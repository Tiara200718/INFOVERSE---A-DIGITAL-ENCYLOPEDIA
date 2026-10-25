require('dotenv').config();
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

const required = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) { console.error('Missing environment variables:', missing.join(', ')); process.exit(1); }

const PROD = process.env.NODE_ENV === 'production';
const BCRYPT_ROUNDS = 12;
const SESSION_DAYS = 7;
const COOKIE = 'iv_session';

const pool = mysql.createPool({
  host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME,
  connectionLimit: 10,
});

const sha256 = (v) => crypto.createHash('sha256').update(v).digest('hex');
const newToken = () => crypto.randomBytes(32).toString('hex');
const emailOk = (e) => typeof e === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 255;

async function currentUser(req) {
  const sid = req.cookies[COOKIE];
  if (!sid) return null;
  const [rows] = await pool.query(
    `SELECT u.id, u.email, u.created_at, p.display_name, p.interest, p.role
     FROM sessions s JOIN users u ON u.id = s.user_id JOIN user_profiles p ON p.user_id = u.id
     WHERE s.id_hash = ? AND s.expires_at > NOW()`, [sha256(sid)]);
  return rows[0] || null;
}
const publicUser = (u) => ({ id: u.id, email: u.email, name: u.display_name, interest: u.interest,
  role: u.role === 'admin' ? 'Administrator' : 'Student Scholar', registeredAt: u.created_at });

const app = express();
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '20kb' }));
app.use(cookieParser());

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false,
  message: { error: 'Too many attempts. Please wait a few minutes and try again.' } });

const wrap = (fn) => (req, res) => fn(req, res).catch((e) => {
  console.error(e);
  res.status(500).json({ error: 'Something went wrong on the server. Please try again.' });
});

app.post('/api/auth/signup', authLimiter, wrap(async (req, res) => {
  const { name, email, password, interest } = req.body || {};
  const mail = String(email || '').trim().toLowerCase();
  if (!emailOk(mail)) return res.status(400).json({ error: 'Please enter a valid email address.' });
  if (typeof password !== 'string' || password.length < 8 || password.length > 128)
    return res.status(400).json({ error: 'Password must be 8–128 characters long.' });
  const display = String(name || '').trim().slice(0, 120) || 'Scholar';
  const topic = String(interest || '').trim().slice(0, 120) || 'General Knowledge';

  const [exists] = await pool.query('SELECT id FROM users WHERE email = ?', [mail]);
  if (exists.length) return res.status(409).json({ error: 'An account with this email already exists. Try signing in.' });

  const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const conn = await pool.getConnection();
  let userId;
  try {
    await conn.beginTransaction();
    const [r] = await conn.query('INSERT INTO users (email, password_hash) VALUES (?, ?)', [mail, hash]);
    userId = r.insertId;
    // Role is always 'scholar' at signup; admins are promoted manually.
    await conn.query('INSERT INTO user_profiles (user_id, display_name, interest) VALUES (?, ?, ?)', [userId, display, topic]);
    await conn.commit();
  } catch (e) { await conn.rollback(); throw e; } finally { conn.release(); }

  return res.status(201).json({ message: 'Account created! You can now sign in with your email and password.' });
}));

app.post('/api/auth/login', authLimiter, wrap(async (req, res) => {
  const { email, password } = req.body || {};
  const mail = String(email || '').trim().toLowerCase();
  const [rows] = await pool.query('SELECT id, password_hash FROM users WHERE email = ?', [mail]);
  const ok = rows.length && typeof password === 'string' && (await bcrypt.compare(password, rows[0].password_hash));
  if (!ok) return res.status(401).json({ error: 'Incorrect email or password.' });

  const sid = newToken();
  await pool.query('INSERT INTO sessions (id_hash, user_id, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? DAY))', [sha256(sid), rows[0].id, SESSION_DAYS]);
  await pool.query('INSERT INTO login_activity (user_id, ip_address) VALUES (?, ?)', [rows[0].id, req.ip]);
  res.cookie(COOKIE, sid, { httpOnly: true, sameSite: 'lax', secure: PROD, maxAge: SESSION_DAYS * 864e5 });
  const user = await currentUser({ cookies: { [COOKIE]: sid } });
  res.json({ user: publicUser(user) });
}));

app.post('/api/auth/logout', wrap(async (req, res) => {
  const sid = req.cookies[COOKIE];
  if (sid) await pool.query('DELETE FROM sessions WHERE id_hash = ?', [sha256(sid)]);
  res.clearCookie(COOKIE);
  res.json({ message: 'Signed out.' });
}));

app.get('/api/auth/me', wrap(async (req, res) => {
  const u = await currentUser(req);
  res.json({ user: u ? publicUser(u) : null });
}));

// ---- Admin-only endpoints (role checked on the server every time) ----
async function requireAdmin(req, res) {
  const u = await currentUser(req);
  if (!u || u.role !== 'admin') { res.status(403).json({ error: 'Administrator access required.' }); return null; }
  return u;
}

app.get('/api/admin/summary', wrap(async (req, res) => {
  if (!(await requireAdmin(req, res))) return;
  const [[s]] = await pool.query(`SELECT
    (SELECT COUNT(*) FROM user_profiles) AS registered_users,
    (SELECT COUNT(*) FROM login_activity) AS successful_logins,
    (SELECT COUNT(DISTINCT user_id) FROM login_activity) AS unique_logged_in_users,
    (SELECT COUNT(*) FROM user_profiles WHERE created_at >= NOW() - INTERVAL 30 DAY) AS registrations_last_30_days`);
  res.json(s);
}));

app.get('/api/admin/users', wrap(async (req, res) => {
  if (!(await requireAdmin(req, res))) return;
  const [rows] = await pool.query(`SELECT u.id, u.email, u.created_at, p.display_name, p.interest, p.role
    FROM users u JOIN user_profiles p ON p.user_id = u.id ORDER BY u.created_at DESC`);
  res.json({ users: rows.map(publicUser) });
}));

app.post('/api/admin/users/:id/role', wrap(async (req, res) => {
  const admin = await requireAdmin(req, res);
  if (!admin) return;
  const id = Number(req.params.id);
  const role = req.body && req.body.role === 'admin' ? 'admin' : 'scholar';
  if (id === admin.id) return res.status(400).json({ error: 'You cannot change your own role.' });
  await pool.query('UPDATE user_profiles SET role = ? WHERE user_id = ?', [role, id]);
  res.json({ message: 'Role updated.' });
}));

app.use(express.static(path.join(__dirname, 'public')));

const port = Number(process.env.PORT || 3000);
pool.query('SELECT 1')
  .then(() => app.listen(port, () => console.log(`InfoVerse running at http://localhost:${port}`)))
  .catch((e) => { console.error('Cannot connect to MySQL:', e.message); process.exit(1); });

# InfoVerse — MySQL + Node.js/Express edition

Same InfoVerse design, articles, bookmarks, CMS and admin dashboard. Accounts live in MySQL with a secure Express backend — no email features.

## What's included
- `server.js` — Express API: signup, login, logout, session check, admin summary, user list & role changes
- `database/schema.sql` — tables: `users`, `user_profiles`, `login_activity`, `sessions`
- `public/` — your original website (unchanged design) + `js/api-auth.js`
- `.env.example` — every setting the server needs

## Security
- Passwords hashed with **bcrypt** (12 rounds); never stored or logged in plain text
- Sessions use an **HttpOnly** cookie (JavaScript can't read it); server-side session table
- Rate limits on login/signup; `helmet` security headers
- Public signup can never choose the admin role; admin endpoints re-check the role on every request
- Database credentials are read only from `.env` on the server — nothing secret is in frontend JavaScript
- No SMTP, no email sending, no verification tokens

## 1. Install requirements
- Node.js 18+ — https://nodejs.org
- MySQL 8+ — https://dev.mysql.com/downloads/ (or XAMPP / MAMP / Docker `mysql:8`)

## 2. Configure MySQL
Log in as root (`mysql -u root -p`) and create a dedicated user:
```sql
CREATE DATABASE infoverse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'infoverse_app'@'localhost' IDENTIFIED BY 'choose-a-strong-password';
GRANT ALL PRIVILEGES ON infoverse.* TO 'infoverse_app'@'localhost';
FLUSH PRIVILEGES;
```
Already have an existing `infoverse` database from an earlier version? Skip this step and keep using it — nothing is deleted. Old email-related leftovers (`email_verified` column, `auth_tokens` table) are simply ignored.

## 3. Create `.env`
```bash
cp .env.example .env
```
Fill in `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.

## 4. Install and run
```bash
npm install
npm run db:init      # creates missing tables (never drops existing data)
npm start
```
Open http://localhost:3000. Signup works immediately — accounts are usable right away, no verification step.

## 5. Make yourself an admin
Register, then in MySQL:
```sql
UPDATE user_profiles p JOIN users u ON u.id = p.user_id
SET p.role = 'admin' WHERE u.email = 'you@example.com';
```
Sign out and back in — the CMS and User Management sections unlock.

## API endpoints
| Method | Path | Purpose |
|---|---|---|
| POST | /api/auth/signup | Create account |
| POST | /api/auth/login | Sign in |
| POST | /api/auth/logout | Sign out |
| GET | /api/auth/me | Current user |
| GET | /api/admin/summary, /api/admin/users | Admin only |
| POST | /api/admin/users/:id/role | Admin only |

## Notes
- Articles, bookmarks and CMS edits still save in the browser (as in the original project).
- The 1-click demo buttons now only fill in the email; the account must be registered first.
- For deployment, serve over HTTPS and set `NODE_ENV=production`.

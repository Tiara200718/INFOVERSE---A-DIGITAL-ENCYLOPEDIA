/**
 * INFOVERSE API AUTH BRIDGE (MySQL + Express backend)
 * Talks only to this site's own /api endpoints. No passwords or database
 * credentials ever reach the browser; the session lives in an HttpOnly cookie.
 * Articles, bookmarks and the CMS stay in browser storage exactly as before.
 */
(function () {
  const toast = (t, m, i) => window.showToast && window.showToast(t, m, i);

  async function api(path, body) {
    const res = await fetch(path, {
      method: body === undefined ? 'GET' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Request failed. Please try again.');
    return data;
  }

  function showMsg(id, text, ok) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    el.style.display = 'block';
    el.style.color = el.style.borderColor = ok ? 'var(--accent-emerald)' : 'var(--accent-rose)';
    el.style.background = ok ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.15)';
  }

  function mirrorLocalUser(user) {
    const db = window.infoVerseDB;
    const users = db.getUsers();
    const id = 'mysql-' + user.id;
    const i = users.findIndex(u => u.id === id);
    const rec = Object.assign({}, user, { id, bookmarks: i > -1 ? (users[i].bookmarks || []) : [] });
    if (i > -1) users[i] = rec; else users.push(rec);
    db.saveUsers(users);
    return rec;
  }

  const P = window.InfoVerseAuth.prototype;

  P.init = function () {
    this.db.clearSession();
    this.adminProfiles = [];
    this.bindEvents();
    this.injectExtras();
    this.updateUserUI();
    api('/api/auth/me').then(({ user }) => user && this.applyUser(user)).catch(() => {});
  };

  P.applyUser = async function (apiUser) {
    const user = mirrorLocalUser(apiUser);
    user.serverId = apiUser.id;
    this.currentUser = user;
    this.db.setCurrentSession(user);
    if (user.role === 'Administrator') await this.refreshAdminData();
    this.updateUserUI();
    if (window.infoVerseApp && window.infoVerseApp.encyclopedia) window.infoVerseApp.encyclopedia.renderArticles();
    return user;
  };

  P.injectExtras = function () {
    const demoTitle = document.querySelector('.quick-demo-accounts .demo-title span');
    if (demoTitle) demoTitle.textContent = '⚡ Quick fill (account must be registered)';
    const roleSel = document.getElementById('reg-role');
    if (roleSel) [...roleSel.options].forEach(o => { if (/admin/i.test(o.value)) o.remove(); });
  };

  P.fillDemoLogin = function (email) {
    document.getElementById('login-email').value = email;
    const p = document.getElementById('login-password');
    p.value = ''; p.focus();
    this.switchTab('login');
  };

  P.handleLogin = async function (e) {
    e.preventDefault();
    const btn = document.getElementById('btn-submit-login');
    document.getElementById('login-error-msg').style.display = 'none';
    if (btn) btn.disabled = true;
    try {
      const { user } = await api('/api/auth/login', {
        email: document.getElementById('login-email').value.trim(),
        password: document.getElementById('login-password').value,
      });
      const u = await this.applyUser(user);
      this.closeAuthModal();
      toast('Authentication Successful', `Welcome back, ${u.name}!`, '🎉');
    } catch (err) {
      showMsg('login-error-msg', err.message, false);
      toast('Login Failed', err.message, '⚠️');
    } finally { if (btn) btn.disabled = false; }
  };

  P.handleRegister = async function (e) {
    e.preventDefault();
    document.getElementById('reg-error-msg').style.display = 'none';
    const password = document.getElementById('reg-password').value;
    if (password.length < 8) return showMsg('reg-error-msg', 'Password must be at least 8 characters long.', false);
    try {
      const data = await api('/api/auth/signup', {
        name: document.getElementById('reg-name').value.trim(),
        email: document.getElementById('reg-email').value.trim(),
        password,
        interest: document.getElementById('reg-interest').value,
      });
      e.target.reset();
      showMsg('reg-error-msg', data.message, true);
    } catch (err) { showMsg('reg-error-msg', err.message, false); }
  };

  P.handleLogout = async function () {
    await api('/api/auth/logout', {}).catch(() => {});
    this.currentUser = null;
    this.db.clearSession();
    this.adminProfiles = [];
    this.updateUserUI();
    toast('Signed Out', 'Session terminated successfully.', '👋');
    if (window.infoVerseApp && window.infoVerseApp.encyclopedia) window.infoVerseApp.encyclopedia.renderArticles();
  };

  P.refreshAdminData = async function () {
    try {
      const { users } = await api('/api/admin/users');
      this.adminProfiles = users.map(u => Object.assign({}, u, { id: 'mysql-' + u.id, bookmarks: [] }));
      this.dashboard = await api('/api/admin/summary');
    } catch (e) { this.adminProfiles = []; }
  };

  P.switchToAdminDemo = function () {
    if (this.currentUser) toast('Administrator access required', 'Ask an existing admin to promote your account.', '🔒');
    else this.openAuthModal('login');
  };

  const origRender = P.renderAdminUsersTable;
  P.renderAdminUsersTable = function (query = '') {
    if (!this.currentUser || this.currentUser.role !== 'Administrator') return;
    const db = window.infoVerseDB;
    const realGet = db.getUsers;
    db.getUsers = () => this.adminProfiles || [];
    try { origRender.call(this, query); } finally { db.getUsers = realGet; }
    const badge = document.getElementById('admin-total-users-badge');
    if (badge && this.dashboard) badge.textContent = `${this.dashboard.registered_users} Scholars • ${this.dashboard.successful_logins} logins`;
  };

  P.handleRoleChange = async function (userId, newRole) {
    const id = String(userId).replace('mysql-', '');
    try {
      await api(`/api/admin/users/${encodeURIComponent(id)}/role`, { role: newRole === 'Administrator' ? 'admin' : 'scholar' });
      toast('Role Updated', `Role changed to ${newRole}.`, '🛡️');
    } catch (err) { toast('Role Update Failed', err.message, '⚠️'); }
    await this.refreshAdminData();
    this.renderAdminUsersTable();
  };

  P.handleDeleteUser = function () { toast('Not available', 'Remove accounts directly in MySQL if needed.', 'ℹ️'); };
  P.handleAdminAddUser = function (e) { e.preventDefault(); toast('Ask them to register', 'New scholars sign up themselves on this page.', 'ℹ️'); };
})();

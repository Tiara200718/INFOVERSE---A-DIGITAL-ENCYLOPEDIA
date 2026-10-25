/**
 * INFOVERSE MASTER APPLICATION COORDINATOR
 * Manages:
 * - Module Progress Bar & Viva Guide
 * - Database / Storage Inspector (Answers: "Where data will save?")
 * - Toast Notification System
 * - Parchment / Midnight Academic Theme Switching
 */

class InfoVerseApp {
  constructor() {
    this.db = window.infoVerseDB;
    this.auth = null;
    this.encyclopedia = null;
    this.init();
  }

  init() {
    // Initialize Submodules
    this.auth = new window.InfoVerseAuth();
    this.encyclopedia = new window.InfoVerseEncyclopedia();
    if (this.auth.initAdminUserManagementModule) {
      this.auth.initAdminUserManagementModule();
    }

    this.bindGlobalEvents();
    this.initTheme();
    console.log('🏛️ InfoVerse Academic Portal Initialized (Modules 1, 2, 3, 4 & 5 Active)');
  }

  bindGlobalEvents() {
    // Theme Toggle
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => this.toggleTheme());
    }

    // Database & Storage Inspector Open
    document.querySelectorAll('[data-action="open-db-inspector"]').forEach(btn => {
      btn.addEventListener('click', () => this.openDatabaseInspector());
    });

    // Close Database Inspector
    const dbCloseBtn = document.getElementById('db-modal-close');
    const dbModal = document.getElementById('db-inspector-modal');
    if (dbCloseBtn) {
      dbCloseBtn.addEventListener('click', () => this.closeDatabaseInspector());
    }
    if (dbModal) {
      dbModal.addEventListener('click', (e) => {
        if (e.target === dbModal) this.closeDatabaseInspector();
      });
    }

    // DB Inspector Tab Switching
    document.querySelectorAll('.db-tab-btn').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const targetPanel = e.currentTarget.getAttribute('data-panel');
        document.querySelectorAll('.db-tab-btn').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.db-panel').forEach(p => p.classList.remove('active'));
        
        e.currentTarget.classList.add('active');
        const panel = document.getElementById(targetPanel);
        if (panel) panel.classList.add('active');
      });
    });

    // Reset Database Seed Button
    const resetDbBtn = document.getElementById('reset-db-btn');
    if (resetDbBtn) {
      resetDbBtn.addEventListener('click', () => {
        if (confirm('Reset database to default seed records? (This will restore initial users and clear active sessions)')) {
          this.db.resetToDefaultSeed();
          this.renderDatabaseInspectorData();
          this.auth.handleLogout();
          this.encyclopedia.renderArticles();
          window.showToast('Database Reset', 'Default records restored successfully', '🔄');
        }
      });
    }

    // Viva Defense Guide Modal Open
    document.querySelectorAll('[data-action="open-viva-guide"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = document.getElementById('viva-guide-modal');
        if (modal) modal.classList.add('active');
      });
    });

    const vivaCloseBtn = document.getElementById('viva-modal-close');
    const vivaModal = document.getElementById('viva-guide-modal');
    if (vivaCloseBtn) {
      vivaCloseBtn.addEventListener('click', () => {
        if (vivaModal) vivaModal.classList.remove('active');
      });
    }
    if (vivaModal) {
      vivaModal.addEventListener('click', (e) => {
        if (e.target === vivaModal) vivaModal.classList.remove('active');
      });
    }

    // Profile Modal Close
    const profileCloseBtn = document.getElementById('profile-modal-close');
    const profileModal = document.getElementById('profile-modal');
    if (profileCloseBtn) {
      profileCloseBtn.addEventListener('click', () => {
        if (profileModal) profileModal.classList.remove('active');
      });
    }
    if (profileModal) {
      profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal) profileModal.classList.remove('active');
      });
    }
  }

  // --- Theme Management ---
  initTheme() {
    const savedTheme = localStorage.getItem('infoverse_theme') || 'dark';
    if (savedTheme === 'parchment') {
      document.body.classList.add('parchment-mode');
      const themeBtn = document.getElementById('theme-toggle-btn');
      if (themeBtn) themeBtn.textContent = '🌙';
    }
  }

  toggleTheme() {
    const isParchment = document.body.classList.toggle('parchment-mode');
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (isParchment) {
      localStorage.setItem('infoverse_theme', 'parchment');
      if (themeBtn) themeBtn.textContent = '🌙';
      window.showToast('Purple & White Mode', 'Clean violet light theme activated', '✨');
    } else {
      localStorage.setItem('infoverse_theme', 'dark');
      if (themeBtn) themeBtn.textContent = '☀️';
      window.showToast('Royal Purple Mode', 'Midnight royal violet theme activated', '🌌');
    }
  }

  // --- Database Inspector ---
  openDatabaseInspector() {
    const modal = document.getElementById('db-inspector-modal');
    if (!modal) return;
    this.renderDatabaseInspectorData();
    modal.classList.add('active');
  }

  closeDatabaseInspector() {
    const modal = document.getElementById('db-inspector-modal');
    if (modal) modal.classList.remove('active');
  }

  renderDatabaseInspectorData() {
    const users = this.db.getUsers();
    const session = this.db.getCurrentSession();
    const articles = this.db.getArticles();

    // 1. Live Users Table
    const userTableBody = document.getElementById('db-users-table-body');
    if (userTableBody) {
      userTableBody.innerHTML = users.map((u, i) => `
        <tr>
          <td><span style="color: var(--accent-gold);">${u.id}</span></td>
          <td style="font-weight: 600; color: var(--text-primary);">${u.name}</td>
          <td>${u.email}</td>
          <td><code style="color: var(--accent-emerald); font-size: 0.75rem;">${u.passwordHash.substring(0, 16)}...</code></td>
          <td><span class="profile-role-badge">${u.role}</span></td>
          <td>${new Date(u.registeredAt).toLocaleDateString()}</td>
        </tr>
      `).join('');
    }

    // 2. Active Session JSON
    const sessionJsonEl = document.getElementById('db-session-json');
    if (sessionJsonEl) {
      sessionJsonEl.textContent = JSON.stringify(session || { status: 'No active session (Guest Mode)' }, null, 2);
    }

    // 3. Raw LocalStorage JSON Dump
    const rawStorageEl = document.getElementById('db-raw-json');
    if (rawStorageEl) {
      const storageDump = {
        total_registered_users: users.length,
        total_articles: articles.length,
        current_session: session,
        users_table: users
      };
      rawStorageEl.textContent = JSON.stringify(storageDump, null, 2);
    }

    // 4. SQL Schema
    const sqlSchemaEl = document.getElementById('db-sql-schema-code');
    if (sqlSchemaEl) {
      sqlSchemaEl.textContent = this.db.getStorageDiagnostics().sqlSchema;
    }
  }
}

// Global Toast Notification Helper
window.showToast = function(title, msg, icon = '💡') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${msg}</div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

// Initialize application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.infoVerseApp = new InfoVerseApp();
});

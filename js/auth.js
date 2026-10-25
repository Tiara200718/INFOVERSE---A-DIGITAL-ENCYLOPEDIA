/**
 * INFOVERSE AUTHENTICATION & USER MANAGEMENT (MODULE 1)
 * Handles User Registration, Login validation, Password Strength Evaluation,
 * Demo Logins, Active User Session UI, and Modal interactions.
 */

class InfoVerseAuth {
  constructor() {
    this.db = window.infoVerseDB;
    this.currentUser = null;
    this.init();
  }

  init() {
    // Check existing session
    const session = this.db.getCurrentSession();
    if (session && session.user) {
      this.currentUser = session.user;
    }

    this.bindEvents();
    this.updateUserUI();
  }

  bindEvents() {
    // Open Auth Modal Buttons
    document.querySelectorAll('[data-action="open-auth-modal"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const defaultTab = e.currentTarget.getAttribute('data-tab') || 'login';
        this.openAuthModal(defaultTab);
      });
    });

    // Close Modal Button
    const closeBtn = document.getElementById('auth-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeAuthModal());
    }

    // Modal Background Click
    const modalOverlay = document.getElementById('auth-modal');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) this.closeAuthModal();
      });
    }

    // Switch Login / Register Tabs
    const tabLogin = document.getElementById('auth-tab-login');
    const tabRegister = document.getElementById('auth-tab-register');
    if (tabLogin && tabRegister) {
      tabLogin.addEventListener('click', () => this.switchTab('login'));
      tabRegister.addEventListener('click', () => this.switchTab('register'));
    }

    // Password Visibility Toggles
    document.querySelectorAll('.password-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        const input = e.currentTarget.parentElement.querySelector('input');
        if (input.type === 'password') {
          input.type = 'text';
          e.currentTarget.innerHTML = '👁️';
        } else {
          input.type = 'password';
          e.currentTarget.innerHTML = '🙈';
        }
      });
    });

    // Password Strength Meter
    const regPasswordInput = document.getElementById('reg-password');
    if (regPasswordInput) {
      regPasswordInput.addEventListener('input', (e) => this.evaluatePasswordStrength(e.target.value));
    }

    // Login Form Submit
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    // Register Form Submit
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => this.handleRegister(e));
    }

    // Quick Demo Accounts Click
    document.querySelectorAll('.demo-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const email = e.currentTarget.getAttribute('data-email');
        const role = e.currentTarget.getAttribute('data-role');
        this.fillDemoLogin(email);
      });
    });

    // Logout Click
    const logoutBtn = document.getElementById('nav-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.handleLogout());
    }

    // Profile Click in Nav
    const userNavProfile = document.getElementById('user-nav-profile');
    if (userNavProfile) {
      userNavProfile.addEventListener('click', () => this.openProfileModal());
    }
  }

  openAuthModal(tab = 'login') {
    const modal = document.getElementById('auth-modal');
    if (modal) {
      modal.classList.add('active');
      this.switchTab(tab);
    }
  }

  closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
      modal.classList.remove('active');
    }
  }

  switchTab(tabName) {
    const tabLogin = document.getElementById('auth-tab-login');
    const tabRegister = document.getElementById('auth-tab-register');
    const loginForm = document.getElementById('login-form-container');
    const registerForm = document.getElementById('register-form-container');
    const modalTitle = document.getElementById('auth-modal-title');
    const modalSubtitle = document.getElementById('auth-modal-subtitle');

    if (tabName === 'login') {
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      loginForm.style.display = 'block';
      registerForm.style.display = 'none';
      if (modalTitle) modalTitle.textContent = 'Welcome Back Scholar';
      if (modalSubtitle) modalSubtitle.textContent = 'Sign in to access your saved research & bookmarks';
    } else {
      tabLogin.classList.remove('active');
      tabRegister.classList.add('active');
      loginForm.style.display = 'none';
      registerForm.style.display = 'block';
      if (modalTitle) modalTitle.textContent = 'Create Scholar Account';
      if (modalSubtitle) modalSubtitle.textContent = 'Join the InfoVerse academic knowledge collective';
    }
  }

  evaluatePasswordStrength(password) {
    const bar = document.getElementById('strength-bar-fill');
    const label = document.getElementById('strength-text');
    if (!bar || !label) return;

    let score = 0;
    if (password.length > 5) score++;
    if (password.length > 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    bar.className = 'strength-fill';
    if (password.length === 0) {
      bar.style.width = '0%';
      label.textContent = 'Enter password';
      label.style.color = 'var(--text-muted)';
    } else if (score <= 2) {
      bar.classList.add('strength-weak');
      label.textContent = 'Weak (add numbers & symbols)';
      label.style.color = 'var(--accent-rose)';
    } else if (score <= 4) {
      bar.classList.add('strength-medium');
      label.textContent = 'Good password';
      label.style.color = 'var(--accent-gold)';
    } else {
      bar.classList.add('strength-strong');
      label.textContent = 'Strong & Secure';
      label.style.color = 'var(--accent-emerald)';
    }
  }

  fillDemoLogin(email) {
    const emailInput = document.getElementById('login-email');
    const passInput = document.getElementById('login-password');
    if (emailInput && passInput) {
      emailInput.value = email;
      passInput.value = 'demo12345';
      this.switchTab('login');
      if (window.showToast) {
        window.showToast('Demo Credential Filled', `Ready to test login for ${email}`, '🔑');
      }
    }
  }

  handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error-msg');

    if (errorEl) errorEl.style.display = 'none';

    try {
      // Authenticate with storage engine
      const user = this.db.authenticateUser(email, password);
      const session = this.db.setCurrentSession(user);
      this.currentUser = session.user;

      this.updateUserUI();
      this.closeAuthModal();

      if (window.showToast) {
        window.showToast('Authentication Successful', `Welcome back, ${user.name}!`, '🎉');
      }

      // Re-render encyclopedia to update bookmark statuses
      if (window.infoVerseApp && window.infoVerseApp.encyclopedia) {
        window.infoVerseApp.encyclopedia.renderArticles();
      }

    } catch (err) {
      if (errorEl) {
        errorEl.textContent = err.message;
        errorEl.style.display = 'block';
      }
      if (window.showToast) {
        window.showToast('Login Failed', err.message, '⚠️');
      }
    }
  }

  handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const interest = document.getElementById('reg-interest').value;
    const role = document.getElementById('reg-role').value;
    const errorEl = document.getElementById('reg-error-msg');

    if (errorEl) errorEl.style.display = 'none';

    if (password.length < 6) {
      if (errorEl) {
        errorEl.textContent = 'Password must be at least 6 characters long.';
        errorEl.style.display = 'block';
      }
      return;
    }

    try {
      // Save new user in database
      const newUser = this.db.registerUser(name, email, password, interest, role);
      const session = this.db.setCurrentSession(newUser);
      this.currentUser = session.user;

      this.updateUserUI();
      this.closeAuthModal();

      if (window.showToast) {
        window.showToast('Account Created & Saved!', `Data persisted to Storage Inspector!`, '💾');
      }

      // Re-render encyclopedia
      if (window.infoVerseApp && window.infoVerseApp.encyclopedia) {
        window.infoVerseApp.encyclopedia.renderArticles();
      }

    } catch (err) {
      if (errorEl) {
        errorEl.textContent = err.message;
        errorEl.style.display = 'block';
      }
      if (window.showToast) {
        window.showToast('Registration Error', err.message, '⚠️');
      }
    }
  }

  handleLogout() {
    this.db.clearSession();
    this.currentUser = null;
    this.updateUserUI();

    if (window.showToast) {
      window.showToast('Signed Out', 'Session terminated successfully.', '👋');
    }

    if (window.infoVerseApp && window.infoVerseApp.encyclopedia) {
      window.infoVerseApp.encyclopedia.renderArticles();
    }
  }

  updateUserUI() {
    const authActions = document.getElementById('nav-auth-actions');
    const userProfileBadge = document.getElementById('user-nav-profile');
    const userNameEl = document.getElementById('user-nav-name');
    const userAvatarEl = document.getElementById('user-nav-avatar');
    const adminBadge = document.getElementById('nav-admin-badge');
    const cmsGuard = document.getElementById('cms-rbac-guard');
    const cmsContent = document.getElementById('cms-workspace-content');
    const adminGuard = document.getElementById('admin-rbac-guard');
    const adminContent = document.getElementById('admin-hub-content');

    const isAdminUser = this.db.isAdmin(this.currentUser);

    if (this.currentUser) {
      if (authActions) authActions.style.display = 'none';
      if (userProfileBadge) {
        userProfileBadge.style.display = 'flex';
        if (userNameEl) userNameEl.textContent = this.currentUser.name;
        if (userAvatarEl) userAvatarEl.textContent = this.currentUser.name.charAt(0).toUpperCase();
      }
    } else {
      if (authActions) authActions.style.display = 'flex';
      if (userProfileBadge) userProfileBadge.style.display = 'none';
    }

    // Admin Mode Badge in Nav
    if (adminBadge) {
      adminBadge.style.display = isAdminUser ? 'inline-flex' : 'none';
    }

    // Module 4 CMS RBAC Access Guard
    if (cmsGuard && cmsContent) {
      if (isAdminUser) {
        cmsGuard.style.display = 'none';
        cmsContent.style.display = 'block';
      } else {
        cmsGuard.style.display = 'block';
        cmsContent.style.display = 'none';
      }
    }

    // Module 5 Admin Hub RBAC Access Guard
    if (adminGuard && adminContent) {
      if (isAdminUser) {
        adminGuard.style.display = 'none';
        adminContent.style.display = 'block';
      } else {
        adminGuard.style.display = 'block';
        adminContent.style.display = 'none';
      }
    }

    // Render Admin Users table if active
    this.renderAdminUsersTable();
  }

  // ==========================================================================
  // MODULE 5: USER & ADMIN MANAGEMENT CONTROLLERS (RBAC & DIRECTORY)
  // ==========================================================================
  initAdminUserManagementModule() {
    // User search in admin directory
    const userSearchInput = document.getElementById('admin-user-search-input');
    if (userSearchInput) {
      userSearchInput.addEventListener('input', (e) => {
        this.renderAdminUsersTable(e.target.value);
      });
    }

    // Switch to Admin demo button click
    document.querySelectorAll('[data-action="switch-to-admin-demo"]').forEach(btn => {
      btn.addEventListener('click', () => this.switchToAdminDemo());
    });

    // Add New User Form Submit (Admin modal)
    const addUserForm = document.getElementById('admin-add-user-form');
    if (addUserForm) {
      addUserForm.addEventListener('submit', (e) => this.handleAdminAddUser(e));
    }
  }

  switchToAdminDemo() {
    const adminUser = this.db.getUsers().find(u => u.role === 'Administrator') || {
      id: 'usr-103',
      name: 'System Administrator',
      email: 'admin@infoverse.edu',
      role: 'Administrator',
      interest: 'All Categories'
    };

    const session = this.db.setCurrentSession(adminUser);
    this.currentUser = session.user;
    this.updateUserUI();

    if (window.infoVerseApp && window.infoVerseApp.encyclopedia) {
      window.infoVerseApp.encyclopedia.renderCmsArticlesTable();
    }

    if (window.showToast) {
      window.showToast('Administrator Session Active', 'Content Management & User Directory Unlocked!', '👑');
    }
  }

  renderAdminUsersTable(query = '') {
    const tableBody = document.getElementById('admin-users-table-body');
    const totalUsersCountEl = document.getElementById('admin-total-users-badge');
    if (!tableBody) return;

    let users = this.db.getUsers();
    if (totalUsersCountEl) totalUsersCountEl.textContent = `${users.length} Scholars`;

    if (query && query.trim().length > 0) {
      const q = query.toLowerCase().trim();
      users = users.filter(u => 
        u.name.toLowerCase().includes(q) || 
        u.email.toLowerCase().includes(q) || 
        (u.role && u.role.toLowerCase().includes(q))
      );
    }

    if (users.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
            No user accounts found matching "${query}".
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = users.map(user => {
      const isSelf = this.currentUser && this.currentUser.id === user.id;
      const bookmarks = user.bookmarks ? user.bookmarks.length : 0;
      const formattedDate = user.registeredAt ? new Date(user.registeredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'August 2026';

      return `
        <tr class="${isSelf ? 'current-admin-row' : ''}">
          <td>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div class="user-avatar-circle" style="width: 32px; height: 32px; font-size: 0.85rem;">${user.name.charAt(0).toUpperCase()}</div>
              <div>
                <div style="font-weight: 700; color: #ffffff;">${user.name} ${isSelf ? '<span class="you-pill">You</span>' : ''}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${user.email}</div>
              </div>
            </div>
          </td>
          <td>
            <select class="role-selector-dropdown" onchange="window.infoVerseApp.auth.handleRoleChange('${user.id}', this.value)" ${isSelf ? 'disabled title="Cannot change own active role"' : ''}>
              <option value="Student Scholar" ${user.role === 'Student Scholar' ? 'selected' : ''}>🎓 Student Scholar</option>
              <option value="Research Fellow" ${user.role === 'Research Fellow' ? 'selected' : ''}>🔬 Research Fellow</option>
              <option value="Administrator" ${user.role === 'Administrator' ? 'selected' : ''}>👑 Administrator</option>
            </select>
          </td>
          <td>
            <span style="font-size: 0.85rem; color: var(--text-secondary);">${user.interest || 'General Science'}</span>
          </td>
          <td>
            <span class="bookmark-stat-badge">🔖 ${bookmarks} saved</span>
          </td>
          <td>
            <span style="font-size: 0.82rem; color: var(--text-muted);">${formattedDate}</span>
          </td>
          <td style="text-align: right;">
            ${isSelf ? `
              <span style="font-size: 0.78rem; color: var(--accent-purple-light); font-weight: bold;">Active Session</span>
            ` : `
              <button class="table-action-btn delete-btn" title="Delete User Account" onclick="window.infoVerseApp.auth.handleDeleteUser('${user.id}')">
                🗑️ Delete
              </button>
            `}
          </td>
        </tr>
      `;
    }).join('');
  }

  handleRoleChange(userId, newRole) {
    try {
      const updatedUser = this.db.updateUserRole(userId, newRole);
      this.updateUserUI();

      if (window.showToast) {
        window.showToast('Role Updated', `${updatedUser.name} is now a ${newRole}.`, '🛡️');
      }
    } catch (err) {
      if (window.showToast) {
        window.showToast('Role Update Failed', err.message, '⚠️');
      }
    }
  }

  handleDeleteUser(userId) {
    const user = this.db.findUserById(userId);
    if (!user) return;

    if (confirm(`Are you sure you want to permanently remove scholar account "${user.name}" (${user.email})?`)) {
      try {
        this.db.deleteUser(userId);
        this.renderAdminUsersTable();
        if (window.showToast) {
          window.showToast('User Deleted', `Account ${user.name} removed from directory.`, '🗑️');
        }
      } catch (err) {
        if (window.showToast) {
          window.showToast('Delete Failed', err.message, '⚠️');
        }
      }
    }
  }

  handleAdminAddUser(e) {
    e.preventDefault();
    const name = document.getElementById('admin-new-name').value;
    const email = document.getElementById('admin-new-email').value;
    const password = document.getElementById('admin-new-password').value;
    const role = document.getElementById('admin-new-role').value;
    const interest = document.getElementById('admin-new-interest').value;

    try {
      this.db.registerUser(name, email, password, interest, role);
      this.renderAdminUsersTable();
      e.target.reset();
      
      const modal = document.getElementById('admin-add-user-modal');
      if (modal) modal.classList.remove('active');

      if (window.showToast) {
        window.showToast('Scholar Account Created', `Created account for ${name} as ${role}.`, '👤');
      }
    } catch (err) {
      alert('Error creating user: ' + err.message);
    }
  }

  openProfileModal() {
    if (!this.currentUser) return;
    const modal = document.getElementById('profile-modal');
    if (!modal) return;

    const nameEl = document.getElementById('profile-name');
    const emailEl = document.getElementById('profile-email');
    const roleEl = document.getElementById('profile-role');
    const interestEl = document.getElementById('profile-interest');
    const initialEl = document.getElementById('profile-initial');
    const bookmarksCountEl = document.getElementById('profile-bookmarks-count');
    const bookmarksListEl = document.getElementById('profile-bookmarks-list');

    if (nameEl) nameEl.textContent = this.currentUser.name;
    if (emailEl) emailEl.textContent = this.currentUser.email;
    if (roleEl) roleEl.textContent = this.currentUser.role || 'Scholar';
    if (interestEl) interestEl.textContent = this.currentUser.interest || 'General';
    if (initialEl) initialEl.textContent = this.currentUser.name.charAt(0).toUpperCase();

    // Render bookmarks
    const bookmarks = this.db.getUserBookmarks(this.currentUser.id);
    if (bookmarksCountEl) bookmarksCountEl.textContent = bookmarks.length;

    if (bookmarksListEl) {
      if (bookmarks.length === 0) {
        bookmarksListEl.innerHTML = `
          <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔖</div>
            <p>No saved articles yet. Browse the encyclopedia and click the bookmark icon on any article!</p>
          </div>
        `;
      } else {
        const allArticles = this.db.getArticles();
        const savedArticles = allArticles.filter(a => bookmarks.includes(a.id));
        bookmarksListEl.innerHTML = savedArticles.map(art => `
          <div class="suggestion-item" style="border: 1px solid var(--border-subtle); border-radius: 8px; margin-bottom: 0.5rem;" onclick="window.infoVerseApp.encyclopedia.loadTopicIntoDisplay('${art.id}', true); document.getElementById('profile-modal').classList.remove('active');">
            <div>
              <div class="suggestion-title">${art.title}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${art.category} • ${art.readTime}</div>
            </div>
            <span class="btn btn-outline-gold" style="font-size: 0.75rem; padding: 0.2rem 0.6rem;">Read Now →</span>
          </div>
        `).join('');
      }
    }

    modal.classList.add('active');
  }
}

// Attach globally
window.InfoVerseAuth = InfoVerseAuth;

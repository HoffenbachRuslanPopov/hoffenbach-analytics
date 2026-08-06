/* =============================================
   AUTHENTICATION MODULE
   ============================================= */

class Auth {
    constructor() {
        // Demo credentials (in production, use secure backend authentication)
        this.credentials = {
            username: 'admin',
            password: 'hoffenbach2026'
        };

        this.sessionKey = 'hoffenbach_session';
        this.init();
    }

    init() {
        this.checkAuth();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Password toggle
        const togglePassword = document.getElementById('togglePassword');
        if (togglePassword) {
            togglePassword.addEventListener('click', () => this.togglePasswordVisibility());
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    checkAuth() {
        const session = this.getSession();
        const isLoginPage = window.location.pathname.endsWith('index.html') ||
                           window.location.pathname === '/' ||
                           window.location.pathname.endsWith('/');

        if (session && session.authenticated) {
            // User is logged in
            if (isLoginPage) {
                window.location.href = 'dashboard.html';
            }
        } else {
            // User is not logged in
            if (!isLoginPage) {
                window.location.href = 'index.html';
            }
        }
    }

    handleLogin(e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        const errorMessage = document.getElementById('errorMessage');

        // Clear previous error
        errorMessage.classList.remove('show');

        // Validate fields
        if (!username || !password) {
            this.showError(window.i18n ? window.i18n.t('login.error.empty') : 'Please fill in all fields');
            return;
        }

        // Check credentials
        if (this.validateCredentials(username, password)) {
            this.createSession(username, remember);
            window.location.href = 'dashboard.html';
        } else {
            this.showError(window.i18n ? window.i18n.t('login.error.invalid') : 'Invalid username or password');
            this.shakeForm();
        }
    }

    validateCredentials(username, password) {
        return username === this.credentials.username &&
               password === this.credentials.password;
    }

    createSession(username, remember) {
        const session = {
            authenticated: true,
            username: username,
            loginTime: new Date().toISOString(),
            expiresAt: remember ?
                new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : // 30 days
                new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 1 day
        };

        if (remember) {
            localStorage.setItem(this.sessionKey, JSON.stringify(session));
        } else {
            sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
        }
    }

    getSession() {
        const localSession = localStorage.getItem(this.sessionKey);
        const sessionSession = sessionStorage.getItem(this.sessionKey);

        const sessionData = localSession || sessionSession;

        if (sessionData) {
            const session = JSON.parse(sessionData);

            // Check if session is expired
            if (new Date(session.expiresAt) < new Date()) {
                this.logout();
                return null;
            }

            return session;
        }

        return null;
    }

    logout() {
        localStorage.removeItem(this.sessionKey);
        sessionStorage.removeItem(this.sessionKey);
        window.location.href = 'index.html';
    }

    showError(message) {
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.classList.add('show');
        }
    }

    shakeForm() {
        const loginCard = document.querySelector('.login-card');
        if (loginCard) {
            loginCard.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                loginCard.style.animation = '';
            }, 500);
        }
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const toggleBtn = document.getElementById('togglePassword');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleBtn.classList.add('active');
        } else {
            passwordInput.type = 'password';
            toggleBtn.classList.remove('active');
        }
    }

    getUsername() {
        const session = this.getSession();
        return session ? session.username : null;
    }

    isAuthenticated() {
        const session = this.getSession();
        return session && session.authenticated;
    }
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Initialize Auth
const auth = new Auth();

// Export for use in other modules
window.auth = auth;

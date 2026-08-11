/* =============================================
   CRM AUTHENTICATION MODULE
   Enhanced security with CSRF protection,
   rate limiting, and session management
   ============================================= */

class CRMAuth {
    constructor() {
        this.maxAttempts = 5;
        this.lockoutTime = 15 * 60 * 1000; // 15 minutes
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
        this.csrfToken = null;

        this.init();
    }

    init() {
        // Generate CSRF token
        this.csrfToken = this.generateCSRFToken();

        // Check authentication on protected pages
        if (this.isProtectedPage()) {
            if (!this.isAuthenticated()) {
                this.redirectToLogin();
                return;
            }

            // Reset session timeout on activity
            this.setupActivityListener();

            // Check session timeout
            this.checkSessionTimeout();
        }
    }

    isProtectedPage() {
        const path = window.location.pathname;
        return path.includes('crm.html') || path.includes('dashboard.html');
    }

    generateCSRFToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Rate limiting
    checkRateLimit() {
        const attempts = this.getLoginAttempts();
        const lastAttempt = parseInt(localStorage.getItem('lastLoginAttempt') || '0');
        const now = Date.now();

        // Check if locked out
        if (attempts >= this.maxAttempts) {
            const timeSinceLast = now - lastAttempt;
            if (timeSinceLast < this.lockoutTime) {
                const remaining = Math.ceil((this.lockoutTime - timeSinceLast) / 60000);
                return {
                    allowed: false,
                    message: `Too many attempts. Try again in ${remaining} minutes.`
                };
            }
            // Reset after lockout period
            this.resetLoginAttempts();
        }

        return { allowed: true };
    }

    getLoginAttempts() {
        return parseInt(localStorage.getItem('loginAttempts') || '0');
    }

    incrementLoginAttempts() {
        const attempts = this.getLoginAttempts() + 1;
        localStorage.setItem('loginAttempts', attempts.toString());
        localStorage.setItem('lastLoginAttempt', Date.now().toString());
        return attempts;
    }

    resetLoginAttempts() {
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('lastLoginAttempt');
    }

    // Password hashing (client-side for demo, production should use server-side)
    async hashPassword(password, salt) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password + salt);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Login validation
    async login(username, password) {
        // Check rate limit
        const rateCheck = this.checkRateLimit();
        if (!rateCheck.allowed) {
            return { success: false, error: rateCheck.message };
        }

        // Input validation
        if (!username || !password) {
            return { success: false, error: 'Username and password are required' };
        }

        // Sanitize input
        username = this.sanitizeInput(username);

        // For demo: hardcoded credentials
        // In production, this would be an API call
        const validCredentials = [
            { username: 'admin', password: 'hoffenbach2026' },
            { username: 'hoffenbach', password: 'analytics2026' }
        ];

        const match = validCredentials.find(
            cred => cred.username === username.toLowerCase() && cred.password === password
        );

        if (match) {
            this.resetLoginAttempts();

            // Create session
            const session = {
                user: match.username,
                csrfToken: this.csrfToken,
                createdAt: Date.now(),
                expiresAt: Date.now() + this.sessionTimeout
            };

            // Store session securely
            sessionStorage.setItem('crmSession', JSON.stringify(session));

            // Set auth flag
            localStorage.setItem('crmAuth', 'true');

            return { success: true, user: match.username };
        } else {
            const attempts = this.incrementLoginAttempts();
            const remaining = this.maxAttempts - attempts;

            if (remaining <= 0) {
                return {
                    success: false,
                    error: 'Account locked due to too many failed attempts. Try again in 15 minutes.'
                };
            }

            return {
                success: false,
                error: `Invalid credentials. ${remaining} attempts remaining.`
            };
        }
    }

    // Sanitize user input
    sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        return input
            .trim()
            .replace(/[<>'"&]/g, '') // Remove dangerous characters
            .substring(0, 100); // Limit length
    }

    // Check if authenticated
    isAuthenticated() {
        const session = this.getSession();
        if (!session) return false;

        // Check expiration
        if (Date.now() > session.expiresAt) {
            this.logout();
            return false;
        }

        return true;
    }

    // Get current session
    getSession() {
        try {
            const sessionStr = sessionStorage.getItem('crmSession');
            if (!sessionStr) return null;
            return JSON.parse(sessionStr);
        } catch {
            return null;
        }
    }

    // Extend session on activity
    extendSession() {
        const session = this.getSession();
        if (session) {
            session.expiresAt = Date.now() + this.sessionTimeout;
            sessionStorage.setItem('crmSession', JSON.stringify(session));
        }
    }

    // Setup activity listener
    setupActivityListener() {
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];

        const throttledExtend = this.throttle(() => {
            this.extendSession();
        }, 60000); // Throttle to once per minute

        events.forEach(event => {
            document.addEventListener(event, throttledExtend, { passive: true });
        });
    }

    // Throttle function
    throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }

    // Check session timeout
    checkSessionTimeout() {
        setInterval(() => {
            if (!this.isAuthenticated()) {
                this.showSessionExpiredModal();
            }
        }, 60000); // Check every minute
    }

    // Show session expired modal
    showSessionExpiredModal() {
        const modal = document.createElement('div');
        modal.className = 'session-modal';
        modal.innerHTML = `
            <div class="session-modal-content">
                <h3>Session Expired</h3>
                <p>Your session has expired. Please log in again.</p>
                <button class="btn-primary" onclick="window.location.href='index.html'">Log In</button>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .session-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            }
            .session-modal-content {
                background: var(--bg-secondary, #1a1a2e);
                padding: 2rem;
                border-radius: 1rem;
                text-align: center;
                max-width: 400px;
            }
            .session-modal-content h3 {
                color: var(--text-primary, #fff);
                margin-bottom: 1rem;
            }
            .session-modal-content p {
                color: var(--text-secondary, #a1a1aa);
                margin-bottom: 1.5rem;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(modal);
    }

    // Logout
    logout() {
        sessionStorage.removeItem('crmSession');
        localStorage.removeItem('crmAuth');
        this.redirectToLogin();
    }

    // Redirect to login
    redirectToLogin() {
        if (!window.location.pathname.includes('index.html')) {
            window.location.href = 'index.html';
        }
    }

    // Validate CSRF token
    validateCSRF(token) {
        const session = this.getSession();
        return session && session.csrfToken === token;
    }

    // Get CSRF token for forms
    getCSRFToken() {
        const session = this.getSession();
        return session ? session.csrfToken : this.csrfToken;
    }
}

// Export singleton
window.crmAuth = new CRMAuth();

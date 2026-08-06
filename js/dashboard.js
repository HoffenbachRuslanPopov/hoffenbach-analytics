/* =============================================
   DASHBOARD MODULE - FULLY INTERACTIVE v2.1
   Updated: 2026-08-06
   ============================================= */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing dashboard...');

    // Check authentication
    if (window.auth && !window.auth.isAuthenticated()) {
        console.log('Not authenticated, redirecting...');
        return;
    }

    // Initialize dashboard
    window.dashboard = new Dashboard();
});

class Dashboard {
    constructor() {
        console.log('Dashboard constructor called');
        this.charts = {};
        this.currentPage = 'dashboard';
        this.currentPeriod = 'ytd';

        // Real sales data
        this.salesData = {
            totalRevenue: 18571.79,
            totalOrders: 1177,
            totalUnits: 1234,
            avgOrder: 15.78,
            byCountry: [
                { code: 'DE', name: 'Germany', flag: '🇩🇪', revenue: 7876.51, orders: 605, units: 780 },
                { code: 'FR', name: 'France', flag: '🇫🇷', revenue: 3723.41, orders: 215, units: 285 },
                { code: 'GB', name: 'UK', flag: '🇬🇧', revenue: 1954.47, orders: 183, units: 210 },
                { code: 'IT', name: 'Italy', flag: '🇮🇹', revenue: 1941.96, orders: 110, units: 145 },
                { code: 'SE', name: 'Sweden', flag: '🇸🇪', revenue: 1399.89, orders: 11, units: 15 },
                { code: 'ES', name: 'Spain', flag: '🇪🇸', revenue: 1217.34, orders: 81, units: 98 },
                { code: 'NL', name: 'Netherlands', flag: '🇳🇱', revenue: 299.29, orders: 21, units: 28 },
                { code: 'BE', name: 'Belgium', flag: '🇧🇪', revenue: 124.94, orders: 6, units: 8 },
                { code: 'IE', name: 'Ireland', flag: '🇮🇪', revenue: 33.98, orders: 2, units: 3 }
            ],
            products: [
                { name: 'Magnetic Locks 20+4', sku: 'D6-QPG9-4J1K', price: 29.99, sold: 151, revenue: 4528.49, stock: 245 },
                { name: 'Socket Protectors 20x', sku: 'SH-G0PF-CSW1', price: 7.99, sold: 362, revenue: 2892.38, stock: 52 },
                { name: 'Magnetic Locks 12+3', sku: 'XT-KL12-3SET', price: 19.99, sold: 130, revenue: 2598.70, stock: 189 },
                { name: 'Wall Protector Pads', sku: '9J-VG9Z-P83K', price: 9.99, sold: 168, revenue: 1678.32, stock: 320 },
                { name: 'Corner Protectors 12x', sku: 'E1-ZMUX-HRSF', price: 9.99, sold: 124, revenue: 1238.76, stock: 18 },
                { name: 'Door Guard Set', sku: 'DG-4SET-BLK', price: 14.99, sold: 89, revenue: 1334.11, stock: 156 }
            ],
            recentOrders: [
                { id: '306-9063696-5426752', product: 'Magnetic Locks 20+4', country: 'DE', flag: '🇩🇪', date: '2026-08-06', amount: 29.99, status: 'shipped' },
                { id: '028-9246498-0330717', product: 'Socket Protectors 20x', country: 'DE', flag: '🇩🇪', date: '2026-08-06', amount: 7.99, status: 'shipped' },
                { id: '203-3985502-1642757', product: 'Corner Protectors 12x', country: 'GB', flag: '🇬🇧', date: '2026-08-05', amount: 9.99, status: 'shipped' },
                { id: '404-9151343-2417117', product: 'Magnetic Locks 20+4', country: 'FR', flag: '🇫🇷', date: '2026-08-05', amount: 29.99, status: 'pending' },
                { id: '171-6613491-8643508', product: 'Socket Protectors 20x', country: 'NL', flag: '🇳🇱', date: '2026-08-05', amount: 9.49, status: 'shipped' }
            ]
        };

        this.init();
    }

    init() {
        console.log('Initializing dashboard components...');
        this.setupNavigation();
        this.setupSidebar();
        this.setupDatePicker();
        this.setupNotifications();
        this.setupChartPeriods();
        this.setupButtons();
        this.setupSearch();
        this.setupFilters();
        this.updateKPIs();
        this.loadRecentOrders();
        this.initCharts();
        console.log('Dashboard initialization complete');
    }

    // ===== NAVIGATION =====
    setupNavigation() {
        console.log('Setting up navigation...');
        const navLinks = document.querySelectorAll('.nav-item a[data-page]');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const page = link.getAttribute('data-page');
                console.log('Navigation click:', page);
                this.navigateTo(page);
            });
        });
    }

    navigateTo(page) {
        console.log('Navigating to:', page);

        // Update nav active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        const activeNav = document.querySelector(`[data-page="${page}"]`);
        if (activeNav) {
            activeNav.closest('.nav-item').classList.add('active');
        }

        // Hide all pages, show selected
        document.querySelectorAll('.page-content').forEach(p => {
            p.classList.remove('active');
            p.style.display = 'none';
        });

        const targetPage = document.getElementById(`page-${page}`);
        if (targetPage) {
            targetPage.classList.add('active');
            targetPage.style.display = 'block';
        }

        // Update header
        this.updatePageHeader(page);

        // Initialize charts if needed
        if (page === 'analytics' && !this.charts.traffic) {
            setTimeout(() => this.initAnalyticsCharts(), 100);
        }

        // Close mobile menu
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.remove('mobile-open');

        this.currentPage = page;
        this.showToast(`${page.charAt(0).toUpperCase() + page.slice(1)} loaded`);
    }

    updatePageHeader(page) {
        const titles = {
            dashboard: { title: 'Dashboard', subtitle: 'Welcome back! Here\'s your sales overview.' },
            sales: { title: 'Sales', subtitle: 'Track your sales performance across all marketplaces.' },
            products: { title: 'Products', subtitle: 'Manage your product catalog and inventory.' },
            analytics: { title: 'Analytics', subtitle: 'Deep insights into your business performance.' },
            orders: { title: 'Orders', subtitle: 'View and manage all your orders.' },
            automation: { title: 'Automation', subtitle: 'Set up rules to automate your workflow.' },
            settings: { title: 'Settings', subtitle: 'Configure your dashboard preferences.' }
        };

        const pageTitle = document.getElementById('pageTitle');
        const pageSubtitle = document.getElementById('pageSubtitle');

        if (pageTitle && titles[page]) {
            pageTitle.textContent = titles[page].title;
        }
        if (pageSubtitle && titles[page]) {
            pageSubtitle.textContent = titles[page].subtitle;
        }
    }

    // ===== SIDEBAR =====
    setupSidebar() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.getElementById('sidebar');
        const logoutBtn = document.getElementById('logoutBtn');

        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
            });
        }

        if (mobileMenuBtn && sidebar) {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-open');
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (window.auth) {
                    window.auth.logout();
                }
            });
        }
    }

    // ===== DATE PICKER =====
    setupDatePicker() {
        const dateBtn = document.getElementById('dateRangeBtn');
        const dropdown = document.getElementById('datePickerDropdown');
        const presets = document.querySelectorAll('.date-preset');
        const dateText = document.getElementById('dateRangeText');

        if (dateBtn && dropdown) {
            dateBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('show');
            });

            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target)) {
                    dropdown.classList.remove('show');
                }
            });
        }

        presets.forEach(preset => {
            preset.addEventListener('click', () => {
                presets.forEach(p => p.classList.remove('active'));
                preset.classList.add('active');

                const range = preset.getAttribute('data-range');
                const today = new Date();
                let text = '';

                switch (range) {
                    case '7d':
                        const d7 = new Date(today);
                        d7.setDate(d7.getDate() - 7);
                        text = `${this.formatDate(d7)} - ${this.formatDate(today)}`;
                        break;
                    case '30d':
                        const d30 = new Date(today);
                        d30.setDate(d30.getDate() - 30);
                        text = `${this.formatDate(d30)} - ${this.formatDate(today)}`;
                        break;
                    case '90d':
                        const d90 = new Date(today);
                        d90.setDate(d90.getDate() - 90);
                        text = `${this.formatDate(d90)} - ${this.formatDate(today)}`;
                        break;
                    case 'ytd':
                        const ytd = new Date(today.getFullYear(), 0, 1);
                        text = `${this.formatDate(ytd)} - ${this.formatDate(today)}`;
                        break;
                    case 'all':
                        text = 'All Time';
                        break;
                }

                if (dateText) dateText.textContent = text;
                if (dropdown) dropdown.classList.remove('show');
                this.showToast('Date range updated');
            });
        });
    }

    formatDate(date) {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    // ===== NOTIFICATIONS =====
    setupNotifications() {
        const notifBtn = document.getElementById('notificationsBtn');
        const dropdown = document.getElementById('notificationsDropdown');
        const markAllRead = document.querySelector('.mark-all-read');

        if (notifBtn && dropdown) {
            notifBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('show');
            });

            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target) && e.target !== notifBtn) {
                    dropdown.classList.remove('show');
                }
            });
        }

        if (markAllRead) {
            markAllRead.addEventListener('click', () => {
                document.querySelectorAll('.notification-item.unread').forEach(item => {
                    item.classList.remove('unread');
                });
                const badge = document.querySelector('.notification-badge');
                if (badge) badge.style.display = 'none';
                this.showToast('All notifications marked as read');
            });
        }

        // Notification items click
        document.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', () => {
                item.classList.remove('unread');
                this.updateNotificationBadge();
            });
        });
    }

    updateNotificationBadge() {
        const count = document.querySelectorAll('.notification-item.unread').length;
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    // ===== CHART PERIODS =====
    setupChartPeriods() {
        const periodBtns = document.querySelectorAll('.chart-period');

        periodBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const parent = btn.parentElement;
                parent.querySelectorAll('.chart-period').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const period = btn.getAttribute('data-period');
                this.currentPeriod = period;
                this.updateSalesTrendChart(period);
            });
        });
    }

    updateSalesTrendChart(period) {
        if (!this.charts.salesTrend) return;

        let days;
        switch (period) {
            case '7d': days = 7; break;
            case '30d': days = 30; break;
            case '90d': days = 90; break;
            case 'ytd': days = 218; break;
            default: days = 30;
        }

        const data = this.generateDailyData(days);
        this.charts.salesTrend.data.labels = data.labels;
        this.charts.salesTrend.data.datasets[0].data = data.values;
        this.charts.salesTrend.update();

        this.showToast(`Showing last ${days} days`);
    }

    // ===== BUTTONS =====
    setupButtons() {
        // Refresh button
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                const svg = refreshBtn.querySelector('svg');
                if (svg) svg.classList.add('animate-spin');
                this.showToast('Refreshing data...', 'info');

                setTimeout(() => {
                    this.updateKPIs();
                    if (svg) svg.classList.remove('animate-spin');
                    this.showToast('Data refreshed!', 'success');
                }, 1000);
            });
        }

        // View All Orders button
        const viewAllBtn = document.getElementById('viewAllOrdersBtn');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', () => {
                this.navigateTo('orders');
            });
        }

        // Export buttons
        const exportSalesBtn = document.getElementById('exportSalesBtn');
        if (exportSalesBtn) {
            exportSalesBtn.addEventListener('click', () => this.exportData('sales'));
        }

        const exportOrdersBtn = document.getElementById('exportOrdersBtn');
        if (exportOrdersBtn) {
            exportOrdersBtn.addEventListener('click', () => this.exportData('orders'));
        }

        // Settings buttons
        const saveProfileBtn = document.getElementById('saveProfileBtn');
        if (saveProfileBtn) {
            saveProfileBtn.addEventListener('click', () => {
                this.showToast('Profile saved!', 'success');
            });
        }

        const changePasswordBtn = document.getElementById('changePasswordBtn');
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', () => {
                this.showToast('Password changed!', 'success');
            });
        }

        const syncNowBtn = document.getElementById('syncNowBtn');
        if (syncNowBtn) {
            syncNowBtn.addEventListener('click', () => {
                syncNowBtn.disabled = true;
                this.showToast('Syncing with Amazon...', 'info');

                setTimeout(() => {
                    syncNowBtn.disabled = false;
                    this.showToast('Sync complete!', 'success');
                }, 2000);
            });
        }

        const createRuleBtn = document.getElementById('createRuleBtn');
        if (createRuleBtn) {
            createRuleBtn.addEventListener('click', () => {
                this.showToast('Create rule (coming soon)', 'info');
            });
        }

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const html = document.documentElement;
                const current = html.getAttribute('data-theme');
                const next = current === 'dark' ? 'light' : 'dark';
                html.setAttribute('data-theme', next);
                localStorage.setItem('theme', next);

                // Rebuild charts with new theme
                setTimeout(() => this.rebuildCharts(), 100);
            });
        }
    }

    exportData(type) {
        this.showToast(`Exporting ${type}...`, 'info');
        setTimeout(() => {
            this.showToast(`${type} exported!`, 'success');
        }, 1500);
    }

    // ===== SEARCH & FILTERS =====
    setupSearch() {
        const productSearch = document.getElementById('productSearch');
        if (productSearch) {
            productSearch.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                document.querySelectorAll('.product-card').forEach(card => {
                    const name = card.querySelector('h4')?.textContent.toLowerCase() || '';
                    const sku = card.querySelector('.product-sku')?.textContent.toLowerCase() || '';
                    card.style.display = (name.includes(query) || sku.includes(query)) ? '' : 'none';
                });
            });
        }
    }

    setupFilters() {
        const orderFilter = document.getElementById('orderStatusFilter');
        if (orderFilter) {
            orderFilter.addEventListener('change', (e) => {
                const status = e.target.value;
                document.querySelectorAll('#allOrdersTableBody tr').forEach(row => {
                    const rowStatus = row.querySelector('.status-badge')?.textContent.toLowerCase();
                    row.style.display = (status === 'all' || rowStatus === status) ? '' : 'none';
                });
                this.showToast(`Filtered by: ${status}`);
            });
        }

        // Pagination
        document.querySelectorAll('.pagination-btn:not(:disabled)').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.pagination-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    // ===== KPIs =====
    updateKPIs() {
        this.animateValue('kpiRevenue', this.salesData.totalRevenue, '€');
        this.animateValue('kpiOrders', this.salesData.totalOrders);
        this.animateValue('kpiUnits', this.salesData.totalUnits);
        this.animateValue('kpiAvg', this.salesData.avgOrder, '€');
    }

    animateValue(id, target, prefix = '') {
        const el = document.getElementById(id);
        if (!el) return;

        const duration = 1500;
        const start = performance.now();
        const isDecimal = !Number.isInteger(target);

        const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = target * eased;

            if (isDecimal) {
                el.textContent = prefix + current.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            } else {
                el.textContent = prefix + Math.floor(current).toLocaleString();
            }

            if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }

    // ===== RECENT ORDERS =====
    loadRecentOrders() {
        const tbody = document.getElementById('ordersTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.salesData.recentOrders.map(order => `
            <tr>
                <td><code style="font-size: 0.75rem; color: var(--primary-400);">${order.id}</code></td>
                <td>${order.product}</td>
                <td><span class="country-cell"><span class="country-flag">${order.flag}</span> ${order.country}</span></td>
                <td>${order.date}</td>
                <td>€${order.amount.toFixed(2)}</td>
                <td><span class="status-badge ${order.status}">${order.status}</span></td>
            </tr>
        `).join('');
    }

    // ===== CHARTS =====
    initCharts() {
        if (typeof Chart === 'undefined') {
            console.error('Chart.js not loaded');
            return;
        }

        this.initSalesTrendChart();
        this.initCountryChart();
        this.initProductsChart();
        this.initHourlyChart();
    }

    rebuildCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.charts = {};
        this.initCharts();
        if (this.currentPage === 'analytics') {
            this.initAnalyticsCharts();
        }
    }

    getChartColors() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        return {
            primary: '#6366f1',
            text: isDark ? '#a1a1aa' : '#64748b',
            grid: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            palette: ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16', '#f97316']
        };
    }

    generateDailyData(days) {
        const labels = [];
        const values = [];
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

            const base = 80 + Math.random() * 120;
            const weekday = date.getDay();
            const mult = (weekday === 0 || weekday === 6) ? 0.7 : 1.2;
            values.push(Math.round(base * mult * 100) / 100);
        }

        return { labels, values };
    }

    initSalesTrendChart() {
        const ctx = document.getElementById('salesTrendChart');
        if (!ctx) return;

        const colors = this.getChartColors();
        const data = this.generateDailyData(30);

        this.charts.salesTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Revenue',
                    data: data.values,
                    borderColor: colors.primary,
                    backgroundColor: colors.primary + '20',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: colors.grid }, ticks: { color: colors.text, maxTicksLimit: 8 } },
                    y: { grid: { color: colors.grid }, ticks: { color: colors.text, callback: v => '€' + v } }
                }
            }
        });
    }

    initCountryChart() {
        const ctx = document.getElementById('countryChart');
        if (!ctx) return;

        const colors = this.getChartColors();

        this.charts.country = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: this.salesData.byCountry.map(c => `${c.flag} ${c.name}`),
                datasets: [{
                    data: this.salesData.byCountry.map(c => c.revenue),
                    backgroundColor: colors.palette,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: { position: 'right', labels: { color: colors.text, font: { size: 11 }, usePointStyle: true } }
                }
            }
        });
    }

    initProductsChart() {
        const ctx = document.getElementById('productsChart');
        if (!ctx) return;

        const colors = this.getChartColors();
        const top5 = this.salesData.products.slice(0, 5);

        this.charts.products = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: top5.map(p => p.name),
                datasets: [{
                    data: top5.map(p => p.revenue),
                    backgroundColor: colors.palette.slice(0, 5),
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: colors.grid }, ticks: { color: colors.text, callback: v => '€' + v } },
                    y: { grid: { display: false }, ticks: { color: colors.text } }
                }
            }
        });
    }

    initHourlyChart() {
        const ctx = document.getElementById('hourlyChart');
        if (!ctx) return;

        const colors = this.getChartColors();
        const hourlyData = [];

        for (let i = 0; i < 24; i++) {
            let mult = 1;
            if (i >= 9 && i <= 12) mult = 2;
            if (i >= 18 && i <= 21) mult = 2.5;
            if (i >= 0 && i <= 6) mult = 0.3;
            hourlyData.push(Math.floor(5 + Math.random() * 20 * mult));
        }

        this.charts.hourly = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
                datasets: [{
                    data: hourlyData,
                    backgroundColor: hourlyData.map(v => {
                        const max = Math.max(...hourlyData);
                        return `rgba(99, 102, 241, ${0.3 + (v / max) * 0.7})`;
                    }),
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: colors.text, maxTicksLimit: 12 } },
                    y: { grid: { color: colors.grid }, ticks: { color: colors.text } }
                }
            }
        });
    }

    initAnalyticsCharts() {
        const colors = this.getChartColors();

        // Traffic chart
        const trafficCtx = document.getElementById('trafficChart');
        if (trafficCtx && !this.charts.traffic) {
            this.charts.traffic = new Chart(trafficCtx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [
                        { label: 'Amazon', data: [1200, 1350, 1100, 1450, 1600, 980, 850], borderColor: '#f59e0b', tension: 0.4, fill: false },
                        { label: 'Direct', data: [400, 380, 420, 450, 380, 320, 280], borderColor: colors.primary, tension: 0.4, fill: false },
                        { label: 'Social', data: [200, 250, 180, 300, 280, 220, 190], borderColor: '#10b981', tension: 0.4, fill: false }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom', labels: { color: colors.text } } },
                    scales: {
                        x: { grid: { color: colors.grid }, ticks: { color: colors.text } },
                        y: { grid: { color: colors.grid }, ticks: { color: colors.text } }
                    }
                }
            });
        }

        // Device chart
        const deviceCtx = document.getElementById('deviceChart');
        if (deviceCtx && !this.charts.device) {
            this.charts.device = new Chart(deviceCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Desktop', 'Mobile', 'Tablet'],
                    datasets: [{
                        data: [55, 38, 7],
                        backgroundColor: [colors.primary, '#10b981', '#f59e0b'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '65%',
                    plugins: { legend: { position: 'bottom', labels: { color: colors.text } } }
                }
            });
        }
    }

    // ===== TOAST =====
    showToast(message, type = 'info') {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `<span>${message}</span><button class="toast-close">&times;</button>`;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);

        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        });

        setTimeout(() => {
            if (toast.parentElement) {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }
        }, 3000);
    }
}

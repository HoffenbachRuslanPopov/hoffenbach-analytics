/* =============================================
   DASHBOARD MODULE
   ============================================= */

class Dashboard {
    constructor() {
        this.charts = {};
        this.salesData = [];
        this.currentPage = 'dashboard';
        this.currentPeriod = 'ytd';
        this.init();
    }

    init() {
        this.setupSidebar();
        this.setupNavigation();
        this.loadDemoData();
        this.initCharts();
        this.updateKPIs();
        this.loadRecentOrders();
        this.setupRefreshButton();
        this.setupDatePicker();
        this.setupNotifications();
        this.setupChartPeriods();
        this.setupViewAllButton();
        this.setupExportButtons();
        this.setupSettingsButtons();
        this.setupProductSearch();
        this.setupOrderFilter();
        this.setupPagination();
    }

    setupSidebar() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');

        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
                localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
            });

            // Restore sidebar state
            if (localStorage.getItem('sidebarCollapsed') === 'true') {
                sidebar.classList.add('collapsed');
            }
        }

        if (mobileMenuBtn && sidebar) {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-open');
            });

            // Close sidebar when clicking outside on mobile
            document.addEventListener('click', (e) => {
                if (window.innerWidth <= 768 &&
                    !sidebar.contains(e.target) &&
                    !mobileMenuBtn.contains(e.target)) {
                    sidebar.classList.remove('mobile-open');
                }
            });
        }
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item a');
        const pages = document.querySelectorAll('.page-content');
        const pageTitle = document.getElementById('pageTitle');
        const pageSubtitle = document.getElementById('pageSubtitle');

        const pageTitles = {
            dashboard: { title: 'Dashboard', subtitle: 'Welcome back! Here\'s your sales overview.', i18nTitle: 'dashboard.title', i18nSubtitle: 'dashboard.subtitle' },
            sales: { title: 'Sales', subtitle: 'Track your sales performance across all marketplaces.', i18nTitle: 'nav.sales', i18nSubtitle: null },
            products: { title: 'Products', subtitle: 'Manage your product catalog and inventory.', i18nTitle: 'nav.products', i18nSubtitle: null },
            analytics: { title: 'Analytics', subtitle: 'Deep insights into your business performance.', i18nTitle: 'nav.analytics', i18nSubtitle: null },
            orders: { title: 'Orders', subtitle: 'View and manage all your orders.', i18nTitle: 'nav.orders', i18nSubtitle: null },
            automation: { title: 'Automation', subtitle: 'Set up rules to automate your workflow.', i18nTitle: 'nav.automation', i18nSubtitle: null },
            settings: { title: 'Settings', subtitle: 'Configure your dashboard preferences.', i18nTitle: 'nav.settings', i18nSubtitle: null }
        };

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;

                // Update active nav item
                navItems.forEach(i => i.parentElement.classList.remove('active'));
                item.parentElement.classList.add('active');

                // Show corresponding page
                pages.forEach(p => p.classList.remove('active'));
                const targetPage = document.getElementById(`page-${page}`);
                if (targetPage) {
                    targetPage.classList.add('active');
                }

                // Update page title
                if (pageTitle && pageTitles[page]) {
                    const titleData = pageTitles[page];
                    if (window.i18n) {
                        pageTitle.textContent = window.i18n.t(titleData.i18nTitle) || titleData.title;
                    } else {
                        pageTitle.textContent = titleData.title;
                    }
                    pageTitle.dataset.i18n = titleData.i18nTitle;
                }

                if (pageSubtitle && pageTitles[page]) {
                    pageSubtitle.textContent = pageTitles[page].subtitle;
                    if (pageTitles[page].i18nSubtitle) {
                        pageSubtitle.dataset.i18n = pageTitles[page].i18nSubtitle;
                    } else {
                        pageSubtitle.removeAttribute('data-i18n');
                    }
                }

                // Initialize analytics charts if needed
                if (page === 'analytics') {
                    this.initAnalyticsCharts();
                }

                // Close mobile menu
                const sidebar = document.getElementById('sidebar');
                if (sidebar) {
                    sidebar.classList.remove('mobile-open');
                }

                this.currentPage = page;
            });
        });
    }

    setupDatePicker() {
        const dateBtn = document.getElementById('dateRangeBtn');
        const dateDropdown = document.getElementById('datePickerDropdown');
        const dateRangeText = document.getElementById('dateRangeText');
        const presets = document.querySelectorAll('.date-preset');

        if (dateBtn && dateDropdown) {
            dateBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dateDropdown.classList.toggle('show');
            });

            document.addEventListener('click', (e) => {
                if (!dateDropdown.contains(e.target) && e.target !== dateBtn) {
                    dateDropdown.classList.remove('show');
                }
            });
        }

        presets.forEach(preset => {
            preset.addEventListener('click', () => {
                presets.forEach(p => p.classList.remove('active'));
                preset.classList.add('active');

                const range = preset.dataset.range;
                const today = new Date();
                let startDate;

                switch (range) {
                    case '7d':
                        startDate = new Date(today);
                        startDate.setDate(today.getDate() - 7);
                        dateRangeText.textContent = `${this.formatDate(startDate)} - ${this.formatDate(today)}`;
                        break;
                    case '30d':
                        startDate = new Date(today);
                        startDate.setDate(today.getDate() - 30);
                        dateRangeText.textContent = `${this.formatDate(startDate)} - ${this.formatDate(today)}`;
                        break;
                    case '90d':
                        startDate = new Date(today);
                        startDate.setDate(today.getDate() - 90);
                        dateRangeText.textContent = `${this.formatDate(startDate)} - ${this.formatDate(today)}`;
                        break;
                    case 'ytd':
                        startDate = new Date(today.getFullYear(), 0, 1);
                        dateRangeText.textContent = `${this.formatDate(startDate)} - ${this.formatDate(today)}`;
                        break;
                    case 'all':
                        dateRangeText.textContent = 'All Time';
                        break;
                }

                dateDropdown.classList.remove('show');
                this.showToast('Date range updated');
            });
        });
    }

    formatDate(date) {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    setupNotifications() {
        const notificationsBtn = document.getElementById('notificationsBtn');
        const notificationsDropdown = document.getElementById('notificationsDropdown');
        const markAllRead = document.querySelector('.mark-all-read');
        const badge = document.querySelector('.notification-badge');

        if (notificationsBtn && notificationsDropdown) {
            notificationsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                notificationsDropdown.classList.toggle('show');
            });

            document.addEventListener('click', (e) => {
                if (!notificationsDropdown.contains(e.target) && e.target !== notificationsBtn) {
                    notificationsDropdown.classList.remove('show');
                }
            });
        }

        if (markAllRead) {
            markAllRead.addEventListener('click', () => {
                const unreadItems = document.querySelectorAll('.notification-item.unread');
                unreadItems.forEach(item => item.classList.remove('unread'));
                if (badge) {
                    badge.style.display = 'none';
                }
                this.showToast('All notifications marked as read');
            });
        }

        // Click on notification item
        const notificationItems = document.querySelectorAll('.notification-item');
        notificationItems.forEach(item => {
            item.addEventListener('click', () => {
                item.classList.remove('unread');
                this.updateNotificationBadge();
            });
        });
    }

    updateNotificationBadge() {
        const unreadCount = document.querySelectorAll('.notification-item.unread').length;
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            if (unreadCount > 0) {
                badge.textContent = unreadCount;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    }

    setupChartPeriods() {
        const periodButtons = document.querySelectorAll('.chart-period');

        periodButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const chartActions = btn.parentElement;
                chartActions.querySelectorAll('.chart-period').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const period = btn.dataset.period;
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
            case 'ytd': days = 218; break; // Jan 1 to Aug 6
            default: days = 30;
        }

        const data = this.generateDailyData(days);
        const colors = this.getChartColors();

        this.charts.salesTrend.data.labels = data.map(d => {
            const date = new Date(d.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        this.charts.salesTrend.data.datasets[0].data = data.map(d => d.revenue);
        this.charts.salesTrend.update();

        this.showToast(`Showing data for last ${days} days`);
    }

    setupViewAllButton() {
        const viewAllBtn = document.getElementById('viewAllOrdersBtn');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', () => {
                // Navigate to orders page
                const ordersNav = document.querySelector('[data-page="orders"]');
                if (ordersNav) {
                    ordersNav.click();
                }
            });
        }
    }

    setupExportButtons() {
        const exportSalesBtn = document.getElementById('exportSalesBtn');
        const exportOrdersBtn = document.getElementById('exportOrdersBtn');

        if (exportSalesBtn) {
            exportSalesBtn.addEventListener('click', () => {
                this.exportData('sales');
            });
        }

        if (exportOrdersBtn) {
            exportOrdersBtn.addEventListener('click', () => {
                this.exportData('orders');
            });
        }
    }

    exportData(type) {
        // Simulate export
        this.showToast(`Exporting ${type} data...`, 'info');

        setTimeout(() => {
            this.showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} data exported successfully!`, 'success');
        }, 1500);
    }

    setupSettingsButtons() {
        const saveProfileBtn = document.getElementById('saveProfileBtn');
        const changePasswordBtn = document.getElementById('changePasswordBtn');
        const syncNowBtn = document.getElementById('syncNowBtn');
        const createRuleBtn = document.getElementById('createRuleBtn');

        if (saveProfileBtn) {
            saveProfileBtn.addEventListener('click', () => {
                this.showToast('Profile settings saved!', 'success');
            });
        }

        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', () => {
                this.showToast('Password changed successfully!', 'success');
            });
        }

        if (syncNowBtn) {
            syncNowBtn.addEventListener('click', () => {
                syncNowBtn.classList.add('loading');
                syncNowBtn.disabled = true;

                this.showToast('Syncing with Amazon SP API...', 'info');

                setTimeout(() => {
                    syncNowBtn.classList.remove('loading');
                    syncNowBtn.disabled = false;
                    this.showToast('Sync completed successfully!', 'success');
                }, 2000);
            });
        }

        if (createRuleBtn) {
            createRuleBtn.addEventListener('click', () => {
                this.showToast('Create new automation rule (coming soon)', 'info');
            });
        }
    }

    setupProductSearch() {
        const searchInput = document.getElementById('productSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const products = document.querySelectorAll('.product-card');

                products.forEach(product => {
                    const name = product.querySelector('h4').textContent.toLowerCase();
                    const sku = product.querySelector('.product-sku').textContent.toLowerCase();

                    if (name.includes(query) || sku.includes(query)) {
                        product.style.display = '';
                    } else {
                        product.style.display = 'none';
                    }
                });
            });
        }
    }

    setupOrderFilter() {
        const filterSelect = document.getElementById('orderStatusFilter');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                const status = e.target.value;
                const rows = document.querySelectorAll('#allOrdersTableBody tr');

                rows.forEach(row => {
                    const rowStatus = row.querySelector('.status-badge')?.textContent.toLowerCase();
                    if (status === 'all' || rowStatus === status) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });

                this.showToast(`Filtered by: ${status === 'all' ? 'All orders' : status}`);
            });
        }
    }

    setupPagination() {
        const paginationBtns = document.querySelectorAll('.pagination-btn');
        paginationBtns.forEach(btn => {
            if (!btn.disabled) {
                btn.addEventListener('click', () => {
                    paginationBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.showToast(`Page ${btn.textContent} loaded`);
                });
            }
        });
    }

    showToast(message, type = 'info') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span>${message}</span>
            <button class="toast-close">&times;</button>
        `;

        document.body.appendChild(toast);

        // Show animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        });

        // Auto hide
        setTimeout(() => {
            if (toast.parentElement) {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }
        }, 3000);
    }

    loadDemoData() {
        // Demo sales data for charts
        this.salesData = {
            daily: this.generateDailyData(30),
            monthly: [
                { month: 'Jan', revenue: 2850, units: 195 },
                { month: 'Feb', revenue: 2420, units: 168 },
                { month: 'Mar', revenue: 3100, units: 210 },
                { month: 'Apr', revenue: 2780, units: 185 },
                { month: 'May', revenue: 3250, units: 225 },
                { month: 'Jun', revenue: 2950, units: 198 },
                { month: 'Jul', revenue: 3400, units: 240 },
                { month: 'Aug', revenue: 820, units: 57 }
            ],
            byCountry: [
                { country: 'DE', name: 'Germany', revenue: 7876.51, units: 605, flag: '🇩🇪' },
                { country: 'FR', name: 'France', revenue: 3723.41, units: 215, flag: '🇫🇷' },
                { country: 'GB', name: 'UK', revenue: 1954.47, units: 183, flag: '🇬🇧' },
                { country: 'IT', name: 'Italy', revenue: 1941.96, units: 110, flag: '🇮🇹' },
                { country: 'SE', name: 'Sweden', revenue: 1399.89, units: 11, flag: '🇸🇪' },
                { country: 'ES', name: 'Spain', revenue: 1217.34, units: 81, flag: '🇪🇸' },
                { country: 'NL', name: 'Netherlands', revenue: 299.29, units: 21, flag: '🇳🇱' },
                { country: 'BE', name: 'Belgium', revenue: 124.94, units: 6, flag: '🇧🇪' },
                { country: 'IE', name: 'Ireland', revenue: 33.98, units: 2, flag: '🇮🇪' }
            ],
            topProducts: [
                { name: 'Magnetic Locks 20+4', revenue: 4520, units: 151 },
                { name: 'Socket Protectors 20x', revenue: 2890, units: 362 },
                { name: 'Magnetic Locks 12+3', revenue: 2450, units: 130 },
                { name: 'Wall Protector Pads', revenue: 1680, units: 168 },
                { name: 'Corner Protectors 12x', revenue: 1240, units: 124 }
            ],
            hourly: this.generateHourlyData()
        };
    }

    generateDailyData(days) {
        const data = [];
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);

            const baseRevenue = 80 + Math.random() * 120;
            const weekday = date.getDay();
            const multiplier = (weekday === 0 || weekday === 6) ? 0.7 : 1.2;

            data.push({
                date: date.toISOString().split('T')[0],
                revenue: Math.round(baseRevenue * multiplier * 100) / 100,
                units: Math.floor(5 + Math.random() * 15 * multiplier)
            });
        }

        return data;
    }

    generateHourlyData() {
        const data = [];
        for (let i = 0; i < 24; i++) {
            let multiplier = 1;
            if (i >= 9 && i <= 12) multiplier = 2;
            if (i >= 18 && i <= 21) multiplier = 2.5;
            if (i >= 0 && i <= 6) multiplier = 0.3;

            data.push({
                hour: i,
                orders: Math.floor(5 + Math.random() * 20 * multiplier)
            });
        }
        return data;
    }

    updateKPIs() {
        const totalRevenue = 18571.79;
        const totalOrders = 1177;
        const totalUnits = 1234;
        const avgOrder = totalRevenue / totalOrders;

        this.animateValue('kpiRevenue', 0, totalRevenue, 1500, '€');
        this.animateValue('kpiOrders', 0, totalOrders, 1500);
        this.animateValue('kpiUnits', 0, totalUnits, 1500);
        this.animateValue('kpiAvg', 0, avgOrder, 1500, '€');
    }

    animateValue(elementId, start, end, duration, prefix = '') {
        const element = document.getElementById(elementId);
        if (!element) return;

        const startTime = performance.now();
        const isDecimal = !Number.isInteger(end);

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = start + (end - start) * easeOutQuart;

            if (isDecimal) {
                element.textContent = prefix + current.toLocaleString('de-DE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            } else {
                element.textContent = prefix + Math.floor(current).toLocaleString();
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    initCharts() {
        this.initSalesTrendChart();
        this.initCountryChart();
        this.initProductsChart();
        this.initHourlyChart();
    }

    initAnalyticsCharts() {
        // Only init if not already created
        if (!this.charts.traffic) {
            this.initTrafficChart();
        }
        if (!this.charts.device) {
            this.initDeviceChart();
        }
    }

    initTrafficChart() {
        const ctx = document.getElementById('trafficChart');
        if (!ctx) return;

        const colors = this.getChartColors();

        this.charts.traffic = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Amazon',
                        data: [1200, 1350, 1100, 1450, 1600, 980, 850],
                        borderColor: '#f59e0b',
                        backgroundColor: 'transparent',
                        tension: 0.4
                    },
                    {
                        label: 'Direct',
                        data: [400, 380, 420, 450, 380, 320, 280],
                        borderColor: colors.primary,
                        backgroundColor: 'transparent',
                        tension: 0.4
                    },
                    {
                        label: 'Social',
                        data: [200, 250, 180, 300, 280, 220, 190],
                        borderColor: '#10b981',
                        backgroundColor: 'transparent',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: colors.textSecondary }
                    }
                },
                scales: {
                    x: {
                        grid: { color: colors.grid },
                        ticks: { color: colors.textSecondary }
                    },
                    y: {
                        grid: { color: colors.grid },
                        ticks: { color: colors.textSecondary }
                    }
                }
            }
        });
    }

    initDeviceChart() {
        const ctx = document.getElementById('deviceChart');
        if (!ctx) return;

        const colors = this.getChartColors();

        this.charts.device = new Chart(ctx, {
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
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: colors.textSecondary }
                    }
                }
            }
        });
    }

    getChartColors() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        return {
            primary: '#6366f1',
            secondary: '#8b5cf6',
            success: '#10b981',
            warning: '#f59e0b',
            danger: '#ef4444',
            text: isDark ? '#ffffff' : '#1e293b',
            textSecondary: isDark ? '#a1a1aa' : '#64748b',
            grid: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            palette: [
                '#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
                '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#14b8a6'
            ]
        };
    }

    initSalesTrendChart() {
        const ctx = document.getElementById('salesTrendChart');
        if (!ctx) return;

        const colors = this.getChartColors();
        const data = this.salesData.daily;

        this.charts.salesTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => {
                    const date = new Date(d.date);
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }),
                datasets: [{
                    label: 'Revenue (€)',
                    data: data.map(d => d.revenue),
                    borderColor: colors.primary,
                    backgroundColor: `${colors.primary}20`,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: colors.primary,
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: (ctx) => `€${ctx.raw.toFixed(2)}`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: colors.grid },
                        ticks: { color: colors.textSecondary, maxTicksLimit: 8 }
                    },
                    y: {
                        grid: { color: colors.grid },
                        ticks: {
                            color: colors.textSecondary,
                            callback: (v) => '€' + v
                        }
                    }
                }
            }
        });
    }

    initCountryChart() {
        const ctx = document.getElementById('countryChart');
        if (!ctx) return;

        const colors = this.getChartColors();
        const data = this.salesData.byCountry;

        this.charts.country = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.map(d => `${d.flag} ${d.name}`),
                datasets: [{
                    data: data.map(d => d.revenue),
                    backgroundColor: colors.palette,
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: colors.textSecondary,
                            font: { size: 11 },
                            padding: 12,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        callbacks: {
                            label: (ctx) => ` €${ctx.raw.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`
                        }
                    }
                }
            }
        });
    }

    initProductsChart() {
        const ctx = document.getElementById('productsChart');
        if (!ctx) return;

        const colors = this.getChartColors();
        const data = this.salesData.topProducts;

        this.charts.products = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(d => d.name),
                datasets: [{
                    label: 'Revenue',
                    data: data.map(d => d.revenue),
                    backgroundColor: colors.palette.slice(0, data.length),
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        callbacks: {
                            label: (ctx) => ` €${ctx.raw.toLocaleString()}`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: colors.grid },
                        ticks: {
                            color: colors.textSecondary,
                            callback: (v) => '€' + v
                        }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: colors.textSecondary }
                    }
                }
            }
        });
    }

    initHourlyChart() {
        const ctx = document.getElementById('hourlyChart');
        if (!ctx) return;

        const colors = this.getChartColors();
        const data = this.salesData.hourly;

        this.charts.hourly = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(d => `${d.hour}:00`),
                datasets: [{
                    label: 'Orders',
                    data: data.map(d => d.orders),
                    backgroundColor: data.map((d, i) => {
                        const intensity = d.orders / Math.max(...data.map(x => x.orders));
                        return `rgba(99, 102, 241, ${0.3 + intensity * 0.7})`;
                    }),
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        callbacks: {
                            title: (ctx) => `${ctx[0].label}`,
                            label: (ctx) => ` ${ctx.raw} orders`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: {
                            color: colors.textSecondary,
                            maxTicksLimit: 12
                        }
                    },
                    y: {
                        grid: { color: colors.grid },
                        ticks: { color: colors.textSecondary }
                    }
                }
            }
        });
    }

    loadRecentOrders() {
        const tbody = document.getElementById('ordersTableBody');
        if (!tbody) return;

        const orders = [
            { id: '306-9063696-5426752', product: 'Magnetic Locks 20+4', country: 'DE', flag: '🇩🇪', date: '2026-08-06', amount: 29.99, status: 'shipped' },
            { id: '028-9246498-0330717', product: 'Socket Protectors 20x', country: 'DE', flag: '🇩🇪', date: '2026-08-06', amount: 7.99, status: 'shipped' },
            { id: '203-3985502-1642757', product: 'Corner Protectors 12x', country: 'GB', flag: '🇬🇧', date: '2026-08-05', amount: 9.99, status: 'shipped' },
            { id: '404-9151343-2417117', product: 'Magnetic Locks 20+4', country: 'FR', flag: '🇫🇷', date: '2026-08-05', amount: 29.99, status: 'pending' },
            { id: '171-6613491-8643508', product: 'Socket Protectors 20x', country: 'NL', flag: '🇳🇱', date: '2026-08-05', amount: 9.49, status: 'shipped' }
        ];

        tbody.innerHTML = orders.map(order => `
            <tr>
                <td><code style="font-size: 0.75rem; color: var(--primary-400);">${order.id}</code></td>
                <td>${order.product}</td>
                <td>
                    <span class="country-cell">
                        <span class="country-flag">${order.flag}</span>
                        ${order.country}
                    </span>
                </td>
                <td>${order.date}</td>
                <td>€${order.amount.toFixed(2)}</td>
                <td><span class="status-badge ${order.status}">${order.status}</span></td>
            </tr>
        `).join('');
    }

    setupRefreshButton() {
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                refreshBtn.querySelector('svg').classList.add('animate-spin');
                this.showToast('Refreshing data...', 'info');

                setTimeout(() => {
                    this.updateKPIs();
                    refreshBtn.querySelector('svg').classList.remove('animate-spin');
                    this.showToast('Data refreshed successfully!', 'success');
                }, 1000);
            });
        }
    }

    // Theme change handler
    updateChartsTheme() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
        this.charts = {};
        this.initCharts();
        if (this.currentPage === 'analytics') {
            this.initAnalyticsCharts();
        }
    }
}

// Initialize Dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication first
    if (window.auth && window.auth.isAuthenticated()) {
        window.dashboard = new Dashboard();

        // Update charts when theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    window.dashboard.updateChartsTheme();
                }
            });
        });

        observer.observe(document.documentElement, { attributes: true });
    }
});

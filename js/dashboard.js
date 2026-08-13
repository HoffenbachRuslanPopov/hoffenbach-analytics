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

        // Sales data with test products
        this.salesData = {
            totalRevenue: 18571.79,
            totalOrders: 1194,
            totalUnits: 1518,
            avgOrder: 15.56,
            byCountry: [
                { code: 'DE', name: 'Germany', flag: '🇩🇪', revenue: 7876.51, orders: 605, units: 780 },
                { code: 'FR', name: 'France', flag: '🇫🇷', revenue: 3723.41, orders: 215, units: 285 },
                { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', revenue: 1954.47, orders: 183, units: 210 },
                { code: 'IT', name: 'Italy', flag: '🇮🇹', revenue: 1941.96, orders: 110, units: 145 },
                { code: 'ES', name: 'Spain', flag: '🇪🇸', revenue: 1217.34, orders: 81, units: 98 },
                { code: 'NL', name: 'Netherlands', flag: '🇳🇱', revenue: 1858.10, orders: 0, units: 0 }
            ],
            products: [
                { name: 'Magnetic Locks 20+4', asin: 'B07JZCWJMW', sku: 'HF-ML-2004', price: 29.99, sold: 342, revenue: 4521.18 },
                { name: 'Socket Protectors 20x', asin: 'B0854MW97N', sku: 'HF-SP-020W', price: 7.99, sold: 287, revenue: 2292.73 },
                { name: 'Corner Protectors 12x', asin: 'B0933B1NKB', sku: 'HF-CP-012B', price: 9.99, sold: 198, revenue: 2187.78 },
                { name: 'Edge Guard 6m', asin: 'B07PPXKJPQ', sku: 'HF-EG-006M', price: 14.99, sold: 156, revenue: 2338.44 },
                { name: 'Wall Protector Pads', asin: 'B08NCRRM6M', sku: 'HF-WP-004W', price: 9.99, sold: 134, revenue: 1339.66 },
                { name: 'Cabinet Locks 10x', asin: 'B09HK8LJ2Z', sku: 'HF-CL-010X', price: 12.99, sold: 89, revenue: 1156.11 }
            ],
            recentOrders: [
                { id: '306-9063696-5426752', product: 'Magnetic Locks 20+4', asin: 'B07JZCWJMW', country: 'DE', flag: '🇩🇪', date: '2026-08-06', amount: 29.99, status: 'shipped' },
                { id: '028-9246498-0330717', product: 'Socket Protectors 20x', asin: 'B0854MW97N', country: 'DE', flag: '🇩🇪', date: '2026-08-06', amount: 7.99, status: 'shipped' },
                { id: '203-3985502-1642757', product: 'Corner Protectors 12x', asin: 'B0933B1NKB', country: 'GB', flag: '🇬🇧', date: '2026-08-05', amount: 9.99, status: 'shipped' },
                { id: '404-9151343-2417117', product: 'Magnetic Locks 20+4', asin: 'B07JZCWJMW', country: 'FR', flag: '🇫🇷', date: '2026-08-05', amount: 29.99, status: 'pending' },
                { id: '171-6613491-8643508', product: 'Socket Protectors 20x', asin: 'B0854MW97N', country: 'NL', flag: '🇳🇱', date: '2026-08-05', amount: 9.49, status: 'shipped' }
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
        this.setupAsinSearch();
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
        const customDateFrom = document.getElementById('customDateFrom');
        const customDateTo = document.getElementById('customDateTo');
        const applyCustomDate = document.getElementById('applyCustomDate');

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

        // Set default values for custom date inputs
        if (customDateFrom && customDateTo) {
            const today = new Date();
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            customDateTo.value = today.toISOString().split('T')[0];
            customDateFrom.value = thirtyDaysAgo.toISOString().split('T')[0];
        }

        // Custom date range apply button
        if (applyCustomDate) {
            applyCustomDate.addEventListener('click', () => {
                const fromDate = customDateFrom ? new Date(customDateFrom.value) : null;
                const toDate = customDateTo ? new Date(customDateTo.value) : null;

                if (!fromDate || !toDate || isNaN(fromDate) || isNaN(toDate)) {
                    this.showToast('Please select both dates', 'error');
                    return;
                }

                if (fromDate > toDate) {
                    this.showToast('Start date must be before end date', 'error');
                    return;
                }

                // Remove active state from presets
                presets.forEach(p => p.classList.remove('active'));

                // Calculate days difference
                const diffTime = Math.abs(toDate - fromDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

                // Update date text
                if (dateText) {
                    dateText.textContent = `${this.formatDate(fromDate)} - ${this.formatDate(toDate)}`;
                }

                // Update chart with custom range
                this.updateSalesTrendChartCustom(fromDate, toDate, diffDays);

                if (dropdown) dropdown.classList.remove('show');
                this.showToast(`Custom range: ${diffDays} days`);
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

    updateSalesTrendChartCustom(fromDate, toDate, days) {
        if (!this.charts.salesTrend) return;

        const data = this.generateDailyDataForRange(fromDate, toDate, days);
        this.charts.salesTrend.data.labels = data.labels;
        this.charts.salesTrend.data.datasets[0].data = data.values;
        this.charts.salesTrend.update();
    }

    generateDailyDataForRange(fromDate, toDate, days) {
        const labels = [];
        const values = [];

        for (let i = 0; i < days; i++) {
            const date = new Date(fromDate);
            date.setDate(date.getDate() + i);

            if (date > toDate) break;

            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

            const base = 80 + Math.random() * 120;
            const weekday = date.getDay();
            const mult = (weekday === 0 || weekday === 6) ? 0.7 : 1.2;
            values.push(Math.round(base * mult * 100) / 100);
        }

        return { labels, values };
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
                const query = e.target.value.toLowerCase().trim();
                let matchCount = 0;

                document.querySelectorAll('.product-card').forEach(card => {
                    const name = card.querySelector('h4')?.textContent.toLowerCase() || '';
                    const sku = card.querySelector('.product-sku')?.textContent.toLowerCase() || '';
                    const asin = card.querySelector('.product-asin')?.textContent.toLowerCase() || '';
                    const dataAsin = card.getAttribute('data-asin')?.toLowerCase() || '';
                    const dataSku = card.getAttribute('data-sku')?.toLowerCase() || '';

                    const matches = name.includes(query) ||
                                   sku.includes(query) ||
                                   asin.includes(query) ||
                                   dataAsin.includes(query) ||
                                   dataSku.includes(query);

                    card.style.display = matches ? '' : 'none';
                    if (matches) matchCount++;
                });

                if (query.length > 0) {
                    this.showToast(`Found ${matchCount} product${matchCount !== 1 ? 's' : ''}`);
                }
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
                    pointHoverRadius: 6,
                    pointBackgroundColor: colors.primary,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            title: (items) => items[0].label,
                            label: (item) => `Revenue: €${item.raw.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`
                        }
                    }
                },
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
        const totalRevenue = this.salesData.byCountry.reduce((sum, c) => sum + c.revenue, 0);

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
                    legend: { position: 'right', labels: { color: colors.text, font: { size: 11 }, usePointStyle: true } },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: (item) => {
                                const value = item.raw;
                                const percent = ((value / totalRevenue) * 100).toFixed(1);
                                return [
                                    `Revenue: €${value.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`,
                                    `Share: ${percent}%`
                                ];
                            }
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

    // ===== ASIN ANALYSIS =====
    setupAsinSearch() {
        console.log('Setting up ASIN search...');
        const searchInput = document.getElementById('asinSearchInput');
        const searchClear = document.getElementById('asinSearchClear');
        const marketplaceSelect = document.getElementById('marketplaceSelect');

        console.log('Search input found:', !!searchInput, searchInput);
        if (!searchInput) {
            console.error('ASIN search input not found!');
            return;
        }

        // Focus debug
        searchInput.addEventListener('focus', () => {
            console.log('ASIN input focused');
        });

        // Load products metrics data
        this.loadProductsMetrics();

        // Search on Enter
        searchInput.addEventListener('keydown', (e) => {
            console.log('KEYDOWN:', e.key, 'Code:', e.code, 'Value:', searchInput.value);
            if (e.key === 'Enter') {
                const asin = searchInput.value.trim().toUpperCase();
                console.log('Enter pressed, ASIN:', asin);
                if (asin.length === 10 && asin.startsWith('B')) {
                    this.searchAsin(asin);
                } else if (asin.length > 0) {
                    console.log('Invalid ASIN format');
                    this.showToast('Invalid ASIN format (e.g. B0DV5N35F7)', 'error');
                }
            }
        });

        // Show/hide clear button
        searchInput.addEventListener('input', () => {
            searchClear.style.display = searchInput.value.length > 0 ? 'flex' : 'none';
        });

        // Clear search
        if (searchClear) {
            searchClear.addEventListener('click', () => {
                searchInput.value = '';
                searchClear.style.display = 'none';
                searchInput.focus();
            });
        }

        // Marketplace change
        if (marketplaceSelect) {
            marketplaceSelect.addEventListener('change', () => {
                const asin = searchInput.value.trim().toUpperCase();
                if (asin.length === 10 && this.asinAnalysisVisible) {
                    this.updateAsinAnalysisForMarketplace();
                }
            });
        }
    }

    async loadProductsMetrics() {
        try {
            const response = await fetch('data/products_metrics.json');
            this.productsMetrics = await response.json();
            console.log('Products metrics loaded:', Object.keys(this.productsMetrics.products).length, 'products');
        } catch (error) {
            console.error('Failed to load products metrics:', error);
            this.productsMetrics = { products: {} };
        }
    }

    async loadSalesData() {
        if (this.salesDataRaw) return this.salesDataRaw;
        try {
            const response = await fetch('data/sales_data.json');
            this.salesDataRaw = await response.json();
            console.log('Sales data loaded');
            return this.salesDataRaw;
        } catch (error) {
            console.error('Failed to load sales data:', error);
            return null;
        }
    }

    searchAsin(asin) {
        console.log('Searching ASIN:', asin);
        const overlay = document.getElementById('asinAnalysisOverlay');
        const loadingOverlay = document.getElementById('asinLoadingOverlay');
        const notFoundState = document.getElementById('asinNotFound');
        const container = overlay?.querySelector('.asin-analysis-container');

        if (!overlay) return;

        // Show overlay with loading
        overlay.classList.add('active');
        if (loadingOverlay) loadingOverlay.style.display = 'flex';
        if (notFoundState) notFoundState.style.display = 'none';
        if (container) container.style.display = 'none';
        this.asinAnalysisVisible = true;

        // Check if ASIN exists in metrics
        const productData = this.productsMetrics?.products?.[asin];

        setTimeout(() => {
            if (loadingOverlay) loadingOverlay.style.display = 'none';

            if (productData) {
                this.showAsinAnalysis(asin, productData);
            } else {
                // ASIN not found
                if (notFoundState) {
                    notFoundState.style.display = 'flex';
                    const msgEl = document.getElementById('asinNotFoundMessage');
                    if (msgEl) {
                        msgEl.textContent = `No data found for ASIN "${asin}" in the selected marketplace.`;
                    }
                }
            }
        }, 500);
    }

    showAsinAnalysis(asin, productData) {
        const overlay = document.getElementById('asinAnalysisOverlay');
        const container = overlay.querySelector('.asin-analysis-container');
        if (container) container.style.display = 'block';

        // Update product header
        document.getElementById('asinProductName').textContent = productData.name || 'Unknown Product';
        document.getElementById('asinBadge').textContent = 'ASIN: ' + asin;
        document.getElementById('skuBadge').textContent = 'SKU: ' + (productData.sku || 'N/A');

        // Load product image from localStorage cache or placeholder
        const productImageContainer = document.getElementById('asinProductImage');
        const productImage = productImageContainer?.querySelector('img');
        const cachedImage = localStorage.getItem(`product_image_${asin}`);
        if (productImage) {
            if (cachedImage) {
                productImage.src = cachedImage;
                productImage.style.display = 'block';
            } else {
                productImage.style.display = 'none';
            }
        }

        // Update summary metrics
        this.updateAsinSummaryMetrics(productData);

        // Setup period selector
        this.setupAsinPeriodSelector(asin, productData);

        // Setup metric toggles
        this.setupAsinMetricToggles();

        // Build initial chart
        this.buildAsinChart(asin, productData, '30d');

        // Build data table
        this.buildAsinDataTable(asin, productData);

        // Build country breakdown
        this.buildAsinCountryBreakdown(asin, productData);

        // Setup close button
        this.setupAsinAnalysisClose();
    }

    updateAsinSummaryMetrics(data) {
        // Helper to format values - returns "No data" for null/undefined
        const fmt = (value, type) => {
            if (value === null || value === undefined) return 'No data';
            switch (type) {
                case 'currency':
                    return this.formatCurrency(value);
                case 'currencyNeg':
                    return '-' + this.formatCurrency(Math.abs(value));
                case 'percent':
                    return value.toFixed(1) + '%';
                case 'percent2':
                    return value.toFixed(2) + '%';
                case 'integer':
                    return Math.round(value).toLocaleString('de-DE');
                case 'rank':
                    return '#' + value;
                default:
                    return value;
            }
        };

        // Check if advertising data is available (from Sellerboard or Ads API)
        const hasAdData = this.hasAdvertisingData(data);

        // Calculate TACOS only if adSpend is available
        const tacos = hasAdData && data.sales > 0
            ? (data.adSpend / data.sales) * 100
            : null;

        // All summary metrics
        const metrics = {
            // Sales & Traffic
            'asinRevenue': fmt(data.sales, 'currency'),
            'asinUnits': fmt(data.units, 'integer'),
            'asinRefunds': fmt(data.refunds, 'integer'),
            'asinPromo': data.promo ? fmt(data.promo, 'currency') : fmt(0, 'currency'),

            // Advertising (from Sellerboard or Ads API)
            'asinAdSpend': hasAdData ? fmt(data.adSpend, 'currencyNeg') : 'No data',

            // Refund & Fees
            'asinRefundCost': fmt(data.refundCost, 'currencyNeg'),
            'asinFees': fmt(data.amazonFees, 'currencyNeg'),
            'asinCogs': fmt(data.cogs, 'currencyNeg'),
            'asinVat': fmt(data.vat, 'currencyNeg'),

            // Profit metrics
            'asinGrossProfit': fmt(data.grossProfit, 'currency'),
            'asinProfit': fmt(data.netProfit, 'currency'),

            // Percentage metrics
            'asinAcos': hasAdData ? fmt(data.acos, 'percent') : 'No data',
            'asinRefundRate': fmt(data.refundRate, 'percent2'),
            'asinMargin': fmt(data.margin, 'percent'),
            'asinRoi': fmt(data.roi, 'percent'),

            // Other
            'asinBsr': data.bsr ? fmt(data.bsr, 'rank') : 'No data',
            'asinAvgPrice': fmt(data.avgPrice, 'currency')
        };

        // Update all metric elements
        Object.entries(metrics).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) {
                el.textContent = value;
                if (value === 'No data') {
                    el.classList.add('no-data');
                } else {
                    el.classList.remove('no-data');
                }
            }
        });

        // Ad breakdown by channel
        const adBreakdown = {
            'adPpc': hasAdData ? fmt(data.adSpendPPC, 'currencyNeg') : 'No data',
            'adDisplay': hasAdData ? fmt(data.adSpendDisplay, 'currencyNeg') : 'No data',
            'adBrands': hasAdData ? fmt(data.adSpendBrands, 'currencyNeg') : 'No data',
            'adVideo': hasAdData ? fmt(data.adSpendVideo, 'currencyNeg') : 'No data'
        };

        Object.entries(adBreakdown).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) {
                el.textContent = value;
                if (value === 'No data') {
                    el.classList.add('no-data');
                } else {
                    el.classList.remove('no-data');
                }
            }
        });
    }

    /**
     * Check if advertising data is available
     * Returns true if data contains ad metrics (from Sellerboard/existing data)
     * Will also return true when Amazon Ads API is connected later
     */
    hasAdvertisingData(data) {
        // Check if adSpend exists and is a valid number (from Sellerboard or Ads API)
        return data && typeof data.adSpend === 'number' && data.adSpend !== null;
    }

    formatCurrency(value) {
        return '€' + value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    setupAsinPeriodSelector(asin, productData) {
        const periodBtns = document.querySelectorAll('.period-btn');
        this.currentAsinPeriod = 'ytd';

        periodBtns.forEach(btn => {
            // Remove existing listeners by cloning
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);

            newBtn.addEventListener('click', () => {
                document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
                newBtn.classList.add('active');
                const period = newBtn.getAttribute('data-period');
                this.currentAsinPeriod = period;
                this.buildAsinChart(asin, productData, period);
                this.updateDateRangeText(period);
            });
        });
    }

    updateDateRangeText(period) {
        const dateRange = document.getElementById('asinDateRange');
        if (!dateRange) return;

        const today = new Date();
        const formatDate = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const year = today.getFullYear();
        let text = '';

        switch (period) {
            case '7d':
                const d7 = new Date(today);
                d7.setDate(d7.getDate() - 7);
                text = `${formatDate(d7)} - ${formatDate(today)}, ${year}`;
                break;
            case '30d':
                const d30 = new Date(today);
                d30.setDate(d30.getDate() - 30);
                text = `${formatDate(d30)} - ${formatDate(today)}, ${year}`;
                break;
            case '90d':
                const d90 = new Date(today);
                d90.setDate(d90.getDate() - 90);
                text = `${formatDate(d90)} - ${formatDate(today)}, ${year}`;
                break;
            case 'ytd':
                text = `Jan 1 - ${formatDate(today)}, ${year}`;
                break;
            case '12m':
                const d12m = new Date(today);
                d12m.setFullYear(d12m.getFullYear() - 1);
                text = `${formatDate(d12m)}, ${year - 1} - ${formatDate(today)}, ${year}`;
                break;
        }
        dateRange.textContent = text;
    }

    setupAsinMetricToggles() {
        // Get all metric checkboxes from config panel
        const checkboxes = document.querySelectorAll('.config-metric-item input[type="checkbox"]');

        // Default colors for metrics
        this.metricColors = {
            sales: '#3b82f6',
            units: '#6366f1',
            orders: '#06b6d4',
            adSpend: '#ef4444',
            refunds: '#f97316',
            refundCost: '#fb923c',
            amazonFees: '#a855f7',
            cogs: '#ec4899',
            vat: '#14b8a6',
            grossProfit: '#22c55e',
            netProfit: '#8b5cf6',
            margin: '#0ea5e9',
            roi: '#84cc16',
            acos: '#eab308',
            tacos: '#f59e0b'
        };

        // Initialize active metrics from checked checkboxes or use defaults
        this.activeAsinMetrics = [];

        if (checkboxes.length > 0) {
            checkboxes.forEach(checkbox => {
                const metric = checkbox.getAttribute('data-metric');
                const color = checkbox.getAttribute('data-color');
                if (color) {
                    this.metricColors[metric] = color;
                }

                if (checkbox.checked) {
                    this.activeAsinMetrics.push(metric);
                }
            });
        }

        // Fallback to defaults if no checkboxes found or none checked
        if (this.activeAsinMetrics.length === 0) {
            this.activeAsinMetrics = ['units', 'adSpend', 'refunds', 'netProfit'];
        }

        // Add event listeners
        checkboxes.forEach(checkbox => {
            // Remove old listeners by cloning
            const newCheckbox = checkbox.cloneNode(true);
            checkbox.parentNode.replaceChild(newCheckbox, checkbox);

            newCheckbox.addEventListener('change', () => {
                const metric = newCheckbox.getAttribute('data-metric');
                const label = newCheckbox.closest('.config-metric-item');

                if (newCheckbox.checked) {
                    if (!this.activeAsinMetrics.includes(metric)) {
                        this.activeAsinMetrics.push(metric);
                    }
                    if (label) label.classList.add('active');
                } else {
                    this.activeAsinMetrics = this.activeAsinMetrics.filter(m => m !== metric);
                    if (label) label.classList.remove('active');
                }

                // Update chart legend
                this.updateChartLegend();

                // Rebuild chart with updated metrics
                if (this.currentAsinData) {
                    const { asin, productData, period } = this.currentAsinData;
                    this.buildAsinChart(asin, productData, period);
                }
            });
        });

        // Initial legend update
        this.updateChartLegend();
    }

    updateChartLegend() {
        const legendContainer = document.getElementById('asinChartLegend');
        if (!legendContainer) return;

        const metricLabels = {
            sales: 'Sales',
            units: 'Units Sold',
            orders: 'Orders',
            adSpend: 'Ad Spend',
            refunds: 'Refunds',
            refundCost: 'Refund Cost',
            amazonFees: 'Amazon Fees',
            cogs: 'COGS',
            vat: 'VAT',
            grossProfit: 'Gross Profit',
            netProfit: 'Net Profit',
            margin: 'Margin',
            roi: 'ROI',
            acos: 'ACOS',
            tacos: 'TACOS'
        };

        legendContainer.innerHTML = this.activeAsinMetrics.map(metric => {
            const color = this.metricColors[metric] || '#6366f1';
            const label = metricLabels[metric] || metric;
            return `
                <div class="legend-item">
                    <span class="legend-dot" style="background: ${color};"></span>
                    <span>${label}</span>
                </div>
            `;
        }).join('');
    }

    buildAsinChart(asin, productData, period) {
        const ctx = document.getElementById('asinAnalysisChart');
        if (!ctx) return;

        // Store current data for rebuilding chart when toggles change
        this.currentAsinData = { asin, productData, period };

        // Destroy existing chart
        if (this.asinChart) {
            this.asinChart.destroy();
        }

        // Generate time-series data based on period
        const data = this.generateAsinTimeSeriesData(productData, period);
        const colors = this.getChartColors();

        // Define metric configurations with labels and axis
        const metricConfigs = {
            sales: { label: 'Sales', yAxisID: 'y1', isCurrency: true },
            units: { label: 'Units Sold', yAxisID: 'y', isCurrency: false },
            orders: { label: 'Orders', yAxisID: 'y', isCurrency: false },
            adSpend: { label: 'Ad Spend', yAxisID: 'y1', isCurrency: true },
            refunds: { label: 'Refunds', yAxisID: 'y', isCurrency: false },
            refundCost: { label: 'Refund Cost', yAxisID: 'y1', isCurrency: true },
            amazonFees: { label: 'Amazon Fees', yAxisID: 'y1', isCurrency: true },
            cogs: { label: 'COGS', yAxisID: 'y1', isCurrency: true },
            vat: { label: 'VAT', yAxisID: 'y1', isCurrency: true },
            grossProfit: { label: 'Gross Profit', yAxisID: 'y1', isCurrency: true },
            netProfit: { label: 'Net Profit', yAxisID: 'y1', isCurrency: true },
            margin: { label: 'Margin', yAxisID: 'y2', isPercent: true },
            roi: { label: 'ROI', yAxisID: 'y2', isPercent: true },
            acos: { label: 'ACOS', yAxisID: 'y2', isPercent: true },
            tacos: { label: 'TACOS', yAxisID: 'y2', isPercent: true }
        };

        // Build datasets for active metrics
        const datasets = this.activeAsinMetrics
            .filter(metric => metricConfigs[metric])
            .map(metric => {
                const config = metricConfigs[metric];
                const color = this.metricColors[metric] || '#6366f1';
                return {
                    label: config.label,
                    data: data[metric] || [],
                    borderColor: color,
                    backgroundColor: color + '20',
                    fill: false,
                    tension: 0.3,
                    pointRadius: 1,
                    pointHoverRadius: 5,
                    borderWidth: 2,
                    yAxisID: config.yAxisID
                };
            });

        // Check if we need percentage axis
        const hasPercentMetric = this.activeAsinMetrics.some(m =>
            ['margin', 'roi', 'acos', 'tacos'].includes(m)
        );

        // Check if we need currency axis
        const hasCurrencyMetric = this.activeAsinMetrics.some(m =>
            metricConfigs[m]?.isCurrency
        );

        // Check if we need units axis
        const hasUnitsMetric = this.activeAsinMetrics.some(m =>
            ['units', 'orders', 'refunds'].includes(m)
        );

        this.asinChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false // Using custom legend
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: (context) => {
                                const metric = this.activeAsinMetrics[context.datasetIndex];
                                const config = metricConfigs[metric];
                                let value = context.parsed.y;
                                if (config?.isCurrency) {
                                    return `${context.dataset.label}: €${value.toLocaleString('de-DE', {minimumFractionDigits: 2})}`;
                                } else if (config?.isPercent) {
                                    return `${context.dataset.label}: ${value.toFixed(1)}%`;
                                }
                                return `${context.dataset.label}: ${Math.round(value).toLocaleString('de-DE')}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: colors.grid },
                        ticks: { color: colors.text, maxTicksLimit: 12 }
                    },
                    y: {
                        type: 'linear',
                        display: hasUnitsMetric,
                        position: 'left',
                        grid: { color: colors.grid },
                        ticks: { color: colors.text },
                        title: { display: hasUnitsMetric, text: 'Units', color: colors.text }
                    },
                    y1: {
                        type: 'linear',
                        display: hasCurrencyMetric,
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        ticks: {
                            color: colors.text,
                            callback: v => '€' + v.toLocaleString('de-DE')
                        },
                        title: { display: hasCurrencyMetric, text: 'EUR', color: colors.text }
                    },
                    y2: {
                        type: 'linear',
                        display: hasPercentMetric,
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        ticks: {
                            color: colors.text,
                            callback: v => v + '%'
                        },
                        title: { display: hasPercentMetric, text: '%', color: colors.text }
                    }
                }
            }
        });
    }

    generateAsinTimeSeriesData(productData, period) {
        let days;
        switch (period) {
            case '7d': days = 7; break;
            case '30d': days = 30; break;
            case '90d': days = 90; break;
            case 'ytd': days = this.getDaysYTD(); break;
            case '12m': days = 365; break;
            default: days = 30;
        }

        const data = {
            labels: [],
            sales: [],
            units: [],
            orders: [],
            adSpend: [],
            refunds: [],
            refundCost: [],
            amazonFees: [],
            cogs: [],
            vat: [],
            grossProfit: [],
            netProfit: [],
            margin: [],
            roi: [],
            acos: [],
            tacos: []
        };

        const today = new Date();

        // Totals from product data
        const totals = {
            units: productData.units || 0,
            sales: productData.sales || 0,
            adSpend: productData.adSpend || 0,
            netProfit: productData.netProfit || 0,
            refunds: productData.refunds || 0,
            refundCost: productData.refundCost || 0,
            amazonFees: productData.amazonFees || 0,
            cogs: productData.cogs || 0,
            vat: productData.vat || 0
        };

        // Distribute totals across days with realistic variation
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);

            // Format label based on period
            let label;
            if (days <= 7) {
                label = date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
            } else if (days <= 90) {
                label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            } else {
                label = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            }
            data.labels.push(label);

            // Generate daily values with variation
            const weekday = date.getDay();
            const weekendMult = (weekday === 0 || weekday === 6) ? 0.7 : 1.1;
            const randomMult = 0.5 + Math.random();
            const dayMult = weekendMult * randomMult;
            const adMult = 0.8 + Math.random() * 0.4;

            // Calculate daily values
            const dailyUnits = Math.max(0, Math.round((totals.units / days) * dayMult));
            const dailySales = Math.max(0, (totals.sales / days) * dayMult);
            const dailyAdSpend = Math.max(0, (totals.adSpend / days) * adMult);
            const dailyRefunds = Math.random() < (totals.refunds / days) ? 1 : 0;
            const dailyRefundCost = (totals.refundCost / days) * (dailyRefunds > 0 ? 2 : 0.5);
            const dailyFees = (totals.amazonFees / days) * dayMult;
            const dailyCogs = (totals.cogs / days) * dayMult;
            const dailyVat = (totals.vat / days) * dayMult;

            // Calculated metrics
            const dailyGrossProfit = dailySales - dailyFees - dailyCogs - dailyVat - dailyRefundCost;
            const dailyNetProfit = dailyGrossProfit - dailyAdSpend;
            const dailyMargin = dailySales > 0 ? (dailyNetProfit / dailySales) * 100 : 0;
            const dailyRoi = (dailyCogs + dailyAdSpend) > 0 ? (dailyNetProfit / (dailyCogs + dailyAdSpend)) * 100 : 0;
            const dailyAcos = dailySales > 0 ? (dailyAdSpend / dailySales) * 100 : 0;
            const dailyTacos = dailySales > 0 ? (dailyAdSpend / dailySales) * 100 : 0;

            // Push values
            data.sales.push(Math.round(dailySales * 100) / 100);
            data.units.push(dailyUnits);
            data.orders.push(dailyUnits);
            data.adSpend.push(Math.round(dailyAdSpend * 100) / 100);
            data.refunds.push(dailyRefunds);
            data.refundCost.push(Math.round(dailyRefundCost * 100) / 100);
            data.amazonFees.push(Math.round(dailyFees * 100) / 100);
            data.cogs.push(Math.round(dailyCogs * 100) / 100);
            data.vat.push(Math.round(dailyVat * 100) / 100);
            data.grossProfit.push(Math.round(dailyGrossProfit * 100) / 100);
            data.netProfit.push(Math.round(dailyNetProfit * 100) / 100);
            data.margin.push(Math.round(dailyMargin * 10) / 10);
            data.roi.push(Math.round(dailyRoi * 10) / 10);
            data.acos.push(Math.round(dailyAcos * 10) / 10);
            data.tacos.push(Math.round(dailyTacos * 10) / 10);
        }

        return data;
    }

    getDaysYTD() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        return Math.ceil((now - start) / (1000 * 60 * 60 * 24));
    }

    updateAsinChartDatasets() {
        if (!this.asinChart || !this.currentAsinData) return;
        const { asin, productData, period } = this.currentAsinData;
        this.buildAsinChart(asin, productData, period);
    }

    buildAsinDataTable(asin, productData) {
        const tbody = document.getElementById('asinTableBody');
        if (!tbody) return;

        // Generate daily data for the table matching period
        const data = this.generateAsinTimeSeriesData(productData, this.currentAsinPeriod || '30d');
        const rows = [];

        // Calculate daily COGS and Fees based on units
        const cogsPerUnit = productData.units > 0 ? productData.cogs / productData.units : 0;
        const feesPerUnit = productData.units > 0 ? productData.amazonFees / productData.units : 0;

        for (let i = data.labels.length - 1; i >= Math.max(0, data.labels.length - 14); i--) {
            const dailyUnits = data.units[i];
            const dailyRevenue = data.revenue[i];
            const dailyAdSpend = data.adSpend[i];
            const dailyProfit = data.profit[i];
            const dailyCogs = dailyUnits * cogsPerUnit;
            const dailyFees = dailyUnits * feesPerUnit;
            const dailyMargin = dailyRevenue > 0 ? ((dailyProfit / dailyRevenue) * 100).toFixed(1) : '0.0';

            rows.push(`
                <tr>
                    <td>${data.labels[i]}</td>
                    <td>${dailyUnits}</td>
                    <td>${data.orders[i]}</td>
                    <td>${this.formatCurrency(dailyRevenue)}</td>
                    <td>${data.refunds[i]}</td>
                    <td>${this.formatCurrency(dailyAdSpend)}</td>
                    <td>${this.formatCurrency(dailyFees)}</td>
                    <td>${this.formatCurrency(dailyCogs)}</td>
                    <td class="${dailyProfit >= 0 ? 'positive' : 'negative'}">${this.formatCurrency(dailyProfit)}</td>
                    <td>${dailyMargin}%</td>
                </tr>
            `);
        }

        tbody.innerHTML = rows.join('');
    }

    buildAsinCountryBreakdown(asin, productData) {
        const container = document.getElementById('asinCountryGrid');
        if (!container) return;

        // Simulated country breakdown based on overall distribution
        const countries = [
            { code: 'DE', name: 'Germany', flag: '🇩🇪', share: 0.45 },
            { code: 'FR', name: 'France', flag: '🇫🇷', share: 0.18 },
            { code: 'IT', name: 'Italy', flag: '🇮🇹', share: 0.12 },
            { code: 'ES', name: 'Spain', flag: '🇪🇸', share: 0.10 },
            { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', share: 0.08 },
            { code: 'NL', name: 'Netherlands', flag: '🇳🇱', share: 0.04 },
            { code: 'PL', name: 'Poland', flag: '🇵🇱', share: 0.03 }
        ];

        const totalSales = productData.sales || 0;
        const totalUnits = productData.units || 0;

        const cards = countries.map(country => {
            const countrySales = totalSales * country.share;
            const countryUnits = Math.round(totalUnits * country.share);

            return `
                <div class="country-card">
                    <div class="country-card-header">
                        <span class="country-flag-large">${country.flag}</span>
                        <span class="country-name">${country.name}</span>
                    </div>
                    <div class="country-card-metrics">
                        <div class="country-metric">
                            <span class="country-metric-value">${this.formatCurrency(countrySales)}</span>
                            <span class="country-metric-label">Revenue</span>
                        </div>
                        <div class="country-metric">
                            <span class="country-metric-value">${countryUnits}</span>
                            <span class="country-metric-label">Units</span>
                        </div>
                        <div class="country-metric">
                            <span class="country-metric-value">${(country.share * 100).toFixed(0)}%</span>
                            <span class="country-metric-label">Share</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = cards;
    }

    setupAsinAnalysisClose() {
        const closeBtn = document.getElementById('asinCloseBtn');
        const overlay = document.getElementById('asinAnalysisOverlay');

        const closeOverlay = () => {
            overlay.classList.remove('active');
            this.asinAnalysisVisible = false;
            if (this.asinChart) {
                this.asinChart.destroy();
                this.asinChart = null;
            }
        };

        if (closeBtn && overlay) {
            closeBtn.onclick = closeOverlay;
        }

        // Close on escape key (add only once)
        if (!this.escapeListenerAdded) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.asinAnalysisVisible) {
                    closeOverlay();
                }
            });
            this.escapeListenerAdded = true;
        }

        // Not found close button
        const notFoundCloseBtn = document.getElementById('asinNotFoundClose');
        if (notFoundCloseBtn) {
            notFoundCloseBtn.onclick = () => {
                document.getElementById('asinNotFound').style.display = 'none';
                overlay.classList.remove('active');
                this.asinAnalysisVisible = false;
                document.getElementById('asinSearchInput')?.focus();
            };
        }
    }

    updateAsinAnalysisForMarketplace() {
        const marketplace = document.getElementById('marketplaceSelect')?.value || 'all';
        this.showToast(`Filtering by: ${marketplace === 'all' ? 'All Marketplaces' : marketplace}`);
        // In real implementation, would filter data by marketplace
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

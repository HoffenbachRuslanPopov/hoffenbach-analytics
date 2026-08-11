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

        // Real sales data from Sellerboard (2026-08-11)
        this.salesData = {
            totalRevenue: 12186.08,
            totalOrders: 682,
            totalUnits: 703,
            avgOrder: 17.87,
            byCountry: [
                { code: 'DE', name: 'Germany', flag: '🇩🇪', revenue: 12186.08, orders: 682, units: 703 }
            ],
            // Product families with Parent/Child structure
            productFamilies: [
                {
                    brand: 'Hoffenbach',
                    parentAsin: 'B0DQV224V2',
                    name: 'Magnetische Kindersicherung 12+3',
                    totalUnits: 414,
                    totalRevenue: 9101.31,
                    children: [
                        { asin: 'B072PPT9V3', sku: '19-LWRP-J1JZ', variant: 'Weiß', units: 145, revenue: 2982.49, price: 20.57, margin: 18.09, profit: 539.68 },
                        { asin: 'B0DMTJXH9W', sku: 'AK-CIFP-P8X9', variant: 'Schwarz', units: 44, revenue: 911.51, price: 20.72, margin: 26.52, profit: 241.74 },
                        { asin: 'B0DQV224V2', sku: '', variant: 'Parent', units: 225, revenue: 5207.31, price: 23.14, margin: 25.29, profit: 1316.86 }
                    ]
                },
                {
                    brand: 'Hoffenbach',
                    parentAsin: 'B0FCXS9PDP',
                    name: 'Steckdosen Kindersicherung 20x',
                    totalUnits: 105,
                    totalRevenue: 889.79,
                    children: [
                        { asin: 'B0854MW97N', sku: 'SH-G0PF-CSW1', variant: 'Weiß', units: 105, revenue: 889.79, price: 8.47, margin: 22.18, profit: 197.37 }
                    ]
                },
                {
                    brand: 'Hoffenbach',
                    parentAsin: 'B0DKJWR1G1',
                    name: 'Eckenschutz Kantenschutz 12x',
                    totalUnits: 95,
                    totalRevenue: 964.02,
                    children: [
                        { asin: 'B0933B1NKB', sku: 'E1-ZMUX-HRSF', variant: 'Schwarz', units: 44, revenue: 426.89, price: 9.70, margin: 24.20, profit: 103.30 },
                        { asin: 'B0933F6ZWD', sku: '8P-ZYWD-VIXU', variant: 'Weiß', units: 24, revenue: 227.35, price: 9.47, margin: 23.95, profit: 54.45 },
                        { asin: 'B0933DBFMS', sku: 'B4-8LX3-XNGZ', variant: 'Braun', units: 15, revenue: 141.77, price: 9.45, margin: 25.87, profit: 36.67 },
                        { asin: 'B0D7QMZZDG', sku: 'VF-W02N-KLUS', variant: '20x Schwarz', units: 9, revenue: 121.31, price: 13.48, margin: 37.60, profit: 45.61 },
                        { asin: 'B0D7QMS49B', sku: 'Uncommingled.MSKU.1722334050975', variant: '20x Weiß', units: 3, revenue: 46.70, price: 15.57, margin: 45.46, profit: 21.23 }
                    ]
                },
                {
                    brand: 'Hoffenbach',
                    parentAsin: 'B0F9F69NZQ',
                    name: 'Kantenschutz 6.2m + 12x Eckenschutz',
                    totalUnits: 56,
                    totalRevenue: 1320.29,
                    children: [
                        { asin: 'B0F63Q4BLX', sku: 'KG-QEAJ-H4PD', variant: 'Wollweiß', units: 30, revenue: 720.47, price: 24.02, margin: 26.06, profit: 187.77 },
                        { asin: 'B07PPXKJPQ', sku: 'UP-185A-6YIE', variant: 'Schwarz', units: 13, revenue: 298.91, price: 22.99, margin: 13.19, profit: 39.42 },
                        { asin: 'B0F79C4Y9C', sku: '4Q-CIIG-VD9B', variant: 'Schokoladenbraun', units: 13, revenue: 300.91, price: 23.15, margin: 32.74, profit: 98.51 }
                    ]
                },
                {
                    brand: 'Hoffenbach',
                    parentAsin: 'B0DV5N35F7',
                    name: 'Wandschutz Pads 4x',
                    totalUnits: 61,
                    totalRevenue: 596.28,
                    children: [
                        { asin: 'B08NCRRM6M', sku: '9J-VG9Z-P83K', variant: 'Standard', units: 61, revenue: 596.28, price: 9.78, margin: 32.13, profit: 191.60 }
                    ]
                },
                {
                    brand: 'Hoffenbach',
                    parentAsin: 'B0FCXS84M8',
                    name: 'Steckdosen Kindersicherung 30x',
                    totalUnits: 50,
                    totalRevenue: 499.52,
                    children: [
                        { asin: 'B0DJ1DGY6J', sku: '60-O7CT-8I0F', variant: 'Weiß', units: 50, revenue: 499.52, price: 9.99, margin: 23.08, profit: 115.28 }
                    ]
                },
                {
                    brand: 'Hoffenbach',
                    parentAsin: null,
                    name: 'Magnetische Kindersicherung 20+4',
                    totalUnits: 26,
                    totalRevenue: 869.01,
                    children: [
                        { asin: 'B07JZCWJMW', sku: 'GM-1QEG-0QPK', variant: 'Weiß', units: 14, revenue: 465.91, price: 33.28, margin: 39.78, profit: 185.35 },
                        { asin: 'B0DMTMHVK4', sku: 'D6-QPG9-4J1K', variant: 'Schwarz', units: 12, revenue: 403.10, price: 33.59, margin: 39.96, profit: 161.09 }
                    ]
                },
                {
                    brand: 'Hoffenbach',
                    parentAsin: null,
                    name: 'Magnetische Kindersicherung 30+6',
                    totalUnits: 10,
                    totalRevenue: 444.30,
                    children: [
                        { asin: 'B0FVG9MZR8', sku: '09-6H6Q-NYOA', variant: 'Weiß', units: 8, revenue: 354.90, price: 44.36, margin: 43.55, profit: 154.57 },
                        { asin: 'B0FVGB9FHJ', sku: 'NL-4NNP-5092', variant: 'Schwarz', units: 2, revenue: 89.40, price: 44.70, margin: 38.51, profit: 34.43 }
                    ]
                },
                {
                    brand: 'WunderHippo',
                    parentAsin: 'B0FTMKYVR6',
                    name: 'Magnetische Kindersicherung',
                    totalUnits: 35,
                    totalRevenue: 689.89,
                    children: [
                        { asin: 'B0DNT4FNZ9', sku: 'MC-DZIG-W9QU', variant: '12+3 Weiß', units: 34, revenue: 660.66, price: 19.43, margin: 21.20, profit: 140.07 },
                        { asin: 'B0FNX21TZF', sku: 'ZV-XWYM-FRWL', variant: '20+4 Weiß', units: 1, revenue: 29.23, price: 29.23, margin: 37.15, profit: 10.86 }
                    ]
                },
                {
                    brand: 'WunderHippo',
                    parentAsin: 'B0GWH7SS9R',
                    name: 'Wandschutz Pads 4x',
                    totalUnits: 14,
                    totalRevenue: 124.97,
                    children: [
                        { asin: 'B0DNTPCLRN', sku: 'UK-P7TQ-VS08', variant: 'Standard', units: 14, revenue: 124.97, price: 8.93, margin: 26.25, profit: 32.80 }
                    ]
                },
                {
                    brand: 'SafeMate',
                    parentAsin: 'B0GN3DM5BX',
                    name: 'Kantenschutz 6m + 10x Eckenschutz',
                    totalUnits: 22,
                    totalRevenue: 406.26,
                    children: [
                        { asin: 'B0GGJ6VRCQ', sku: 'JZ-7QN5-JBQ4', variant: 'Mattschwarz', units: 17, revenue: 315.35, price: 18.55, margin: 29.79, profit: 93.94 },
                        { asin: 'B0GGJ4RNBC', sku: 'VX-PB4F-4IMK', variant: 'Wollweiß', units: 5, revenue: 90.91, price: 18.18, margin: 17.92, profit: 16.29 }
                    ]
                }
            ],
            // Flat products list for backward compatibility
            products: [
                { name: 'Magnet Locks 12+3 Weiß', asin: 'B072PPT9V3', sku: '19-LWRP-J1JZ', price: 20.57, sold: 145, revenue: 2982.49, brand: 'Hoffenbach' },
                { name: 'Magnet Locks 12+3 Schwarz', asin: 'B0DMTJXH9W', sku: 'AK-CIFP-P8X9', price: 20.72, sold: 44, revenue: 911.51, brand: 'Hoffenbach' },
                { name: 'Steckdosen 20x Weiß', asin: 'B0854MW97N', sku: 'SH-G0PF-CSW1', price: 8.47, sold: 105, revenue: 889.79, brand: 'Hoffenbach' },
                { name: 'Wandschutz Pads 4x', asin: 'B08NCRRM6M', sku: '9J-VG9Z-P83K', price: 9.78, sold: 61, revenue: 596.28, brand: 'Hoffenbach' },
                { name: 'Steckdosen 30x Weiß', asin: 'B0DJ1DGY6J', sku: '60-O7CT-8I0F', price: 9.99, sold: 50, revenue: 499.52, brand: 'Hoffenbach' },
                { name: 'Eckenschutz 12x Schwarz', asin: 'B0933B1NKB', sku: 'E1-ZMUX-HRSF', price: 9.70, sold: 44, revenue: 426.89, brand: 'Hoffenbach' },
                { name: 'WH Magnet Locks 12+3', asin: 'B0DNT4FNZ9', sku: 'MC-DZIG-W9QU', price: 19.43, sold: 34, revenue: 660.66, brand: 'WunderHippo' },
                { name: 'Kantenschutz 6.2m Wollweiß', asin: 'B0F63Q4BLX', sku: 'KG-QEAJ-H4PD', price: 24.02, sold: 30, revenue: 720.47, brand: 'Hoffenbach' },
                { name: 'Eckenschutz 12x Weiß', asin: 'B0933F6ZWD', sku: '8P-ZYWD-VIXU', price: 9.47, sold: 24, revenue: 227.35, brand: 'Hoffenbach' },
                { name: 'SM Kantenschutz Schwarz', asin: 'B0GGJ6VRCQ', sku: 'JZ-7QN5-JBQ4', price: 18.55, sold: 17, revenue: 315.35, brand: 'SafeMate' },
                { name: 'Eckenschutz 12x Braun', asin: 'B0933DBFMS', sku: 'B4-8LX3-XNGZ', price: 9.45, sold: 15, revenue: 141.77, brand: 'Hoffenbach' },
                { name: 'Magnet Locks 20+4 Weiß', asin: 'B07JZCWJMW', sku: 'GM-1QEG-0QPK', price: 33.28, sold: 14, revenue: 465.91, brand: 'Hoffenbach' },
                { name: 'WH Wandschutz Pads', asin: 'B0DNTPCLRN', sku: 'UK-P7TQ-VS08', price: 8.93, sold: 14, revenue: 124.97, brand: 'WunderHippo' },
                { name: 'Kantenschutz 6.2m Schwarz', asin: 'B07PPXKJPQ', sku: 'UP-185A-6YIE', price: 22.99, sold: 13, revenue: 298.91, brand: 'Hoffenbach' },
                { name: 'Kantenschutz 6.2m Braun', asin: 'B0F79C4Y9C', sku: '4Q-CIIG-VD9B', price: 23.15, sold: 13, revenue: 300.91, brand: 'Hoffenbach' },
                { name: 'Magnet Locks 20+4 Schwarz', asin: 'B0DMTMHVK4', sku: 'D6-QPG9-4J1K', price: 33.59, sold: 12, revenue: 403.10, brand: 'Hoffenbach' }
            ],
            recentOrders: [
                { id: '306-9063696-5426752', product: 'Magnet Locks 12+3', asin: 'B072PPT9V3', country: 'DE', flag: '🇩🇪', date: '2026-08-11', amount: 20.57, status: 'shipped' },
                { id: '028-9246498-0330717', product: 'Steckdosen 20x', asin: 'B0854MW97N', country: 'DE', flag: '🇩🇪', date: '2026-08-11', amount: 8.47, status: 'shipped' },
                { id: '203-3985502-1642757', product: 'Eckenschutz 12x', asin: 'B0933B1NKB', country: 'DE', flag: '🇩🇪', date: '2026-08-11', amount: 9.70, status: 'shipped' },
                { id: '404-9151343-2417117', product: 'Wandschutz Pads', asin: 'B08NCRRM6M', country: 'DE', flag: '🇩🇪', date: '2026-08-11', amount: 9.78, status: 'pending' },
                { id: '171-6613491-8643508', product: 'Kantenschutz 6.2m', asin: 'B0F63Q4BLX', country: 'DE', flag: '🇩🇪', date: '2026-08-11', amount: 24.02, status: 'shipped' }
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
        this.setupGlobalSearch();
        this.setupFilters();
        this.updateKPIs();
        this.loadRecentOrders();
        this.renderProducts();
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

    setupGlobalSearch() {
        const searchInput = document.getElementById('globalSearch');
        const resultsContainer = document.getElementById('globalSearchResults');

        if (!searchInput || !resultsContainer) return;

        // Build searchable index from all products
        const searchIndex = [];
        this.salesData.productFamilies.forEach(family => {
            family.children.forEach(child => {
                searchIndex.push({
                    name: family.name + (child.variant !== 'Parent' ? ` - ${child.variant}` : ''),
                    asin: child.asin,
                    sku: child.sku,
                    brand: family.brand,
                    units: child.units,
                    revenue: child.revenue,
                    price: child.price,
                    margin: child.margin,
                    parentAsin: family.parentAsin
                });
            });
        });

        let debounceTimer;

        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            const query = e.target.value.toLowerCase().trim();

            if (query.length < 2) {
                resultsContainer.classList.remove('show');
                return;
            }

            debounceTimer = setTimeout(() => {
                const results = searchIndex.filter(item =>
                    item.name.toLowerCase().includes(query) ||
                    item.asin.toLowerCase().includes(query) ||
                    item.sku.toLowerCase().includes(query) ||
                    item.brand.toLowerCase().includes(query)
                );

                this.renderSearchResults(results, resultsContainer);
            }, 150);
        });

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
                resultsContainer.classList.remove('show');
            }
        });

        // Close on Escape
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                resultsContainer.classList.remove('show');
                searchInput.blur();
            }
        });
    }

    renderSearchResults(results, container) {
        if (results.length === 0) {
            container.innerHTML = '<div class="search-no-results">No products found</div>';
            container.classList.add('show');
            return;
        }

        const html = results.slice(0, 10).map(item => {
            const brandClass = item.brand.toLowerCase().replace(/\s+/g, '');
            const brandInitials = item.brand.substring(0, 2).toUpperCase();

            return `
                <div class="search-result-item" data-asin="${item.asin}">
                    <div class="search-result-brand ${brandClass}">${brandInitials}</div>
                    <div class="search-result-info">
                        <div class="search-result-name">${item.name}</div>
                        <div class="search-result-meta">
                            <span class="asin">${item.asin}</span>
                            ${item.sku ? `<span class="sku">${item.sku}</span>` : ''}
                        </div>
                    </div>
                    <div class="search-result-stats">
                        <div class="search-result-revenue">€${item.revenue.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</div>
                        <div class="search-result-units">${item.units} units</div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
        container.classList.add('show');

        // Add click handlers
        container.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const asin = item.getAttribute('data-asin');
                this.showProductDetail(asin);
                container.classList.remove('show');
                document.getElementById('globalSearch').value = '';
            });
        });
    }

    showProductDetail(asin) {
        // Find product in families
        let product = null;
        let family = null;

        for (const fam of this.salesData.productFamilies) {
            const found = fam.children.find(c => c.asin === asin);
            if (found) {
                product = found;
                family = fam;
                break;
            }
        }

        if (product) {
            const name = family.name + (product.variant !== 'Parent' ? ` - ${product.variant}` : '');
            this.showToast(`${name}: €${product.revenue.toLocaleString('de-DE')} | ${product.units} units | ${product.margin}% margin`);
            // Navigate to products page
            this.navigateTo('products');
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

    // ===== PRODUCTS GRID =====
    renderProducts() {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;

        const brandColors = {
            'Hoffenbach': { bg: 'linear-gradient(135deg, #6366f1, #8b5cf6)', abbr: 'HF' },
            'WunderHippo': { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', abbr: 'WH' },
            'SafeMate': { bg: 'linear-gradient(135deg, #10b981, #059669)', abbr: 'SM' }
        };

        let html = '';

        this.salesData.productFamilies.forEach(family => {
            const brand = brandColors[family.brand] || { bg: '#64748b', abbr: '??' };

            // Create family group card
            html += `
                <div class="product-family" data-parent="${family.parentAsin || 'standalone'}">
                    <div class="product-family-header">
                        <div class="brand-badge" style="background: ${brand.bg}">${brand.abbr}</div>
                        <div class="family-info">
                            <h4>${family.name}</h4>
                            <div class="family-meta">
                                <span class="family-brand">${family.brand}</span>
                                ${family.parentAsin ? `<span class="family-parent">Parent: ${family.parentAsin}</span>` : ''}
                            </div>
                        </div>
                        <div class="family-stats">
                            <div class="family-revenue">€${family.totalRevenue.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</div>
                            <div class="family-units">${family.totalUnits} units</div>
                        </div>
                    </div>
                    <div class="product-variants">
                        ${family.children.map(child => `
                            <div class="product-card" data-asin="${child.asin}" data-sku="${child.sku}">
                                <div class="product-info">
                                    <div class="variant-name">${child.variant}</div>
                                    <div class="product-ids">
                                        <span class="product-asin">ASIN: ${child.asin}</span>
                                        ${child.sku ? `<span class="product-sku">SKU: ${child.sku}</span>` : ''}
                                    </div>
                                    <div class="product-stats">
                                        <span class="product-price">€${child.price.toFixed(2)}</span>
                                        <span class="product-sold">${child.units} sold</span>
                                    </div>
                                    <div class="product-metrics">
                                        <span class="metric revenue">€${child.revenue.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</span>
                                        <span class="metric margin ${child.margin >= 25 ? 'good' : child.margin >= 15 ? 'warning' : 'critical'}">${child.margin}%</span>
                                        <span class="metric profit">+€${child.profit.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });

        grid.innerHTML = html;
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

/* =============================================
   CRM APPLICATION
   Main application logic
   ============================================= */

class CRMApp {
    constructor() {
        this.currentPage = 'sales-analysis';
        this.charts = {};
        this.salesData = null;
        this.feesData = null;

        // Sample data (will be replaced with API data)
        this.mockData = {
            ytd: {
                grossRevenue: 45892.34,
                totalFees: 12456.78,
                netProfit: 33435.56,
                totalOrders: 2847,
                totalUnits: 3521,
                revenueChange: 23.5,
                monthly: [
                    { month: 'Jan', revenue: 4520, fees: 1220, orders: 285, units: 352 },
                    { month: 'Feb', revenue: 5180, fees: 1398, orders: 327, units: 403 },
                    { month: 'Mar', revenue: 6230, fees: 1682, orders: 394, units: 486 },
                    { month: 'Apr', revenue: 5890, fees: 1590, orders: 372, units: 459 },
                    { month: 'May', revenue: 6450, fees: 1742, orders: 408, units: 503 },
                    { month: 'Jun', revenue: 7120, fees: 1922, orders: 450, units: 555 },
                    { month: 'Jul', revenue: 6780, fees: 1831, orders: 428, units: 528 },
                    { month: 'Aug', revenue: 3722, fees: 1005, orders: 183, units: 235 }
                ],
                fees: [
                    { type: 'Referral Fee', description: 'Commission on sales (15%)', amount: 6883.85, percent: 15.0, trend: 'up' },
                    { type: 'FBA Fulfillment', description: 'Pick, pack & ship fees', amount: 3245.12, percent: 7.07, trend: 'up' },
                    { type: 'Storage Fee', description: 'Monthly inventory storage', amount: 892.45, percent: 1.94, trend: 'down' },
                    { type: 'Placement Fee', description: 'Inbound placement service', amount: 534.21, percent: 1.16, trend: 'neutral' },
                    { type: 'Closing Fee', description: 'Per-item closing fee', amount: 421.15, percent: 0.92, trend: 'neutral' },
                    { type: 'Subscription', description: 'Professional seller plan', amount: 312.00, percent: 0.68, trend: 'neutral' },
                    { type: 'Other Fees', description: 'Misc. charges', amount: 168.00, percent: 0.37, trend: 'down' }
                ],
                byCountry: [
                    { code: 'DE', name: 'Germany', revenue: 18571.79, orders: 1177, flag: '🇩🇪' },
                    { code: 'FR', name: 'France', revenue: 9234.56, orders: 584, flag: '🇫🇷' },
                    { code: 'IT', name: 'Italy', revenue: 6123.45, orders: 387, flag: '🇮🇹' },
                    { code: 'ES', name: 'Spain', revenue: 5432.10, orders: 343, flag: '🇪🇸' },
                    { code: 'UK', name: 'UK', revenue: 3987.65, orders: 252, flag: '🇬🇧' },
                    { code: 'NL', name: 'Netherlands', revenue: 1542.79, orders: 104, flag: '🇳🇱' }
                ],
                products: [
                    { name: 'Magnetic Locks 20+4', revenue: 12450, units: 415 },
                    { name: 'Cabinet Locks 8-Pack', revenue: 9870, units: 658 },
                    { name: 'Drawer Safety Latches', revenue: 8340, units: 834 },
                    { name: 'Corner Protectors Set', revenue: 7650, units: 1020 },
                    { name: 'Door Stoppers 6-Pack', revenue: 4320, units: 360 },
                    { name: 'Outlet Covers 24-Pack', revenue: 3262, units: 234 }
                ]
            }
        };

        this.init();
    }

    init() {
        console.log('CRM App initializing...');
        this.setupNavigation();
        this.setupEventListeners();
        this.loadData();
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item a[data-page]');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
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

        const activeNav = document.querySelector(`.nav-item a[data-page="${page}"]`);
        if (activeNav) {
            activeNav.closest('.nav-item').classList.add('active');
        }

        // Hide all pages
        document.querySelectorAll('.page-content').forEach(p => {
            p.classList.remove('active');
            p.style.display = 'none';
        });

        // Show target page
        const targetPage = document.getElementById(`page-${page}`);
        if (targetPage) {
            targetPage.classList.add('active');
            targetPage.style.display = 'block';
        }

        // Update header
        this.updatePageHeader(page);

        // Close mobile menu
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.remove('mobile-open');
        }

        this.currentPage = page;
    }

    updatePageHeader(page) {
        const titles = {
            'sales-analysis': { title: 'Sales Analysis', subtitle: 'Year-to-date performance with Amazon fees breakdown' },
            'profit-loss': { title: 'Profit & Loss', subtitle: 'Detailed financial performance' },
            'fees-breakdown': { title: 'Fees Breakdown', subtitle: 'Amazon fee analysis by category' },
            'reimbursements': { title: 'Reimbursements', subtitle: 'Track Amazon reimbursements and refunds' },
            'inventory': { title: 'Inventory', subtitle: 'FBA stock levels and management' },
            'orders': { title: 'Orders', subtitle: 'Order tracking and management' },
            'products': { title: 'Products', subtitle: 'Product catalog and performance' },
            'data-sources': { title: 'Data Sources', subtitle: 'Manage connected data sources' },
            'google-sheets': { title: 'Google Sheets', subtitle: 'Import and export data' },
            'automation': { title: 'Automation', subtitle: 'Scheduled tasks and workflows' },
            'settings': { title: 'Settings', subtitle: 'Application preferences' }
        };

        const config = titles[page] || { title: 'Dashboard', subtitle: '' };

        const titleEl = document.getElementById('pageTitle');
        const subtitleEl = document.getElementById('pageSubtitle');

        if (titleEl) titleEl.textContent = config.title;
        if (subtitleEl) subtitleEl.textContent = config.subtitle;
    }

    setupEventListeners() {
        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.getElementById('sidebar');

        if (mobileMenuBtn && sidebar) {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-open');
            });
        }

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
            });
        }

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const html = document.documentElement;
                const currentTheme = html.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
            });
        }

        // Date range picker
        const dateRangeBtn = document.getElementById('dateRangeBtn');
        const datePickerDropdown = document.getElementById('datePickerDropdown');

        if (dateRangeBtn && datePickerDropdown) {
            dateRangeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                datePickerDropdown.classList.toggle('show');
            });

            document.querySelectorAll('.date-preset').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll('.date-preset').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    datePickerDropdown.classList.remove('show');
                    this.onDateRangeChange(e.target.dataset.range);
                });
            });

            document.addEventListener('click', (e) => {
                if (!dateRangeBtn.contains(e.target) && !datePickerDropdown.contains(e.target)) {
                    datePickerDropdown.classList.remove('show');
                }
            });
        }

        // Refresh button
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshData();
            });
        }

        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportData();
            });
        }

        // Export fees button
        const exportFeesBtn = document.getElementById('exportFeesBtn');
        if (exportFeesBtn) {
            exportFeesBtn.addEventListener('click', () => {
                this.exportFeesCSV();
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }

        // Sync now button
        const syncNowBtn = document.getElementById('syncNowBtn');
        if (syncNowBtn) {
            syncNowBtn.addEventListener('click', () => {
                this.syncNow();
            });
        }
    }

    onDateRangeChange(range) {
        console.log('Date range changed to:', range);

        const today = new Date();
        let startDate, endDate = today;
        let text;

        switch (range) {
            case '7d':
                startDate = new Date(today - 7 * 24 * 60 * 60 * 1000);
                text = 'Last 7 days';
                break;
            case '30d':
                startDate = new Date(today - 30 * 24 * 60 * 60 * 1000);
                text = 'Last 30 days';
                break;
            case '90d':
                startDate = new Date(today - 90 * 24 * 60 * 60 * 1000);
                text = 'Last 90 days';
                break;
            case 'ytd':
                startDate = new Date(today.getFullYear(), 0, 1);
                text = `Jan 1 - ${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${today.getFullYear()}`;
                break;
            case 'all':
                startDate = new Date(2024, 0, 1);
                text = 'All Time';
                break;
        }

        const dateRangeText = document.getElementById('dateRangeText');
        if (dateRangeText) {
            dateRangeText.textContent = text;
        }

        this.loadData(startDate, endDate);
    }

    async loadData(startDate, endDate) {
        console.log('Loading data...');

        // For now, use mock data
        // In production, this would call amazonAPI methods
        const data = this.mockData.ytd;

        this.updateKPIs(data);
        this.updateFeesTable(data.fees);
        this.updateMonthlyTable(data.monthly);
        this.initCharts(data);

        // Update sync status
        const lastSyncTime = document.getElementById('lastSyncTime');
        if (lastSyncTime) {
            const now = new Date();
            lastSyncTime.textContent = `Last: ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        }
    }

    updateKPIs(data) {
        const formatCurrency = (val) => `€${val.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        const kpiGrossRevenue = document.getElementById('kpiGrossRevenue');
        const kpiTotalFees = document.getElementById('kpiTotalFees');
        const kpiNetProfit = document.getElementById('kpiNetProfit');
        const kpiTotalOrders = document.getElementById('kpiTotalOrders');
        const kpiRevenueChange = document.getElementById('kpiRevenueChange');
        const kpiFeesPercent = document.getElementById('kpiFeesPercent');
        const kpiProfitMargin = document.getElementById('kpiProfitMargin');
        const kpiUnitsCount = document.getElementById('kpiUnitsCount');

        if (kpiGrossRevenue) kpiGrossRevenue.textContent = formatCurrency(data.grossRevenue);
        if (kpiTotalFees) kpiTotalFees.textContent = formatCurrency(data.totalFees);
        if (kpiNetProfit) kpiNetProfit.textContent = formatCurrency(data.netProfit);
        if (kpiTotalOrders) kpiTotalOrders.textContent = data.totalOrders.toLocaleString();

        if (kpiRevenueChange) {
            kpiRevenueChange.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
                +${data.revenueChange}%
            `;
        }

        const feesPercent = ((data.totalFees / data.grossRevenue) * 100).toFixed(1);
        if (kpiFeesPercent) kpiFeesPercent.textContent = `${feesPercent}% of revenue`;

        const marginPercent = ((data.netProfit / data.grossRevenue) * 100).toFixed(1);
        if (kpiProfitMargin) kpiProfitMargin.textContent = `${marginPercent}% margin`;

        if (kpiUnitsCount) kpiUnitsCount.textContent = `${data.totalUnits.toLocaleString()} units sold`;
    }

    updateFeesTable(fees) {
        const tbody = document.getElementById('feesTableBody');
        if (!tbody) return;

        const grossRevenue = this.mockData.ytd.grossRevenue;
        let totalFees = 0;

        tbody.innerHTML = fees.map(fee => {
            totalFees += fee.amount;
            const trendIcon = fee.trend === 'up' ? '↑' : fee.trend === 'down' ? '↓' : '→';
            const trendClass = fee.trend === 'up' ? 'trend-up' : fee.trend === 'down' ? 'trend-down' : 'trend-neutral';

            return `
                <tr class="fee-row ${fee.type.toLowerCase().includes('referral') ? 'referral' : fee.type.toLowerCase().includes('fba') ? 'fba' : fee.type.toLowerCase().includes('storage') ? 'storage' : fee.type.toLowerCase().includes('placement') ? 'placement' : 'other'}">
                    <td><strong>${fee.type}</strong></td>
                    <td>${fee.description}</td>
                    <td class="text-right">€${fee.amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</td>
                    <td class="text-right">${fee.percent.toFixed(2)}%</td>
                    <td class="${trendClass}">${trendIcon}</td>
                </tr>
            `;
        }).join('');

        // Update footer
        const totalFeesAmount = document.getElementById('totalFeesAmount');
        const totalFeesPercent = document.getElementById('totalFeesPercent');

        if (totalFeesAmount) totalFeesAmount.textContent = `€${totalFees.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`;
        if (totalFeesPercent) totalFeesPercent.textContent = `${((totalFees / grossRevenue) * 100).toFixed(2)}%`;
    }

    updateMonthlyTable(monthly) {
        const tbody = document.getElementById('monthlyTableBody');
        if (!tbody) return;

        tbody.innerHTML = monthly.map(m => {
            const net = m.revenue - m.fees;
            const margin = ((net / m.revenue) * 100).toFixed(1);

            return `
                <tr>
                    <td><strong>${m.month} 2026</strong></td>
                    <td>${m.orders.toLocaleString()}</td>
                    <td>${m.units.toLocaleString()}</td>
                    <td>€${m.revenue.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</td>
                    <td class="text-danger">-€${m.fees.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</td>
                    <td class="text-success">€${net.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</td>
                    <td>${margin}%</td>
                </tr>
            `;
        }).join('');
    }

    initCharts(data) {
        this.initRevenueTrendChart(data.monthly);
        this.initFeesBreakdownChart(data.fees);
        this.initCountryChart(data.byCountry);
        this.initProductsChart(data.products);
    }

    initRevenueTrendChart(monthly) {
        const ctx = document.getElementById('revenueTrendChart');
        if (!ctx) return;

        if (this.charts.revenueTrend) {
            this.charts.revenueTrend.destroy();
        }

        this.charts.revenueTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: monthly.map(m => m.month),
                datasets: [
                    {
                        label: 'Revenue',
                        data: monthly.map(m => m.revenue),
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Fees',
                        data: monthly.map(m => m.fees),
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Net Profit',
                        data: monthly.map(m => m.revenue - m.fees),
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: true,
                        tension: 0.4
                    }
                ]
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
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#a1a1aa',
                            callback: (value) => '€' + value.toLocaleString()
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#a1a1aa'
                        }
                    }
                }
            }
        });
    }

    initFeesBreakdownChart(fees) {
        const ctx = document.getElementById('feesBreakdownChart');
        if (!ctx) return;

        if (this.charts.feesBreakdown) {
            this.charts.feesBreakdown.destroy();
        }

        const colors = ['#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981', '#06b6d4', '#64748b'];

        this.charts.feesBreakdown = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: fees.map(f => f.type),
                datasets: [{
                    data: fees.map(f => f.amount),
                    backgroundColor: colors,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#a1a1aa',
                            padding: 12,
                            usePointStyle: true
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }

    initCountryChart(countries) {
        const ctx = document.getElementById('countryChart');
        if (!ctx) return;

        if (this.charts.country) {
            this.charts.country.destroy();
        }

        this.charts.country = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: countries.map(c => `${c.flag} ${c.code}`),
                datasets: [{
                    label: 'Revenue',
                    data: countries.map(c => c.revenue),
                    backgroundColor: '#6366f1',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#a1a1aa',
                            callback: (value) => '€' + value.toLocaleString()
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#a1a1aa'
                        }
                    }
                }
            }
        });
    }

    initProductsChart(products) {
        const ctx = document.getElementById('productsChart');
        if (!ctx) return;

        if (this.charts.products) {
            this.charts.products.destroy();
        }

        const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe', '#e9d5ff'];

        this.charts.products = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: products.map(p => p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name),
                datasets: [{
                    label: 'Revenue',
                    data: products.map(p => p.revenue),
                    backgroundColor: colors,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#a1a1aa',
                            callback: (value) => '€' + value.toLocaleString()
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#a1a1aa',
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                }
            }
        });
    }

    async refreshData() {
        console.log('Refreshing data...');
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.querySelector('svg').classList.add('animate-spin');
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        await this.loadData();

        if (refreshBtn) {
            refreshBtn.querySelector('svg').classList.remove('animate-spin');
        }

        this.showToast('Data refreshed successfully', 'success');
    }

    async syncNow() {
        console.log('Manual sync started...');
        this.showToast('Syncing with Amazon...', 'info');

        // Simulate sync
        await new Promise(resolve => setTimeout(resolve, 2000));

        this.showToast('Sync completed! 1,234 orders and 45 fee records updated.', 'success');
    }

    exportData() {
        console.log('Exporting data...');
        this.showToast('Export started... Check your downloads folder.', 'info');
    }

    exportFeesCSV() {
        const fees = this.mockData.ytd.fees;
        const headers = ['Fee Type', 'Description', 'Amount (EUR)', '% of Revenue', 'Trend'];

        let csv = headers.join(',') + '\n';

        fees.forEach(fee => {
            csv += `"${fee.type}","${fee.description}",${fee.amount},${fee.percent}%,${fee.trend}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'amazon_fees_ytd.csv';
        a.click();
        window.URL.revokeObjectURL(url);

        this.showToast('Fees exported to CSV', 'success');
    }

    logout() {
        sessionStorage.clear();
        localStorage.removeItem('crmAuth');
        window.location.href = 'index.html';
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span>${message}</span>
            <button class="toast-close">&times;</button>
        `;

        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);

        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        });

        setTimeout(() => {
            if (toast.parentElement) {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }
        }, 4000);
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing CRM App...');
    window.crmApp = new CRMApp();
});

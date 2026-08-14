/**
 * Margin Dashboard
 * Profitability and cost analysis for Amazon products
 * v1.0 - 2026-08-14
 */

class MarginDashboard {
    constructor() {
        this.data = null;
        this.filteredData = null;
        this.sortColumn = 'revenue';
        this.sortDirection = 'desc';
        this.selectedCountries = ['DE', 'GB', 'ES', 'IT', 'FR', 'NL', 'PL'];
        this.searchQuery = '';
        this.seasonalityChart = null;
        this.expandedRows = new Set();

        this.countryFlags = {
            DE: '🇩🇪', GB: '🇬🇧', ES: '🇪🇸', IT: '🇮🇹',
            FR: '🇫🇷', NL: '🇳🇱', PL: '🇵🇱', SE: '🇸🇪', BE: '🇧🇪'
        };

        this.init();
    }

    async init() {
        console.log('Initializing Margin Dashboard...');
        this.setupEventListeners();
        await this.loadData();
        this.render();
        this.initSeasonalityChart();
        console.log('Margin Dashboard initialized');
    }

    async loadData() {
        try {
            const response = await fetch('data/margin_data.json');
            if (!response.ok) throw new Error('Failed to load margin data');
            this.data = await response.json();
            this.filteredData = this.data;
            console.log('Margin data loaded:', Object.keys(this.data.products || {}).length, 'products');
        } catch (error) {
            console.warn('Using mock data:', error.message);
            this.data = this.getMockData();
            this.filteredData = this.data;
        }
    }

    getMockData() {
        return {
            lastUpdated: new Date().toISOString(),
            products: {
                'B07JZCWJMW': {
                    title: 'Magnetische Kindersicherung 20+4',
                    sku: 'GM-1QEG-0QPK',
                    cog: 6.08,
                    byCountry: {
                        DE: { revenue: 4521.70, units: 151, referralFee: 678.26, fbaFee: 453.15, storageFee: 45.12, refunds: 135.65, otherFees: 22.61, totalCosts: 2253.32, profit: 2268.38, margin: 50.2 },
                        GB: { revenue: 1234.50, units: 42, referralFee: 185.18, fbaFee: 126.00, storageFee: 12.34, refunds: 37.04, otherFees: 6.17, totalCosts: 622.65, profit: 611.85, margin: 49.6 },
                        ES: { revenue: 876.30, units: 29, referralFee: 131.45, fbaFee: 87.00, storageFee: 8.76, refunds: 26.29, otherFees: 4.38, totalCosts: 433.88, profit: 442.42, margin: 50.5 },
                        FR: { revenue: 654.20, units: 22, referralFee: 98.13, fbaFee: 66.00, storageFee: 6.54, refunds: 19.63, otherFees: 3.27, totalCosts: 327.45, profit: 326.75, margin: 49.9 },
                        IT: { revenue: 543.10, units: 18, referralFee: 81.47, fbaFee: 54.00, storageFee: 5.43, refunds: 16.29, otherFees: 2.72, totalCosts: 269.33, profit: 273.77, margin: 50.4 }
                    },
                    monthly: this.generateMonthlyData(8500, 50)
                },
                'B0854MW97N': {
                    title: 'Steckdosen Kindersicherung 20x',
                    sku: 'SH-G0PF-CSW1',
                    cog: 1.25,
                    byCountry: {
                        DE: { revenue: 2345.60, units: 293, referralFee: 351.84, fbaFee: 234.56, storageFee: 23.46, refunds: 70.37, otherFees: 11.73, totalCosts: 1058.06, profit: 1287.54, margin: 54.9 },
                        GB: { revenue: 876.40, units: 109, referralFee: 131.46, fbaFee: 87.64, storageFee: 8.76, refunds: 26.29, otherFees: 4.38, totalCosts: 394.78, profit: 481.62, margin: 55.0 },
                        ES: { revenue: 543.20, units: 68, referralFee: 81.48, fbaFee: 54.32, storageFee: 5.43, refunds: 16.30, otherFees: 2.72, totalCosts: 245.25, profit: 297.95, margin: 54.9 }
                    },
                    monthly: this.generateMonthlyData(4200, 55)
                },
                'B0933B1NKB': {
                    title: 'Eckenschutz Kantenschutz Baby 12x (Schwarz)',
                    sku: 'E1-ZMUX-HRSF',
                    cog: 0.95,
                    byCountry: {
                        DE: { revenue: 1876.50, units: 188, referralFee: 281.48, fbaFee: 187.65, storageFee: 18.77, refunds: 56.30, otherFees: 9.38, totalCosts: 732.16, profit: 1144.34, margin: 61.0 },
                        GB: { revenue: 654.30, units: 65, referralFee: 98.15, fbaFee: 65.43, storageFee: 6.54, refunds: 19.63, otherFees: 3.27, totalCosts: 254.79, profit: 399.51, margin: 61.1 }
                    },
                    monthly: this.generateMonthlyData(2800, 61)
                },
                'B07PPXKJPQ': {
                    title: 'Kantenschutz Baby Schaumstoff 6,2m (Schwarz)',
                    sku: 'UP-185A-6YIE',
                    cog: 2.71,
                    byCountry: {
                        DE: { revenue: 3456.70, units: 173, referralFee: 518.51, fbaFee: 345.67, storageFee: 34.57, refunds: 103.70, otherFees: 17.28, totalCosts: 1488.39, profit: 1968.31, margin: 56.9 },
                        GB: { revenue: 987.60, units: 49, referralFee: 148.14, fbaFee: 98.76, storageFee: 9.88, refunds: 29.63, otherFees: 4.94, totalCosts: 423.94, profit: 563.66, margin: 57.1 },
                        FR: { revenue: 567.80, units: 28, referralFee: 85.17, fbaFee: 56.78, storageFee: 5.68, refunds: 17.03, otherFees: 2.84, totalCosts: 243.38, profit: 324.42, margin: 57.1 }
                    },
                    monthly: this.generateMonthlyData(5500, 57)
                },
                'B08NCRRM6M': {
                    title: 'Wandschutz Pads für Treppengitter 4x',
                    sku: '9J-VG9Z-P83K',
                    cog: 1.11,
                    byCountry: {
                        DE: { revenue: 1234.50, units: 154, referralFee: 185.18, fbaFee: 123.45, storageFee: 12.35, refunds: 37.04, otherFees: 6.17, totalCosts: 535.09, profit: 699.41, margin: 56.7 },
                        GB: { revenue: 456.70, units: 57, referralFee: 68.51, fbaFee: 45.67, storageFee: 4.57, refunds: 13.70, otherFees: 2.28, totalCosts: 197.99, profit: 258.71, margin: 56.6 }
                    },
                    monthly: this.generateMonthlyData(1900, 57)
                },
                'B0DMTJXH9W': {
                    title: 'Magnetische Kindersicherung 12+3 (Schwarz)',
                    sku: 'AK-CIFP-P8X9',
                    cog: 4.23,
                    byCountry: {
                        DE: { revenue: 2345.80, units: 98, referralFee: 351.87, fbaFee: 234.58, storageFee: 23.46, refunds: 70.37, otherFees: 11.73, totalCosts: 1106.55, profit: 1239.25, margin: 52.8 }
                    },
                    monthly: this.generateMonthlyData(2800, 53)
                }
            },
            byCountry: {
                DE: { revenue: 15780.80, units: 1057, totalCosts: 7173.57, profit: 8607.23, margin: 54.5 },
                GB: { revenue: 4209.50, units: 322, totalCosts: 1894.15, profit: 2315.35, margin: 55.0 },
                ES: { revenue: 1419.50, units: 97, totalCosts: 679.13, profit: 740.37, margin: 52.2 },
                FR: { revenue: 1222.00, units: 50, totalCosts: 570.83, profit: 651.17, margin: 53.3 },
                IT: { revenue: 543.10, units: 18, totalCosts: 269.33, profit: 273.77, margin: 50.4 },
                NL: { revenue: 345.60, units: 23, totalCosts: 156.78, profit: 188.82, margin: 54.6 },
                PL: { revenue: 234.50, units: 19, totalCosts: 112.34, profit: 122.16, margin: 52.1 }
            },
            subscriptionFee: 39.00,
            subscriptionSplit: { DE: 15.60, GB: 7.80, ES: 3.90, FR: 3.90, IT: 1.95, NL: 1.95, PL: 1.95, SE: 0.98, BE: 0.97 }
        };
    }

    generateMonthlyData(avgRevenue, avgMargin) {
        const months = [];
        const seasonality = [0.85, 0.80, 0.90, 1.0, 1.05, 0.95, 0.85, 0.90, 1.10, 1.20, 1.45, 1.35];
        const now = new Date();

        for (let i = 23; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthIndex = date.getMonth();
            const factor = seasonality[monthIndex] + (Math.random() * 0.2 - 0.1);
            const revenue = Math.round(avgRevenue * factor / 12);
            const marginVariation = avgMargin + (Math.random() * 6 - 3);

            months.push({
                month: date.toISOString().slice(0, 7),
                revenue: revenue,
                margin: Math.round(marginVariation * 10) / 10
            });
        }
        return months;
    }

    setupEventListeners() {
        // Country multi-select
        const countryBtn = document.getElementById('countrySelectBtn');
        const countryDropdown = document.getElementById('countrySelectDropdown');

        if (countryBtn && countryDropdown) {
            countryBtn.addEventListener('click', () => {
                countryDropdown.classList.toggle('show');
            });

            document.addEventListener('click', (e) => {
                if (!e.target.closest('.multi-select-wrapper')) {
                    countryDropdown.classList.remove('show');
                }
            });

            countryDropdown.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.addEventListener('change', () => this.handleCountryChange());
            });
        }

        // ASIN search
        const searchInput = document.getElementById('asinSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toUpperCase();
                this.applyFilters();
            });
        }

        // Table sorting
        document.querySelectorAll('.margin-table th.sortable').forEach(th => {
            th.addEventListener('click', () => {
                const column = th.dataset.sort;
                if (this.sortColumn === column) {
                    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    this.sortColumn = column;
                    this.sortDirection = 'desc';
                }
                this.updateSortIndicators();
                this.renderTable();
            });
        });

        // Seasonality country filter
        const seasonalityFilter = document.getElementById('seasonalityCountryFilter');
        if (seasonalityFilter) {
            seasonalityFilter.addEventListener('change', () => this.updateSeasonalityChart());
        }

        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportToCSV());
        }

        // Refresh button
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadData().then(() => this.render()));
        }

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
            });
        }

        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenuBtn && sidebar) {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-open');
            });
        }
    }

    handleCountryChange() {
        const checkboxes = document.querySelectorAll('#countrySelectDropdown input[type="checkbox"]:not(#country-all)');
        const allCheckbox = document.getElementById('country-all');

        if (event.target.id === 'country-all') {
            checkboxes.forEach(cb => cb.checked = allCheckbox.checked);
        } else {
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            allCheckbox.checked = allChecked;
        }

        this.selectedCountries = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        this.updateCountrySelectText();
        this.applyFilters();
    }

    updateCountrySelectText() {
        const textEl = document.getElementById('countrySelectText');
        if (textEl) {
            if (this.selectedCountries.length === 0) {
                textEl.textContent = 'None selected';
            } else if (this.selectedCountries.length === 7) {
                textEl.textContent = 'All Countries';
            } else {
                textEl.textContent = this.selectedCountries.join(', ');
            }
        }
    }

    applyFilters() {
        if (!this.data || !this.data.products) return;

        const filtered = {};

        for (const [asin, product] of Object.entries(this.data.products)) {
            // Search filter
            if (this.searchQuery && !asin.includes(this.searchQuery) &&
                !product.title.toUpperCase().includes(this.searchQuery)) {
                continue;
            }

            // Country filter - create filtered byCountry
            const filteredByCountry = {};
            for (const [country, data] of Object.entries(product.byCountry || {})) {
                if (this.selectedCountries.includes(country)) {
                    filteredByCountry[country] = data;
                }
            }

            if (Object.keys(filteredByCountry).length > 0) {
                filtered[asin] = { ...product, byCountry: filteredByCountry };
            }
        }

        this.filteredData = { ...this.data, products: filtered };
        this.render();
    }

    render() {
        this.renderKPIs();
        this.renderTable();
        this.updateSeasonalityChart();
    }

    renderKPIs() {
        if (!this.filteredData || !this.filteredData.products) return;

        let totalRevenue = 0;
        let totalCosts = 0;
        let totalUnits = 0;

        for (const product of Object.values(this.filteredData.products)) {
            for (const countryData of Object.values(product.byCountry || {})) {
                totalRevenue += countryData.revenue || 0;
                totalCosts += countryData.totalCosts || 0;
                totalUnits += countryData.units || 0;
            }
        }

        const profit = totalRevenue - totalCosts;
        const margin = totalRevenue > 0 ? (profit / totalRevenue * 100) : 0;

        document.getElementById('kpiRevenue').textContent = this.formatCurrency(totalRevenue);
        document.getElementById('kpiCosts').textContent = this.formatCurrency(totalCosts);
        document.getElementById('kpiProfit').textContent = this.formatCurrency(profit);
        document.getElementById('kpiMargin').textContent = margin.toFixed(1) + '%';
    }

    renderTable() {
        const tbody = document.getElementById('marginTableBody');
        if (!tbody || !this.filteredData || !this.filteredData.products) return;

        // Aggregate and sort data
        const rows = [];

        for (const [asin, product] of Object.entries(this.filteredData.products)) {
            const totals = this.aggregateProductData(product);
            rows.push({ asin, product, ...totals });
        }

        // Sort
        rows.sort((a, b) => {
            let aVal = a[this.sortColumn];
            let bVal = b[this.sortColumn];

            if (this.sortColumn === 'product') {
                aVal = a.product.title;
                bVal = b.product.title;
            }

            if (typeof aVal === 'string') {
                return this.sortDirection === 'asc'
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }

            return this.sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        });

        // Render
        tbody.innerHTML = rows.map(row => this.renderProductRow(row)).join('');

        // Add click handlers for expansion
        tbody.querySelectorAll('tr.product-row').forEach(tr => {
            tr.addEventListener('click', () => this.toggleRow(tr.dataset.asin));
        });
    }

    aggregateProductData(product) {
        let revenue = 0, units = 0, cog = 0, referralFee = 0, fbaFee = 0;
        let storageFee = 0, refunds = 0, otherFees = 0, totalCosts = 0, profit = 0;

        for (const data of Object.values(product.byCountry || {})) {
            revenue += data.revenue || 0;
            units += data.units || 0;
            referralFee += data.referralFee || 0;
            fbaFee += data.fbaFee || 0;
            storageFee += data.storageFee || 0;
            refunds += data.refunds || 0;
            otherFees += data.otherFees || 0;
            totalCosts += data.totalCosts || 0;
            profit += data.profit || 0;
        }

        cog = units * (product.cog || 0);
        const margin = revenue > 0 ? (profit / revenue * 100) : 0;

        return { revenue, units, cog, referralFee, fbaFee, storageFee, refunds, otherFees, totalCosts, profit, margin };
    }

    renderProductRow(row) {
        const { asin, product, revenue, units, cog, referralFee, fbaFee, storageFee, refunds, otherFees, totalCosts, profit, margin } = row;
        const isExpanded = this.expandedRows.has(asin);
        const marginClass = margin >= 50 ? 'good' : margin >= 30 ? 'warning' : 'bad';

        let html = `
            <tr class="product-row ${isExpanded ? 'expanded' : ''}" data-asin="${asin}">
                <td>
                    <div class="product-name-cell">
                        <svg class="expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                        <div class="product-details">
                            <span class="product-title">${this.truncate(product.title, 40)}</span>
                            <span class="product-asin">${asin}</span>
                        </div>
                    </div>
                </td>
                <td>${this.formatCurrency(revenue)}</td>
                <td>${units.toLocaleString()}</td>
                <td class="negative-value">${this.formatCurrency(cog)}</td>
                <td class="negative-value">${this.formatCurrency(referralFee)}</td>
                <td class="negative-value">${this.formatCurrency(fbaFee)}</td>
                <td class="negative-value">${this.formatCurrency(storageFee)}</td>
                <td class="negative-value">${this.formatCurrency(refunds)}</td>
                <td class="negative-value">${this.formatCurrency(otherFees)}</td>
                <td class="negative-value">${this.formatCurrency(totalCosts)}</td>
                <td class="positive-value">${this.formatCurrency(profit)}</td>
                <td class="margin-percentage ${marginClass}">${margin.toFixed(1)}%</td>
            </tr>
        `;

        // Add breakdown rows for each country
        if (isExpanded) {
            for (const [country, data] of Object.entries(product.byCountry || {})) {
                const countryMarginClass = data.margin >= 50 ? 'good' : data.margin >= 30 ? 'warning' : 'bad';
                const countryCog = (data.units || 0) * (product.cog || 0);

                html += `
                    <tr class="breakdown-row" style="display: table-row;">
                        <td>
                            <div class="country-flag-cell">
                                <span class="country-flag-icon">${this.countryFlags[country] || ''}</span>
                                <span>${country}</span>
                            </div>
                        </td>
                        <td>${this.formatCurrency(data.revenue)}</td>
                        <td>${(data.units || 0).toLocaleString()}</td>
                        <td class="negative-value">${this.formatCurrency(countryCog)}</td>
                        <td class="negative-value">${this.formatCurrency(data.referralFee)}</td>
                        <td class="negative-value">${this.formatCurrency(data.fbaFee)}</td>
                        <td class="negative-value">${this.formatCurrency(data.storageFee)}</td>
                        <td class="negative-value">${this.formatCurrency(data.refunds)}</td>
                        <td class="negative-value">${this.formatCurrency(data.otherFees)}</td>
                        <td class="negative-value">${this.formatCurrency(data.totalCosts)}</td>
                        <td class="positive-value">${this.formatCurrency(data.profit)}</td>
                        <td class="margin-percentage ${countryMarginClass}">${(data.margin || 0).toFixed(1)}%</td>
                    </tr>
                `;
            }
        }

        return html;
    }

    toggleRow(asin) {
        if (this.expandedRows.has(asin)) {
            this.expandedRows.delete(asin);
        } else {
            this.expandedRows.add(asin);
        }
        this.renderTable();
    }

    updateSortIndicators() {
        document.querySelectorAll('.margin-table th.sortable').forEach(th => {
            th.classList.remove('sort-asc', 'sort-desc');
            if (th.dataset.sort === this.sortColumn) {
                th.classList.add(this.sortDirection === 'asc' ? 'sort-asc' : 'sort-desc');
            }
        });
    }

    initSeasonalityChart() {
        const ctx = document.getElementById('seasonalityChart');
        if (!ctx) return;

        const chartColors = getComputedStyle(document.documentElement);

        this.seasonalityChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Revenue',
                        data: [],
                        backgroundColor: 'rgba(99, 102, 241, 0.7)',
                        borderColor: 'rgb(99, 102, 241)',
                        borderWidth: 1,
                        yAxisID: 'y',
                        order: 2
                    },
                    {
                        label: 'Margin %',
                        data: [],
                        type: 'line',
                        borderColor: 'rgb(34, 197, 94)',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        yAxisID: 'y1',
                        order: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: chartColors.getPropertyValue('--text-primary') || '#e5e7eb'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                if (context.dataset.label === 'Revenue') {
                                    return `Revenue: ${this.formatCurrency(context.raw)}`;
                                }
                                return `Margin: ${context.raw}%`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        ticks: { color: chartColors.getPropertyValue('--text-secondary') || '#9ca3af' }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        ticks: {
                            color: chartColors.getPropertyValue('--text-secondary') || '#9ca3af',
                            callback: (value) => '€' + value.toLocaleString()
                        },
                        title: {
                            display: true,
                            text: 'Revenue (€)',
                            color: chartColors.getPropertyValue('--text-secondary') || '#9ca3af'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        min: 0,
                        max: 100,
                        grid: { drawOnChartArea: false },
                        ticks: {
                            color: 'rgb(34, 197, 94)',
                            callback: (value) => value + '%'
                        },
                        title: {
                            display: true,
                            text: 'Margin %',
                            color: 'rgb(34, 197, 94)'
                        }
                    }
                }
            }
        });

        this.updateSeasonalityChart();
    }

    updateSeasonalityChart() {
        if (!this.seasonalityChart || !this.filteredData || !this.filteredData.products) return;

        const countryFilter = document.getElementById('seasonalityCountryFilter')?.value || 'all';

        // Aggregate monthly data
        const monthlyTotals = {};

        for (const product of Object.values(this.filteredData.products)) {
            const monthly = product.monthly || [];

            for (const monthData of monthly) {
                if (!monthlyTotals[monthData.month]) {
                    monthlyTotals[monthData.month] = { revenue: 0, marginSum: 0, count: 0 };
                }

                // If filtering by country, we need country-specific monthly data
                // For now, use product-level monthly (mock data doesn't have country-specific monthly)
                let factor = 1;
                if (countryFilter !== 'all' && product.byCountry) {
                    const countryData = product.byCountry[countryFilter];
                    if (!countryData) continue;

                    // Calculate what portion of revenue comes from this country
                    const totalRevenue = Object.values(product.byCountry)
                        .reduce((sum, c) => sum + (c.revenue || 0), 0);
                    factor = totalRevenue > 0 ? countryData.revenue / totalRevenue : 0;
                }

                monthlyTotals[monthData.month].revenue += monthData.revenue * factor;
                monthlyTotals[monthData.month].marginSum += monthData.margin;
                monthlyTotals[monthData.month].count += 1;
            }
        }

        // Sort by month
        const sortedMonths = Object.keys(monthlyTotals).sort();

        const labels = sortedMonths.map(m => {
            const [year, month] = m.split('-');
            return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        });

        const revenueData = sortedMonths.map(m => Math.round(monthlyTotals[m].revenue));
        const marginData = sortedMonths.map(m =>
            monthlyTotals[m].count > 0
                ? Math.round(monthlyTotals[m].marginSum / monthlyTotals[m].count * 10) / 10
                : 0
        );

        this.seasonalityChart.data.labels = labels;
        this.seasonalityChart.data.datasets[0].data = revenueData;
        this.seasonalityChart.data.datasets[1].data = marginData;
        this.seasonalityChart.update();
    }

    exportToCSV() {
        if (!this.filteredData || !this.filteredData.products) return;

        const headers = ['ASIN', 'Title', 'Country', 'Revenue', 'Units', 'COG', 'Referral Fee', 'FBA Fee', 'Storage', 'Refunds', 'Other', 'Total Costs', 'Profit', 'Margin %'];
        const rows = [headers.join(';')];

        for (const [asin, product] of Object.entries(this.filteredData.products)) {
            for (const [country, data] of Object.entries(product.byCountry || {})) {
                const cog = (data.units || 0) * (product.cog || 0);
                rows.push([
                    asin,
                    `"${product.title}"`,
                    country,
                    this.formatNumber(data.revenue),
                    data.units,
                    this.formatNumber(cog),
                    this.formatNumber(data.referralFee),
                    this.formatNumber(data.fbaFee),
                    this.formatNumber(data.storageFee),
                    this.formatNumber(data.refunds),
                    this.formatNumber(data.otherFees),
                    this.formatNumber(data.totalCosts),
                    this.formatNumber(data.profit),
                    this.formatNumber(data.margin)
                ].join(';'));
            }
        }

        const csv = '\ufeff' + rows.join('\n'); // BOM for Excel
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8-sig' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `margin_report_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();

        URL.revokeObjectURL(url);
    }

    formatCurrency(value) {
        if (value == null || isNaN(value)) return '€0';
        return '€' + value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    formatNumber(value) {
        if (value == null || isNaN(value)) return '0';
        return value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace('.', ',');
    }

    truncate(str, maxLength) {
        if (!str) return '';
        return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.marginDashboard = new MarginDashboard();
});

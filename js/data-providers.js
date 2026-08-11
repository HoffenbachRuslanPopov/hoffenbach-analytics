/* =============================================
   DATA PROVIDERS - Abstraction Layer v1.0
   Prepared for future Amazon Ads API integration
   ============================================= */

/**
 * Base interface for all data providers
 * Each provider returns normalized data format
 */

// =============================================
// ADVERTISING DATA PROVIDER
// =============================================
// Currently returns null/no-data for ad metrics
// Will be replaced with Amazon Ads API integration later
//
// Future flow:
// Amazon Ads API → AdvertisingDataProvider → Dashboard
// =============================================

class AdvertisingDataProvider {
    constructor() {
        this.isConnected = false;
        this.source = 'none'; // Will be 'amazon-ads-api' when connected
    }

    /**
     * Check if advertising data is available
     * @returns {boolean}
     */
    hasData() {
        return this.isConnected;
    }

    /**
     * Get advertising metrics for a specific ASIN
     * @param {string} asin
     * @param {string} marketplace
     * @param {Date} startDate
     * @param {Date} endDate
     * @returns {Object|null} Normalized advertising metrics or null
     */
    async getMetrics(asin, marketplace, startDate, endDate) {
        if (!this.isConnected) {
            return null;
        }

        // Future implementation will call Amazon Ads API here
        // For now, return null to indicate no data
        return null;
    }

    /**
     * Get daily advertising data for time series
     * @param {string} asin
     * @param {string} marketplace
     * @param {Date} startDate
     * @param {Date} endDate
     * @returns {Array|null} Array of daily metrics or null
     */
    async getDailyMetrics(asin, marketplace, startDate, endDate) {
        if (!this.isConnected) {
            return null;
        }

        // Future: Return array of daily advertising metrics
        // [{date, adSpend, adSales, impressions, clicks, ...}, ...]
        return null;
    }

    /**
     * Normalized advertising metrics format
     * This is the contract that Dashboard expects
     */
    static getEmptyMetrics() {
        return {
            adSpend: null,
            adSales: null,
            adUnits: null,
            adOrders: null,
            impressions: null,
            clicks: null,
            ctr: null,
            cpc: null,
            acos: null,
            roas: null,
            // Breakdown by campaign type
            adSpendPPC: null,
            adSpendDisplay: null,
            adSpendBrands: null,
            adSpendVideo: null
        };
    }
}

// =============================================
// SALES DATA PROVIDER
// =============================================
// Uses SP-API for sales and orders data
// Currently uses local JSON files
// =============================================

class SalesDataProvider {
    constructor() {
        this.source = 'sp-api'; // or 'local-json' for testing
        this.cachedData = null;
    }

    /**
     * Get sales metrics for a specific ASIN
     * @param {string} asin
     * @param {string} marketplace
     * @param {Date} startDate
     * @param {Date} endDate
     * @returns {Object} Normalized sales metrics
     */
    async getMetrics(asin, marketplace, startDate, endDate) {
        // Load from local JSON for now
        const data = await this.loadData();

        if (!data || !data.products || !data.products[asin]) {
            return null;
        }

        const product = data.products[asin];

        return {
            name: product.name,
            sku: product.sku,
            units: product.units,
            orders: product.units, // Approximation
            revenue: product.sales,
            refunds: product.refunds,
            refundRate: product.refundRate,
            avgPrice: product.avgPrice
        };
    }

    async loadData() {
        if (this.cachedData) return this.cachedData;

        try {
            const response = await fetch('data/products_metrics.json');
            this.cachedData = await response.json();
            return this.cachedData;
        } catch (error) {
            console.error('SalesDataProvider: Failed to load data', error);
            return null;
        }
    }
}

// =============================================
// FINANCIAL DATA PROVIDER
// =============================================
// Uses SP-API Financial Events for fees, refunds
// =============================================

class FinancialDataProvider {
    constructor() {
        this.source = 'sp-api-financial';
    }

    /**
     * Get financial metrics for a specific ASIN
     * @param {string} asin
     * @param {string} marketplace
     * @param {Date} startDate
     * @param {Date} endDate
     * @returns {Object} Normalized financial metrics
     */
    async getMetrics(asin, marketplace, startDate, endDate) {
        // Load from local JSON for now
        try {
            const response = await fetch('data/products_metrics.json');
            const data = await response.json();

            if (!data.products || !data.products[asin]) {
                return null;
            }

            const product = data.products[asin];

            return {
                amazonFees: product.amazonFees,
                refundCost: product.refundCost,
                cogs: product.cogs,
                vat: product.vat,
                shipping: product.shipping,
                promo: product.promo
            };
        } catch (error) {
            console.error('FinancialDataProvider: Failed to load data', error);
            return null;
        }
    }
}

// =============================================
// AGGREGATED METRICS CALCULATOR
// =============================================
// Combines data from all providers
// Calculates derived metrics (Profit, Margin, ROI, TACOS)
// =============================================

class MetricsAggregator {
    constructor() {
        this.advertisingProvider = new AdvertisingDataProvider();
        this.salesProvider = new SalesDataProvider();
        this.financialProvider = new FinancialDataProvider();
    }

    /**
     * Get all metrics for an ASIN
     * @param {string} asin
     * @param {string} marketplace
     * @param {Date} startDate
     * @param {Date} endDate
     * @returns {Object} Complete metrics object
     */
    async getAsinMetrics(asin, marketplace, startDate, endDate) {
        // Fetch from all providers in parallel
        const [salesData, financialData, adData] = await Promise.all([
            this.salesProvider.getMetrics(asin, marketplace, startDate, endDate),
            this.financialProvider.getMetrics(asin, marketplace, startDate, endDate),
            this.advertisingProvider.getMetrics(asin, marketplace, startDate, endDate)
        ]);

        if (!salesData) {
            return null; // ASIN not found
        }

        // Merge all data
        const metrics = {
            // Product info
            name: salesData.name,
            sku: salesData.sku,

            // Sales metrics (from SP-API)
            units: salesData.units,
            orders: salesData.orders,
            revenue: salesData.revenue,
            refunds: salesData.refunds,
            refundRate: salesData.refundRate,
            avgPrice: salesData.avgPrice,

            // Financial metrics (from SP-API Financial)
            amazonFees: financialData?.amazonFees ?? null,
            cogs: financialData?.cogs ?? null,
            vat: financialData?.vat ?? null,
            refundCost: financialData?.refundCost ?? null,

            // Advertising metrics (from Ads API - currently null)
            adSpend: adData?.adSpend ?? null,
            adSales: adData?.adSales ?? null,
            impressions: adData?.impressions ?? null,
            clicks: adData?.clicks ?? null,
            acos: adData?.acos ?? null,
            roas: adData?.roas ?? null,
            adSpendPPC: adData?.adSpendPPC ?? null,
            adSpendDisplay: adData?.adSpendDisplay ?? null,
            adSpendBrands: adData?.adSpendBrands ?? null,
            adSpendVideo: adData?.adSpendVideo ?? null,

            // Calculated metrics
            ...this.calculateDerivedMetrics(salesData, financialData, adData)
        };

        return metrics;
    }

    /**
     * Calculate derived metrics from base data
     */
    calculateDerivedMetrics(sales, financial, ads) {
        const revenue = sales?.revenue || 0;
        const costs = (financial?.amazonFees || 0) +
                     (financial?.cogs || 0) +
                     (financial?.vat || 0) +
                     (financial?.refundCost || 0);

        // Ad spend - null if not available
        const adSpend = ads?.adSpend;

        // Gross profit (before ads)
        const grossProfit = revenue - costs;

        // Net profit (including ads if available)
        const netProfit = adSpend !== null
            ? grossProfit - adSpend
            : grossProfit;

        // Margin calculation
        const margin = revenue > 0 ? (netProfit / revenue) * 100 : null;

        // ROI calculation (return on investment)
        const totalInvestment = costs + (adSpend || 0);
        const roi = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : null;

        // TACOS - only if adSpend is available
        const tacos = (adSpend !== null && revenue > 0)
            ? (adSpend / revenue) * 100
            : null;

        return {
            grossProfit,
            netProfit,
            margin,
            roi,
            tacos
        };
    }

    /**
     * Check if advertising data is available
     */
    hasAdvertisingData() {
        return this.advertisingProvider.hasData();
    }
}

// =============================================
// FORMATTING HELPERS
// =============================================

const MetricsFormatter = {
    /**
     * Format value for display
     * Returns "No data" for null values
     */
    formatValue(value, type = 'number') {
        if (value === null || value === undefined) {
            return 'No data';
        }

        switch (type) {
            case 'currency':
                return '€' + value.toLocaleString('de-DE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });

            case 'percent':
                return value.toFixed(1) + '%';

            case 'integer':
                return Math.round(value).toLocaleString('de-DE');

            case 'rank':
                return '#' + value;

            default:
                return value.toLocaleString('de-DE');
        }
    },

    /**
     * Check if value should be displayed as "No data"
     */
    isNoData(value) {
        return value === null || value === undefined;
    }
};

// Export for use in dashboard
window.AdvertisingDataProvider = AdvertisingDataProvider;
window.SalesDataProvider = SalesDataProvider;
window.FinancialDataProvider = FinancialDataProvider;
window.MetricsAggregator = MetricsAggregator;
window.MetricsFormatter = MetricsFormatter;

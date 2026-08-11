/* =============================================
   SYNC LOGGER MODULE
   Handles logging, notifications, and sync history
   ============================================= */

class SyncLogger {
    constructor() {
        this.storageKey = 'hoffenbach_sync_logs';
        this.maxLogs = 500;
        this.syncInterval = 4 * 60 * 60 * 1000; // 4 hours in ms

        // Initialize with sample data if empty
        if (!this.getLogs().length) {
            this.initializeSampleData();
        }
    }

    // Get all logs from storage
    getLogs() {
        try {
            const logs = localStorage.getItem(this.storageKey);
            return logs ? JSON.parse(logs) : [];
        } catch (e) {
            console.error('Error reading logs:', e);
            return [];
        }
    }

    // Save logs to storage
    saveLogs(logs) {
        try {
            // Keep only last maxLogs entries
            const trimmedLogs = logs.slice(-this.maxLogs);
            localStorage.setItem(this.storageKey, JSON.stringify(trimmedLogs));
        } catch (e) {
            console.error('Error saving logs:', e);
        }
    }

    // Add a new log entry
    addLog(entry) {
        const logs = this.getLogs();

        const logEntry = {
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            integration: entry.integration || 'unknown',
            action: entry.action || 'sync',
            status: entry.status || 'success',
            records: entry.records || 0,
            duration: entry.duration || 0,
            summary: entry.summary || '',
            details: entry.details || '',
            error: entry.error || null,
            read: false
        };

        logs.push(logEntry);
        this.saveLogs(logs);

        // Dispatch event for UI updates
        window.dispatchEvent(new CustomEvent('syncLogAdded', { detail: logEntry }));

        return logEntry;
    }

    // Log a successful sync
    logSuccess(integration, action, records, duration, summary) {
        return this.addLog({
            integration,
            action,
            status: 'success',
            records,
            duration,
            summary: summary || `Successfully synced ${records} records`,
            details: this.generateSuccessDetails(integration, records, duration)
        });
    }

    // Log an error
    logError(integration, action, errorCode, errorMessage, suggestion) {
        return this.addLog({
            integration,
            action,
            status: 'error',
            records: 0,
            duration: 0,
            summary: `Sync failed: ${errorMessage}`,
            error: {
                code: errorCode,
                message: errorMessage,
                suggestion: suggestion || this.getErrorSuggestion(errorCode)
            },
            details: this.generateErrorDetails(integration, errorCode, errorMessage)
        });
    }

    // Log a warning
    logWarning(integration, action, records, duration, warningMessage) {
        return this.addLog({
            integration,
            action,
            status: 'warning',
            records,
            duration,
            summary: warningMessage,
            details: this.generateWarningDetails(integration, records, warningMessage)
        });
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    // Generate success details
    generateSuccessDetails(integration, records, duration) {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] INFO: Starting ${integration} sync
[${timestamp}] INFO: Authenticating with ${integration} API
[${timestamp}] INFO: Authentication successful
[${timestamp}] INFO: Fetching data from ${integration}
[${timestamp}] INFO: Retrieved ${records} records
[${timestamp}] INFO: Processing records...
[${timestamp}] INFO: Data validation passed
[${timestamp}] INFO: Updating local database
[${timestamp}] INFO: Sync completed successfully in ${duration}ms`;
    }

    // Generate error details
    generateErrorDetails(integration, errorCode, errorMessage) {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] INFO: Starting ${integration} sync
[${timestamp}] INFO: Authenticating with ${integration} API
[${timestamp}] ERROR: ${errorCode} - ${errorMessage}
[${timestamp}] ERROR: Sync aborted
[${timestamp}] INFO: Retry scheduled`;
    }

    // Generate warning details
    generateWarningDetails(integration, records, warningMessage) {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] INFO: Starting ${integration} sync
[${timestamp}] INFO: Authenticating with ${integration} API
[${timestamp}] INFO: Authentication successful
[${timestamp}] WARN: ${warningMessage}
[${timestamp}] INFO: Retrieved ${records} records (partial)
[${timestamp}] INFO: Sync completed with warnings`;
    }

    // Get error suggestion based on code
    getErrorSuggestion(errorCode) {
        const suggestions = {
            'AUTH_FAILED': 'Check your API credentials and refresh token. You may need to re-authorize the connection.',
            'RATE_LIMIT': 'Too many requests. The sync will automatically retry in 15 minutes.',
            'TIMEOUT': 'The server took too long to respond. Check your internet connection or try again later.',
            'API_UNAVAILABLE': 'The API service is temporarily unavailable. Please wait and try again.',
            'INVALID_RESPONSE': 'Received unexpected data from the API. Contact support if this persists.',
            'NETWORK_ERROR': 'Network connection failed. Check your internet connection.',
            'TOKEN_EXPIRED': 'Your access token has expired. Please re-authenticate in Settings.'
        };

        return suggestions[errorCode] || 'Please try again or contact support if the issue persists.';
    }

    // Get recent notifications (last 10 unread or recent)
    getNotifications(limit = 10) {
        const logs = this.getLogs();
        return logs
            .slice(-50)
            .reverse()
            .slice(0, limit);
    }

    // Get unread count
    getUnreadCount() {
        const logs = this.getLogs();
        return logs.filter(log => !log.read).length;
    }

    // Mark notification as read
    markAsRead(logId) {
        const logs = this.getLogs();
        const log = logs.find(l => l.id === logId);
        if (log) {
            log.read = true;
            this.saveLogs(logs);
        }
    }

    // Mark all as read
    markAllAsRead() {
        const logs = this.getLogs();
        logs.forEach(log => log.read = true);
        this.saveLogs(logs);
        window.dispatchEvent(new CustomEvent('syncLogsRead'));
    }

    // Get stats
    getStats(period = '7d') {
        const logs = this.getLogs();
        const now = new Date();
        let cutoff;

        switch (period) {
            case '24h':
                cutoff = new Date(now - 24 * 60 * 60 * 1000);
                break;
            case '7d':
                cutoff = new Date(now - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                cutoff = new Date(now - 30 * 24 * 60 * 60 * 1000);
                break;
            default:
                cutoff = new Date(0);
        }

        const filteredLogs = logs.filter(log => new Date(log.timestamp) >= cutoff);

        const total = filteredLogs.length;
        const success = filteredLogs.filter(l => l.status === 'success').length;
        const error = filteredLogs.filter(l => l.status === 'error').length;
        const warning = filteredLogs.filter(l => l.status === 'warning').length;
        const successRate = total > 0 ? ((success / total) * 100).toFixed(1) : 100;

        return { total, success, error, warning, successRate };
    }

    // Get filtered logs
    getFilteredLogs(filters = {}) {
        let logs = this.getLogs();

        if (filters.integration && filters.integration !== 'all') {
            logs = logs.filter(l => l.integration === filters.integration);
        }

        if (filters.status && filters.status !== 'all') {
            logs = logs.filter(l => l.status === filters.status);
        }

        if (filters.period && filters.period !== 'all') {
            const now = new Date();
            let cutoff;

            switch (filters.period) {
                case '24h':
                    cutoff = new Date(now - 24 * 60 * 60 * 1000);
                    break;
                case '7d':
                    cutoff = new Date(now - 7 * 24 * 60 * 60 * 1000);
                    break;
                case '30d':
                    cutoff = new Date(now - 30 * 24 * 60 * 60 * 1000);
                    break;
            }

            if (cutoff) {
                logs = logs.filter(l => new Date(l.timestamp) >= cutoff);
            }
        }

        return logs.reverse();
    }

    // Get log by ID
    getLogById(logId) {
        const logs = this.getLogs();
        return logs.find(l => l.id === logId);
    }

    // Calculate next sync time
    getNextSyncTime() {
        const logs = this.getLogs();
        const lastSync = logs.filter(l => l.status === 'success').pop();

        if (lastSync) {
            const lastSyncTime = new Date(lastSync.timestamp);
            const nextSync = new Date(lastSyncTime.getTime() + this.syncInterval);
            const now = new Date();

            if (nextSync > now) {
                const diff = nextSync - now;
                const hours = Math.floor(diff / (60 * 60 * 1000));
                const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
                return `${hours}h ${minutes}m`;
            }
        }

        return 'Soon';
    }

    // Initialize with sample data
    initializeSampleData() {
        const now = new Date();
        const sampleLogs = [];

        // Generate last 7 days of sync logs (every 4 hours)
        for (let d = 7; d >= 0; d--) {
            const syncsPerDay = d === 0 ? 3 : 6; // Today has fewer syncs

            for (let s = 0; s < syncsPerDay; s++) {
                const syncTime = new Date(now);
                syncTime.setDate(syncTime.getDate() - d);
                syncTime.setHours(2 + (s * 4), 0, 0, 0);

                // Most syncs are successful
                const isError = Math.random() < 0.03;
                const isWarning = !isError && Math.random() < 0.02;

                if (isError) {
                    const errorTypes = [
                        { code: 'RATE_LIMIT', msg: 'API rate limit exceeded' },
                        { code: 'TIMEOUT', msg: 'Request timeout after 30s' },
                        { code: 'AUTH_FAILED', msg: 'Authentication token expired' }
                    ];
                    const error = errorTypes[Math.floor(Math.random() * errorTypes.length)];

                    sampleLogs.push({
                        id: this.generateId(),
                        timestamp: syncTime.toISOString(),
                        integration: 'amazon',
                        action: 'Full Sync',
                        status: 'error',
                        records: 0,
                        duration: 0,
                        summary: `Sync failed: ${error.msg}`,
                        error: {
                            code: error.code,
                            message: error.msg,
                            suggestion: this.getErrorSuggestion(error.code)
                        },
                        details: this.generateErrorDetails('amazon', error.code, error.msg),
                        read: d > 1
                    });
                } else if (isWarning) {
                    const records = Math.floor(Math.random() * 500) + 800;
                    sampleLogs.push({
                        id: this.generateId(),
                        timestamp: syncTime.toISOString(),
                        integration: 'amazon',
                        action: 'Full Sync',
                        status: 'warning',
                        records,
                        duration: Math.floor(Math.random() * 3000) + 2000,
                        summary: 'Partial data received - some records may be missing',
                        details: this.generateWarningDetails('amazon', records, 'Partial data received'),
                        read: d > 1
                    });
                } else {
                    const records = Math.floor(Math.random() * 200) + 1100;
                    const duration = Math.floor(Math.random() * 2000) + 1500;
                    sampleLogs.push({
                        id: this.generateId(),
                        timestamp: syncTime.toISOString(),
                        integration: 'amazon',
                        action: 'Full Sync',
                        status: 'success',
                        records,
                        duration,
                        summary: `Successfully synced ${records} orders and ${Math.floor(records * 0.04)} fee records`,
                        details: this.generateSuccessDetails('amazon', records, duration),
                        read: d > 0
                    });
                }
            }
        }

        this.saveLogs(sampleLogs);
    }

    // Format timestamp for display
    formatTimestamp(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        if (diff < 172800000) return 'Yesterday';

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Format duration
    formatDuration(ms) {
        if (ms < 1000) return `${ms}ms`;
        return `${(ms / 1000).toFixed(1)}s`;
    }
}

// Export singleton
window.syncLogger = new SyncLogger();

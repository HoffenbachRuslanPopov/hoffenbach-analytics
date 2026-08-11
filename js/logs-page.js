/* =============================================
   LOGS PAGE CONTROLLER
   Handles the logs.html page functionality
   ============================================= */

class LogsPage {
    constructor() {
        this.currentPage = 1;
        this.pageSize = 20;
        this.filters = {
            integration: 'all',
            status: 'all',
            period: '7d'
        };
        this.selectedLog = null;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadStats();
        this.loadLogs();
    }

    setupEventListeners() {
        // Filter changes
        document.getElementById('filterIntegration')?.addEventListener('change', (e) => {
            this.filters.integration = e.target.value;
            this.currentPage = 1;
            this.loadLogs();
            this.loadStats();
        });

        document.getElementById('filterStatus')?.addEventListener('change', (e) => {
            this.filters.status = e.target.value;
            this.currentPage = 1;
            this.loadLogs();
        });

        document.getElementById('filterPeriod')?.addEventListener('change', (e) => {
            this.filters.period = e.target.value;
            this.currentPage = 1;
            this.loadLogs();
            this.loadStats();
        });

        // Export logs
        document.getElementById('exportLogsBtn')?.addEventListener('click', () => {
            this.exportLogs();
        });

        // Pagination
        document.getElementById('prevPage')?.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.loadLogs();
            }
        });

        document.getElementById('nextPage')?.addEventListener('click', () => {
            this.currentPage++;
            this.loadLogs();
        });

        // Modal close
        document.getElementById('closeLogDetailModal')?.addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('logDetailModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'logDetailModal') {
                this.closeModal();
            }
        });

        // Copy log
        document.getElementById('copyLogBtn')?.addEventListener('click', () => {
            this.copyLogToClipboard();
        });

        // Retry button
        document.getElementById('retryBtn')?.addEventListener('click', () => {
            this.retrySync();
        });

        // Escape key closes modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    loadStats() {
        const stats = window.syncLogger.getStats(this.filters.period);

        document.getElementById('totalSyncs').textContent = stats.total;
        document.getElementById('successCount').textContent = stats.success;
        document.getElementById('errorCount').textContent = stats.error;
        document.getElementById('warningCount').textContent = stats.warning;
        document.getElementById('uptimePercent').textContent = `${stats.successRate}%`;
    }

    loadLogs() {
        const logs = window.syncLogger.getFilteredLogs(this.filters);
        const totalRecords = logs.length;
        const totalPages = Math.ceil(totalRecords / this.pageSize);

        // Paginate
        const startIdx = (this.currentPage - 1) * this.pageSize;
        const endIdx = startIdx + this.pageSize;
        const pageLogs = logs.slice(startIdx, endIdx);

        this.renderLogs(pageLogs);
        this.updatePagination(totalRecords, totalPages);
    }

    renderLogs(logs) {
        const tbody = document.getElementById('logsTableBody');
        if (!tbody) return;

        if (logs.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 3rem;">
                        <p style="color: var(--text-tertiary);">No logs found matching your filters</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = logs.map(log => this.renderLogRow(log)).join('');

        // Add click handlers
        tbody.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const logId = btn.dataset.logId;
                this.showLogDetail(logId);
            });
        });
    }

    renderLogRow(log) {
        const date = new Date(log.timestamp);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        const statusIcon = this.getStatusIcon(log.status);
        const integrationClass = log.integration === 'amazon' ? 'amazon' : 'google';

        return `
            <tr>
                <td class="col-status">
                    <div class="status-indicator">
                        <span class="status-dot ${log.status}"></span>
                        <span class="status-text ${log.status}">${this.capitalizeFirst(log.status)}</span>
                    </div>
                </td>
                <td class="col-timestamp">
                    <div class="timestamp">
                        <span class="timestamp-date">${dateStr}</span>
                        <span class="timestamp-time">${timeStr}</span>
                    </div>
                </td>
                <td class="col-integration">
                    <span class="integration-badge ${integrationClass}">
                        ${this.capitalizeFirst(log.integration)}
                    </span>
                </td>
                <td class="col-action">${log.action}</td>
                <td class="col-records">
                    <span class="records-count">${log.records.toLocaleString()}</span>
                </td>
                <td class="col-duration">
                    <span class="duration">${window.syncLogger.formatDuration(log.duration)}</span>
                </td>
                <td class="col-details">
                    <div class="details-preview">${log.summary}</div>
                    <button class="view-details-btn" data-log-id="${log.id}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        View
                    </button>
                </td>
            </tr>
        `;
    }

    getStatusIcon(status) {
        const icons = {
            success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>`,
            error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>`,
            warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>`
        };
        return icons[status] || icons.success;
    }

    updatePagination(totalRecords, totalPages) {
        const showingFrom = document.getElementById('showingFrom');
        const showingTo = document.getElementById('showingTo');
        const totalRecordsEl = document.getElementById('totalRecords');
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        const paginationPages = document.getElementById('paginationPages');

        if (showingFrom) showingFrom.textContent = ((this.currentPage - 1) * this.pageSize) + 1;
        if (showingTo) showingTo.textContent = Math.min(this.currentPage * this.pageSize, totalRecords);
        if (totalRecordsEl) totalRecordsEl.textContent = totalRecords;

        if (prevBtn) prevBtn.disabled = this.currentPage <= 1;
        if (nextBtn) nextBtn.disabled = this.currentPage >= totalPages;

        // Render page numbers
        if (paginationPages) {
            let pagesHtml = '';
            const maxVisible = 5;
            let startPage = Math.max(1, this.currentPage - 2);
            let endPage = Math.min(totalPages, startPage + maxVisible - 1);

            if (endPage - startPage < maxVisible - 1) {
                startPage = Math.max(1, endPage - maxVisible + 1);
            }

            if (startPage > 1) {
                pagesHtml += `<button class="pagination-btn" data-page="1">1</button>`;
                if (startPage > 2) pagesHtml += `<span class="pagination-dots">...</span>`;
            }

            for (let i = startPage; i <= endPage; i++) {
                pagesHtml += `<button class="pagination-btn${i === this.currentPage ? ' active' : ''}" data-page="${i}">${i}</button>`;
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) pagesHtml += `<span class="pagination-dots">...</span>`;
                pagesHtml += `<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;
            }

            paginationPages.innerHTML = pagesHtml;

            // Add click handlers
            paginationPages.querySelectorAll('.pagination-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.currentPage = parseInt(btn.dataset.page);
                    this.loadLogs();
                });
            });
        }
    }

    showLogDetail(logId) {
        const log = window.syncLogger.getLogById(logId);
        if (!log) return;

        this.selectedLog = log;

        const modal = document.getElementById('logDetailModal');
        const statusIcon = document.getElementById('modalStatusIcon');
        const title = document.getElementById('modalTitle');

        // Update status icon
        statusIcon.className = `log-status-icon ${log.status}`;
        statusIcon.innerHTML = this.getStatusIcon(log.status);

        // Update title
        title.textContent = `${log.action} - ${this.capitalizeFirst(log.integration)}`;

        // Update details
        const date = new Date(log.timestamp);
        document.getElementById('modalTimestamp').textContent = date.toLocaleString();
        document.getElementById('modalIntegration').textContent = this.capitalizeFirst(log.integration);
        document.getElementById('modalAction').textContent = log.action;
        document.getElementById('modalDuration').textContent = window.syncLogger.formatDuration(log.duration);
        document.getElementById('modalRecords').textContent = log.records.toLocaleString();
        document.getElementById('modalStatus').textContent = this.capitalizeFirst(log.status);
        document.getElementById('modalSummary').textContent = log.summary;
        document.getElementById('modalTechnicalLog').textContent = log.details;

        // Show/hide error section
        const errorSection = document.getElementById('errorSection');
        const retryBtn = document.getElementById('retryBtn');

        if (log.status === 'error' && log.error) {
            errorSection.style.display = 'block';
            document.getElementById('modalErrorCode').textContent = log.error.code;
            document.getElementById('modalErrorMessage').textContent = log.error.message;
            document.getElementById('modalErrorSuggestion').textContent = log.error.suggestion;
            retryBtn.style.display = 'inline-flex';
        } else {
            errorSection.style.display = 'none';
            retryBtn.style.display = 'none';
        }

        // Mark as read
        window.syncLogger.markAsRead(logId);

        // Show modal
        modal.classList.add('show');
    }

    closeModal() {
        const modal = document.getElementById('logDetailModal');
        modal?.classList.remove('show');
        this.selectedLog = null;
    }

    copyLogToClipboard() {
        if (!this.selectedLog) return;

        const logText = `
Sync Log Details
================
Timestamp: ${new Date(this.selectedLog.timestamp).toLocaleString()}
Integration: ${this.selectedLog.integration}
Action: ${this.selectedLog.action}
Status: ${this.selectedLog.status}
Records: ${this.selectedLog.records}
Duration: ${window.syncLogger.formatDuration(this.selectedLog.duration)}

Summary:
${this.selectedLog.summary}

${this.selectedLog.error ? `Error:
Code: ${this.selectedLog.error.code}
Message: ${this.selectedLog.error.message}
Suggestion: ${this.selectedLog.error.suggestion}

` : ''}Technical Log:
${this.selectedLog.details}
        `.trim();

        navigator.clipboard.writeText(logText).then(() => {
            this.showToast('Log copied to clipboard', 'success');
        }).catch(() => {
            this.showToast('Failed to copy log', 'error');
        });
    }

    retrySync() {
        if (!this.selectedLog) return;

        this.showToast(`Retrying ${this.selectedLog.integration} sync...`, 'info');
        this.closeModal();

        // Simulate retry
        setTimeout(() => {
            window.syncLogger.logSuccess(
                this.selectedLog.integration,
                'Retry Sync',
                Math.floor(Math.random() * 200) + 1100,
                Math.floor(Math.random() * 2000) + 1500,
                'Retry sync completed successfully'
            );
            this.loadLogs();
            this.loadStats();
            this.showToast('Sync completed successfully!', 'success');
        }, 2000);
    }

    exportLogs() {
        const logs = window.syncLogger.getFilteredLogs(this.filters);

        const headers = ['Timestamp', 'Integration', 'Action', 'Status', 'Records', 'Duration (ms)', 'Summary'];
        let csv = headers.join(',') + '\n';

        logs.forEach(log => {
            csv += `"${log.timestamp}","${log.integration}","${log.action}","${log.status}",${log.records},${log.duration},"${log.summary.replace(/"/g, '""')}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sync_logs_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        this.showToast('Logs exported successfully', 'success');
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `<span>${message}</span>`;

        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.logsPage = new LogsPage();
});

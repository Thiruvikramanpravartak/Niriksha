export const auditQueries = {
  getLatestAuditLogs: 'SELECT id, action, username, created_at FROM admin_audit_log ORDER BY id DESC LIMIT $1',
  getLogsByAction: 'SELECT id, action, username, created_at FROM admin_audit_log WHERE action = $1',
} as const;

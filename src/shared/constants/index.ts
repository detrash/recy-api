export const AuditStatusConstants = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;

// TODO: return this messages to clients
export const AuditStatusMessages = {
  [AuditStatusConstants.PENDING]: 'The report is awaiting audit approval.',
  [AuditStatusConstants.APPROVED]:
    'The report has been approved after the audit.',
  [AuditStatusConstants.REJECTED]:
    'The report has been rejected after the audit.',
  [AuditStatusConstants.COMPLETED]:
    'Audit was successful, and blockchain tokens have been created.',
  [AuditStatusConstants.FAILED]:
    'Audit was approved, but blockchain token creation failed.',
} as const;

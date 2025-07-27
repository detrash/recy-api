import z from 'zod';

import { AuditStatusConstants } from '@/shared/constants';

// Schema for updating an audit
export const UpdateAuditSchema = z.object({
  auditorId: z.string().min(1, { message: 'auditorId cannot be empty' }),
  comments: z.string().optional(),
  status: z.enum(
    [
      AuditStatusConstants.PENDING,
      AuditStatusConstants.APPROVED,
      AuditStatusConstants.REJECTED,
      AuditStatusConstants.COMPLETED,
      AuditStatusConstants.FAILED,
    ],
    { message: 'Invalid status' }
  ),
});

export type UpdateAuditDto = z.infer<typeof UpdateAuditSchema>;

import z from 'zod';

import { AuditStatusConstants } from '@/shared/constants';

// DTO schema for creating an audit, only requires the status
export const CreateAuditSchema = z.object({
  reportId: z.string().min(1, { message: 'reportId cannot be empty' }),
  auditorId: z.string().nullable(),
  comments: z.string().optional(),
  status: z.enum(
    [
      AuditStatusConstants.PENDING,
      AuditStatusConstants.APPROVED,
      AuditStatusConstants.REJECTED,
      AuditStatusConstants.COMPLETED,
      AuditStatusConstants.FAILED,
    ],
    { message: 'Invalid status' },
  ),
});

export type CreateAuditDto = z.infer<typeof CreateAuditSchema>;

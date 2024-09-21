import { z } from 'zod';
import { CreateAuditSchema } from './create-audit.dto';

export const UpdateAuditSchema = z.object({
  audited: z.boolean().optional(),
  comments: z.string().optional().nullable(),
});

export type UpdateAuditDto = z.infer<typeof UpdateAuditSchema>;

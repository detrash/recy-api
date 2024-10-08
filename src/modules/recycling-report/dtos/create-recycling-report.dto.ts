import { z } from 'zod';

import { ResidueType } from './residue-type.enum';

const MaterialSchema = z.object({
  materialType: z.nativeEnum(ResidueType),
  weightKg: z.number().nonnegative(),
});

export const CreateRecyclingReportSchema = z.object({
  submittedBy: z.string().min(1),
  reportDate: z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
  }, z.date()),
  phone: z.string().optional(),
  materials: z.array(MaterialSchema),
  walletAddress: z.string().optional(),
  evidenceUrl: z.string().url(),
});

export type CreateRecyclingReportDto = z.infer<
  typeof CreateRecyclingReportSchema
>;

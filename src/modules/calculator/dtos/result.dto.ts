import { z } from 'zod';

export const ResultDtoSchema = z.object({
  walletAddress: z.string({ message: 'walletAddress must be a string' }),
  cRecys: z.number({ message: 'cRecys must be a number' }),
  wasteFootprint: z
    .number({ message: 'wasteFootprint must be a number' })
    .min(1, { message: 'wasteFootprint cannot be empty' }),
});

export type ResultDto = z.infer<typeof ResultDtoSchema>;

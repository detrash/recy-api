import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

import { ResidueType } from './residue-type.enum';

export const MaterialSchema = z
  .record(
    z.nativeEnum(ResidueType),
    z.number().positive('Weight must be a positive number greater than 0'),
  )
  .refine((materials) => Object.keys(materials).length > 0, {
    message: 'Materials cannot be empty',
  });

export const CreateRecyclingReportSchema = z
  .object({
    submittedBy: z.string().min(1, 'Submitter name cannot be empty'),
    reportDate: z
      .string()
      .optional()
      .refine(
        (val) => !val || !isNaN(new Date(val).getTime()),
        'Report date must be valid',
      )
      .transform((val) => (val ? new Date(val) : undefined))
      .refine(
        (date) => !date || date <= new Date(),
        'Report date cannot be in the future',
      ),
    phone: z.string().optional(),
    materials: MaterialSchema.refine(
      (materials) => Object.values(materials).every((weight) => weight > 0),
      'All material weights must be positive',
    ),
    walletAddress: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid EVM wallet address format')
      .or(z.literal(''))
      .optional(),
    residueEvidence: z
      .string()
      .url('Invalid URL format')
      .refine(
        (url) => url.startsWith('https://'),
        'Evidence URL must start with https',
      )
      .optional(),
    residueEvidenceFile: z
      .instanceof(Buffer)
      .refine((buffer) => buffer.length > 0, 'File content cannot be empty')
      .optional(),
  })
  .refine((data) => data.residueEvidence || data.residueEvidenceFile, {
    message: 'Either residueEvidenceFile or residueEvidence must be provided.',
    path: ['residueEvidenceFile', 'residueEvidence'],
  });

export type CreateRecyclingReportDto = z.infer<
  typeof CreateRecyclingReportSchema
>;

export class CreateRecyclingReportSwaggerDto {
  @ApiProperty()
  submittedBy: string;

  @ApiProperty({ required: false, type: Date })
  reportDate?: Date;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({
    type: Object,
    description:
      'Object with residue types as keys and corresponding weight in kg as values',
    additionalProperties: { type: 'number' },
  })
  materials: Record<ResidueType, number>;

  @ApiProperty({ required: false, type: String })
  walletAddress?: string;

  @ApiProperty({ required: false, type: String })
  residueEvidence?: string;

  @ApiProperty({ required: false, type: Buffer })
  residueEvidenceFile?: Buffer;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

export class CreateRecyclingReportSwaggerDto {
  @ApiProperty({
    description: 'ID of the user submitting the report',
    example: '1',
  })
  submittedBy: string;

  @ApiProperty({
    description: 'Date when the report was submitted',
    example: '2024-01-01T00:00:00.000Z',
  })
  reportDate: Date;

  @ApiPropertyOptional({
    description: "User's phone number",
    example: '+1 234 567 8901',
  })
  phone?: string;

  @ApiProperty({
    description: 'Recycled materials with type and weight in kilograms',
    example: [
      { materialType: ResidueType.PLASTIC, weightKg: 12.5 },
      { materialType: ResidueType.METAL, weightKg: 7.3 },
    ],
  })
  materials: { materialType: ResidueType; weightKg: number }[];

  @ApiPropertyOptional({
    description: 'Wallet address for recycling credits',
    example: '0xABC123...',
  })
  walletAddress?: string;

  @ApiProperty({
    description: 'URL for report evidence',
    example: 'https://example.com/evidence.jpg',
  })
  evidenceUrl: string;
}

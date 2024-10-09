import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { ResidueType } from './residue-type.enum';

export class CreateRecyclingReportDto {
  @IsNotEmpty()
  @IsString()
  submittedBy: string;

  @IsNotEmpty()
  @Type(() => Date)
  reportDate: Date;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MaterialDto)
  materials: MaterialDto[];

  @IsOptional()
  @IsString()
  walletAddress?: string;

  @IsNotEmpty()
  @IsString()
  evidenceUrl: string;
}

class MaterialDto {
  @IsNotEmpty()
  @IsEnum(ResidueType)
  materialType: ResidueType;

  @IsNotEmpty()
  @IsNumber()
  weightKg: number;
}

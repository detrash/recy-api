import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
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
  @IsNumber()
  submittedBy: number | bigint;

  @IsNotEmpty()
  @Type(() => Date)
  reportDate: Date;

  @IsNotEmpty()
  @IsBoolean()
  audited: boolean;

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

export class MaterialDto {
  @IsNotEmpty()
  @IsEnum(ResidueType)
  materialType: ResidueType;

  @IsNotEmpty()
  @IsNumber()
  weightKg: number;
}

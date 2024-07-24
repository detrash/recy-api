import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

import { Document } from '@/documents';
import { Timestamp } from '@/dto/timestamp.dto';
import { ToBoolean } from '@/util/to-boolean';
export class Form extends Timestamp {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '0000742d-ee03-463b-a558-d79728f8a171',
  })
  id: string;

  @IsNotEmpty()
  @IsBoolean()
  @ToBoolean()
  @ApiProperty({
    example: true,
  })
  isFormAuthorizedByAdmin: boolean;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((object, value) => value !== null)
  @ApiProperty({
    example: '0xfCA6c2f1fa695D17dEd51779526F50BbdB9Aee30',
  })
  walletAddress: string | null;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'https://example.com/metadata.json',
  })
  formMetadataUrl: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '0000742d-ee03-463b-a558-d79728f8a171',
  })
  userId: string;

  @IsOptional()
  @IsArray()
  @Type(() => Document)
  documents?: Document[];
}

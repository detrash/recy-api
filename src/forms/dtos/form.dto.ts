import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
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
import { User } from '@/users';
import { ToBoolean } from '@/util/to-boolean';

@ObjectType()
export class Form extends Timestamp {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '0000742d-ee03-463b-a558-d79728f8a171',
  })
  @Field(() => ID)
  id: string;

  @IsNotEmpty()
  @IsBoolean()
  @ToBoolean()
  @ValidateIf((object, value) => value !== null)
  @ApiProperty({
    example: true,
  })
  @Field({ nullable: true })
  isFormAuthorizedByAdmin: boolean | null;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((object, value) => value !== null)
  @ApiProperty({
    example: '0xfCA6c2f1fa695D17dEd51779526F50BbdB9Aee30',
  })
  @Field({ nullable: true })
  walletAddress: string | null;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((object, value) => value !== null)
  @ApiProperty({
    example: 'https://example.com/metadata.json',
  })
  @Field({ nullable: true })
  formMetadataUrl: string | null;

  @ApiHideProperty()
  @Field(() => User)
  user: User;

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

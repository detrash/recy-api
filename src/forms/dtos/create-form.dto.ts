import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

import { ResidueType } from '@/documents';

import { Form } from './form.dto';

@InputType()
export class ResidueInput {
  @Field(() => Float, { nullable: true })
  amount: number;

  @Field({ nullable: true })
  videoFileName?: string;

  @Field(() => [String])
  invoicesFileName: string[];
}

@ObjectType()
export class S3 {
  @Field({ nullable: true })
  videoCreateUrl: string;

  @Field({ nullable: true })
  videoFileName: string;

  @Field(() => [String])
  invoicesCreateUrl: string[];

  @Field(() => [String])
  invoicesFileName: string[];

  @Field(() => ResidueType)
  residue: ResidueType;
}

@InputType()
export class CreateFormDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'google-oauth2|104364323610927340190',
  })
  @Field({ description: 'Auth0 User ID' })
  authUserId: string;

  @Type(() => ResidueInput)
  @ApiPropertyOptional({
    type: ResidueInput,
  })
  @Field(() => ResidueInput, { nullable: true })
  [ResidueType.GLASS]?: ResidueInput;

  @Type(() => ResidueInput)
  @ApiPropertyOptional({
    type: ResidueInput,
  })
  @Field(() => ResidueInput, { nullable: true })
  [ResidueType.METAL]?: ResidueInput;

  @Type(() => ResidueInput)
  @ApiPropertyOptional({
    type: ResidueInput,
  })
  @Field(() => ResidueInput, { nullable: true })
  [ResidueType.ORGANIC]?: ResidueInput;

  @Type(() => ResidueInput)
  @ApiPropertyOptional({
    type: ResidueInput,
  })
  @Field(() => ResidueInput, { nullable: true })
  [ResidueType.PAPER]?: ResidueInput;

  @Type(() => ResidueInput)
  @ApiPropertyOptional({
    type: ResidueInput,
  })
  @Field(() => ResidueInput, { nullable: true })
  [ResidueType.PLASTIC]?: ResidueInput;

  @Type(() => ResidueInput)
  @ApiPropertyOptional({
    type: ResidueInput,
  })
  @Field(() => ResidueInput, { nullable: true })
  [ResidueType.TEXTILE]?: ResidueInput;

  @Type(() => ResidueInput)
  @ApiPropertyOptional({
    type: ResidueInput,
  })
  @Field(() => ResidueInput, { nullable: true })
  [ResidueType.LANDFILL_WASTE]?: ResidueInput;

  @Field({ nullable: true })
  walletAddress?: string;
}

@ObjectType()
export class CreateFormResponse {
  @Field(() => Form)
  form: Form;

  @Field(() => [S3], {
    description: 'Field regarding informations on AWS S3',
    nullable: true,
  })
  s3?: S3[];
}

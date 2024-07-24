import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

@ObjectType()
export class Timestamp {
  @IsString()
  @ApiProperty({ type: Date })
  @Field(() => Date)
  createdAt: string;

  @IsString()
  @ApiProperty({ type: Date })
  @Field(() => Date)
  updatedAt: string;
}

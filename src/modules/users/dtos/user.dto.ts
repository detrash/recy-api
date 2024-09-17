import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

@ObjectType()
export class User {
  @ApiProperty({ example: 1 })
  @Field()
  id: number;

  @ApiProperty({ example: 'Jhon Doe' })
  @Field()
  name: string;

  @ApiProperty({ example: 'jhon@example.com' })
  @IsEmail()
  @Field()
  email: string;

  @ApiProperty({ example: '2223334444', required: false })
  @Field({ nullable: true })
  phone?: string;

  @ApiProperty({ example: '0x12345...', required: false })
  @Field({ nullable: true })
  walletAddress?: string;

  @IsString()
  @ApiProperty({ type: Date })
  @Field(() => Date)
  createdAt: string;

  @IsString()
  @ApiProperty({ type: Date })
  @Field(() => Date)
  updatedAt: string;

}
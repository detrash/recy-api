import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { ProfileType } from './user.dto';

@InputType()
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'google-oauth2|104364323610927340190',
  })
  @Field({ description: 'Auth0 User ID' })
  authUserId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Jhon Doe',
  })
  @Field()
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'jhon@example.com',
  })
  @Field()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '2223334444',
  })
  @Field()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => ProfileType)
  profileType: ProfileType;
}

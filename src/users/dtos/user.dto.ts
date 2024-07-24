import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { Timestamp } from '@/dto/timestamp.dto';
import { Form } from '@/forms/dtos/form.dto';

export enum ProfileType {
  HODLER = 'HODLER',
  RECYCLER = 'RECYCLER',
  WASTE_GENERATOR = 'WASTE_GENERATOR',
}

registerEnumType(ProfileType, {
  name: 'ProfileType',
  description: 'Represents the user type',
});

@ObjectType()
export class User extends Timestamp {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '0000742d-ee03-463b-a558-d79728f8a171',
  })
  @Field(() => ID)
  id: string;

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
    example: 'jhon@examp.com',
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

  @ApiHideProperty()
  @Field(() => [Form])
  forms: Form[];
}

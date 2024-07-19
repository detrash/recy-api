import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { Timestamp } from '@/dto/timestamp.dto';

export enum ProfileType {
  HODLER = 'HODLER',
  RECYCLER = 'RECYCLER',
  WASTE_GENERATOR = 'WASTE_GENERATOR',
}

export class User extends Timestamp {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '0000742d-ee03-463b-a558-d79728f8a171',
  })
  id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'google-oauth2|104364323610927340190',
  })
  authUserId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Jhon Doe',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'jhon@examp.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '2223334444',
  })
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  profileType: ProfileType;
}

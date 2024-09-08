import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, isNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Jhon Doe' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'jhon@example.com' })
  email: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '2223334444', required: false })
  phone?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '0x12345...', required: false })
  walletAddress?: string;

}
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SupportDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  company_type: string;

  @IsNumber()
  @IsNotEmpty()
  employees_quantity: number;

  @IsNumber()
  @IsNotEmpty()
  waste_foot_print: number;
}

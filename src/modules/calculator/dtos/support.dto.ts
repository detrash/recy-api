import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SupportDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  companyType: string;

  @IsNumber()
  @IsNotEmpty()
  employeesQuantity: number;

  @IsNumber()
  @IsNotEmpty()
  wasteFootPrint: number;
}

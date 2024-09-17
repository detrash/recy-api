import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAuditDto {
  @IsNotEmpty()
  @IsNumber()
  reportId: number;

  @IsNotEmpty()
  @IsBoolean()
  audited: boolean;

  @IsNotEmpty()
  @IsNumber()
  auditorId: number;

  @IsString()
  comments?: string;
}

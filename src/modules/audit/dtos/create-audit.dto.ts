import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAuditDto {
  @IsNotEmpty()
  @IsNumber()
  reportId: string;

  @IsNotEmpty()
  @IsBoolean()
  audited: boolean;

  @IsNotEmpty()
  @IsNumber()
  auditorId: string;

  @IsString()
  comments?: string;
}

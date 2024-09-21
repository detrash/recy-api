import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateAuditDto {
  @IsNotEmpty()
  @IsString()
  reportId: string;

  @IsNotEmpty()
  @IsBoolean()
  audited: boolean;

  @IsNotEmpty()
  @IsString()
  auditorId: string;

  @IsString()
  comments?: string;
}

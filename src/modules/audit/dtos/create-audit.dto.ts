import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAuditDto {
  @IsNotEmpty()
  @IsNumber()
  reportId: bigint;

  @IsNotEmpty()
  @IsNumber()
  auditorId: bigint;

  @IsString()
  comments?: string;
}

import { IsOptional, IsString } from 'class-validator';

export class UpdateAuditDto {
  @IsOptional()
  @IsString()
  comments?: string;
}

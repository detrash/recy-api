import { IsOptional, IsString } from 'class-validator';

export class UpdateRecyclerDto {
  @IsOptional()
  @IsString()
  organizationName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  walletAddress?: string;
}

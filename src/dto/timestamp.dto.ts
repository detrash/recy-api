import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class Timestamp {
  @IsString()
  @ApiProperty({ type: Date })
  createdAt: string;

  @IsString()
  @ApiProperty({ type: Date })
  updatedAt: string;
}

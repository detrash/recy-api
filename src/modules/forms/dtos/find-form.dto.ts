import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

import { PaginationQuery } from '@/shared/dto/dto/paginated.dto';
import { ToBoolean } from '@/shared/utils/to-boolean';

import { Form } from './form.dto';

export class FindFormDto extends PaginationQuery(
  PartialType(OmitType(Form, ['documents', 'user'] as const)),
) {
  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  @ApiProperty({
    description: 'Include documents property in the form object',
    default: false,
  })
  includeDocuments?: boolean = false;
}

import { PartialType } from '@nestjs/mapped-types';

import { CreateRecyclingReportDto } from './create-recycling-report.dto';

export class UpdateRecyclingReportDto extends PartialType(
  CreateRecyclingReportDto,
) {}

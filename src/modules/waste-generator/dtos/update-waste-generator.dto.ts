import { PartialType } from '@nestjs/mapped-types';

import { CreateWasteGeneratorDto } from './create-waste-generator.dto';

export class UpdateWasteGeneratorDto extends PartialType(
  CreateWasteGeneratorDto,
) {}

import { PartialType } from '@nestjs/mapped-types';

import { CreateAuditorDto } from './create-auditor.dto';

export class UpdateAuditorDto extends PartialType(CreateAuditorDto) {}

import { OmitType, PartialType } from '@nestjs/swagger';

import { PaginationQuery } from '@/dto/paginated.dto';

import { User } from './user.dto';

export class FindUserDto extends PaginationQuery(
  PartialType(OmitType(User, ['forms'] as const)),
) {}

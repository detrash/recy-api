import { OmitType, PartialType } from '@nestjs/swagger';
import { User } from './user.dto';
import { PaginationQuery } from '@/helpers/pagination';

export class FindUserDto extends PaginationQuery(
  // PartialType(OmitType(User, ['forms'] as const)),
  PartialType(User),
) { }
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { ResultDto, RoleDto } from './dtos';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async getRoles(): Promise<ResultDto> {
    const roles = await this.prisma.role.findMany();

    const formattedRoles: RoleDto[] = roles.map((role) => ({
      id: role.id,
      name: role.name,
    }));

    return { roles: formattedRoles };
  }
}

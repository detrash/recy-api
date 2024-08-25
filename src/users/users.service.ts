import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { MessagesHelper } from 'src/helpers/messages.helper';
import { getFilters } from 'src/util/getFilters';

import { ListFiltersInput } from '@/graphql/inputs/list-filters-input';
import { UpdateUserInput } from '@/graphql/inputs/update-user-input';

import { CreateUserDto } from './dtos';
import { FindUserDto } from './dtos/find-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  updateLastLogin(authUserId: string) {
    return this.prisma.user.update({
      where: {
        authUserId,
      },
      data: {
        lastLoginDate: new Date(),
      },
    });
  }

  async createUser({ authUserId, ...userInfo }: CreateUserDto) {
    const userExists = await this.prisma.user.findUnique({
      where: {
        authUserId,
      },
    });

    if (userExists) {
      throw new BadRequestException(MessagesHelper.USER_EXISTS);
    }

    const user = await this.prisma.user.create({
      data: {
        authUserId,
        ...userInfo,
      },
    });

    return user;
  }

  async updateUser({ authUserId, profileType }: UpdateUserInput) {
    const currentUser = await this.findUserByAuthUserId(authUserId);

    if (profileType) {
      return this.prisma.user.update({
        where: {
          authUserId,
        },
        data: {
          profileType,
        },
      });
    }

    return currentUser;
  }

  /**
   *
   * @deprecated Use `findAllNew` instead
   */
  async findAll(filters?: ListFiltersInput) {
    let filterOptions = [];

    if (filters) {
      filterOptions = getFilters(filters);
    }

    return this.prisma.user.findMany({
      where: {
        AND: filterOptions,
      },
    });
  }

  async findAllNew(args: FindUserDto) {
    const { page, limit, orderBy, sortBy, ...filters } = args;

    const users = await this.prisma.user.findMany({
      where: filters,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        [sortBy]: orderBy,
      },
    });

    const total = await this.prisma.user.count({
      where: filters,
    });

    return {
      data: users,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findUserByAuthUserId(authUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        authUserId,
      },
    });

    if (!user) throw new NotFoundException(MessagesHelper.USER_NOT_FOUND);

    await this.updateLastLogin(authUserId);
    return user;
  }

  async findUserByUserId(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException(MessagesHelper.USER_NOT_FOUND);

    return user;
  }

  async findAllFormsByUser(userId: string, args: FindUserDto) {
    const { page, limit, orderBy, sortBy, ...filters } = args;

    const forms = await this.prisma.form.findMany({
      where: {
        ...filters,
        userId,
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        [sortBy]: orderBy,
      },
    });

    const total = await this.prisma.form.count({
      where: {
        ...filters,
        userId,
      },
    });

    return {
      data: forms,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

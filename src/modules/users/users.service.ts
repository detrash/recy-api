import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateUserDto, UpdateUserDto, FindUserDto } from './dtos';
import { PrismaService } from '@/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async createUser(createUserDto: CreateUserDto) {
    const { email } = createUserDto;

    const userExists = await this.prisma.user.findUnique({ where: { email } });
    if (userExists) {
      throw new BadRequestException('User with this email already exists.');
    }

    const user = await this.prisma.user.create({
      data: createUserDto,
    });

    return user;
  }

  async updateUser(updateUserDto: UpdateUserDto) {
    const { id } = updateUserDto;

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async findUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException('User not found.');

    return { ...user, id: Number(user.id) };
  }

  async findAll(args: FindUserDto) {
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

}
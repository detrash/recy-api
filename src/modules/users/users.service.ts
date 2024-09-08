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
      include: {
        auditors: true,
        partners: true,
        recyclers: true,
        recyclingReports: true,
        wasteGenerators: true,
      },
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
      include: {
        auditors: true,
        partners: true,
        recyclers: true,
        recyclingReports: true,
        wasteGenerators: true,
      },
    });
  }

  async findUserById(id: bigint) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        auditors: true,
        partners: true,
        recyclers: true,
        recyclingReports: true,
        wasteGenerators: true,
      },
    });

    if (!user) throw new NotFoundException('User not found.');

    return user;
  }

  async findAll(queryParams: FindUserDto) {
    const { page, limit, ...filters } = queryParams;

    const users = await this.prisma.user.findMany({
      where: filters,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        auditors: true,
        partners: true,
        recyclers: true,
        recyclingReports: true,
        wasteGenerators: true,
      },
    });

    const total = await this.prisma.user.count({ where: filters });

    return {
      data: users,
      pagination: {
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    };
  }
}
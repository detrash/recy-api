import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Auditor, User } from '@prisma/client';

import { PrismaService } from '@/modules/prisma/prisma.service';

import { UserService } from '../user/user.service';
import { CreateAuditorDto } from './dtos/create-auditor.dto';
import { UpdateAuditorDto } from './dtos/update-auditor.dto';

@Injectable()
export class AuditorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async createAuditor(createAuditorDto: CreateAuditorDto): Promise<Auditor> {
    const { email, name, organizationName, phone, walletAddress } =
      createAuditorDto;

    let user: User;
    try {
      user = await this.userService.findUserByEmail(email);
    } catch (error) {
      if (error instanceof NotFoundException) {
        user = await this.userService.createUser({
          email,
          name,
          phone,
          walletAddress,
        });
      } else {
        throw error;
      }
    }

    const existingAuditor = await this.prisma.auditor.findUnique({
      where: { userId: user.id },
    });

    if (existingAuditor) {
      throw new ConflictException(
        `An Auditor already exists for User with ID ${user.id}`,
      );
    }

    return this.prisma.auditor.create({
      data: {
        phone,
        walletAddress,
        organizationName,
        user: { connect: { id: user.id } },
      },
    });
  }

  async findAllAuditors(): Promise<Auditor[]> {
    return this.prisma.auditor.findMany();
  }

  async findAuditorById(id: number): Promise<Auditor | null> {
    return this.prisma.auditor.findUnique({ where: { id } });
  }

  async updateAuditor(
    id: number,
    updateAuditorDto: UpdateAuditorDto,
  ): Promise<Auditor> {
    return this.prisma.auditor.update({
      where: { id },
      data: updateAuditorDto,
    });
  }

  async deleteAuditor(id: number): Promise<Auditor> {
    const auditor = await this.prisma.auditor.findUnique({
      where: { id },
    });

    if (!auditor) {
      throw new NotFoundException(`Auditor with ID ${id} not found.`);
    }

    return this.prisma.auditor.delete({
      where: { id },
    });
  }
}

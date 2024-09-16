import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Auditor, User } from '@prisma/client';

import { PrismaService } from '@/modules/prisma/prisma.service';

import { CreateAuditorDto } from './dtos/create-auditor.dto';
import { UpdateAuditorDto } from './dtos/update-auditor.dto';

@Injectable()
export class AuditorService {
  constructor(private readonly prisma: PrismaService) {}

  async createAuditor(createAuditorDto: CreateAuditorDto): Promise<Auditor> {
    const { email, name, organizationName, phone, walletAddress } =
      createAuditorDto;

    let user: User;

    try {
      user = await this.prisma.user.findUnique({
        where: { email: email },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            name: name,
            email: email,
            phone: phone,
            walletAddress: walletAddress,
          },
        });
      }
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(`User with email ${email} already exists.`);
      }
      throw error;
    }
    const existingAuditor = await this.prisma.auditor.findUnique({
      where: { userId: user.id },
    });

    if (existingAuditor) {
      throw new ConflictException(
        `A Auditor already exists for User with ID ${user.id}`,
      );
    }

    return this.prisma.auditor.create({
      data: {
        phone: phone,
        walletAddress: walletAddress,
        organizationName: organizationName,
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
    const Auditor = await this.prisma.auditor.findUnique({
      where: { id },
    });

    if (!Auditor) {
      throw new NotFoundException(`Auditor with ID ${id} not found.`);
    }

    return this.prisma.auditor.delete({
      where: { id },
    });
  }
}

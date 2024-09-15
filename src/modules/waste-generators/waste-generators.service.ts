import { ConflictException, Injectable } from '@nestjs/common';
import { Partner, User } from '@prisma/client';

import { PrismaService } from '@/modules/prisma/prisma.service';

import { CreatePartnerDto } from './dtos/create-waste-generator.dto';
import { UpdatePartnerDto } from './dtos/update-waste-generator.dto';

@Injectable()
export class PartnerService {
  constructor(private readonly prisma: PrismaService) {}

  async createPartner(createPartnerDto: CreatePartnerDto): Promise<Partner> {
    if (!createPartnerDto.organizationName) {
      throw new ConflictException('Organization Name is required');
    }

    if (!createPartnerDto.name) {
      throw new ConflictException('Name is required');
    }

    if (!createPartnerDto.email) {
      throw new ConflictException('Email is required');
    }

    let user: User;

    try {
      user = await this.prisma.user.findUnique({
        where: { email: createPartnerDto.email },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            name: createPartnerDto.name,
            email: createPartnerDto.email,
            phone: createPartnerDto.phone,
            walletAddress: createPartnerDto.walletAddress,
          },
        });
      }
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `User with email ${createPartnerDto.email} already exists.`,
        );
      }
      throw error;
    }
    const existingPartner = await this.prisma.partner.findUnique({
      where: { userId: user.id },
    });

    if (existingPartner) {
      throw new ConflictException(
        `A Partner already exists for User with ID ${user.id}`,
      );
    }

    return this.prisma.partner.create({
      data: {
        phone: createPartnerDto.phone,
        walletAddress: createPartnerDto.walletAddress,
        organizationName: createPartnerDto.organizationName,
        user: { connect: { id: user.id } },
      },
    });
  }

  async findAllPartners(): Promise<Partner[]> {
    return this.prisma.partner.findMany();
  }

  async findPartnerById(id: number): Promise<Partner | null> {
    return this.prisma.partner.findUnique({ where: { id } });
  }

  async updatePartner(
    id: number,
    updatePartnerDto: UpdatePartnerDto,
  ): Promise<Partner> {
    return this.prisma.partner.update({
      where: { id },
      data: updatePartnerDto,
    });
  }

  async deletePartner(id: number): Promise<Partner> {
    return this.prisma.partner.delete({
      where: { id },
    });
  }
}

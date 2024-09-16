import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Partner, User } from '@prisma/client';

import { PrismaService } from '@/modules/prisma/prisma.service';

import { CreatePartnerDto } from './dtos/create-partner.dto';
import { UpdatePartnerDto } from './dtos/update-partner.dto';

@Injectable()
export class PartnerService {
  constructor(private readonly prisma: PrismaService) {}

  async createPartner(createPartnerDto: CreatePartnerDto): Promise<Partner> {
    const { email, name, organizationName, phone, walletAddress } =
      createPartnerDto;

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
    const existingPartner = await this.prisma.partner.findFirst({
      where: { userId: user.id },
    });

    if (existingPartner) {
      throw new ConflictException(
        `A Partner already exists for User with ID ${user.id}`,
      );
    }

    return this.prisma.partner.create({
      data: {
        phone: phone,
        walletAddress: walletAddress,
        organizationName: organizationName,
        user: { connect: { id: user.id } },
      },
    });
  }

  async findAllPartners(): Promise<Partner[]> {
    return this.prisma.partner.findMany();
  }

  async findPartnerById(id: number): Promise<Partner | null> {
    return this.prisma.partner.findFirst({ where: { id } });
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
    const partner = await this.prisma.partner.findUnique({
      where: { id },
    });

    if (!partner) {
      throw new NotFoundException(`Partner with ID ${id} not found.`);
    }

    return this.prisma.partner.delete({
      where: { id },
    });
  }
}

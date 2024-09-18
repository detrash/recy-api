import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Partner, User } from '@prisma/client';

import { PrismaService } from '@/modules/prisma/prisma.service';

import { UserService } from '../user/user.service';
import { CreatePartnerDto } from './dtos/create-partner.dto';
import { UpdatePartnerDto } from './dtos/update-partner.dto';

@Injectable()
export class PartnerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async createPartner(createPartnerDto: CreatePartnerDto): Promise<Partner> {
    const { email, name, organizationName, phone, walletAddress } =
      createPartnerDto;

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
        phone,
        walletAddress,
        organizationName,
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
    const partner = await this.prisma.partner.findUnique({
      where: { id },
    });

    if (!partner) {
      throw new NotFoundException(`Partner with ID ${id} not found.`);
    }

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

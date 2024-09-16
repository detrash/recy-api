import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, WasteGenerator } from '@prisma/client';

import { PrismaService } from '@/modules/prisma/prisma.service';

import { CreateWasteGeneratorDto } from './dtos/create-waste-generator.dto';
import { UpdateWasteGeneratorDto } from './dtos/update-waste-generator.dto';

@Injectable()
export class WasteGeneratorService {
  constructor(private readonly prisma: PrismaService) {}

  async createWasteGenerator(
    createWasteGeneratorDto: CreateWasteGeneratorDto,
  ): Promise<WasteGenerator> {
    const { email, name, organizationName, phone, walletAddress } =
      createWasteGeneratorDto;

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
    const existingWasteGenerator = await this.prisma.wasteGenerator.findUnique({
      where: { userId: user.id },
    });

    if (existingWasteGenerator) {
      throw new ConflictException(
        `A Waste Generator already exists for User with ID ${user.id}`,
      );
    }

    return this.prisma.wasteGenerator.create({
      data: {
        phone: phone,
        walletAddress: walletAddress,
        organizationName: organizationName,
        user: { connect: { id: user.id } },
      },
    });
  }

  async findAllWasteGenerators(): Promise<WasteGenerator[]> {
    return this.prisma.wasteGenerator.findMany();
  }

  async findWasteGeneratorById(id: number): Promise<WasteGenerator | null> {
    return this.prisma.wasteGenerator.findUnique({ where: { id } });
  }

  async updateWasteGenerator(
    id: number,
    updateWasteGeneratorDto: UpdateWasteGeneratorDto,
  ): Promise<WasteGenerator> {
    const wasteGenerator = await this.prisma.wasteGenerator.findUnique({
      where: { id },
    });

    if (!wasteGenerator) {
      throw new NotFoundException(`Waste generator with ID ${id} not found.`);
    }

    return this.prisma.wasteGenerator.update({
      where: { id },
      data: updateWasteGeneratorDto,
    });
  }

  async deleteWasteGenerator(id: number): Promise<WasteGenerator> {
    const wasteGenerator = await this.prisma.wasteGenerator.findUnique({
      where: { id },
    });

    if (!wasteGenerator) {
      throw new NotFoundException(`Waste generator with ID ${id} not found.`);
    }

    return this.prisma.wasteGenerator.delete({
      where: { id },
    });
  }
}

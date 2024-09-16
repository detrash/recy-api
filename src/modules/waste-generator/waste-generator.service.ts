import { ConflictException, Injectable } from '@nestjs/common';
import { User, WasteGenerator } from '@prisma/client';

import { PrismaService } from '@/modules/prisma/prisma.service';

import { CreateWasteGeneratorDto } from './dtos/create-waste-generator.dto';
import { UpdateWasteGeneratorDto } from './dtos/update-waste-generator.dto';

@Injectable()
export class WasteGeneratorService {
  constructor(private readonly prisma: PrismaService) {}

  async createWasteGenerator(
    createWasteGenerator: CreateWasteGeneratorDto,
  ): Promise<WasteGenerator> {
    if (!createWasteGenerator.organizationName) {
      throw new ConflictException('Organization Name is required');
    }

    if (!createWasteGenerator.name) {
      throw new ConflictException('Name is required');
    }

    if (!createWasteGenerator.email) {
      throw new ConflictException('Email is required');
    }

    let user: User;

    try {
      user = await this.prisma.user.findUnique({
        where: { email: createWasteGenerator.email },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            name: createWasteGenerator.name,
            email: createWasteGenerator.email,
            phone: createWasteGenerator.phone,
            walletAddress: createWasteGenerator.walletAddress,
          },
        });
      }
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `User with email ${createWasteGenerator.email} already exists.`,
        );
      }
      throw error;
    }
    const existingWasteGenerator = await this.prisma.wasteGenerator.findUnique({
      where: { userId: user.id },
    });

    if (existingWasteGenerator) {
      throw new ConflictException(
        `A PWaste Generator already exists for User with ID ${user.id}`,
      );
    }

    return this.prisma.wasteGenerator.create({
      data: {
        phone: createWasteGenerator.phone,
        walletAddress: createWasteGenerator.walletAddress,
        organizationName: createWasteGenerator.organizationName,
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
    return this.prisma.wasteGenerator.update({
      where: { id },
      data: updateWasteGeneratorDto,
    });
  }

  async deleteWasteGenerator(id: number): Promise<WasteGenerator> {
    return this.prisma.wasteGenerator.delete({
      where: { id },
    });
  }
}

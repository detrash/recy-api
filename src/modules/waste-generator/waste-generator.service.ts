import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, WasteGenerator } from '@prisma/client';

import { PrismaService } from '@/modules/prisma/prisma.service';

import { UserService } from '../user/user.service';
import { CreateWasteGeneratorDto } from './dtos/create-waste-generator.dto';
import { UpdateWasteGeneratorDto } from './dtos/update-waste-generator.dto';

@Injectable()
export class WasteGeneratorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async createWasteGenerator(
    createWasteGeneratorDto: CreateWasteGeneratorDto,
  ): Promise<WasteGenerator> {
    const { email, name, organizationName, phone, walletAddress } =
      createWasteGeneratorDto;

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
        phone,
        walletAddress,
        organizationName,
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
      throw new NotFoundException(`Waste Generator with ID ${id} not found.`);
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
      throw new NotFoundException(`Waste Generator with ID ${id} not found.`);
    }

    return this.prisma.wasteGenerator.delete({
      where: { id },
    });
  }
}

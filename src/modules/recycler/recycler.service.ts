import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Recycler, User } from '@prisma/client';

import { PrismaService } from '@/modules/prisma/prisma.service';

import { CreateRecyclerDto } from './dtos/create-recycler.dto';
import { UpdateRecyclerDto } from './dtos/update-recycler.dto';

@Injectable()
export class RecyclerService {
  constructor(private readonly prisma: PrismaService) {}

  async createRecycler(
    createRecyclerDto: CreateRecyclerDto,
  ): Promise<Recycler> {
    const { email, name, organizationName, phone, walletAddress } =
      createRecyclerDto;

    if (!organizationName) {
      throw new ConflictException('Organization Name is required');
    }

    if (!name) {
      throw new ConflictException('Name is required');
    }

    if (!email) {
      throw new ConflictException('Email is required');
    }

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
    const existingRecycler = await this.prisma.recycler.findUnique({
      where: { userId: user.id },
    });

    if (existingRecycler) {
      throw new ConflictException(
        `A PWaste Generator already exists for User with ID ${user.id}`,
      );
    }

    return this.prisma.recycler.create({
      data: {
        phone: phone,
        walletAddress: walletAddress,
        organizationName: organizationName,
        user: { connect: { id: user.id } },
      },
    });
  }

  async findAllRecyclers(): Promise<Recycler[]> {
    return this.prisma.recycler.findMany();
  }

  async findRecyclerById(id: number): Promise<Recycler | null> {
    return this.prisma.recycler.findUnique({ where: { id } });
  }

  async updateRecycler(
    id: number,
    updateRecyclerDto: UpdateRecyclerDto,
  ): Promise<Recycler> {
    const recycler = await this.prisma.recycler.findUnique({ where: { id } });

    if (!recycler) {
      throw new NotFoundException(`Recycler with ID ${id} not found.`);
    }

    return this.prisma.recycler.update({
      where: { id },
      data: updateRecyclerDto,
    });
  }

  async deleteRecycler(id: number): Promise<Recycler> {
    const recycler = await this.prisma.recycler.findUnique({ where: { id } });

    if (!recycler) {
      throw new NotFoundException(`Recycler with ID ${id} not found.`);
    }

    return this.prisma.recycler.delete({
      where: { id },
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, RecyclingReport, User } from '@prisma/client';

import { PrismaService } from '@/modules/prisma/prisma.service';

import { CreateRecyclingReportDto } from './dtos/create-recycling-report.dto';
import { UpdateRecyclingReportDto } from './dtos/update-recycling-report.dto';

@Injectable()
export class RecyclingReportService {
  constructor(private readonly prisma: PrismaService) {}

  private async checkUserExists(userId: bigint): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    return user;
  }

  async createRecyclingReport(
    createRecyclingReportDto: CreateRecyclingReportDto,
  ): Promise<RecyclingReport> {
    const {
      submittedBy,
      reportDate,
      phone,
      materials,
      walletAddress,
      evidenceUrl,
    } = createRecyclingReportDto;

    await this.checkUserExists(BigInt(submittedBy));

    const jsonMaterials: Prisma.JsonArray =
      materials as unknown as Prisma.JsonArray;

    return this.prisma.recyclingReport.create({
      data: {
        submittedBy: BigInt(submittedBy),
        reportDate,
        audited: false,
        phone,
        materials: jsonMaterials,
        walletAddress,
        evidenceUrl,
      },
    });
  }

  async findAllRecyclingReports(): Promise<RecyclingReport[]> {
    return this.prisma.recyclingReport.findMany({
      include: { user: true, audits: true },
    });
  }

  async findRecyclingReportById(id: bigint): Promise<RecyclingReport> {
    const report = await this.prisma.recyclingReport.findUnique({
      where: { id },
      include: { user: true, audits: true },
    });

    if (!report) {
      throw new NotFoundException(`RecyclingReport with ID ${id} not found.`);
    }

    return report;
  }

  async updateRecyclingReport(
    id: number,
    updateRecyclingReportDto: UpdateRecyclingReportDto,
  ): Promise<RecyclingReport> {
    const { materials, submittedBy } = updateRecyclingReportDto;

    const existingReport = await this.prisma.recyclingReport.findUnique({
      where: { id },
    });

    if (!existingReport) {
      throw new NotFoundException(`RecyclingReport with ID ${id} not found.`);
    }

    if (submittedBy) {
      await this.checkUserExists(BigInt(submittedBy));
    }

    const jsonMaterials: Prisma.JsonArray =
      materials as unknown as Prisma.JsonArray;

    return this.prisma.recyclingReport.update({
      where: { id },
      data: {
        ...updateRecyclingReportDto,
        materials: jsonMaterials,
      },
    });
  }

  async deleteRecyclingReport(id: number): Promise<RecyclingReport> {
    const existingReport = await this.prisma.recyclingReport.findUnique({
      where: { id },
    });

    if (!existingReport) {
      throw new NotFoundException(`RecyclingReport with ID ${id} not found.`);
    }

    return this.prisma.recyclingReport.delete({
      where: { id },
    });
  }
}

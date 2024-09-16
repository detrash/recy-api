import { Injectable, NotFoundException } from '@nestjs/common';
import { Audit } from '@prisma/client';

import { PrismaService } from '@/modules/prisma/prisma.service';

import { CreateAuditDto } from './dtos/create-audit.dto';
import { UpdateAuditDto } from './dtos/update-audit.dto';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async createAudit(createAuditDto: CreateAuditDto): Promise<Audit> {
    const { reportId, auditorId, comments } = createAuditDto;

    const recyclingReport = await this.prisma.recyclingReport.findUnique({
      where: { id: reportId },
    });

    if (!recyclingReport) {
      throw new NotFoundException(
        `Recycling report with ID ${reportId} not found.`,
      );
    }

    const auditor = await this.prisma.auditor.findUnique({
      where: { id: auditorId },
    });

    if (!auditor) {
      throw new NotFoundException(`Auditor with ID ${auditorId} not found.`);
    }

    return this.prisma.audit.create({
      data: {
        reportId,
        auditorId,
        comments,
      },
    });
  }

  async findAllAudits(): Promise<Audit[]> {
    return this.prisma.audit.findMany();
  }

  async findAuditById(id: number): Promise<Audit | null> {
    return this.prisma.audit.findUnique({ where: { id } });
  }

  async updateAudit(
    id: number,
    updateAuditDto: UpdateAuditDto,
  ): Promise<Audit> {
    const existingAudit = await this.prisma.audit.findUnique({ where: { id } });

    if (!existingAudit) {
      throw new NotFoundException(`Audit with ID ${id} not found.`);
    }

    return this.prisma.audit.update({
      where: { id },
      data: updateAuditDto,
    });
  }

  async deleteAudit(id: number): Promise<Audit> {
    const audit = await this.prisma.audit.findUnique({ where: { id } });

    if (!audit) {
      throw new NotFoundException(`Audit with ID ${id} not found.`);
    }

    return this.prisma.audit.delete({
      where: { id },
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { Audit } from '@prisma/client';
import { ulid } from 'ulid';

import { PrismaService } from '@/modules/prisma/prisma.service';

import { CreateAuditDto } from './dtos/create-audit.dto';
import { UpdateAuditDto } from './dtos/update-audit.dto';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async createAudit(createAuditDto: CreateAuditDto): Promise<Audit> {
    const { reportId, audited, auditorId, comments } = createAuditDto;

    const recyclingReport = await this.prisma.recyclingReport.findUnique({
      where: { id: reportId },
    });

    if (!recyclingReport) {
      throw new NotFoundException(
        `RecyclingReport with ID ${reportId} not found.`,
      );
    }

    // Gera um ULID para o ID da auditoria
    const auditId = ulid();

    const audit = await this.prisma.audit.create({
      data: {
        id: auditId,
        reportId: reportId,
        audited,
        auditorId: auditorId,
        comments,
      },
    });

    await this.prisma.recyclingReport.update({
      where: { id: reportId },
      data: {
        audited,
      },
    });

    return audit;
  }

  async findAllAudits(): Promise<Audit[]> {
    return this.prisma.audit.findMany();
  }

  async findAuditById(id: string): Promise<Audit | null> {
    return this.prisma.audit.findUnique({ where: { id } });
  }

  async updateAudit(
    id: string,
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

  async deleteAudit(id: string): Promise<Audit> {
    const audit = await this.prisma.audit.findUnique({ where: { id } });

    if (!audit) {
      throw new NotFoundException(`Audit with ID ${id} not found.`);
    }

    return this.prisma.audit.delete({
      where: { id },
    });
  }
}

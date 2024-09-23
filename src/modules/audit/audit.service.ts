import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Audit, Prisma } from '@prisma/client';
import { ulid } from 'ulid';

import { PrismaService } from '@/modules/prisma/prisma.service';

import { Web3Service } from '../web3/web3.service';
import { CreateAuditDto } from './dtos/create-audit.dto';
import { UpdateAuditDto } from './dtos/update-audit.dto';

@Injectable()
export class AuditService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly web3Service: Web3Service,
  ) {}

  async createAudit(createAuditDto: CreateAuditDto): Promise<Audit> {
    const { reportId, audited, auditorId, comments } = createAuditDto;

    try {
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new BadRequestException(
            `Foreign key constraint failed on the field: ${error.meta?.field_name}`,
          );
        }

        if (error.code === 'P2002') {
          throw new BadRequestException(
            `Unique constraint failed on the field: ${error.meta?.target}`,
          );
        }
      }

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('An unexpected error occurred.');
    }
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

  async owner() {
    return this.web3Service.owner();
  }
}

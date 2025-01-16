import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Audit, Prisma } from '@prisma/client';
import { Queue } from 'bullmq';
import { async } from 'rxjs';
import { ulid } from 'ulid';

import { PrismaService } from '@/modules/prisma/prisma.service';
import { AuditStatusConstants } from '@/shared/constants';
import { paginate, PaginatedResult } from '@/shared/utils/pagination.util';

import { JOBS, REPORT_QUEUE } from '../bullmq/bullmq.constants';
import { MetadataDatabase } from '../recycling-reports/types';
import { UserService } from '../users/user.service';
import { Web3Service } from '../web3/web3.service';
import { CreateAuditDto } from './dtos/create-audit.dto';
import { UpdateAuditDto } from './dtos/update-audit.dto';
import { AuditQueryParams } from './interface/audit.types';

@Injectable()
export class AuditService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly web3Service: Web3Service,
    private readonly config: ConfigService,
    @InjectQueue(REPORT_QUEUE) readonly bullMQQueue: Queue
  ) {}

  private async processAfterAuditValidated(auditId: string) {
    try {
      const audit = await this.prisma.audit.findUnique({
        where: { id: auditId },
      });

      if (!audit || audit.status !== AuditStatusConstants.APPROVED) {
        throw new NotFoundException(`Audit with ID ${auditId} not found or not audited.`);
      }

      const recyclingReport = await this.prisma.recyclingReport.findUnique({
        where: { id: audit.reportId },
      });

      if (!recyclingReport) {
        throw new NotFoundException(`Recycling report with ID ${audit.reportId} not found.`);
      }

      if (recyclingReport) {
        const user = await this.userService.checkUserExists(recyclingReport.submittedBy);

        const JOB_DATA = {
          user: user,
          report: recyclingReport,
        };

        await this.bullMQQueue.add(JOBS.reportEvidence, JOB_DATA);

        if (recyclingReport?.metadata && typeof recyclingReport.metadata === 'object') {
          const metadata = recyclingReport.metadata as unknown as MetadataDatabase;

          const detrashWallet = this.config.get<string>('WALLET') || '';

          await this.web3Service.mintRecyCertificate({
            recipient: recyclingReport.walletAddress || detrashWallet,
            tokenURI: metadata.url,
          });
        } else {
          throw new Error('Invalid metadata structure in recycling report');
        }

        // TODO: integrate with blockchain
        //   // Creating report on polygon after validate true
        //   async mintNFTPolygon(data: MintNftDto) {
        //     return this.web3Service.mintNFTPolygon(data);
        //   }

        //   // if user is recycler
        //   async mintCelo(data: MintCeloDto) {
        //     return this.web3Service.mintCelo(data);
        //   }
        //   // 1) Mint de 50% do volume em cRECY para a carteira que mandou o relatório tokenizado (o agente de tratamento sustentável de resíduos).
        //   // 2) Mint de 10% do volume em cRECY para a carteira dona do contrato.
        //   // 3) Mint de 40% do volume para a carteira de incentivos e liquidez 0xBdF566d020e206456534e873f5EF385A762aC4FC
        //   // 4) Transfer da carteira de incentivos e liquidez de 0.5 cRECYs por relatório para cada gerador de resíduos
        //   // mandou relatórios (e conectaram a carteira) na data entre esse mint de cRECY e o último mint de cRECY.

        return audit;
      }
    } catch (error) {
      throw new Error(`Error processing after audit validation: ${error}`);
    }
  }

  async createAudit(createAuditDto: CreateAuditDto): Promise<Audit> {
    const { reportId, auditorId, comments, status } = createAuditDto;

    try {
      const recyclingReport = await this.prisma.recyclingReport.findUnique({
        where: { id: reportId },
      });

      if (!recyclingReport) {
        throw new NotFoundException(`RecyclingReport with ID ${reportId} not found.`);
      }

      // Generate ULID for the audit ID
      const auditId = ulid();

      const audit = await this.prisma.audit.create({
        data: {
          id: auditId,
          reportId: reportId,
          status,
          auditorId: auditorId,
          comments,
        },
      });

      return audit;
    } catch (error) {
      throw error;
    }
  }

  async findAllAudits(params: AuditQueryParams): Promise<PaginatedResult<Audit>> {
    return paginate<Audit>(
      () =>
        this.prisma.audit.count({
          where: {},
        }),
      (skip, take) =>
        this.prisma.audit.findMany({
          skip,
          take,
          orderBy: { createdAt: 'desc' },
          where: {},
        }),
      params
    );
  }

  async findAuditById(id: string): Promise<Audit> {
    const audit = await this.prisma.audit.findUnique({ where: { id } });

    if (!audit) {
      throw new NotFoundException(`Audit with ID ${id} not found.`);
    }

    return audit;
  }

  async updateAudit(id: string, updateAuditDto: UpdateAuditDto): Promise<Audit> {
    if (!updateAuditDto.auditorId) {
      throw new NotFoundException('Auditor ID is required to updated an Audit.');
    }

    const existingAudit = await this.prisma.audit.findUnique({ where: { id } });

    if (!existingAudit) {
      throw new NotFoundException(`Audit with ID ${id} not found.`);
    }

    const updatedAudit = await this.prisma.audit.update({
      where: { id },
      data: updateAuditDto,
    });

    if (
      updatedAudit.status === AuditStatusConstants.APPROVED &&
      existingAudit.status !== AuditStatusConstants.APPROVED
    ) {
      console.log('updated');
      await this.processAfterAuditValidated(updatedAudit.id);
    }

    return updatedAudit;
  }

  async deleteAudit(id: string): Promise<Audit> {
    const audit = await this.prisma.audit.findUnique({ where: { id } });

    if (!audit) {
      throw new NotFoundException(`Audit with ID ${id} not found.`);
    }

    const deletedAudit = await this.prisma.audit.delete({
      where: { id },
    });

    return deletedAudit;
  }
}

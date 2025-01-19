import { Injectable, NotFoundException } from '@nestjs/common';
import { RecyclingReport } from '@prisma/client';
import { ulid } from 'ulid';

import { PrismaService } from '@/modules/prisma/prisma.service';
import { AuditStatusConstants } from '@/shared/constants';
import { UserRole } from '@/shared/enums/user.enums';
import { paginate, PaginatedResult } from '@/shared/utils/pagination.util';

import { UploadService } from '../../shared/modules/upload/upload.service';
import { AuditService } from '../audits/audit.service';
import { UserService } from '../users/user.service';
import { CreateRecyclingReportDto } from './dtos/create-recycling-report.dto';
import { UpdateRecyclingReportDto } from './dtos/update-recycling-report.dto';
import { RecyclingReportQueryParams } from './interface/recycling-report.types';

@Injectable()
export class RecyclingReportService {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly uploadService: UploadService
  ) {}

  async createRecyclingReport(createRecyclingReportDto: CreateRecyclingReportDto): Promise<RecyclingReport> {
    const { submittedBy, reportDate, phone, materials, walletAddress, residueEvidenceFile, residueEvidence } =
      createRecyclingReportDto;

    // Generate a unique report ID using ULID
    const reportId = ulid();

    // Handle file upload if evidence file is provided
    let residueEvidenceFileUrl = '';

    if (!residueEvidence && residueEvidenceFile) {
      const { mimetype, originalname } = residueEvidenceFile;

      const options = {
        file: residueEvidenceFile.buffer,
        fileName: originalname,
        type: mimetype,
        bucketName: 'detrash-prod',
      };

      residueEvidenceFileUrl = await this.uploadService.upload(options);
    }

    const createdReport = await this.prisma.recyclingReport.create({
      data: {
        id: reportId,
        submittedBy,
        reportDate,
        phone,
        materials,
        walletAddress,
        residueEvidence: residueEvidence || residueEvidenceFileUrl,
        metadata: {},
      },
    });

    const userRoles = await this.prisma.userRole.findMany({
      where: {
        userId: submittedBy,
        role: {
          name: UserRole.WASTE_GENERATOR,
        },
      },
      select: {
        role: {
          select: { name: true },
        },
      },
    });

    const isWasteGenerator = userRoles.some((role) => role.role.name === UserRole.WASTE_GENERATOR);

    // Waste Generators reports don't generate audits they receive tokens after audits sended by recyclers
    if (!isWasteGenerator) {
      await this.auditService.createAudit({
        reportId,
        status: AuditStatusConstants.PENDING,
        auditorId: null,
        comments: '',
      });
    }

    return createdReport;
  }

  async findAllRecyclingReports(params: RecyclingReportQueryParams): Promise<PaginatedResult<RecyclingReport>> {
    return paginate<RecyclingReport>(
      () =>
        this.prisma.recyclingReport.count({
          where: {},
        }),
      (skip, take) =>
        this.prisma.recyclingReport.findMany({
          skip,
          take,
          orderBy: { createdAt: 'desc' },
          include: { user: true, audits: true },
          where: {},
        }),
      params
    );
  }

  async findRecyclingReportById(id: string): Promise<RecyclingReport> {
    const report = await this.prisma.recyclingReport.findUnique({
      where: { id },
      include: { user: true, audits: true },
    });

    if (!report) {
      throw new NotFoundException(`RecyclingReport with ID ${id} not found.`);
    }

    return report;
  }

  async findRecyclingReportsByUser(userId: string): Promise<RecyclingReport[]> {
    await this.userService.checkUserExists(userId);

    return this.prisma.recyclingReport.findMany({
      where: { submittedBy: userId },
      include: { user: true, audits: true },
    });
  }

  async updateRecyclingReport(
    id: string,
    updateRecyclingReportDto: UpdateRecyclingReportDto
  ): Promise<RecyclingReport> {
    const existingReport = await this.prisma.recyclingReport.findUnique({
      where: { id },
    });

    if (!existingReport) {
      throw new NotFoundException(`RecyclingReport with ID ${id} not found.`);
    }

    const updatedReport = await this.prisma.recyclingReport.update({
      where: { id },
      data: {
        ...updateRecyclingReportDto,
        // Prisma use Json
        materials: JSON.parse(JSON.stringify(updateRecyclingReportDto.materials)),
        submittedBy: updateRecyclingReportDto.submittedBy || existingReport.submittedBy,
      },
    });

    return updatedReport;
  }

  async deleteRecyclingReport(id: string): Promise<RecyclingReport> {
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

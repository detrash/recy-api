import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Audit } from '@prisma/client';

import { AuditService } from './audit.service';
import { CreateAuditDto } from './dtos/create-audit.dto';
import { UpdateAuditDto } from './dtos/update-audit.dto';

@ApiTags('audits')
@Controller({ path: 'audits', version: '1' })
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Post()
  @ApiOperation({ summary: 'Create an audit' })
  @ApiResponse({
    status: 201,
    description: 'The audit has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() createAuditDto: CreateAuditDto): Promise<Audit> {
    return this.auditService.createAudit(createAuditDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all audits' })
  @ApiResponse({
    status: 200,
    description: 'List of all audits.',
  })
  async findAll(): Promise<Audit[]> {
    return this.auditService.findAllAudits();
  }

  @Get('owner')
  async owner() {
    return this.auditService.owner();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific audit by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'The ID of the audit' })
  @ApiResponse({
    status: 200,
    description: 'The audit with the specified ID.',
  })
  @ApiResponse({ status: 404, description: 'Audit not found.' })
  async findOne(@Param('id') id: string): Promise<Audit | null> {
    return this.auditService.findAuditById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a specific audit by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'The ID of the audit' })
  @ApiResponse({
    status: 200,
    description: 'The audit has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Audit not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateAuditDto: UpdateAuditDto,
  ): Promise<Audit> {
    return this.auditService.updateAudit(id, updateAuditDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific audit by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'The ID of the audit' })
  @ApiResponse({
    status: 200,
    description: 'The audit has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Audit not found.' })
  async remove(@Param('id') id: string): Promise<Audit> {
    return this.auditService.deleteAudit(id);
  }
}

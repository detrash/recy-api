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
import { Auditor } from '@prisma/client';

import { AuditorService } from './auditor.service';
import { CreateAuditorDto } from './dtos/create-auditor.dto';
import { UpdateAuditorDto } from './dtos/update-auditor.dto';

@ApiTags('auditor')
@Controller({ path: 'auditor', version: '1' })
export class AuditorController {
  constructor(private readonly partnerService: AuditorService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new partner' })
  @ApiResponse({
    status: 201,
    description: 'The partner has been successfully created.',
    type: CreateAuditorDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createAuditorDto: CreateAuditorDto): Promise<Auditor> {
    return this.partnerService.createAuditor(createAuditorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all auditor' })
  @ApiResponse({
    status: 200,
    description: 'Retrieve all auditor',
  })
  async findAll(): Promise<Auditor[]> {
    return this.partnerService.findAllAuditors();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a auditor by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the auditor',
  })
  @ApiResponse({
    status: 200,
    description: 'Retrieve a auditor by ID',
  })
  @ApiResponse({ status: 404, description: 'Auditor not found' })
  async findOne(@Param('id') id: number): Promise<Auditor | null> {
    return this.partnerService.findAuditorById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a auditor by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the auditor to update',
  })
  @ApiResponse({
    status: 200,
    description: 'Update a auditor',
    type: UpdateAuditorDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Auditor not found' })
  async update(
    @Param('id') id: number,
    @Body() updateAuditorDto: UpdateAuditorDto,
  ): Promise<Auditor> {
    return this.partnerService.updateAuditor(id, updateAuditorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a auditor by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the auditor to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete a auditor',
  })
  @ApiResponse({ status: 404, description: 'Auditor not found' })
  async remove(@Param('id') id: number): Promise<Auditor> {
    return this.partnerService.deleteAuditor(id);
  }
}

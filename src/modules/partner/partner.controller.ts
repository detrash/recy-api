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
import { Partner } from '@prisma/client';

import { CreatePartnerDto } from './dtos/create-partner.dto';
import { UpdatePartnerDto } from './dtos/update-partner.dto';
import { PartnerService } from './partner.service';

@ApiTags('partner')
@Controller({ path: 'partner', version: '1' })
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new partner' })
  @ApiResponse({
    status: 201,
    description: 'The partner has been successfully created.',
    type: CreatePartnerDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() partnerData: CreatePartnerDto): Promise<Partner> {
    return this.partnerService.createPartner(partnerData);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all partners' })
  @ApiResponse({
    status: 200,
    description: 'Retrieve all partners',
  })
  async findAll(): Promise<Partner[]> {
    return this.partnerService.findAllPartners();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a partner by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the partner',
  })
  @ApiResponse({
    status: 200,
    description: 'Retrieve a partner by ID',
  })
  @ApiResponse({ status: 404, description: 'Partner not found' })
  async findOne(@Param('id') id: number): Promise<Partner | null> {
    return this.partnerService.findPartnerById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a partner by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the partner to update',
  })
  @ApiResponse({
    status: 200,
    description: 'Update a partner',
    type: UpdatePartnerDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Partner not found' })
  async update(
    @Param('id') id: number,
    @Body() updatePartnerDto: UpdatePartnerDto,
  ): Promise<Partner> {
    return this.partnerService.updatePartner(id, updatePartnerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a partner by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the partner to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete a partner',
  })
  @ApiResponse({ status: 404, description: 'Partner not found' })
  async remove(@Param('id') id: number): Promise<Partner> {
    return this.partnerService.deletePartner(id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Partner } from '@prisma/client';

import { CreatePartnerDto } from './dtos/create-partner.dto';
import { PartnerService } from './partner.service';

@ApiTags('partner')
@Controller({ path: 'partner', version: '1' })
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post()
  async create(@Body() partnerData: CreatePartnerDto): Promise<Partner> {
    return this.partnerService.createPartner(partnerData);
  }

  @Get()
  async findAll(): Promise<Partner[]> {
    return this.partnerService.findAllPartners();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Partner | null> {
    return this.partnerService.findPartnerById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateData: Partial<Partner>,
  ): Promise<Partner> {
    return this.partnerService.updatePartner(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<Partner> {
    return this.partnerService.deletePartner(id);
  }
}

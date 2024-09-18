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
import { WasteGenerator } from '@prisma/client';

import { CreateWasteGeneratorDto } from './dtos/create-waste-generator.dto';
import { UpdateWasteGeneratorDto } from './dtos/update-waste-generator.dto';
import { WasteGeneratorService } from './waste-generator.service';

@ApiTags('waste-generator')
@Controller({ path: 'waste-generator', version: '1' })
export class WasteGeneratorController {
  constructor(private readonly wasteGenerator: WasteGeneratorService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new waste generator' })
  @ApiResponse({
    status: 201,
    description: 'The waste generator has been successfully created.',
    type: CreateWasteGeneratorDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(
    @Body() wasteGeneratorDto: CreateWasteGeneratorDto,
  ): Promise<WasteGenerator> {
    return this.wasteGenerator.createWasteGenerator(wasteGeneratorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all waste generators' })
  @ApiResponse({
    status: 200,
    description: 'Retrieve all waste generators',
  })
  async findAll(): Promise<WasteGenerator[]> {
    return this.wasteGenerator.findAllWasteGenerators();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a waste generator by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the Waste Generator',
  })
  @ApiResponse({
    status: 200,
    description: 'Retrieve a waste generator by ID',
  })
  @ApiResponse({ status: 404, description: 'Waste generator not found' })
  async findOne(@Param('id') id: number): Promise<WasteGenerator | null> {
    return this.wasteGenerator.findWasteGeneratorById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a waste generator by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the waste generator to update',
  })
  @ApiResponse({
    status: 200,
    description: 'Update a waste generator',
    type: UpdateWasteGeneratorDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Waste generator not found' })
  async update(
    @Param('id') id: number,
    @Body() UpdateWasteGeneratorDto: UpdateWasteGeneratorDto,
  ): Promise<WasteGenerator> {
    return this.wasteGenerator.updateWasteGenerator(
      id,
      UpdateWasteGeneratorDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a waste generator by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the waste generator to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete a waste generator',
  })
  @ApiResponse({ status: 404, description: 'Waste generator not found' })
  async remove(@Param('id') id: number): Promise<WasteGenerator> {
    return this.wasteGenerator.deleteWasteGenerator(id);
  }
}

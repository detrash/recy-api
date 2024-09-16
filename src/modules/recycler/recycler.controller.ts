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
import { Recycler } from '@prisma/client';

import { CreateRecyclerDto } from './dtos/create-recycler.dto';
import { UpdateRecyclerDto } from './dtos/update-recycler.dto';
import { RecyclerService } from './recycler.service';

@ApiTags('recycler')
@Controller({ path: 'recycler', version: '1' })
export class RecyclerController {
  constructor(private readonly recycler: RecyclerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new recycler' })
  @ApiResponse({
    status: 201,
    description: 'The recycler has been successfully created.',
    type: CreateRecyclerDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() RecyclerDto: CreateRecyclerDto): Promise<Recycler> {
    return this.recycler.createRecycler(RecyclerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all recycler' })
  @ApiResponse({
    status: 200,
    description: 'Retrieve all recycler',
  })
  async findAll(): Promise<Recycler[]> {
    return this.recycler.findAllRecyclers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a recycler by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the recycler',
  })
  @ApiResponse({
    status: 200,
    description: 'Retrieve a recycler by ID',
  })
  @ApiResponse({ status: 404, description: 'recycler not found' })
  async findOne(@Param('id') id: number): Promise<Recycler | null> {
    return this.recycler.findRecyclerById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a recycler by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the recycler to update',
  })
  @ApiResponse({
    status: 200,
    description: 'Update a recycler',
    type: UpdateRecyclerDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'recycler not found' })
  async update(
    @Param('id') id: number,
    @Body() UpdateRecyclerDto: UpdateRecyclerDto,
  ): Promise<Recycler> {
    return this.recycler.updateRecycler(id, UpdateRecyclerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a recycler by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the recycler to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete a recycler',
  })
  @ApiResponse({ status: 404, description: 'recycler not found' })
  async remove(@Param('id') id: number): Promise<Recycler> {
    return this.recycler.deleteRecycler(id);
  }
}

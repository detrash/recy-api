import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { ApiOkResponsePaginated } from '@/dto/paginated.dto';

import {
  AggregateFormByUserProfileResponse,
  CreateFormInput,
  FindFormDto,
  Form,
} from './dtos';
import { FormsService } from './forms.service';

@ApiTags('forms')
@ApiBearerAuth('access-token')
@Controller({ path: 'forms', version: '1' })
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Get('/status')
  @ApiOperation({
    summary: 'form status',
    description: 'Returns form status by user profile',
  })
  @ApiOkResponse({
    description: 'form status',
    type: AggregateFormByUserProfileResponse,
  })
  aggregateFormByUserProfile() {
    return this.formsService.aggregateFormByUserProfile();
  }

  @Post(':formId/image-url')
  @ApiOperation({
    summary: 'returns presigned url for image upload',
    description: 'Returns presigned url for image upload',
  })
  submitFormImage(@Param('formId') formId: string) {
    return this.formsService.submitFormImage(formId);
  }

  @Put(':formId/authorize')
  @ApiOperation({
    summary: 'authorize form by admin',
    description: 'Returns presigned url for image upload',
  })
  @ApiOkResponse({
    description: 'form object',
    type: Form,
  })
  authorizeForm(
    @Param('formId') formId: string,
    @Query('isFormAuthorized') isFormAuthorized: boolean,
  ) {
    return this.formsService.authorizeForm(formId, isFormAuthorized);
  }

  @Post('')
  createForm(@Body() createFormDto: CreateFormInput) {
    return this.formsService.createForm(createFormDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get form by ID',
    description: 'Returns form',
  })
  @ApiParam({
    type: 'string',
    name: 'id',
    example: '0000742d-ee03-463b-a558-d79728f8a171',
  })
  @ApiOkResponse({
    description: 'form object',
    type: Form,
  })
  findFormById(@Param('id') id: string) {
    return this.formsService.findByFormId(id);
  }

  @Get('')
  @ApiOperation({
    summary: 'Get all forms',
    description: 'Returns forms',
  })
  @ApiOkResponsePaginated(Form)
  findAll(@Query() queryParams: FindFormDto) {
    return this.formsService.findAllNew(queryParams);
  }
}

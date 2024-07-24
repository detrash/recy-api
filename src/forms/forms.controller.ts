import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { ApiOkResponsePaginated } from '@/dto/paginated.dto';

import { FindFormDto } from './dtos/find-form.dto';
import { Form } from './dtos/form.dto';
import { FormsService } from './forms.service';

@ApiTags('forms')
@ApiBearerAuth('access-token')
@Controller({ path: 'forms', version: '1' })
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

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

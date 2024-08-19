

import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { DocumentsService } from './documents.service';
import { Role } from 'src/util/constants';
import { Roles } from '@/auth/roles.decorator';
import { ResidueType } from './dtos';

@ApiTags('documents')
@ApiBearerAuth('access-token')
@Controller({ path: 'documents', version: '1' })
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) { }

  @Get('video-url')
  @ApiOperation({
    summary: 'Get document video URL by residue type',
    description: 'Returns the video URL for the specified residue type and form ID',
  })
  @ApiQuery({
    type: 'string',
    name: 'formId',
    example: '0000742d-ee03-463b-a558-d79728f8a171',
  })
  @ApiQuery({
    name: 'residueType',
    enum: ResidueType,
    example: ResidueType.GLASS
  })
  @ApiOkResponse({
    description: 'Returns the video URL for the specified residue type and form ID',
    type: String,
  })
  @Roles(Role.Admin)
  getDocumentVideoUrlByResidue(
    @Query('formId') formId: string,
    @Query('residueType') residueType: ResidueType,
  ) {
    return this.documentsService.getDocumentVideoUrlByResidue(formId, residueType);
  }

  @Get('invoices-url')
  @ApiOperation({
    summary: 'Get document invoices URL by residue type',
    description: 'Returns the invoices URL for the specified residue type and form ID',
  })
  @ApiQuery({
    type: 'string',
    name: 'formId',
    example: '0000742d-ee03-463b-a558-d79728f8a171',
  })
  @ApiQuery({
    name: 'residueType',
    enum: ResidueType,
    example: ResidueType.GLASS
  })
  @ApiOkResponse({
    description: 'Returns the invoices URL for the specified residue type and form ID',
    type: [String],
  })
  @Roles(Role.Admin)
  getDocumentInvoicesUrlByResidue(
    @Query('formId') formId: string,
    @Query('residueType') residueType: ResidueType,
  ) {
    return this.documentsService.getDocumentInvoicesUrlByResidue(formId, residueType);
  }
}

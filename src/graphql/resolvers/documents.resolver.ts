import { Args, Query, Resolver } from '@nestjs/graphql';
import { Role } from 'src/util/constants';

import { Roles } from '@/auth/roles.decorator';
import { Document, DocumentsService, ResidueType } from '@/documents';

@Resolver(() => Document)
export class DocumentsResolver {
  constructor(private documentsService: DocumentsService) {}

  @Query(() => String)
  @Roles(Role.Admin)
  documentVideoUrlByResidue(
    @Args('formId') formId: string,
    @Args('residueType', { type: () => ResidueType }) residueType: ResidueType,
  ) {
    return this.documentsService.getDocumentVideoUrlByResidue(
      formId,
      residueType,
    );
  }

  @Query(() => [String])
  @Roles(Role.Admin)
  documentInvoicesUrlByResidue(
    @Args('formId') formId: string,
    @Args('residueType', { type: () => ResidueType }) residueType: ResidueType,
  ) {
    return this.documentsService.getDocumentInvoicesUrlByResidue(
      formId,
      residueType,
    );
  }
}

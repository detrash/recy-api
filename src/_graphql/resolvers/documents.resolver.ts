import { Args, Query, Resolver } from '@nestjs/graphql';

import { Roles } from '@/_auth/roles.decorator';
import { Document, DocumentsService, ResidueType } from '@/modules/documents';
import { Role } from '@/shared/utils/constants';

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

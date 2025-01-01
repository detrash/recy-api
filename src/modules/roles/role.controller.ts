import { Controller, Get, UseGuards, UsePipes } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ZodValidationPipe } from '@/shared/utils/zod-validation.pipe';

import { AuthorizationGuard } from '../auth0/authorization.guard';
import { ResultDto, ResultDtoSchema } from './dtos';
import { RoleService } from './role.service';

@ApiTags('roles')
@Controller({ path: 'roles', version: '1' })
export class RoleController {
  constructor(private readonly rolesService: RoleService) {}

  @UseGuards(AuthorizationGuard)
  @Get()
  @ApiOperation({
    summary: 'Get all available roles',
    description: 'Retrieve a list of all roles available in the database',
  })
  @ApiOkResponse({
    description: 'Returns a list of roles',
  })
  @UsePipes(new ZodValidationPipe(ResultDtoSchema))
  async getAllRoles(): Promise<ResultDto> {
    return await this.rolesService.getRoles();
  }
}

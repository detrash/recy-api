import {
  applyDecorators,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { Roles } from '@/auth/roles.decorator';
import { RestAuthorizationGuard } from '@/graphql/rest-authorization.guard';
import { Role } from '@/util/constants';

interface ApiAuthOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  summary: string;
  description: string;
  authRoute: boolean;
  responseType: any;
  roles?: Role;
}

export function ApiAuthOperation(options: ApiAuthOptions) {
  const decorators = [
    ApiOperation({
      summary: options.summary,
      description: options.description,
    }),
    ApiOkResponse({ description: options.summary, type: options.responseType }),
    options.authRoute && ApiBearerAuth('access-token'),
    options.authRoute &&
      options.roles &&
      options.roles.length &&
      Roles(options.roles) &&
      UseGuards(RestAuthorizationGuard),
  ].filter(Boolean) as MethodDecorator[];

  switch (options.method) {
    case 'GET':
      decorators.push(Get(options.path));
      break;
    case 'POST':
      decorators.push(Post(options.path));
      break;
    case 'PUT':
      decorators.push(Put(options.path));
      break;
    case 'DELETE':
      decorators.push(Delete(options.path));
      break;
  }

  return applyDecorators(...decorators);
}

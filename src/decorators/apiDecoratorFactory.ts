import {
  applyDecorators,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Roles } from '@/auth/roles.decorator';
import { RestAuthorizationGuard } from '@/guards/authorization.guard';
import { MessagesHelper } from '@/helpers/messages.helper';
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
    ApiUnauthorizedResponse({ description: MessagesHelper.USER_UNAUTHORIZED }),
    ApiOkResponse({ description: options.summary, type: options.responseType }),
    options.authRoute && ApiBearerAuth('access-token'),
    options.authRoute && UseGuards(RestAuthorizationGuard),
    Roles(options.roles),
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

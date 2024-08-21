import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Response } from 'express';
import { expressjwt, Request } from 'express-jwt';
import { expressJwtSecret, GetVerificationKey } from 'jwks-rsa';
import { PERMISSION_SCOPES, Role, ROLES_KEY } from 'src/util/constants';
import { promisify } from 'util';

import { MessagesHelper } from '@/helpers/messages.helper';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private AUTH0_AUDIENCE: string;
  private AUTH0_DOMAIN: string;

  constructor(
    private configService: ConfigService,
    private reflector: Reflector,
  ) {
    this.AUTH0_AUDIENCE = this.configService.get('AUTH0_AUDIENCE');
    this.AUTH0_DOMAIN = this.configService.get('AUTH0_DOMAIN');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { req, res } = GqlExecutionContext.create(context).getContext<{
      req: Request;
      res: Response;
    }>();

    // Only check for permissions on GraphQL requests
    if (req.path !== '/graphql') {
      return true;
    }

    const checkJWT = promisify(
      expressjwt({
        secret: expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `${this.AUTH0_DOMAIN}.well-known/jwks.json`,
        }) as GetVerificationKey,
        audience: this.AUTH0_AUDIENCE,
        issuer: this.AUTH0_DOMAIN,
        algorithms: ['RS256'],
      }),
    );

    try {
      await checkJWT(req, res);
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      const scopeRules = req?.auth.permissions as string[];
      if (requiredRoles) {
        if (!scopeRules?.length) {
          throw new UnauthorizedException(MessagesHelper.USER_UNAUTHORIZED);
        }

        const [requiredRole] = requiredRoles;

        const hasAccess = scopeRules.every((scopeType) =>
          PERMISSION_SCOPES[requiredRole].includes(scopeType),
        );

        if (!hasAccess) {
          throw new UnauthorizedException(MessagesHelper.USER_UNAUTHORIZED);
        }

        return hasAccess;
      }

      return true;
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
}

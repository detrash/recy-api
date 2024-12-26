import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  auth,
  InvalidTokenError,
  UnauthorizedError,
} from 'express-oauth2-jwt-bearer';
import process from 'process';
import { promisify } from 'util';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const validateAccessToken = promisify(
      auth({
        issuerBaseURL: process.env.AUTH0_DOMAIN,
        audience: process.env.AUTH0_AUDIENCE,
        ...(process.env.NODE_ENV === 'development' && {
          secret: process.env.JWT_SECRET,
          tokenSigningAlg: 'HS256',
        }),
      }),
    );

    try {
      await validateAccessToken(request, response);
      return true;
    } catch (error) {
      console.error('Error validating token:', error);

      if (error instanceof InvalidTokenError) {
        throw new UnauthorizedException('Bad credentials');
      }

      if (error instanceof UnauthorizedError) {
        throw new UnauthorizedException('Requires authentication');
      }

      // If there are any unexpected errors
      throw new InternalServerErrorException();
    }
  }
}

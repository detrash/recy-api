import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';
import { ZodError } from 'zod';

interface HttpExceptionResponse {
  message?: string | string[];
  [key: string]: unknown;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  private readonly prismaErrorMap: Record<
    string,
    { status: number; message: string }
  > = {
      P2002: {
        status: HttpStatus.BAD_REQUEST,
        message: 'Unique constraint violation',
      },
      P2025: { status: HttpStatus.NOT_FOUND, message: 'Record not found' },
    };

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorResponse = this.formatError(exception);

    this.logger.error(`Error: ${errorResponse.message}`, errorResponse.details);

    response.status(errorResponse.status).json({
      statusCode: errorResponse.status,
      message: errorResponse.message,
      details: errorResponse.details,
      timestamp: new Date().toISOString(),
    });
  }

  private formatError(exception: unknown): {
    status: number;
    message: string;
    details: Array<{ field?: string; message: string }> | null;
  } {
    if (exception instanceof ZodError) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        details: exception.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      };
    }

    if (exception instanceof PrismaClientKnownRequestError) {
      const prismaError = this.prismaErrorMap[exception.code] || {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Database error',
      };

      return {
        status: prismaError.status,
        message: prismaError.message,
        details: exception.meta
          ? [{ message: JSON.stringify(exception.meta) }]
          : null,
      };
    }

    if (exception instanceof HttpException) {
      const responseBody = exception.getResponse();

      if (this.isHttpExceptionResponse(responseBody)) {
        const messages = Array.isArray(responseBody.message)
          ? responseBody.message.map((msg) => ({ message: msg }))
          : [{ message: responseBody.message || exception.message }];

        return {
          status: exception.getStatus(),
          message: exception.message,
          details: messages,
        };
      }

      return {
        status: exception.getStatus(),
        message: exception.message,
        details: null,
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message:
        exception instanceof Error
          ? exception.message
          : 'Internal server error',
      details:
        exception instanceof Error
          ? [{ message: exception.stack || '' }]
          : null,
    };
  }

  private isHttpExceptionResponse(
    response: unknown,
  ): response is HttpExceptionResponse {
    return (
      typeof response === 'object' && response !== null && 'message' in response
    );
  }
}

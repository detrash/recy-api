import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';
import { ZodError } from 'zod';

interface HttpExceptionResponse {
  message?: string | string[];
  details?: ErrorDetail[];
  error?: string;
  [key: string]: unknown;
}

interface ErrorDetail {
  field?: string;
  model?: string;
  message: string;
}

interface ErrorResponse {
  statusCode: number;
  error: string;
  message: string;
  details: ErrorDetail[];
  timestamp: string;
  path: string;
  method: string;
}

const prismaErrorMap: Record<
  string,
  { status: number; error: string; message: string }
> = {
  P2000: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Value too long for the column',
  },
  P2001: {
    status: HttpStatus.NOT_FOUND,
    error: 'Not Found',
    message: 'Record does not exist',
  },
  P2002: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Unique constraint violation',
  },
  P2003: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Foreign key constraint failed',
  },
  P2004: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'A constraint failed on the database',
  },
  P2005: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Invalid value stored for field',
  },
  P2006: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Invalid value provided',
  },
  P2007: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Data validation error',
  },
  P2008: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Failed to parse the query',
  },
  P2009: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Failed to validate the query',
  },
  P2010: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Raw query failed',
  },
  P2011: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Null constraint violation',
  },
  P2012: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Missing a required value',
  },
  P2013: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Missing required argument or field',
  },
  P2014: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Relation violation',
  },
  P2015: {
    status: HttpStatus.NOT_FOUND,
    error: 'Not Found',
    message: 'A related record could not be found',
  },
  P2016: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Query interpretation error',
  },
  P2017: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Records for relation are not connected',
  },
  P2018: {
    status: HttpStatus.NOT_FOUND,
    error: 'Not Found',
    message: 'Required connected records not found',
  },
  P2019: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Input error',
  },
  P2020: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Value out of range',
  },
  P2021: {
    status: HttpStatus.NOT_FOUND,
    error: 'Not Found',
    message: 'Table not found in the database',
  },
  P2022: {
    status: HttpStatus.NOT_FOUND,
    error: 'Not Found',
    message: 'Column not found in the database',
  },
  P2023: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Inconsistent column data',
  },
  P2024: {
    status: HttpStatus.REQUEST_TIMEOUT,
    error: 'Request Timeout',
    message: 'Timed out fetching a new connection',
  },
  P2025: {
    status: HttpStatus.NOT_FOUND,
    error: 'Not Found',
    message: 'Record not found',
  },
  P2026: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Database provider does not support this feature',
  },
  P2027: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Multiple errors occurred during query execution',
  },
  P2028: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Transaction API error',
  },
  P2029: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Cannot find a fulltext index',
  },
  P2030: {
    status: HttpStatus.SERVICE_UNAVAILABLE,
    error: 'Service Unavailable',
    message: 'Cannot connect to the database server',
  },
  P2031: {
    status: HttpStatus.SERVICE_UNAVAILABLE,
    error: 'Service Unavailable',
    message: 'Cannot read from socket',
  },
  P2032: {
    status: HttpStatus.SERVICE_UNAVAILABLE,
    error: 'Service Unavailable',
    message: 'Cannot write to socket',
  },
  P2033: {
    status: HttpStatus.SERVICE_UNAVAILABLE,
    error: 'Service Unavailable',
    message: 'Error closing socket',
  },
  P2034: {
    status: HttpStatus.REQUEST_TIMEOUT,
    error: 'Request Timeout',
    message: 'Operation timed out',
  },
  P2035: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Cannot start a transaction because one is already in progress',
  },
  P2036: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Cannot commit or roll back a transaction if none is in progress',
  },
  P2037: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Operation failed for different reasons on different sub fields',
  },
  P2038: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Invalid argument value provided',
  },
  P2039: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Field does not exist',
  },
  P2040: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'The provided filter is not valid',
  },
  P2041: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Invalid DateTime value',
  },
  P2042: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Invalid combination of fields',
  },
  P2043: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Invalid JSON value',
  },
  P2044: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Invalid Bytes value',
  },
  P2045: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Value is too large for the field type',
  },
  P2046: {
    status: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
    message: 'Value is too small for the field type',
  },
};

function parsePrismaForeignKeyDetails(
  meta: Record<string, unknown>,
): ErrorDetail[] {
  const fieldName = (meta.field_name as string) || '';
  const modelName = (meta.modelName as string) || '';
  return [
    {
      field: fieldName,
      model: modelName,
      message: `Foreign key constraint violated. Referenced record does not exist in model "${modelName}".`,
    },
  ];
}

function getPrismaParsedResult(
  code: string,
  meta: unknown,
): { message: string; details: ErrorDetail[] } {
  let metaObj: Record<string, unknown> = {};
  if (meta && typeof meta === 'object') {
    metaObj = JSON.parse(JSON.stringify(meta));
  }
  switch (code) {
    case 'P2002': {
      const targets = Array.isArray(metaObj.target)
        ? metaObj.target.map(String)
        : [];
      const message = `Unique constraint violation on field(s): [${targets.join(
        ', ',
      )}]`;
      const details = targets.map<ErrorDetail>((field) => ({
        field,
        message: `Field "${field}" must be unique.`,
      }));
      return { message, details };
    }
    case 'P2003': {
      const details = parsePrismaForeignKeyDetails(metaObj);
      const combinedMessage = details.map((d) => d.message).join('; ');
      return { message: combinedMessage, details };
    }
    default: {
      const mapped = prismaErrorMap[code];
      if (!mapped) {
        const detailMessage = metaObj ? JSON.stringify(metaObj) : '';
        return {
          message: 'Database error',
          details: detailMessage ? [{ message: detailMessage }] : [],
        };
      }
      const detailMessage = metaObj ? JSON.stringify(metaObj) : '';
      return {
        message: mapped.message,
        details: detailMessage ? [{ message: detailMessage }] : [],
      };
    }
  }
}

function mapHttpStatusToErrorTitle(status: number): string | undefined {
  const map: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    500: 'Internal Server Error',
    503: 'Service Unavailable',
    408: 'Request Timeout',
  };
  return map[status];
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const errorResponse = this.createErrorResponse(exception, request);
    this.logger.error(
      `Error: ${errorResponse.message}`,
      JSON.stringify({
        error: errorResponse.error,
        details: errorResponse.details,
        path: errorResponse.path,
        method: errorResponse.method,
      }),
    );
    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private createErrorResponse(
    exception: unknown,
    request: Request,
  ): ErrorResponse {
    const baseErrorResponse: ErrorResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
      details: [],
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };
    if (exception instanceof ZodError) {
      return {
        ...baseErrorResponse,
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: 'Validation failed',
        details: exception.errors.map<ErrorDetail>((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    if (exception instanceof PrismaClientKnownRequestError) {
      const mapped = prismaErrorMap[exception.code] || {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Database Error',
        message: 'Database error',
      };
      const parsed = getPrismaParsedResult(exception.code, exception.meta);
      return {
        ...baseErrorResponse,
        statusCode: mapped.status,
        error: mapped.error,
        message: parsed.message,
        details: parsed.details,
      };
    }
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const responseBody = exception.getResponse();
      const httpError = {
        ...baseErrorResponse,
        statusCode,
        error: mapHttpStatusToErrorTitle(statusCode) || 'Error',
        message: exception.message,
        details: [] as ErrorDetail[],
      };
      if (
        typeof responseBody === 'object' &&
        responseBody !== null &&
        this.isHttpExceptionResponse(responseBody)
      ) {
        if (Array.isArray(responseBody.message)) {
          httpError.details = responseBody.message.map((msg) => ({
            message: typeof msg === 'string' ? msg : JSON.stringify(msg),
          }));
          httpError.message = httpError.details
            .map((d) => d.message)
            .join('; ');
        } else if (typeof responseBody.message === 'string') {
          httpError.message = responseBody.message;
        }
        if (Array.isArray(responseBody.details)) {
          httpError.details = [
            ...httpError.details,
            ...responseBody.details.map((d) => ({ ...d })),
          ];
        }
        if (responseBody.error && typeof responseBody.error === 'string') {
          httpError.error = responseBody.error;
        }
        return httpError;
      }
      return {
        ...httpError,
        message:
          typeof responseBody === 'string' ? responseBody : httpError.message,
      };
    }
    if (exception instanceof Error) {
      return {
        ...baseErrorResponse,
        message: exception.message,
        details: exception.stack ? [{ message: exception.stack }] : [],
      };
    }
    return baseErrorResponse;
  }

  private isHttpExceptionResponse(obj: unknown): obj is HttpExceptionResponse {
    return typeof obj === 'object' && obj !== null;
  }
}

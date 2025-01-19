import { BadRequestException, Logger, PipeTransform } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

export class ZodValidationPipe<T> implements PipeTransform {
  private readonly logger = new Logger(ZodValidationPipe.name);

  constructor(private readonly schema: ZodSchema<T>) { }

  transform(value: unknown): T {
    this.logger.log('Validating input...');
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        const errorDetails = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));

        this.logger.warn('Validation error', { details: errorDetails });

        throw new BadRequestException({
          message: 'Validation failed',
          error: 'Bad Request',
          details: errorDetails,
        });
      }

      this.logger.error('Unexpected error during validation', { error });
      throw error;
    }
  }
}

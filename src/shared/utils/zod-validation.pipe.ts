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
      const zodError = error as ZodError;
      const errorDetails = zodError.errors.map((e) => ({
        field: e.path.join('.'),
        issue: e.message,
        invalidValue: e.code,
      }));

      this.logger.warn('Validation error:', {
        details: errorDetails,
      });

      throw new BadRequestException({
        message: 'Validation failed',
        errors: errorDetails,
      });
    }
  }
}

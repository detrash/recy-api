import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  // TODO: remove anys and improve return off errors
  constructor(private schema: ZodSchema<any>) {}

  transform(value: any) {
    console.log(value);
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log('zod error', error);
        throw new BadRequestException({
          message: 'Validation failed',
          details: error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      throw error;
    }
  }
}

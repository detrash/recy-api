import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { ZodSchema } from 'zod';

@ValidatorConstraint({ name: 'ZodValidation', async: false })
export class ZodValidationPipe implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const schema = args.constraints[0] as ZodSchema;
    const result = schema.safeParse(value);
    return result.success;
  }

  defaultMessage(args: ValidationArguments) {
    const schema = args.constraints[0] as ZodSchema;
     if (!(schema instanceof ZodSchema)) {
    return 'Invalid schema provided to ZodValidationPipe';
  }
    const result = schema.safeParse(args.value);
    if (!result.success) {
      return result.error.errors[0].message;
    }
    return 'Invalid input';
  }
}

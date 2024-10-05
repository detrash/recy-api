import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateUserSchema = z.object({
  email: z
    .string({ message: 'wasteFootprint must be a string' })
    .email('Please make sure that this is e-mail is valid')
    .optional(),
  name: z.string({ message: 'name must be a string' }).optional(),
  phone: z.string({ message: 'phone must be a string' }).optional(),
  walletAddress: z.string({ message: 'phone must be a string' }).optional(),
  roleIds: z
    .array(z.string(), {
      message: 'Role IDs must be an array of strings',
    })
    .optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;

export class UpdateUserSwaggerDto extends createZodDto(UpdateUserSchema) {}

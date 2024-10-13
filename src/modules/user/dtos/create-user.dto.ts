import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z
    .string({ message: 'email must be a string' })
    .email({ message: 'Email is required' }),
  name: z.string({ message: 'name must be a string' }),
  phone: z.string({ message: 'phone must be a string' }).optional(),
  walletAddress: z
    .string({ message: 'walletAddress must be a string' })
    .optional(),
  roleIds: z.array(z.string(), {
    message: 'Role IDs must be an array of strings',
  }),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

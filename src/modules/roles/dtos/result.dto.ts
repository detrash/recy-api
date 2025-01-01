import { z } from 'zod';

export const RoleDtoSchema = z.object({
  id: z.string().uuid({ message: 'Role ID must be a valid UUID' }),
  name: z.string().min(1, { message: 'Role name cannot be empty' }),
});

export type RoleDto = z.infer<typeof RoleDtoSchema>;

export const ResultDtoSchema = z.object({
  roles: z.array(RoleDtoSchema),
});

export type ResultDto = z.infer<typeof ResultDtoSchema>;

import { z } from 'zod';


export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');


export const walletAddressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum wallet address');


export const emailSchema = z.string().email('Invalid email address');


export const auth0UserIdSchema = z
  .string()
  .regex(/^auth0\|[a-zA-Z0-9]{24,32}$/, 'Invalid Auth0 User ID format');


export const profileTypeSchema = z.enum(['HODLER', 'RECYCLER', 'WASTE_GENERATOR']);


export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: emailSchema,
  phoneNumber: phoneSchema,
  authUserId: auth0UserIdSchema,
  profileType: profileTypeSchema,
});


export const formSchema = z.object({
  walletAddress: walletAddressSchema.optional(),
});
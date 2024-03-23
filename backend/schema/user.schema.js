import { z } from "zod";

export const userRegistrationSchema = z.object({
  userName: z.string().min(2),
  contactNumber: z.coerce.number().positive().gt(1000000000).lte(9999999999),
  emailId: z.string().email(),
  password: z.string().min(6),
});

export const userLoginSchema = z.object({
  emailId: z.string().email(),
  password: z.string().min(6),
});

export const forgotPasswordSchema = z.object({
  emailId: z.string().email(),
});

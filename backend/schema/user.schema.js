import { z } from "zod";

export const userRegistrationSchema = z.object({
  userName: z.string().min(2),
  contactNumber: z.coerce.number().positive().gt(1000000000).lte(9999999999),
  emailId: z.string().email(),
  city: z.string().min(3),
  password: z.string().min(6),
  gender: z.enum(["male", "female", "others"]),
  selectedCourses: z
    .object({
      english: z.string(),
      marathi: z.string(),
    })
    .partial()
    .refine((data) => {
      return !!data.english || !!data.marathi;
    }, "At least one course must be selected"),
});

export const userLoginSchema = z.object({
  emailId: z.string().email(),
  password: z.string().min(6),
});

export const forgotPasswordSchema = z.object({
  emailId: z.string().email(),
});

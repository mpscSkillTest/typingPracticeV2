"use client";
import { z } from "zod";

const contactNumberValidationError = {
  message: "Contact Number must be valid",
};

const userRegistrationSchema = z.object({
  userName: z.string().min(2, {
    message: "Name must be at least 2 characters",
  }),
  contactNumber: z.coerce
    .number()
    .positive(contactNumberValidationError) // Make sure it's an integer
    .gt(1000000000, contactNumberValidationError) // Greater than or equal to the smallest 10 digit int
    .lte(9999999999, contactNumberValidationError),
  emailId: z.string().email("This is not a valid email"),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 letters long" }),
});

export type UserRegistrationSchema = z.infer<typeof userRegistrationSchema>;

export default userRegistrationSchema;

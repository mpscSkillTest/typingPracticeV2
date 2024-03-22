"use client";
import { z } from "zod";

const userLoginSchema = z.object({
  emailId: z.string().email("This is not a valid email"),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 letters long" }),
});

export type UserLoginSchema = z.infer<typeof userLoginSchema>;

export default userLoginSchema;

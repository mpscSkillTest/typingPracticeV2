import { z } from "zod";

const userPasswordResetSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 letters long" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 letters long" }),
  })
  .refine(
    ({ password, confirmPassword }) => {
      return password === confirmPassword;
    },
    {
      message: "Passwords don't match",
      path: ["confirmPassword"], // path of error
    }
  );

export type UserPasswordResetSchema = z.infer<typeof userPasswordResetSchema>;

export default userPasswordResetSchema;

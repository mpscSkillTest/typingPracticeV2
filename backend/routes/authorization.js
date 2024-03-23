import { Router } from "express";
import {
  loginStudent,
  forgotStudentPassword,
  registerStudent,
  verifyStudent,
  logoutStudent,
} from "../controllers/index.js";
import {
  userLoginSchema,
  userRegistrationSchema,
  forgotPasswordSchema,
} from "../schema/user.schema.js";
import { validateData } from "../middlewares/validationMiddleWare.js";

const AuthorizationRouter = Router();

AuthorizationRouter.post(
  "/register",
  validateData(userRegistrationSchema),
  registerStudent
);

AuthorizationRouter.post("/login", validateData(userLoginSchema), loginStudent);

AuthorizationRouter.post(
  "/forgotPassword",
  validateData(forgotPasswordSchema),
  forgotStudentPassword
);

AuthorizationRouter.post("/verify", verifyStudent);

AuthorizationRouter.post("/logout", logoutStudent);

export default AuthorizationRouter;

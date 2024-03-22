import { Router } from "express";
import {
  loginStudent,
  forgotStudentPassword,
  registerStudent,
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

export default AuthorizationRouter;

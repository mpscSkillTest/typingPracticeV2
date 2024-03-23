import { Router } from "express";
import {
  login,
  forgotPassword,
  signup,
  logout,
  verify,
} from "../controllers/index.js";
import {
  userLoginSchema,
  userRegistrationSchema,
  forgotPasswordSchema,
} from "../schema/user.schema.js";
import { validateFormData } from "../middlewares/index.js";

const AuthorizationRouter = Router();

AuthorizationRouter.post(
  "/signup",
  validateFormData(userRegistrationSchema),
  signup
);

AuthorizationRouter.post("/login", validateFormData(userLoginSchema), login);

AuthorizationRouter.post(
  "/forgotPassword",
  validateFormData(forgotPasswordSchema),
  forgotPassword
);

AuthorizationRouter.post("/verify", verify);

AuthorizationRouter.post("/logout", logout);

export default AuthorizationRouter;

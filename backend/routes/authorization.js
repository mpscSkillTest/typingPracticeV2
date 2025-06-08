import { Router } from "express";
import {
  login,
  forgotPassword,
  signup,
  logout,
  verify,
  resetPassword,
  oauthSignin,
} from "../controllers/index.js";
import {
  userLoginSchema,
  userRegistrationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
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
  "/forgot-password",
  validateFormData(forgotPasswordSchema),
  forgotPassword
);

AuthorizationRouter.post(
  "/reset-password",
  validateFormData(resetPasswordSchema),
  resetPassword
);

AuthorizationRouter.post(
  "/oauth-signin",
  oauthSignin
);





AuthorizationRouter.post("/verify", verify);
AuthorizationRouter.post("/logout", logout);

export default AuthorizationRouter;

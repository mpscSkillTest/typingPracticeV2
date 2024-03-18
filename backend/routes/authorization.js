import { Router } from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  verifyUser,
} from "../controllers/authorization.js";

const AuthorizationRouter = Router();

AuthorizationRouter.route("/verify").post(verifyUser);
AuthorizationRouter.route("/register").post(registerUser);
AuthorizationRouter.route("/login").post(loginUser);
AuthorizationRouter.route("/forgotPassword").post(forgotPassword);

export default AuthorizationRouter;

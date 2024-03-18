import express from "express";
import cors from "cors";
import { USER_AUTHORIZATION_API } from "./constant.js";
import AuthorizationRouter from "./routes/authorization.js";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

//middleware or to set router
app.use(USER_AUTHORIZATION_API, AuthorizationRouter);

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`${PORT} Yes I am connected`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

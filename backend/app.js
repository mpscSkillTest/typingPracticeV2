import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { config } from "dotenv";
import { USER_AUTHORIZATION_API } from "./constant.js";
import AuthorizationRouter from "./routes/authorization.js";

const app = express();

// initialize env variables
config();

// support cross origin resource request
app.use(cors());

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

//middleware or to set router
app.use(USER_AUTHORIZATION_API, AuthorizationRouter);

//when undefined route is called by client then hit following error message
app.all("*", (req, res, next) => {
  const errorMessage = `${req.originalUrl} resource not available on the server`;
  const error = new Error(errorMessage);
  error.status = "Something Broke";
  error.statusCode = 404;

  // passing argument to next will let express know to throw error
  next(error);
});

// following code block will be used to handle errors at global level
// this will throw error which will be required to handle on UI
// error handling middleware default error code will be 500
app.use((error, req, res, next) => {
  const { statusCode = 500, message = "Something broke" } = error || {};
  res.status(statusCode).json({ status: statusCode, message });
});

const start = async () => {
  try {
    app.listen(process.env.PORT, () => {
      console.log(`${process.env.PORT} Yes I am connected`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

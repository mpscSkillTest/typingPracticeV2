import { config } from "dotenv";
import winston from "winston";
import { PapertrailTransport } from "winston-papertrail-transport";
import os from "os";

config();

const env = process.env.NODE_ENV || "development";
const isDevelopment = env === "development";
// Define your severity levels.
// With them, You can create log files,
// see or hide levels based on the running ENV.
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// This method set the current severity based on
// the current NODE_ENV: show all the log levels
// if the server was run in development mode; otherwise,
// if it was run in production, show only warn and error messages.
const level = () => {
  return isDevelopment ? "debug" : "warn";
};

// Define different colors for each level.
// Colors make the log message more visible,
// adding the ability to focus or ignore messages.
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

// Tell winston that you want to link the colors
// defined above to the severity levels.
winston.addColors(colors);

// Chose the aspect of your log customizing the log format.
const format = winston.format.combine(
  // Add the message timestamp with the preferred format
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  // Tell Winston that the logs must be colored
  winston.format.colorize({ all: true }),
  // Define the format of the message showing the timestamp, the level and the message
  winston.format.printf(
    (info) =>
      `typing practice - ${env}  ${info.timestamp} ${info.level}: ${info.message}`
  )
);

const options = {
  host: process.env.LOGGER_HOST,
  port: process.env.LOGGER_PORT,
  app_name: "mpsc-skilltest",
  localhost: os.hostname(),
};

// Define which transports the logger must use to print out messages.
// In this example, we are using three different transports
const transports = [
  // Allow the use the console to print the messages
  new winston.transports.Console({ eol: "\n" }),
];

// Add Papertrail transport only for production
if (env === "production") {
  transports.push(new winston.transports(PapertrailTransport(options)));
}

// Create the logger instance that has to be exported
// and used to log messages.
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

if (!isDevelopment) {
  logger.info("application running on prod");
}

export default logger;

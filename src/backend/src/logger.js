import { pino } from "pino";
import process from "process";

export default pino(
  {
    transport: process.env.NODE_ENV === "development" ? {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    }: undefined,
    level: process.env.LOG_LEVEL || "info"
  }, 
);


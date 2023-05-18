import dotenv from "dotenv";
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";

import { routes } from "./routes";
import { InternalError } from "./config/GenerateErros";
import { exceptionHandler } from "./utils/exceptionHandler";
import { Settings } from "luxon";

Settings.defaultZone = "UTC";

const app = express();

dotenv.config();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(routes);

app.use(
  (err: InternalError, req: Request, res: Response, next: NextFunction) => {
    const { status, ...rest } = exceptionHandler(err);

    if (err) {
      res.status(status).json({ status, ...rest });
    }
  }
);

export { app };

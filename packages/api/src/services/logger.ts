import pinoCaller from "pino-caller";
import pino from "pino";

export const logger = pinoCaller(pino());

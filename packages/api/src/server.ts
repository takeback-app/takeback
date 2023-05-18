import "reflect-metadata";
import "express-async-errors";

import { createServer } from "http";

import dotenv from "dotenv";

dotenv.config();

import { app } from "./app";

import "./database";

const httpServer = createServer(app);

const PORT = +process.env.PORT || 3333;
const HOST = "0.0.0.0";

httpServer.listen({ port: PORT, host: HOST });

console.log(`🚀 Server is running in HOST: ${HOST} on PORT: ${PORT}`);

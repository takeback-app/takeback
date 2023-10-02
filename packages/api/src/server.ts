import 'reflect-metadata'
import 'express-async-errors'

import dotenv from 'dotenv'
import { createServer } from 'http'

import { app } from './app'

import { connectTypeorm } from './database'

dotenv.config()

connectTypeorm()

const httpServer = createServer(app)

const PORT = +process.env.PORT || 3333
const HOST = '0.0.0.0'

httpServer.listen({ port: PORT, host: HOST })

console.log(`🚀 Server is running in HOST: ${HOST} on PORT: ${PORT}`)

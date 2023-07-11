import 'dotenv/config'
import cors from 'cors'
import express, { Request, Response, NextFunction } from 'express'
import * as Sentry from '@sentry/node'

import { Settings } from 'luxon'
import { routes } from './routes'
import { InternalError } from './config/GenerateErros'
import { exceptionHandler } from './utils/exceptionHandler'

Settings.defaultZone = 'UTC'

Sentry.init({
  dsn: process.env.SENTRY_DSN || '',
})

const app = express()

app.use(Sentry.Handlers.requestHandler())

app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(routes)

app.use(Sentry.Handlers.errorHandler())

app.use(
  (err: InternalError, req: Request, res: Response, next: NextFunction) => {
    const { status, ...rest } = exceptionHandler(err)

    if (err) {
      res.status(status).json({ status, ...rest })
    }
  },
)

export { app }

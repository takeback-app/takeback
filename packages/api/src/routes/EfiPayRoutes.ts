import { Router } from 'express'
import EfiPayController from '../controllers/integration/EfiPayController'
import { EfiWebhookMiddleware } from '../middlewares/EfiWebhookMiddleware'

const routes = Router()

routes.use(EfiWebhookMiddleware)

routes.post('/webhook', EfiPayController.webhook)

export const EfiPayRoutes = routes

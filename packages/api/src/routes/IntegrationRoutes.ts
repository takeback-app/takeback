import { Router } from 'express'
import LoginController from '../controllers/integration/LoginController'
import { AccessTokenMiddleware } from '../middlewares/AccessTokenMiddleware'
import { AuthIntegrationMiddleware } from '../middlewares/AuthIntegrationMiddleware'
import SessionController from '../controllers/integration/SessionController'
import IntegrationSettingsController from '../controllers/integration/IntegrationSettingsController'
import NfceController from '../controllers/integration/NfceController'

const routes = Router()

routes.post('/login', LoginController.handle)

routes.use(AccessTokenMiddleware, AuthIntegrationMiddleware)

routes.get('/me', SessionController.me)
routes.put('/integration-settings', IntegrationSettingsController.update)

routes.post('/nfc-e', NfceController.store)

export const IntegrationRoutes = routes

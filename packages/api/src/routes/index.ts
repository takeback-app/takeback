import express, { Request, Response } from 'express'
import { resolve } from 'path'

import SupportRoutes from './SupportRoutes'
import CostumerRoutes from './CostumerRoutes'
import CompanyRoutes from './CompanyRoutes'
import ManagerRoutes from './ManagerRoutes'
import representativeRoutes from './RepresentativeRoutes'
import sharedRoutes from './sharedRoutes'
import { IntegrationRoutes } from './IntegrationRoutes'
import { EfiPayRoutes } from './EfiPayRoutes'

const routes = express()

routes.get('/', (request: Request, response: Response) => {
  return response.status(200).send('TAKE BACK!')
})

routes.use('/costumer', CostumerRoutes)
routes.use('/company', CompanyRoutes)
routes.use('/manager', ManagerRoutes)
routes.use('/support', SupportRoutes)
routes.use('/representative', representativeRoutes)
routes.use('/shared', sharedRoutes)
routes.use('/integration', IntegrationRoutes)
routes.use('/efipay', EfiPayRoutes)
routes.use(
  '/uploads',
  express.static(resolve(__dirname, '..', '..', 'uploads')),
)

export { routes }

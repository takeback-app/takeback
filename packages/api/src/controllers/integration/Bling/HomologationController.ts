import { Request, Response } from 'express'
import { BlingIntegration } from '../../../useCases/Bling/BlingIntegration'
import { BlingHomologation } from '../../../useCases/Bling/BlingHomologation'

class HomologationController {
  async handle(request: Request, response: Response) {
    const { code } = request.query as Record<string, string>

    const clientId = process.env.BLING_CLIENT_ID
    const clientSecret = process.env.BLING_CLIENT_SECRET

    const integration = new BlingIntegration(clientId, clientSecret)

    await integration.authenticate(code)

    const blingHomologation = new BlingHomologation(integration)

    const productData = await blingHomologation.getProduct()
    const product = await blingHomologation.createProduct(productData)
    await blingHomologation.updateProduct(product.id, {
      nome: 'Copo',
      preco: 32.56,
      codigo: 'COD-4587',
    })
    await blingHomologation.setProductSituation(product.id)
    await blingHomologation.deleteProduct(product.id)

    return response.status(204).json()
  }
}

export default new HomologationController()

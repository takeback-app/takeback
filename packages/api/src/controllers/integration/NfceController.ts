import { Request, Response } from 'express'
import CreateNfceUseCase from '../../useCases/integration/CreateNfceUseCase'

class NfceController {
  async store(request: Request, response: Response) {
    const companyId = request['companyId']

    const { path, content } = request.body

    await CreateNfceUseCase.handle(companyId, path, content)

    return response.status(200).json({ message: 'ok' })
  }
}

export default new NfceController()

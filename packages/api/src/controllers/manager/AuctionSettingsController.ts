import { Request, Response } from 'express'
import { InternalError } from '../../config/GenerateErros'
import { UpdateAuctionSettingsRequest } from '../../requests/UpdateAuctionSettingsRequest'
import { GetAuctionSettingsUseCase } from '../../useCases/auction/GetAuctionSettingsUseCase'
import { UpdateAuctionSettingsUseCase } from '../../useCases/auction/UpdateAuctionSettingsUseCase'

export class AuctionSettingsController {
  async index(_request: Request, response: Response) {
    const settings = await new GetAuctionSettingsUseCase().execute()

    return response.json(settings)
  }

  async update(request: Request, response: Response) {
    const form = UpdateAuctionSettingsRequest.safeParse(request.body)

    if (form.success === false) {
      throw new InternalError(form.error.issues[0].message, 400)
    }

    const settings = await new UpdateAuctionSettingsUseCase().execute(
      form.data as Required<typeof form.data>,
    )

    return response.json({
      message: 'Configurações do Desapega atualizadas com sucesso',
      settings,
    })
  }
}

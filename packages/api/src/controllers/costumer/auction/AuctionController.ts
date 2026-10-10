import { Request, Response } from 'express'
import { InternalError } from '../../../config/GenerateErros'
import { ListAuctionsRequest } from '../../../requests/ListAuctionsRequest'
import { GetAuctionSettingsUseCase } from '../../../useCases/auction/GetAuctionSettingsUseCase'
import { ListActiveAuctionsUseCase } from '../../../useCases/auction/ListActiveAuctionsUseCase'

export class AuctionController {
  async index(request: Request, response: Response) {
    const form = ListAuctionsRequest.safeParse(request.query)

    if (!form.success) {
      throw new InternalError('Filtros inválidos', 400)
    }

    const auctions = await new ListActiveAuctionsUseCase().execute(
      form.data as Required<typeof form.data>,
    )

    return response.json(auctions)
  }

  async settings(_request: Request, response: Response) {
    const settings = await new GetAuctionSettingsUseCase().execute()

    return response.json(settings)
  }
}

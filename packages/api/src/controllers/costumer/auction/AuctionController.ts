import { Request, Response } from 'express'
import { InternalError } from '../../../config/GenerateErros'
import { isUuid } from '../../../utils'
import { ListAuctionsRequest } from '../../../requests/ListAuctionsRequest'
import { GetAuctionSettingsUseCase } from '../../../useCases/auction/GetAuctionSettingsUseCase'
import { ListActiveAuctionsUseCase } from '../../../useCases/auction/ListActiveAuctionsUseCase'
import { GetAuctionDetailUseCase } from '../../../useCases/auction/GetAuctionDetailUseCase'

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

  async show(request: Request, response: Response) {
    const { id } = request.params

    if (!isUuid(id)) {
      throw new InternalError('Anúncio não encontrado', 404)
    }

    const auction = await new GetAuctionDetailUseCase().execute({ id })

    return response.json(auction)
  }

  async settings(_request: Request, response: Response) {
    const settings = await new GetAuctionSettingsUseCase().execute()

    return response.json(settings)
  }
}

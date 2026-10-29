import { AuctionStatus } from '@prisma/client'
import { Request, Response } from 'express'
import { InternalError } from '../../../config/GenerateErros'
import { SaveAuctionDraftRequest } from '../../../requests/SaveAuctionDraftRequest'
import { ensureAuctionsEnabled } from '../../../useCases/auction/GetAuctionSettingsUseCase'
import { UploadAuctionImageUseCase } from '../../../useCases/auction/AuctionImages'
import {
  AuctionDraftData,
  DeleteAuctionDraftUseCase,
  GetOwnAuctionUseCase,
  ListOwnAuctionsUseCase,
  SaveAuctionDraftUseCase,
} from '../../../useCases/auction/OwnAuctionsUseCases'
import { isUuid } from '../../../utils'

function auctionIdParam(request: Request) {
  const { id } = request.params

  if (!isUuid(id)) {
    throw new InternalError('Anúncio não encontrado', 404)
  }

  return id
}

function parseDraft(request: Request) {
  const form = SaveAuctionDraftRequest.safeParse(request.body)

  if (form.success === false) {
    throw new InternalError(form.error.issues[0].message, 400)
  }

  return form.data as AuctionDraftData
}

export class MyAuctionController {
  async uploadImage(request: Request, response: Response) {
    await ensureAuctionsEnabled()

    const image = await new UploadAuctionImageUseCase().execute(request.file)

    return response.status(201).json(image)
  }

  async index(request: Request, response: Response) {
    const { status } = request.query

    if (
      status &&
      !Object.values(AuctionStatus).includes(status as AuctionStatus)
    ) {
      throw new InternalError('Status inválido', 400)
    }

    const auctions = await new ListOwnAuctionsUseCase().execute(
      request['tokenPayload'].id,
      status as AuctionStatus | undefined,
    )

    return response.json(auctions)
  }

  async show(request: Request, response: Response) {
    const auction = await new GetOwnAuctionUseCase().execute(
      request['tokenPayload'].id,
      auctionIdParam(request),
    )

    return response.json(auction)
  }

  async store(request: Request, response: Response) {
    const auction = await new SaveAuctionDraftUseCase().execute(
      request['tokenPayload'].id,
      parseDraft(request),
    )

    return response.status(201).json(auction)
  }

  async update(request: Request, response: Response) {
    const auctionId = auctionIdParam(request)

    const auction = await new SaveAuctionDraftUseCase().execute(
      request['tokenPayload'].id,
      parseDraft(request),
      auctionId,
    )

    return response.json(auction)
  }

  async destroy(request: Request, response: Response) {
    await new DeleteAuctionDraftUseCase().execute(
      request['tokenPayload'].id,
      auctionIdParam(request),
    )

    return response.status(204).send()
  }
}

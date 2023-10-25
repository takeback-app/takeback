import { Request, Response } from 'express'
import { QRCodeType } from '@prisma/client'
import { prisma } from '../../../prisma'
import { nfceLinks } from '../../../config/nfce-links'

export class QRCodeController {
  async store(request: Request, response: Response) {
    const { id: consumerId } = request['tokenPayload']

    const { link, companyUserId, companyId } = request.body as Record<
      string,
      string
    >

    const alreadyExistQRCode = await prisma.qRCode.findFirst({
      where: { link },
    })

    if (alreadyExistQRCode) {
      if (alreadyExistQRCode.companyId !== companyId) {
        return response.status(400).json({
          message: 'O QRCode pertence a outra empresa',
        })
      }
      if (alreadyExistQRCode.consumerId !== consumerId) {
        return response.status(400).json({
          message: 'O QRCode já foi usado por outro usuário',
        })
      }
      if (alreadyExistQRCode.type === QRCodeType.WAITING) {
        return response.status(400).json({
          message: 'O QRCode já foi utilizado e está aguardando validação',
        })
      }
      if (alreadyExistQRCode.type === QRCodeType.NOT_VALIDATED) {
        return response.status(400).json({
          message:
            'O QRCode inválido. Solicite do estabelecimento o lançamento manual.',
        })
      }
      return response.status(400).json({
        message: 'O QRCode já foi utilizado',
      })
    }

    const isValidLink = nfceLinks.some((l) => link.includes(l))

    if (!isValidLink) {
      return response.status(400).json({
        message:
          'QRCode em contingencia ou inválido. Solicite do estabelecimento o lançamento manual.',
      })
    }

    await prisma.qRCode.create({
      data: { link, consumerId, companyUserId, companyId },
    })

    return response
      .status(201)
      .json({ message: 'QRCode cadastrado com sucesso' })
  }
}

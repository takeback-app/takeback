import { Request, Response } from 'express'
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
      return response.status(400).json({ message: 'QRCode já lido' })
    }

    const isValidLink = nfceLinks.some((l) => link.includes(l))

    if (!isValidLink) {
      return response.status(400).json({ message: 'QRCode invalido' })
    }

    await prisma.qRCode.create({
      data: { link, consumerId, companyUserId, companyId },
    })

    return response
      .status(201)
      .json({ message: 'QRCode cadastrado com sucesso' })
  }
}

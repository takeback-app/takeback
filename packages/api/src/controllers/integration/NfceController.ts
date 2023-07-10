import { Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import GetNfceUseCase from '../../useCases/integration/GetNfceUseCase'
import { prisma } from '../../prisma'
import { getNFCePaymentMethod } from '../../enum/NfcePaymentMethodEnum'

class NfceController {
  async store(request: Request, response: Response) {
    const companyId = request['companyId']

    const { path, content } = request.body

    const nfce = GetNfceUseCase.handle(content)

    const issuedAt = new Date(nfce.nfeProc.NFe.infNFe.ide.dhEmi)

    const detPag = nfce.nfeProc.NFe.infNFe.pag.detPag

    const manyDetPag = Array.isArray(detPag) ? detPag : [detPag]

    const nfcePayments: Prisma.NFCePaymentCreateManyNFCeInput[] =
      manyDetPag.map(({ tPag, vPag }) => ({
        value: vPag,
        method: getNFCePaymentMethod(tPag),
        tPag,
      }))

    await prisma.nFCe.create({
      data: {
        path,
        companyId,
        nfcePayments: { createMany: { data: nfcePayments } },
        issuedAt,
      },
    })

    return response.status(200).json({ message: 'ok' })
  }
}

export default new NfceController()

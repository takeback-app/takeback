import { Prisma } from '@prisma/client'
import GetNfceUseCase from './GetNfceUseCase'
import { getNFCePaymentMethod } from '../../enum/NfcePaymentMethodEnum'
import { prisma } from '../../prisma'

class CreateNfceUseCase {
  handle(companyId: string, path: string, content: string) {
    const nfce = GetNfceUseCase.handle(content)

    const issuedAt = new Date(nfce.infNFe.ide.dhEmi)
    const detPag = nfce.infNFe.pag.detPag
    const vTroco = nfce.infNFe.pag.vTroco
    const manyDetPag = Array.isArray(detPag) ? detPag : [detPag]

    const nfcePayments: Prisma.NFCePaymentCreateManyNFCeInput[] =
      manyDetPag.map(({ tPag, vPag }) => {
        if (vTroco && tPag === 1) {
          vPag -= vTroco
        }

        return {
          value: vPag,
          method: getNFCePaymentMethod(tPag),
          tPag,
        }
      })

    return prisma.nFCe.create({
      data: {
        path,
        companyId,
        nfcePayments: { createMany: { data: nfcePayments } },
        issuedAt,
      },
    })
  }
}

export default new CreateNfceUseCase()

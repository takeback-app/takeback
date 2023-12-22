import { DateTime } from 'luxon'
import { z } from 'zod'
import { InternalError } from '../config/GenerateErros'
import { parseNumber, unMaskCpfAndCnpj } from '../utils/Masks'

const RequestBodySchema = z.object({
  Cnpj: z.string(),
  Num_Venda: z.string(),
  CPF: z.string(),
  Data_hora_compra: z.string(),
  Valor_total: z.string(),
  Operador_caixa: z.string().optional(),
  CPF_oper_caixa: z.string().optional(),
  Vendedor: z.string().optional(),
  CPF_vendedor: z.string().optional(),
  Troco_Cash: z.string(),
  Cond_Pag: z.array(
    z.object({
      Condicao: z.string(),
      Valor_pag_cond: z.string(),
    }),
  ),
})

export type RequestBody = z.infer<typeof RequestBodySchema>

interface SellDto {
  cnpj: string
  sellId: string
  consumerCpf: string
  companyUserCpf: string
  createdAt: Date
  totalAmount: number
  backAmount: number
  hasBackAmount: boolean
  paymentMethods: {
    tPag: number
    value: number
  }[]
}

export class CMMSellRequest {
  public static getDataFormatted(data: RequestBody): SellDto {
    const form = RequestBodySchema.safeParse(data)

    if (!form.success) {
      throw new InternalError('Existem erros nos dados enviados', 400)
    }
    const companyUserCpf = form.data.CPF_oper_caixa
      ? unMaskCpfAndCnpj(form.data.CPF_oper_caixa)
      : unMaskCpfAndCnpj(form.data.CPF_vendedor)

    const hasBackAmount = form.data.Troco_Cash === 'Sim'
    return {
      cnpj: unMaskCpfAndCnpj(form.data.Cnpj),
      sellId: form.data.Num_Venda,
      consumerCpf: unMaskCpfAndCnpj(form.data.CPF),
      companyUserCpf,
      createdAt: DateTime.fromFormat(
        form.data.Data_hora_compra,
        'dd-MM-yyyy HH:mm:ss',
      ).toJSDate(),
      totalAmount: parseNumber(form.data.Valor_total),
      hasBackAmount,
      backAmount: hasBackAmount ? 0 : undefined,
      paymentMethods: form.data.Cond_Pag.map((pag) => ({
        tPag: Number(pag.Condicao.split(' - ')[0]),
        value: parseNumber(pag.Valor_pag_cond),
      })),
    }
  }
}

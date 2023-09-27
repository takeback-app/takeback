import { DateTime } from 'luxon'

export interface RequestBody {
  Cnpj: string
  Num_Venda: string
  CPF: string
  Vendedores_Venda: {
    Vendedor: string
    CPF_Vendedor: string
  }[]
  Data_hora_compra: string
  Valor_total: string
  Troco_Cash: string
  Cond_Pag: {
    Condicao: string
    Valor_pag_cond: string
  }[]
}

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
    const hasBackAmount = data.Troco_Cash === 'Sim'
    return {
      cnpj: data.Cnpj,
      sellId: data.Num_Venda,
      consumerCpf: data.CPF,
      companyUserCpf: data.Vendedores_Venda[0].CPF_Vendedor.replace(
        /[.-]/g,
        '',
      ),
      createdAt: DateTime.fromFormat(
        data.Data_hora_compra,
        'dd-MM-yyyy HH:mm:ss',
      ).toJSDate(),
      totalAmount: Number(data.Valor_total),
      hasBackAmount,
      backAmount: hasBackAmount ? 0 : undefined,
      paymentMethods: data.Cond_Pag.map((pag) => ({
        tPag: Number(pag.Condicao.split(' - ')[0]),
        value: Number(pag.Valor_pag_cond),
      })),
    }
  }
}

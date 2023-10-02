export interface ErrorReturn {
  nome: string
  mensagem: string
}

export interface PixCreateImmediateChargeBody {
  calendario: {
    expiracao: number
  }
  devedor: {
    cpf?: string
    cnpj?: string
    nome: string
  }
  valor: {
    original: string
  }
  chave: string
  solicitacaoPagador?: string
}

export interface PixCreateImmediateChargeReturn {
  calendario: {
    criacao: string
    expiracao: number
  }
  txid: string
  revisao: number
  loc: {
    id: number
    location: string
    tipoCob: string
  }
  location: string
  status: string
  devedor: {
    cnpj: string
    nome: string
  }
  valor: {
    original: string
  }
  chave: string
  solicitacaoPagador: string
}

export interface PixGenerateQRCodeReturn {
  qrcode: string
  imagemQrcode: string
  linkVisualizacao: string
}

export interface PixCreateImmediateChargeDTO {
  expirationInSeconds?: number
  documentKey?: 'cpf' | 'cnpj'
  document: string
  name: string
  value: number
  message?: string
}

export interface PixEvent {
  endToEndId: string
  txid: string
  chave: string
  valor: string
  horario: string
  infoPagador: string
}

export interface PixWebhookRequest {
  pix: PixEvent[]
}

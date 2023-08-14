/* eslint-disable no-use-before-define */
import { BlingIntegration } from './BlingIntegration'

export class BlingHomologation {
  protected homologationHeader: string

  constructor(protected integration: BlingIntegration) {}

  private getHeaders() {
    return {
      'x-bling-homologacao': this.homologationHeader,
    }
  }

  public async getProduct() {
    const { data, headers } = await this.integration
      .api()
      .get<GetProductResponse>('homologacao/produtos')

    this.homologationHeader = headers['x-bling-homologacao']

    return data.data
  }

  public async createProduct(productDto: ProductDTO) {
    const { data, headers } = await this.integration
      .api()
      .post<CreateProductResponse>('homologacao/produtos', productDto, {
        headers: this.getHeaders(),
      })

    this.homologationHeader = headers['x-bling-homologacao']

    return data.data
  }

  public async updateProduct(id: number, productDto: ProductDTO) {
    const { headers } = await this.integration
      .api()
      .put(`homologacao/produtos/${id}`, productDto, {
        headers: this.getHeaders(),
      })

    this.homologationHeader = headers['x-bling-homologacao']
  }

  public async setProductSituation(id: number) {
    const { headers } = await this.integration.api().patch(
      `homologacao/produtos/${id}/situacoes`,
      { situacao: 'I' },
      {
        headers: this.getHeaders(),
      },
    )

    this.homologationHeader = headers['x-bling-homologacao']
  }

  public async deleteProduct(id: number) {
    await this.integration.api().delete(`homologacao/produtos/${id}`, {
      headers: this.getHeaders(),
    })
  }
}

export type GetProductResponse = {
  data: {
    nome: string
    preco: number
    codigo: string
  }
}

export type ProductDTO = {
  nome: string
  preco: number
  codigo: string
}

export type CreateProductResponse = {
  data: {
    nome: string
    preco: number
    codigo: string
    id: number
  }
}

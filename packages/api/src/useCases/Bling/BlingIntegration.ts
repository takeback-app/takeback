import axios, { AxiosError, AxiosInstance } from 'axios'
import { TokenResponse } from './types'
import { InternalError } from '../../config/GenerateErros'

export class BlingIntegration {
  protected baseApi: AxiosInstance

  protected accessToken: string
  protected refreshToken: string

  constructor(clientId: string, clientSecret: string) {
    this.baseApi = axios.create({
      baseURL: 'https://www.bling.com.br/Api/v3',
      headers: {
        'Content-Type': 'application/json',
      },
      auth: {
        username: clientId,
        password: clientSecret,
      },
    })

    this.setupApiInterceptor()
  }

  private setupApiInterceptor() {
    this.baseApi.interceptors.response.use(
      (response) => response,
      async (e) => {
        const error = e as AxiosError<any>

        const config = error?.config as any

        if (error?.response?.status === 401 && !config?.sent) {
          this.accessToken = undefined
          config.sent = true

          await this.refresh()

          if (this.accessToken) {
            config.headers = {
              ...config.headers,
              authorization: `Bearer ${this.accessToken}`,
            }
          }

          return this.baseApi(config)
        }

        if (error.response.data.error?.description) {
          return Promise.reject(
            new InternalError(error.response.data.error.description, 400),
          )
        }

        return Promise.reject(error)
      },
    )
  }

  private setBearerToken() {
    this.baseApi.defaults.headers.common.Authorization = `Bearer ${this.accessToken}`
  }

  public api() {
    return this.baseApi
  }

  public async authenticate(code: string) {
    const { data } = await this.baseApi.post<TokenResponse>('oauth/token', {
      grant_type: 'authorization_code',
      code,
    })

    this.accessToken = data.access_token
    this.refreshToken = data.refresh_token

    console.log(data)

    this.setBearerToken()
  }

  public async refresh() {
    if (!this.refreshToken) {
      throw new Error('Refresh Token não encontrado')
    }

    const { data } = await this.baseApi.post<TokenResponse>('oauth/token', {
      grant_type: 'refresh_token',
      refresh_token: this.refreshToken,
    })

    this.accessToken = data.access_token
    this.refreshToken = data.refresh_token

    this.setBearerToken()
  }
}

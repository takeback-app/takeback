import axios from 'axios'
import { refreshToken } from './RefreshToken'
import { API_URL } from '@env'

const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

API.interceptors.response.use(
  response => response,
  async function (error) {
    const originalRequest = error.config

    if (error.response.status !== 498 || originalRequest._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    const managedToRefresh = await refreshToken(API)

    if (!managedToRefresh) {
      return Promise.reject(error)
    }

    return API(originalRequest)
  }
)

const axiosFetcher = (url: string) => API.get(url).then(res => res.data)

export { API, axiosFetcher }

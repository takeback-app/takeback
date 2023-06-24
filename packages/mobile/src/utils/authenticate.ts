import { API } from '../services/API'
import { storeData } from './StoreData'

export function authenticate(
  token: string,
  refreshToken: string,
  remember = false
) {
  storeData('@take-back-user-token', token)
  storeData('@take-back-refresh-token', refreshToken)
  storeData('@take-back-remember', remember)

  API.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

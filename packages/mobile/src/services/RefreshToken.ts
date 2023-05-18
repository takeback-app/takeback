import AsyncStorage from '@react-native-async-storage/async-storage'
import { storeData } from '../utils/StoreData'
import { AxiosInstance } from 'axios'
import { signOut } from '../utils/signOut'

async function refreshToken(api: AxiosInstance) {
  const ACCESS_TOKEN = await AsyncStorage.getItem('@take-back-user-token')
  const REFRESH_TOKEN = await AsyncStorage.getItem('@take-back-refresh-token')

  if (ACCESS_TOKEN && REFRESH_TOKEN) {
    const response = await api
      .post(`/costumer/refresh-token/${JSON.parse(REFRESH_TOKEN)}`)
      .then(response => {
        storeData('@take-back-user-token', response.data.token)
        storeData('@take-back-refresh-token', response.data.refreshToken)

        api.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${response.data.token}`

        return true
      })
      .catch(signOut)

    return response
  } else {
    return await signOut()
  }
}

export { refreshToken }

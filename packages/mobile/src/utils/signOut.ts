import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

import { API_URL } from '@env'

export async function signOut() {
  const token = await AsyncStorage.getItem('@take-back-user-token')

  await AsyncStorage.multiRemove([
    '@take-back-balance-visible',
    '@take-back-user-token',
    '@take-back-user-data',
    '@take-back-refresh-token',
    '@take-back-remember'
  ])

  if (!token) return false

  try {
    await axios.post(
      `${API_URL}costumer/notification-token`,
      { token: null },
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`
        }
      }
    )
  } catch {}

  return false
}

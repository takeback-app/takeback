import { useEffect, useState } from 'react'
import * as Updates from 'expo-updates'

export function useExpoUpdate() {
  const [hasUpdate, setHasUpdate] = useState(false)
  const [error, setError] = useState()

  useEffect(() => {
    Updates.checkForUpdateAsync()
      .then(update => setHasUpdate(update.isAvailable))
      .catch(setError)
  }, [])

  async function handleUpdate() {
    if (!hasUpdate || error) return

    try {
      await Updates.fetchUpdateAsync()
      await Updates.reloadAsync()
    } catch (e) {
      console.log(e)
    }
  }

  return { hasUpdate, handleUpdate, error }
}

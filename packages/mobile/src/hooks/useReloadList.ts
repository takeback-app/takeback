import { useCallback, useState } from 'react'

import useSWR from 'swr'

export function useReloadList<T>(url: string) {
  const [refreshing, setRefreshing] = useState(false)

  const { data, isLoading, mutate } = useSWR<T[]>(url)

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await mutate()
    setRefreshing(false)
  }, [mutate])

  return {
    data,
    mutate,
    isLoading,
    onRefresh,
    refreshing
  }
}

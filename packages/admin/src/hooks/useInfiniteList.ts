import { useCallback, useMemo, useState } from 'react'

import useSWRInfinite from 'swr/infinite'

export function useInfiniteList<T>(url: string) {
  const getKey = (pageIndex: number, previousPageData: T[]) => {
    if (previousPageData && !previousPageData.length) return null // reached the end
    return `${url}?page=${pageIndex + 1}` // SWR key
  }

  const [refreshing, setRefreshing] = useState(false)

  const { data, isLoading, mutate, setSize, size } = useSWRInfinite<T[]>(getKey)

  const isLoadingMore = useMemo(
    () =>
      isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined'),
    [data, size, isLoading]
  )

  const isReachedEnd = useMemo(() => {
    if (!data) return false

    return !data.at(-1)?.length
  }, [data])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await mutate()
    setRefreshing(false)
  }, [mutate])

  async function nextPage() {
    await setSize(state => state + 1)
  }

  return {
    data: data?.reduce((a, b) => a.concat(b), []),
    isLoading,
    isLoadingMore,
    onRefresh,
    refreshing,
    isReachedEnd,
    nextPage
  }
}

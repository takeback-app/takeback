import { useCallback, useMemo, useState } from 'react'

import useSWRInfinite from 'swr/infinite'

export function useInfiniteSectionList<T>(url: string) {
  type Data = {
    title?: string
    data: T[]
  }

  const getKey = useMemo(
    () => (pageIndex: number, previousPageData: Data) => {
      if (previousPageData && !previousPageData.title) return null // reached the end
      return `${url}?page=${pageIndex + 1}` // SWR key
    },
    [url]
  )

  const [refreshing, setRefreshing] = useState(false)

  const { data, isLoading, mutate, setSize, size } =
    useSWRInfinite<Data>(getKey)

  const isLoadingMore = useMemo(
    () =>
      isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined'),
    [data, size, isLoading]
  )

  const isReachedEnd = useMemo(() => {
    if (!data) return false

    return !data.at(-1)?.title
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
    data:
      data?.reduce(
        (a, b) => [...a, b.title, ...b.data],
        [] as (string | undefined | T)[]
      ) ?? [],
    isLoading,
    isLoadingMore,
    onRefresh,
    refreshing,
    isReachedEnd,
    nextPage
  }
}

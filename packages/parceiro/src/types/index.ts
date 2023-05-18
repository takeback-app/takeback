export interface Paginated<T> {
  data: T[]
  meta: {
    lastPage: number
    total: number
  }
}

export interface Paginated<T> {
  data: T[]
  meta: {
    lastPage: number
  }
}

export interface PagedResponse<T> {
  content: T[]
  metadata: Metadata
}

export interface Metadata {
  page: number,
  size: number,
  numberOfElements: number
  totalPages: number
  totalElements: number
}



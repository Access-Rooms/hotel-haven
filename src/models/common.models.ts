export class DateFilter {
    from: number
    to: number
}

export class ApiResponse<T> {
    status: boolean
    msg: string
    data: T
    count?: number
  }
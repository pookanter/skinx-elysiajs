export namespace IPosts {
  export interface BulkBody {
    data: {
      title: string
      content: string
      postedAt: string
      postedBy: string
      tags: string[]
    }[]
  }

  export interface SearchBody {
    title?: string
    sort?: 'asc' | 'desc'
    sortBy?: 'title' | 'postedAt'
    tags?: string[]
    page: number
    pageSize: number
  }
}

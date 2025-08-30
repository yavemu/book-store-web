export interface BookListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  offset?: number;
}

export interface BookAdvancedSearchParams extends BookListParams {
  title?: string;
  isbn?: string;
  price?: number;
  stock?: number;
  isAvailable?: boolean;
  genre?: string;
  publisher?: string;
  startDate?: string;
  endDate?: string;
}

export interface Book {
  id: string;
  title: string;
  isbn: string;
  summary?: string;
  price: number;
  stock: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  publishedDate?: string;
  pages?: number;
  language?: string;
  genre?: {
    id: string;
    name: string;
  };
  publisher?: {
    id: string;
    name: string;
  };
  authors?: Array<{
    id: string;
    name: string;
  }>;
}

export interface BookListResponse {
  data: Book[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const booksApi = {
  getAll: (params: BookListParams) => `/book-catalog?${new URLSearchParams(params as any).toString()}`,
  getById: (id: string) => `/book-catalog/${id}`,
  create: () => `/book-catalog`,
  update: (id: string) => `/book-catalog/${id}`,
  delete: (id: string) => `/book-catalog/${id}`,
  search: (query: string) => `/book-catalog/search?q=${encodeURIComponent(query)}`,
  available: () => `/book-catalog/available`,
  byGenre: (genreId: string) => `/book-catalog/by-genre/${genreId}`,
  byPublisher: (publisherId: string) => `/book-catalog/by-publisher/${publisherId}`
};
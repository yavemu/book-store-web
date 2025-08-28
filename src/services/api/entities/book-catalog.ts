import {
  BookCatalog,
  CreateBookCatalogDto,
  UpdateBookCatalogDto,
  BookFiltersDto,
  BookCatalogListParams,
  BookCatalogSearchParams,
  IsbnCheckResponse,
  Genre,
  PublishingHouse,
  Author,
} from "@/types/domain";
import { PaginatedResponse } from "@/types/api";
import { apiClient } from "../client";

// Utilidad para construir query strings
const buildQueryString = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
};

// Utilidad para construir URLs con parámetros opcionales
const buildUrl = (basePath: string, queryParams?: Record<string, unknown>): string => {
  if (!queryParams) return basePath;

  const queryString = buildQueryString(queryParams);
  return queryString ? `${basePath}?${queryString}` : basePath;
};

export const bookCatalogApi = {
  // Listar libros con paginación y filtros
  list: (params?: BookCatalogListParams): Promise<PaginatedResponse<BookCatalog>> => {
    const defaultParams = {
      page: 1,
      limit: 10,
      ...params,
    };

    const url = buildUrl("/book-catalog", defaultParams);

    console.log("bookCatalogApi.list: llamando URL:", url);
    console.log("bookCatalogApi.list: parámetros:", defaultParams);

    return apiClient.get(url);
  },

  // Obtener libro por ID
  getById: (id: string): Promise<BookCatalog> => apiClient.get(`/api/book-catalog/${id}`),

  // Crear nuevo libro
  create: (data: CreateBookCatalogDto): Promise<BookCatalog> => apiClient.post("/api/book-catalog", data),

  // Actualizar libro
  update: (id: string, data: UpdateBookCatalogDto): Promise<BookCatalog> => apiClient.patch(`/api/book-catalog/${id}`, data),

  // Eliminar libro (soft delete)
  delete: (id: string): Promise<{ message: string }> => apiClient.delete(`/api/book-catalog/${id}`),

  // Verificar ISBN
  checkIsbn: (isbn: string): Promise<IsbnCheckResponse> => apiClient.get(`/api/book-catalog/check-isbn/${isbn}`),

  // Buscar libros
  search: (params: BookCatalogSearchParams): Promise<PaginatedResponse<BookCatalog>> => {
    const url = buildUrl("/book-catalog/search", params);
    return apiClient.get(url);
  },

  // Filtros avanzados
  filter: (filters: BookFiltersDto, page?: number, limit?: number): Promise<PaginatedResponse<BookCatalog>> => {
    const queryParams: Record<string, unknown> = {};
    if (page) queryParams.page = page;
    if (limit) queryParams.limit = limit;

    const url = buildUrl("/book-catalog/filter", queryParams);
    return apiClient.post(url, filters);
  },

  // Libros disponibles
  available: (page?: number, limit?: number): Promise<PaginatedResponse<BookCatalog>> => {
    const queryParams: Record<string, unknown> = {};
    if (page) queryParams.page = page;
    if (limit) queryParams.limit = limit;

    const url = buildUrl("/book-catalog/available", queryParams);
    return apiClient.get(url);
  },

  // Libros por género
  byGenre: (genreId: string, page?: number, limit?: number): Promise<PaginatedResponse<BookCatalog>> => {
    const queryParams: Record<string, unknown> = {};
    if (page) queryParams.page = page;
    if (limit) queryParams.limit = limit;

    const url = buildUrl(`/api/book-catalog/by-genre/${genreId}`, queryParams);
    return apiClient.get(url);
  },

  // Libros por editorial
  byPublisher: (publisherId: string, page?: number, limit?: number): Promise<PaginatedResponse<BookCatalog>> => {
    const queryParams: Record<string, unknown> = {};
    if (page) queryParams.page = page;
    if (limit) queryParams.limit = limit;

    const url = buildUrl(`/api/book-catalog/by-publisher/${publisherId}`, queryParams);
    return apiClient.get(url);
  },
};

// APIs auxiliares para géneros, editoriales y autores
export const genresApi = {
  list: (): Promise<Genre[]> => apiClient.get("/api/genres"),
  search: (q: string): Promise<Genre[]> => apiClient.get(buildUrl("/genres/search", { q })),
  create: (data: { name: string; description?: string }): Promise<Genre> => apiClient.post("/api/genres", data),
};

export const publishingHousesApi = {
  list: (): Promise<PublishingHouse[]> => apiClient.get("/api/publishing-houses"),
  search: (term: string): Promise<PublishingHouse[]> => apiClient.get(buildUrl("/publishing-houses/search", { term })),
  create: (data: { name: string; country?: string; foundedYear?: number }): Promise<PublishingHouse> =>
    apiClient.post("/api/publishing-houses", data),
  byCountry: (country: string): Promise<PublishingHouse[]> => apiClient.get(`/api/publishing-houses/by-country/${encodeURIComponent(country)}`),
};

export const authorsApi = {
  list: (page?: number, limit?: number): Promise<PaginatedResponse<Author>> => {
    const queryParams: Record<string, unknown> = {};
    if (page) queryParams.page = page;
    if (limit) queryParams.limit = limit;

    const url = buildUrl("/book-authors", queryParams);
    return apiClient.get(url);
  },
  search: (term: string): Promise<Author[]> => apiClient.get(buildUrl("/book-authors/search", { term })),
  create: (data: { firstName: string; lastName: string; biography?: string; birthDate?: string; nationality?: string }): Promise<Author> =>
    apiClient.post("/api/book-authors", data),
  byName: (firstName: string, lastName: string): Promise<Author> =>
    apiClient.get(`/api/book-authors/by-name/${encodeURIComponent(firstName)}/${encodeURIComponent(lastName)}`),
};

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

export const bookCatalogApi = {
  // Listar libros con paginación y filtros
  list: (params?: BookCatalogListParams): Promise<PaginatedResponse<BookCatalog>> => {
    const searchParams = new URLSearchParams();

    // Siempre incluir page y limit con valores por defecto
    searchParams.append("page", (params?.page || 1).toString());
    searchParams.append("limit", (params?.limit || 10).toString());

    if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);
    if (params?.search) searchParams.append("search", params.search);
    if (params?.genreId) searchParams.append("genreId", params.genreId);
    if (params?.publisherId) searchParams.append("publisherId", params.publisherId);
    if (params?.isAvailable !== undefined) searchParams.append("isAvailable", params.isAvailable.toString());
    if (params?.minPrice !== undefined) searchParams.append("minPrice", params.minPrice.toString());
    if (params?.maxPrice !== undefined) searchParams.append("maxPrice", params.maxPrice.toString());

    const queryString = searchParams.toString();
    const url = `/book-catalog?${queryString}`;

    console.log("bookCatalogApi.list: llamando URL:", url);
    console.log("bookCatalogApi.list: parámetros:", params);

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
    const searchParams = new URLSearchParams({
      term: params.term,
    });

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());

    return apiClient.get(`/api/book-catalog/search?${searchParams.toString()}`);
  },

  // Filtros avanzados
  filter: (filters: BookFiltersDto, page?: number, limit?: number): Promise<PaginatedResponse<BookCatalog>> => {
    const searchParams = new URLSearchParams();
    if (page) searchParams.append("page", page.toString());
    if (limit) searchParams.append("limit", limit.toString());

    const queryString = searchParams.toString();
    return apiClient.post(`/api/book-catalog/filter${queryString ? `?${queryString}` : ""}`, filters);
  },

  // Libros disponibles
  available: (page?: number, limit?: number): Promise<PaginatedResponse<BookCatalog>> => {
    const searchParams = new URLSearchParams();
    if (page) searchParams.append("page", page.toString());
    if (limit) searchParams.append("limit", limit.toString());

    const queryString = searchParams.toString();
    return apiClient.get(`/api/book-catalog/available${queryString ? `?${queryString}` : ""}`);
  },

  // Libros por género
  byGenre: (genreId: string, page?: number, limit?: number): Promise<PaginatedResponse<BookCatalog>> => {
    const searchParams = new URLSearchParams();
    if (page) searchParams.append("page", page.toString());
    if (limit) searchParams.append("limit", limit.toString());

    const queryString = searchParams.toString();
    return apiClient.get(`/api/book-catalog/by-genre/${genreId}${queryString ? `?${queryString}` : ""}`);
  },

  // Libros por editorial
  byPublisher: (publisherId: string, page?: number, limit?: number): Promise<PaginatedResponse<BookCatalog>> => {
    const searchParams = new URLSearchParams();
    if (page) searchParams.append("page", page.toString());
    if (limit) searchParams.append("limit", limit.toString());

    const queryString = searchParams.toString();
    return apiClient.get(`/api/book-catalog/by-publisher/${publisherId}${queryString ? `?${queryString}` : ""}`);
  },
};

// APIs auxiliares para géneros, editoriales y autores
export const genresApi = {
  list: (): Promise<Genre[]> => apiClient.get("/api/genres"),
  search: (q: string): Promise<Genre[]> => apiClient.get(`/api/genres/search?q=${encodeURIComponent(q)}`),
  create: (data: { name: string; description?: string }): Promise<Genre> => apiClient.post("/api/genres", data),
};

export const publishingHousesApi = {
  list: (): Promise<PublishingHouse[]> => apiClient.get("/api/publishing-houses"),
  search: (term: string): Promise<PublishingHouse[]> => apiClient.get(`/api/publishing-houses/search?term=${encodeURIComponent(term)}`),
  create: (data: { name: string; country?: string; foundedYear?: number }): Promise<PublishingHouse> =>
    apiClient.post("/api/publishing-houses", data),
  byCountry: (country: string): Promise<PublishingHouse[]> => apiClient.get(`/api/publishing-houses/by-country/${encodeURIComponent(country)}`),
};

export const authorsApi = {
  list: (page?: number, limit?: number): Promise<PaginatedResponse<Author>> => {
    const searchParams = new URLSearchParams();
    if (page) searchParams.append("page", page.toString());
    if (limit) searchParams.append("limit", limit.toString());

    const queryString = searchParams.toString();
    return apiClient.get(`/api/book-authors${queryString ? `?${queryString}` : ""}`);
  },
  search: (term: string): Promise<Author[]> => apiClient.get(`/api/book-authors/search?term=${encodeURIComponent(term)}`),
  create: (data: { firstName: string; lastName: string; biography?: string; birthDate?: string; nationality?: string }): Promise<Author> =>
    apiClient.post("/api/book-authors", data),
  byName: (firstName: string, lastName: string): Promise<Author> =>
    apiClient.get(`/api/book-authors/by-name/${encodeURIComponent(firstName)}/${encodeURIComponent(lastName)}`),
};

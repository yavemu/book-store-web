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
  getById: (id: string): Promise<BookCatalog> => apiClient.get(`/book-catalog/${id}`),

  // Crear nuevo libro
  create: (data: CreateBookCatalogDto): Promise<BookCatalog> => {
    // Convertir el precio a decimal con 2 posiciones decimales para la BD
    const dataWithDecimalPrice = {
      ...data,
      price: parseFloat(data.price.toFixed(2)),
    };

    console.log("📤 Enviando a API con precio decimal:", dataWithDecimalPrice);
    return apiClient.post("/book-catalog", dataWithDecimalPrice);
  },

  // Actualizar libro
  update: (id: string, data: UpdateBookCatalogDto): Promise<BookCatalog> => {
    // Si el precio está presente, convertirlo a decimal con 2 posiciones decimales
    const dataWithDecimalPrice = data.price
      ? {
          ...data,
          price: parseFloat(data.price.toFixed(2)),
        }
      : data;

    return apiClient.patch(`/book-catalog/${id}`, dataWithDecimalPrice);
  },

  // Eliminar libro (soft delete)
  delete: (id: string): Promise<{ message: string }> => apiClient.delete(`/book-catalog/${id}`),

  // Verificar ISBN
  checkIsbn: (isbn: string): Promise<IsbnCheckResponse> => apiClient.get(`/book-catalog/check-isbn/${isbn}`),

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

    const url = buildUrl(`/book-catalog/by-genre/${genreId}`, queryParams);
    return apiClient.get(url);
  },

  // Libros por editorial
  byPublisher: (publisherId: string, page?: number, limit?: number): Promise<PaginatedResponse<BookCatalog>> => {
    const queryParams: Record<string, unknown> = {};
    if (page) queryParams.page = page;
    if (limit) queryParams.limit = limit;

    const url = buildUrl(`/book-catalog/by-publisher/${publisherId}`, queryParams);
    return apiClient.get(url);
  },
};

// Note: Auxiliary APIs moved to their respective entity files to avoid conflicts:
// - genresApi -> entities/genres.ts
// - publishingHousesApi -> entities/publishing-houses.ts  
// - authorsApi -> entities/authors.ts

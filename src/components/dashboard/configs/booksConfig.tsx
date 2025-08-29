import { Column } from "@/components/ui";
import { bookCatalogApi } from "@/services/api";
import { BookCatalog, BookCatalogListParams, BookFiltersDto } from "@/types/domain";

export const booksManagementConfig = {
  title: "Panel Administrativo de Libros",
  createButtonText: "Crear Libro",
  createUrl: "/dashboard/books/create",
  editUrl: "/dashboard/books/edit",
  entityType: "books" as const,
  emptyMessage: "No se encontraron libros. Crea tu primer libro para comenzar.",
  errorMessage: "Error al cargar los libros",
  initialParams: {
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "DESC" as const,
  },
  apiService: bookCatalogApi,
  permissions: {
    roles: ["admin", "user"], // Ambos roles pueden ver libros
    canCreate: true,  // Solo admin puede crear (se evalúa en GenericManagementPage)
    canEdit: true,    // Solo admin puede editar
    canDelete: true,  // Solo admin puede eliminar
    canView: true,    // Ambos roles pueden ver
  },
  columns: [
    {
      key: "coverImageUrl",
      label: "Portada",
      className: "w-20",
      render: (book: BookCatalog, value: string) => (
        <div className="w-16 h-20 bg-gray-200 rounded overflow-hidden">
          {value ? (
            <img
              src={value}
              alt={`Portada de ${book.title}`}
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Sin imagen</div>
          )}
        </div>
      ),
    },
    {
      key: "title",
      label: "Título",
      sortable: true,
      render: (book: BookCatalog, value: string) => (
        <div className="min-w-48">
          <div className="font-medium text-gray-900 truncate">{value}</div>
          <div className="text-sm text-gray-500 truncate">{book.isbnCode}</div>
        </div>
      ),
    },
    { 
      key: "genre", 
      label: "Género", 
      render: (book: BookCatalog) => book.genre?.name || "Sin género", 
      className: "min-w-32" 
    },
    { 
      key: "publisher", 
      label: "Editorial", 
      render: (book: BookCatalog) => book.publisher?.name || "Sin editorial", 
      className: "min-w-32" 
    },
    { 
      key: "price", 
      label: "Precio", 
      sortable: true, 
      render: (_: BookCatalog, value: number) => `$${Number(value).toFixed(2)}`, 
      className: "text-right" 
    },
    { 
      key: "stockQuantity", 
      label: "Stock", 
      sortable: true, 
      render: (_: BookCatalog, value: number) => value?.toString() || "0", 
      className: "text-center" 
    },
    {
      key: "isAvailable",
      label: "Disponible",
      className: "text-center",
      render: (_: BookCatalog, value: boolean) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {value ? "Sí" : "No"}
        </span>
      ),
    },
  ] as Column<BookCatalog>[],
  // filters: removed - CRUD functionality disabled
};
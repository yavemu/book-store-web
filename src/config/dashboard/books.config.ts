// Books Entity Configuration Template
// Copy and adapt this pattern for other entities (Users, Genres, Publishers, etc.)

import { DashboardEntityConfig } from "@/types/dashboard/entities";
import { 
  BookResponseDto, 
  CreateBookDto, 
  UpdateBookDto 
} from "@/types/api/entities";
import { 
  booksApi, 
  BookListParams, 
  BookSearchParams, 
  BookFiltersDto 
} from "@/services/api/entities/books";
// import { booksSearchConfig } from "@/config/search/books.search"; // Create this
import { TableColumn } from "@/types/table";

// Import components (create these if they don't exist)
// import BookForm from "@/components/books/BookForm";
// import BookViewModal from "@/components/books/BookViewModal";
// import DeleteBookDialog from "@/components/books/DeleteBookDialog";

const booksTableColumns: TableColumn[] = [
  { key: "title", label: "Título" },
  { key: "isbn", label: "ISBN" },
  { key: "publishedDate", label: "Fecha Publicación", render: (value) => new Date(value).toLocaleDateString() },
  { key: "price", label: "Precio", render: (value) => `$${value}` },
];

export const booksConfig: DashboardEntityConfig<
  BookResponseDto,
  CreateBookDto,
  UpdateBookDto,
  BookListParams,
  BookSearchParams,
  BookFiltersDto
> = {
  entityName: "Libro",
  entityNamePlural: "Libros",
  routePath: "/books",
  
  capabilities: {
    crud: ['create', 'read', 'update', 'delete'],
    search: ['auto', 'simple', 'advanced'],
    export: true,
  },
  
  api: booksApi,
  
  ui: {
    pageTitle: "Gestión de Libros",
    breadcrumbs: ["Libros"],
    tableColumns: booksTableColumns,
    // searchConfig: booksSearchConfig, // Uncomment when created
    autoSearchField: "title",
    autoSearchPlaceholder: "Búsqueda rápida libros (mín. 3 caracteres)",
  },
  
  components: {
    // FormComponent: BookForm, // Uncomment when created
    // ViewModalComponent: BookViewModal, // Uncomment when created
    // DeleteDialogComponent: DeleteBookDialog, // Uncomment when created
  },
  
  customHandlers: {
    onAfterCreate: (entity) => console.log("Libro creado:", entity),
    onAfterUpdate: (entity) => console.log("Libro actualizado:", entity),
    onAfterDelete: (entityId) => console.log("Libro eliminado:", entityId),
  },
};
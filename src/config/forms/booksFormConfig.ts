import { 
  createBookSchema, 
  updateBookSchema, 
  CreateBookFormData, 
  UpdateBookFormData 
} from "@/services/validation/schemas/books";
import { bookCatalogApi } from "@/services/api/entities/book-catalog";
import { EntityFormConfig } from "@/types/forms";

export const booksFormConfig: EntityFormConfig<CreateBookFormData, UpdateBookFormData> = {
  createSchema: createBookSchema,
  updateSchema: updateBookSchema,
  
  createFields: [
    { name: "title", label: "Título", type: "text", placeholder: "Ej: Cien años de soledad" },
    { name: "isbnCode", label: "Código ISBN", type: "text", placeholder: "9780307474728" },
    { name: "price", label: "Precio", type: "number", placeholder: "25.99" },
    { name: "stockQuantity", label: "Cantidad en stock", type: "number", placeholder: "100" },
    { name: "pageCount", label: "Número de páginas", type: "number", placeholder: "432" },
    { name: "publicationDate", label: "Fecha de publicación", type: "text", placeholder: "YYYY-MM-DD" },
    { name: "coverImageUrl", label: "URL de portada", type: "text", placeholder: "https://ejemplo.com/portada.jpg" },
    { name: "summary", label: "Resumen", type: "textarea", placeholder: "Breve descripción del libro..." },
    { name: "genreId", label: "Género", type: "text", placeholder: "Seleccionar género..." },
    { name: "publisherId", label: "Editorial", type: "text", placeholder: "Seleccionar editorial..." }
  ],
  
  editFields: [
    { name: "title", label: "Título", type: "text", placeholder: "Ej: Cien años de soledad" },
    { name: "isbnCode", label: "Código ISBN", type: "text", placeholder: "9780307474728" },
    { name: "price", label: "Precio", type: "number", placeholder: "25.99" },
    { name: "stockQuantity", label: "Cantidad en stock", type: "number", placeholder: "100" },
    { name: "pageCount", label: "Número de páginas", type: "number", placeholder: "432" },
    { name: "publicationDate", label: "Fecha de publicación", type: "text", placeholder: "YYYY-MM-DD" },
    { name: "coverImageUrl", label: "URL de portada", type: "text", placeholder: "https://ejemplo.com/portada.jpg" },
    { name: "summary", label: "Resumen", type: "textarea", placeholder: "Breve descripción del libro..." },
    { name: "genreId", label: "Género", type: "text", placeholder: "Seleccionar género..." },
    { name: "publisherId", label: "Editorial", type: "text", placeholder: "Seleccionar editorial..." }
  ],

  apiService: {
    create: bookCatalogApi.create
  },

  texts: {
    createSubmitText: "Crear Libro",
    editSubmitText: "Actualizar Libro",
    createLoadingText: "Creando libro...",
    editLoadingText: "Actualizando libro...",
    createSuccessMessage: "Libro creado exitosamente",
    editSuccessMessage: "Libro actualizado exitosamente"
  }
};
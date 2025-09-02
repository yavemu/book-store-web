"use client";

import { createUnifiedDashboardProps } from "@/adapters/dashboardConfigAdapter";
import UnifiedDashboardPage from "@/components/Dashboard/UnifiedDashboardPage";
import { booksApi } from "@/services/api/entities/books";

const booksConfig = {
  entityName: "Libro",
  displayName: "Gestión de Libros",
  defaultPageSize: 10,
  defaultSort: {
    field: "createdAt",
    direction: "DESC" as const,
  },
  capabilities: {
    crud: ["create", "read", "update", "delete"],
    search: ["auto", "simple", "advanced"],
    export: true,
  },
  columns: [
    {
      key: "title",
      label: "Título",
      sortable: true,
      width: "300px",
    },
    {
      key: "isbn",
      label: "ISBN",
      sortable: true,
      width: "150px",
    },
    {
      key: "publishedDate",
      label: "Fecha Publicación",
      sortable: true,
      width: "140px",
      render: (value: string) => (value ? new Date(value).toLocaleDateString() : "-"),
    },
    {
      key: "price",
      label: "Precio",
      sortable: true,
      width: "100px",
      align: "right" as const,
      render: (value: number) => (value ? `$${value}` : "-"),
    },
    {
      key: "stock",
      label: "Stock",
      sortable: true,
      width: "80px",
      align: "center" as const,
      render: (value: number) => String(value || 0),
    },
    {
      key: "isActive",
      label: "Estado",
      sortable: true,
      width: "100px",
      align: "center" as const,
      render: (value: boolean) => (value ? "Activo" : "Inactivo"),
    },
  ],
  searchFields: [
    {
      key: "title",
      label: "Título",
      type: "text" as const,
      placeholder: "Ej: Cien años de soledad",
    },
    {
      key: "isbn",
      label: "ISBN",
      type: "text" as const,
      placeholder: "Ej: 978-3-16-148410-0",
    },
    {
      key: "publishedDate",
      label: "Fecha de Publicación",
      type: "date" as const,
    },
    {
      key: "price",
      label: "Precio",
      type: "number" as const,
      placeholder: "Ej: 25.99",
    },
    {
      key: "isActive",
      label: "Estado",
      type: "boolean" as const,
      options: [
        { value: true, label: "Activo" },
        { value: false, label: "Inactivo" },
      ],
    },
  ],
  formFields: [
    {
      key: "title",
      label: "Título",
      type: "text" as const,
      required: true,
      placeholder: "Ej: Cien años de soledad",
    },
    {
      key: "isbnCode",
      label: "Código ISBN",
      type: "text" as const,
      required: true,
      placeholder: "Ej: 978-3-16-148410-0",
    },
    {
      key: "genreId",
      label: "Género",
      type: "select" as const,
      required: true,
      options: [], // Se llenará dinámicamente
      placeholder: "Seleccionar género",
    },
    {
      key: "publisherId", 
      label: "Editorial",
      type: "select" as const,
      required: true,
      options: [], // Se llenará dinámicamente
      placeholder: "Seleccionar editorial",
    },
    {
      key: "price",
      label: "Precio",
      type: "number" as const,
      required: true,
      placeholder: "Ej: 25.99",
    },
    {
      key: "stockQuantity",
      label: "Cantidad en Stock",
      type: "number" as const,
      required: true,
      placeholder: "Ej: 100",
    },
    {
      key: "publicationDate",
      label: "Fecha de Publicación",
      type: "date" as const,
      required: false,
    },
    {
      key: "pageCount",
      label: "Número de Páginas",
      type: "number" as const,
      required: false,
      placeholder: "Ej: 350",
    },
    {
      key: "summary",
      label: "Resumen/Descripción",
      type: "textarea" as const,
      required: false,
      placeholder: "Descripción del libro...",
    },
    {
      key: "coverImage",
      label: "Imagen de Portada",
      type: "file" as const,
      required: false,
      accept: "image/*",
    },
    {
      key: "isAvailable",
      label: "Disponible",
      type: "boolean" as const,
      required: false,
      placeholder: "Disponible",
    },
  ],
};

const customHandlers = {
  onAfterCreate: (book: any) => {
    console.log("✅ Libro creado exitosamente:", book.title);
  },
  onAfterUpdate: (book: any) => {
    console.log("✅ Libro actualizado:", book.title);
  },
  onAfterDelete: (bookId: string) => {
    console.log("🗑️ Libro eliminado:", bookId);
  },
  onDataRefresh: () => {
    console.log("🔄 Datos de libros actualizados");
  },
};

export default function BooksPage() {
  const unifiedProps = createUnifiedDashboardProps(booksConfig, booksApi, customHandlers);

  // Use custom form component for books
  const customComponents = {
    form: () => import('@/components/books/BookForm').then(mod => mod.default)
  };

  return <UnifiedDashboardPage {...unifiedProps} customComponents={customComponents} />;
}

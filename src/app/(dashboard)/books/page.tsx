"use client";

import { createUnifiedDashboardProps } from "@/adapters/dashboardConfigAdapter";
import InlineDashboardPage from "@/components/Dashboard/InlineDashboardPage";
import { bookCatalogApi } from "@/services/api/entities/book-catalog";
import type { BookCatalogResponseDto } from '@/types/api/entities';

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
      key: "isbnCode",
      label: "ISBN",
      sortable: true,
      width: "150px",
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
      key: "stockQuantity",
      label: "Stock",
      sortable: true,
      width: "80px",
      align: "center" as const,
      render: (value: number) => String(value || 0),
    },
    {
      key: "isAvailable",
      label: "Disponible",
      sortable: true,
      width: "100px",
      align: "center" as const,
      render: (value: boolean) => (value ? "Sí" : "No"),
    },
    {
      key: "publicationDate",
      label: "Fecha Publicación",
      sortable: true,
      width: "140px",
      render: (value: string) => (value ? new Date(value).toLocaleDateString() : "-"),
    },
    {
      key: "pageCount",
      label: "Páginas",
      sortable: true,
      width: "80px",
      align: "center" as const,
      render: (value: number) => (value ? String(value) : "-"),
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
      key: "isbnCode",
      label: "ISBN",
      type: "text" as const,
      placeholder: "Ej: 978-3-16-148410-0",
    },
    {
      key: "genreId",
      label: "Género",
      type: "select" as const,
      options: [], // Se llenará dinámicamente
      placeholder: "Seleccionar género",
    },
    {
      key: "publisherId",
      label: "Editorial",
      type: "select" as const,
      options: [], // Se llenará dinámicamente
      placeholder: "Seleccionar editorial",
    },
    {
      key: "isAvailable",
      label: "Disponible",
      type: "boolean" as const,
      options: [
        { value: true, label: "Disponible" },
        { value: false, label: "No disponible" },
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
      key: "isAvailable",
      label: "Disponible",
      type: "boolean" as const,
      required: false,
      placeholder: "Disponible",
    },
  ],
};

const customHandlers = {
  onAfterCreate: (book: BookCatalogResponseDto) => {
    console.log("✅ Libro creado exitosamente:", book.title);
  },
  onAfterUpdate: (book: BookCatalogResponseDto) => {
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
  const unifiedProps = createUnifiedDashboardProps(booksConfig, bookCatalogApi, customHandlers);

  return <InlineDashboardPage {...unifiedProps} />;
}

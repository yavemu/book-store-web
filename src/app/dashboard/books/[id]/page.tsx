"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Layout } from "@/components";
import { EntityForm } from "@/components/forms";
import { useEntityApi } from "@/hooks/useEntityApi";
import { booksFormConfig } from "@/config/forms";
import { bookCatalogApi } from "@/services/api/entities/book-catalog";
import { useAppSelector } from "@/hooks";
import type { BookCatalog } from "@/types/domain";

type Mode = "view" | "edit";

/* ------------------------------ Loading UI ------------------------------ */
function BookSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
}

/* --------------------------- Not Found State ---------------------------- */
function BookNotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 text-center py-10">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Libro no encontrado</h2>
      <p className="text-gray-600 mb-6">El libro solicitado no existe o ha sido eliminado.</p>
      <button onClick={onBack} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
        Volver a Libros
      </button>
    </div>
  );
}

/* ------------------------------- Header -------------------------------- */
function BookHeader({
  book,
  mode,
  onBack,
  onEdit,
  onCancel,
  onCreateNew,
}: {
  book: BookCatalog;
  mode: Mode;
  onBack: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onCreateNew: () => void;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
      <div>
        <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-800 font-medium mb-2">
          ← Volver a Libros
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
        <p className="mt-2 text-gray-600">{mode === "view" ? "Detalles del libro" : "Editando información del libro"}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button onClick={onCreateNew} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium">
          + Crear Nuevo Libro
        </button>
        {mode === "view" ? (
          <button onClick={onEdit} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
            Editar
          </button>
        ) : (
          <button onClick={onCancel} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-medium">
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}

/* ----------------------------- View Mode ------------------------------- */
function BookDetails({ book }: { book: BookCatalog }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* Campos principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Título" value={book.title} full />
        <Field label="ISBN" value={book.isbnCode} mono />
        <Field label="Precio" value={`$${book.price}`} />
        <Field label="Stock" value={`${book.stockQuantity} unidades`} />
        <Field label="Páginas" value={book.pageCount || "No especificado"} />
        <Field
          label="Fecha de Publicación"
          value={book.publicationDate ? new Date(book.publicationDate).toLocaleDateString("es-ES") : "No especificada"}
        />
        <Field
          label="Disponible"
          value={
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                book.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {book.isAvailable ? "Disponible" : "No disponible"}
            </span>
          }
        />
      </div>

      {/* Imagen */}
      {book.coverImageUrl && (
        <Field label="Portada">
          <img src={book.coverImageUrl} alt={`Portada de ${book.title}`} className="max-w-48 max-h-64 object-cover rounded-md" />
          <a href={book.coverImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline block mt-2 text-sm">
            Ver imagen original
          </a>
        </Field>
      )}

      {/* Resumen */}
      {book.summary && (
        <Field label="Resumen">
          <div className="min-h-[100px] whitespace-pre-wrap">{book.summary}</div>
        </Field>
      )}

      {/* Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
        <Field label="ID" value={<span className="font-mono text-xs">{book.id}</span>} />
        <Field label="Creado" value={new Date(book.createdAt).toLocaleString("es-ES")} />
      </div>
    </div>
  );
}

/* ------------------------ Reusable Field block ------------------------- */
function Field({
  label,
  value,
  full,
  mono,
  children,
}: {
  label: string;
  value?: React.ReactNode;
  full?: boolean;
  mono?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className={`px-3 py-2 bg-gray-50 border border-gray-200 rounded-md ${mono ? "font-mono" : ""}`}>{children ?? value}</div>
    </div>
  );
}

/* --------------------------- Main Component ---------------------------- */
export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  const [bookData, setBookData] = useState<BookCatalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>("view");

  const entityApi = useEntityApi(bookCatalogApi, {
    onUpdateSuccess: () => {
      setMode("view");
      loadBook();
    },
    entityName: "libro",
  });

  const loadBook = async () => {
    try {
      setLoading(true);
      const response = await bookCatalogApi.getById(params.id as string);
      setBookData(response);
    } catch (error) {
      console.error("Error loading book:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) loadBook();
  }, [params.id]);

  const handleBack = () => router.push("/dashboard?tab=books");
  const handleCreateNew = () => router.push("/dashboard/books/create");

  return (
    <Layout user={user}>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <BookSkeleton />
        ) : !bookData ? (
          <BookNotFound onBack={handleBack} />
        ) : (
          <>
            <BookHeader
              book={bookData}
              mode={mode}
              onBack={handleBack}
              onEdit={() => setMode("edit")}
              onCancel={() => setMode("view")}
              onCreateNew={handleCreateNew}
            />

            {mode === "view" ? (
              <BookDetails book={bookData} />
            ) : (
              <EntityForm
                mode="edit"
                config={booksFormConfig}
                initialData={bookData}
                onUpdateSubmit={entityApi.update}
                updateLoading={entityApi.states.update.loading}
                errorMessage={entityApi.states.update.error}
                showErrorMessage={!!entityApi.states.update.error}
              />
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

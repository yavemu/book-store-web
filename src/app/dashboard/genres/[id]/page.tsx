"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Layout } from "@/components";
import { EntityForm } from "@/components/forms";
import { useEntityApi } from "@/hooks/useEntityApi";
import { genresFormConfig } from "@/config/forms";
import { genresApi } from "@/services/api/entities/genres";
import { useAppSelector } from "@/hooks";
import type { BookGenreResponseDto } from "@/types/api/entities";

type Mode = "view" | "edit";

/* ------------------------------ Loading UI ------------------------------ */
function GenreSkeleton() {
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
function GenreNotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 text-center py-10">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Género no encontrado</h2>
      <p className="text-gray-600 mb-6">El género solicitado no existe o ha sido eliminado.</p>
      <button onClick={onBack} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
        Volver a Géneros
      </button>
    </div>
  );
}

/* ------------------------------- Header -------------------------------- */
function GenreHeader({
  genre,
  mode,
  onBack,
  onEdit,
  onCancel,
  onCreateNew,
}: {
  genre: BookGenreResponseDto;
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
          ← Volver a Géneros
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{genre.name}</h1>
        <p className="mt-2 text-gray-600">{mode === "view" ? "Detalles del género" : "Editando información del género"}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button onClick={onCreateNew} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium">
          + Crear Nuevo Género
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
function GenreDetails({ genre }: { genre: BookGenreResponseDto }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Field label="Nombre del Género" value={genre.name} full />
        {genre.description && (
          <Field label="Descripción">
            <div className="min-h-[100px] whitespace-pre-wrap">{genre.description}</div>
          </Field>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
        <Field label="ID" value={<span className="font-mono text-xs">{genre.id}</span>} />
        <Field label="Creado" value={new Date(genre.createdAt).toLocaleString("es-ES")} />
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
export default function GenreDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  const [genreData, setGenreData] = useState<BookGenreResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>("view");

  const entityApi = useEntityApi(genresApi, {
    onUpdateSuccess: () => {
      setMode("view");
      loadGenre();
    },
    entityName: "género",
  });

  const loadGenre = async () => {
    try {
      setLoading(true);
      const response = await genresApi.getById(params.id as string);
      setGenreData(response);
    } catch (error) {
      console.error("Error loading genre:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) loadGenre();
  }, [params.id]);

  const handleBack = () => router.push("/dashboard?tab=genres");
  const handleCreateNew = () => router.push("/dashboard/genres/create");

  return (
    <Layout user={user}>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <GenreSkeleton />
        ) : !genreData ? (
          <GenreNotFound onBack={handleBack} />
        ) : (
          <>
            <GenreHeader
              genre={genreData}
              mode={mode}
              onBack={handleBack}
              onEdit={() => setMode("edit")}
              onCancel={() => setMode("view")}
              onCreateNew={handleCreateNew}
            />

            {mode === "view" ? (
              <GenreDetails genre={genreData} />
            ) : (
              <EntityForm
                mode="edit"
                config={genresFormConfig}
                initialData={genreData}
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

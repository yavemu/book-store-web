"use client";

import GenericDashboardPage from "@/components/Dashboard/GenericDashboardPage";
import { genresConfig } from "@/config/dashboard/genres.config";
import { genresApi } from "@/services/api/entities/genres";
import GenreTable from "@/components/genres/GenreTable";

// Usando el hook optimizado para Genres
export default function GenresPageOptimized() {
  return (
    <GenericDashboardPage
      config={genresConfig}
      apiService={genresApi}
      tableComponent={GenreTable}
      customHandlers={{
        // Custom handlers específicos para Genres
        onAfterCreate: (genre) => {
          console.log('Género creado exitosamente:', genre.name);
        },
        onAfterUpdate: (genre) => {
          console.log('Género actualizado:', genre.name);
        },
        onBeforeDelete: async (genre) => {
          // Validación antes de eliminar - verificar si tiene libros asociados
          if (genre.booksCount && genre.booksCount > 0) {
            const confirm = window.confirm(
              `Este género tiene ${genre.booksCount} libros asociados. ¿Continuar con la eliminación?`
            );
            if (!confirm) {
              throw new Error('Eliminación cancelada: género tiene libros asociados');
            }
          }
        }
      }}
    />
  );
}
"use client";

import GenericDashboardPage from "@/components/Dashboard/GenericDashboardPage";
import { publishersConfig } from "@/config/dashboard/publishers.config";
import { publishingHousesApi } from "@/services/api/entities/publishing-houses";
import PublisherTable from "@/components/publishers/PublisherTable";

// Usando el hook optimizado para Publishers
export default function PublishersPageOptimized() {
  return (
    <GenericDashboardPage
      config={publishersConfig}
      apiService={publishingHousesApi}
      tableComponent={PublisherTable}
      customHandlers={{
        // Custom handlers específicos para Publishers
        onAfterCreate: (publisher) => {
          console.log('Editorial creada exitosamente:', publisher.name);
        },
        onAfterUpdate: (publisher) => {
          console.log('Editorial actualizada:', publisher.name);
        },
        onBeforeDelete: async (publisher) => {
          // Validación antes de eliminar - verificar si tiene libros publicados
          if (publisher.booksCount && publisher.booksCount > 0) {
            const confirm = window.confirm(
              `Esta editorial tiene ${publisher.booksCount} libros publicados. ¿Continuar con la eliminación?`
            );
            if (!confirm) {
              throw new Error('Eliminación cancelada: editorial tiene libros publicados');
            }
          }
        },
        onAfterDelete: (publisherId) => {
          console.log('Editorial eliminada:', publisherId);
          // Aquí podrías notificar a otros sistemas, etc.
        }
      }}
    />
  );
}
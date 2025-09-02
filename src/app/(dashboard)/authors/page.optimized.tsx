"use client";

import GenericDashboardPage from "@/components/Dashboard/GenericDashboardPage";
import { authorsConfig } from "@/config/dashboard/authors.config";
import { authorsApi } from "@/services/api/entities/authors";
import AuthorTable from "@/components/authors/AuthorTable";

// Usando el hook optimizado para Authors
export default function AuthorsPageOptimized() {
  return (
    <GenericDashboardPage
      config={authorsConfig}
      apiService={authorsApi}
      tableComponent={AuthorTable}
      customHandlers={{
        // Custom handlers específicos para Authors si es necesario
        onAfterCreate: (author) => {
          console.log('Autor creado exitosamente:', author.name);
        },
        onAfterUpdate: (author) => {
          console.log('Autor actualizado:', author.name);
        }
      }}
    />
  );
}
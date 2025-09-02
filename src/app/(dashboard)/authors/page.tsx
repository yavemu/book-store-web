"use client";

import { SearchFilters } from "@/components/AdvancedSearchForm";
import AuthorTable from "@/components/authors/AuthorTable";
import ApiErrorState from "@/components/ErrorStates/ApiErrorState";
import PageWrapper from "@/components/PageWrapper";
import PageLoading from "@/components/ui/PageLoading";
import { useApiRequest } from "@/hooks";
import { authorsApi, AuthorListParams } from "@/services/api/entities/authors";
import { PaginationMeta } from "@/types/table";
import { useEffect, useState } from "react";

export default function AuthorsPage() {
  const [params, setParams] = useState<AuthorListParams>({ page: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});

  const { loading, error, data, execute } = useApiRequest({
    apiFunction: () => authorsApi.list(params),
  });

  useEffect(() => {
    execute();
  }, [params]);

  const handlePageChange = (page: number) => setParams({ ...params, page });

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);

    if (value?.trim().length >= 3) {
      authorsApi.search({
        term: value.trim(),
        page: 1,
        sortBy: "createdAt",
        sortOrder: "DESC",
      });
    }
  };

  const handleAdvancedSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    const newParams = { ...params, page: 1 };
    setParams(newParams);

    const hasFilters = Object.values(filters).some((value) => value && value !== "");

    if (hasFilters) {
      authorsApi.filter({
        name: filters.name as string,
        nationality: filters.nationality as string,
        birthYear: filters.birthYear as number,
        isActive: filters.isActive as boolean,
        pagination: newParams,
      });
    }
  };

  const handleClearAdvancedSearch = () => {
    setSearchFilters({});
    setParams({ page: 1, limit: 10 });
  };

  if (loading && !data) {
    return (
      <PageLoading 
        title="Gestión de Autores" 
        breadcrumbs={["Autores"]}
        message="Cargando autores del sistema..."
      />
    );
  }

  if (error) {
    return (
      <PageWrapper title="Autores">
        <ApiErrorState
          error={error}
          canRetry={true}
          isRetrying={loading}
          onRetry={() => execute()}
          onReset={() => {
            setParams({ page: 1, limit: 10 });
            setSearchTerm("");
            execute();
          }}
          title="Error cargando autores"
          description="No se pudieron cargar los autores del sistema."
          showTechnicalDetails
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Gestión de Autores"
      breadcrumbs={["Autores"]}
      showSearch
      onSearchChange={handleSearchChange}
      searchPlaceholder="Buscar autores..."
      showCsvDownload
      onCsvDownload={async () => {
        const csvData = await authorsApi.exportToCsv();
        const blob = new Blob([csvData], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `autores_${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }}
      csvDownloadEnabled
    >
      <AuthorTable data={data?.data || []} meta={data?.meta as PaginationMeta} loading={loading} onPageChange={handlePageChange} />
    </PageWrapper>
  );
}
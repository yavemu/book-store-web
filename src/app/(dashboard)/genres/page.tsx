"use client";

import { SearchFilters } from "@/components/AdvancedSearchForm";
import GenreTable from "@/components/genres/GenreTable";
import ApiErrorState from "@/components/ErrorStates/ApiErrorState";
import PageWrapper from "@/components/PageWrapper";
import PageLoading from "@/components/ui/PageLoading";
import { useApiRequest } from "@/hooks";
import { genresApi, GenreListParams } from "@/services/api/entities/genres";
import { PaginationMeta } from "@/types/table";
import { useEffect, useState } from "react";

export default function GenresPage() {
  const [params, setParams] = useState<GenreListParams>({ page: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});

  const { loading, error, data, execute } = useApiRequest({
    apiFunction: () => genresApi.list(params),
  });

  useEffect(() => {
    execute();
  }, [params]);

  const handlePageChange = (page: number) => setParams({ ...params, page });

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);

    if (value?.trim().length >= 3) {
      genresApi.filter({
        filter: value.trim(),
        pagination: { ...params, page: 1, sortBy: "createdAt", sortOrder: "DESC" },
      });
    }
  };

  const handleAdvancedSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    const newParams = { ...params, page: 1 };
    setParams(newParams);

    const hasFilters = Object.values(filters).some((value) => value && value !== "");

    if (hasFilters) {
      genresApi.advancedFilter(
        {
          name: filters.name as string,
          description: filters.description as string,
          isActive: filters.isActive as boolean,
          createdDateStart: filters.startDate as string,
          createdDateEnd: filters.endDate as string,
          pagination: newParams,
        },
        newParams,
      );
    }
  };

  const handleClearAdvancedSearch = () => {
    setSearchFilters({});
    setParams({ page: 1, limit: 10 });
  };

  if (loading && !data) {
    return (
      <PageLoading 
        title="Gestión de Géneros" 
        breadcrumbs={["Géneros"]}
        message="Cargando géneros del sistema..."
      />
    );
  }

  if (error) {
    return (
      <PageWrapper title="Géneros">
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
          title="Error cargando géneros"
          description="No se pudieron cargar los géneros del sistema."
          showTechnicalDetails
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Gestión de Géneros"
      breadcrumbs={["Géneros"]}
      showSearch
      onSearchChange={handleSearchChange}
      searchPlaceholder="Buscar géneros..."
      showCsvDownload
      onCsvDownload={async () => {
        const csvData = await genresApi.exportToCsv();
        const blob = new Blob([csvData], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `generos_${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }}
      csvDownloadEnabled
    >
      <GenreTable data={data?.data || []} meta={data?.meta as PaginationMeta} loading={loading} onPageChange={handlePageChange} />
    </PageWrapper>
  );
}
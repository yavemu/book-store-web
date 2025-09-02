"use client";

import { SearchFilters } from "@/components/AdvancedSearchForm";
import GenreTable from "@/components/genres/GenreTable";
import ApiErrorState from "@/components/ErrorStates/ApiErrorState";
import PageWrapper from "@/components/PageWrapper";
import PageLoading from "@/components/ui/PageLoading";
import { useApiRequest } from "@/hooks";
import { genresApi, GenreListParams } from "@/services/api/entities/genres";
import { ApiPaginationMeta } from "@/types/api/entities";
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

  const handleSearchChange = async (value: string) => {
    setSearchTerm(value);

    if (value?.trim().length >= 3) {
      try {
        const filterResponse = await genresApi.filter({
          filter: value.trim(),
          pagination: { ...params, page: 1, sortBy: "createdAt", sortOrder: "DESC" },
        });
        setParams({ ...params, page: 1 });
      } catch (error) {
        console.error('Error filtering genres:', error);
      }
    } else if (value.trim() === "") {
      setParams({ ...params, page: 1 });
    }
  };

  const handleAdvancedSearch = async (filters: SearchFilters) => {
    setSearchFilters(filters);
    const newParams = { ...params, page: 1 };

    const hasFilters = Object.values(filters).some((value) => value && value !== "");

    if (hasFilters) {
      try {
        const filterResponse = await genresApi.advancedFilter(
          {
            name: filters.name as string,
            description: filters.description as string,
            isActive: filters.isActive as boolean,
            createdAfter: filters.startDate as string,
            createdBefore: filters.endDate as string,
          },
          newParams,
        );
        setParams(newParams);
      } catch (error) {
        console.error('Error in advanced search:', error);
      }
    } else {
      setParams(newParams);
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
      <GenreTable data={data?.data || []} meta={data?.meta as ApiPaginationMeta} loading={loading} onPageChange={handlePageChange} />
    </PageWrapper>
  );
}
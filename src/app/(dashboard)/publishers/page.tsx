"use client";

import { SearchFilters } from "@/components/AdvancedSearchForm";
import PublisherTable from "@/components/publishers/PublisherTable";
import ApiErrorState from "@/components/ErrorStates/ApiErrorState";
import PageWrapper from "@/components/PageWrapper";
import PageLoading from "@/components/ui/PageLoading";
import { useApiRequest } from "@/hooks";
import { publishingHousesApi, PublishingHouseListParams } from "@/services/api/entities/publishing-houses";
import { PaginationMeta } from "@/types/table";
import { useEffect, useState } from "react";

export default function PublishersPage() {
  const [params, setParams] = useState<PublishingHouseListParams>({ page: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});

  const { loading, error, data, execute } = useApiRequest({
    apiFunction: () => publishingHousesApi.list(params),
  });

  useEffect(() => {
    execute();
  }, [params]);

  const handlePageChange = (page: number) => setParams({ ...params, page });

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);

    if (value?.trim().length >= 3) {
      publishingHousesApi.search({
        term: value.trim(),
        page: 1,
        sortBy: "name",
        sortOrder: "ASC",
      });
    }
  };

  const handleAdvancedSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    const newParams = { ...params, page: 1 };
    setParams(newParams);

    const hasFilters = Object.values(filters).some((value) => value && value !== "");

    if (hasFilters) {
      publishingHousesApi.filter({
        name: filters.name as string,
        country: filters.country as string,
        city: filters.city as string,
        established: filters.established as number,
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
        title="Gestión de Editoriales" 
        breadcrumbs={["Editoriales"]}
        message="Cargando editoriales del sistema..."
      />
    );
  }

  if (error) {
    return (
      <PageWrapper title="Editoriales">
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
          title="Error cargando editoriales"
          description="No se pudieron cargar las editoriales del sistema."
          showTechnicalDetails
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Gestión de Editoriales"
      breadcrumbs={["Editoriales"]}
      showSearch
      onSearchChange={handleSearchChange}
      searchPlaceholder="Buscar editoriales..."
      showCsvDownload
      onCsvDownload={async () => {
        const csvData = await publishingHousesApi.exportToCsv();
        const blob = new Blob([csvData], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `editoriales_${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }}
      csvDownloadEnabled
    >
      <PublisherTable data={data?.data || []} meta={data?.meta as PaginationMeta} loading={loading} onPageChange={handlePageChange} />
    </PageWrapper>
  );
}
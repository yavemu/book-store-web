"use client";

import { SearchFilters } from "@/components/AdvancedSearchForm";
import AuditTable from "@/components/audit/AuditTable";
import ApiErrorState from "@/components/ErrorStates/ApiErrorState";
import PageWrapper from "@/components/PageWrapper";
import PageLoading from "@/components/ui/PageLoading";
import { useApiRequest } from "@/hooks";
import { auditApi, AuditListParams } from "@/services/api/entities/audit";
import { PaginationMeta } from "@/types/table";
import { useEffect, useState } from "react";

export default function AuditPage() {
  const [params, setParams] = useState<AuditListParams>({ page: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});

  const { loading, error, data, execute } = useApiRequest({
    apiFunction: () => auditApi.list(params),
  });

  useEffect(() => {
    execute();
  }, [params]);

  const handlePageChange = (page: number) => setParams({ ...params, page });

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);

    if (value?.trim().length >= 3) {
      auditApi.filter({
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
      auditApi.advancedFilter(
        {
          userId: filters.userId as string,
          entityType: filters.entityType as string,
          action: filters.action as string,
          startDate: filters.startDate as string,
          endDate: filters.endDate as string,
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
        title="Logs de Auditoría" 
        breadcrumbs={["Auditoría"]}
        message="Cargando registros de auditoría..."
      />
    );
  }

  if (error) {
    return (
      <PageWrapper title="Auditoría">
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
          title="Error cargando auditoría"
          description="No se pudieron cargar los registros de auditoría del sistema."
          showTechnicalDetails
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Logs de Auditoría"
      breadcrumbs={["Auditoría"]}
      showSearch
      onSearchChange={handleSearchChange}
      searchPlaceholder="Buscar en logs..."
      showCsvDownload
      onCsvDownload={async () => {
        const csvData = await auditApi.exportToCsv();
        const blob = new Blob([csvData], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `auditoria_${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }}
      csvDownloadEnabled
    >
      <AuditTable data={data?.data || []} meta={data?.meta as PaginationMeta} loading={loading} onPageChange={handlePageChange} />
    </PageWrapper>
  );
}

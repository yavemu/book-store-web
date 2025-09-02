"use client";

import { SearchFilters } from "@/components/AdvancedSearchForm";
import UserTable from "@/components/users/UserTable";
import ApiErrorState from "@/components/ErrorStates/ApiErrorState";
import PageWrapper from "@/components/PageWrapper";
import PageLoading from "@/components/ui/PageLoading";
import { useApiRequest } from "@/hooks";
import { usersApi, UserListParams } from "@/services/api/entities/users";
import { PaginationMeta } from "@/types/table";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [params, setParams] = useState<UserListParams>({ page: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});

  const { loading, error, data, execute } = useApiRequest({
    apiFunction: () => usersApi.list(params),
  });

  useEffect(() => {
    execute();
  }, [params]);

  const handlePageChange = (page: number) => setParams({ ...params, page });

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);

    if (value?.trim().length >= 3) {
      usersApi.filter({
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
      usersApi.advancedFilter(
        {
          name: filters.name as string,
          email: filters.email as string,
          role: filters.role as "admin" | "user",
          isActive: filters.isActive as boolean,
          createdAfter: filters.startDate as string,
          createdBefore: filters.endDate as string,
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
        title="Gestión de Usuarios" 
        breadcrumbs={["Usuarios"]}
        message="Cargando usuarios del sistema..."
      />
    );
  }

  if (error) {
    return (
      <PageWrapper title="Usuarios">
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
          title="Error cargando usuarios"
          description="No se pudieron cargar los usuarios del sistema."
          showTechnicalDetails
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Gestión de Usuarios"
      breadcrumbs={["Usuarios"]}
      showSearch
      onSearchChange={handleSearchChange}
      searchPlaceholder="Buscar usuarios..."
      showCsvDownload
      onCsvDownload={async () => {
        const csvData = await usersApi.exportToCsv();
        const blob = new Blob([csvData], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `usuarios_${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }}
      csvDownloadEnabled
    >
      <UserTable data={data?.data || []} meta={data?.meta as PaginationMeta} loading={loading} onPageChange={handlePageChange} />
    </PageWrapper>
  );
}

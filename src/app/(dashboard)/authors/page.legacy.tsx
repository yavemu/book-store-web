"use client";

import AuthorTable from "@/components/authors/AuthorTable";
import GenericAdvancedSearch, { GenericSearchFilters } from "@/components/Dashboard/GenericAdvancedSearch";
import QuickSearchInput from "@/components/Dashboard/QuickSearchInput";
import { authorsSearchConfig } from "@/config/search/authors.search";
import ApiErrorState from "@/components/ErrorStates/ApiErrorState";
import PageWrapper from "@/components/PageWrapper";
import PageLoading from "@/components/ui/PageLoading";
import { useApiRequest } from "@/hooks";
import { authorsApi, AuthorListParams } from "@/services/api/entities/authors";
import { ApiPaginationMeta } from "@/types/api/entities";
import { useEffect, useState } from "react";

export default function AuthorsPage() {
  const [params, setParams] = useState<AuthorListParams>({ page: 1, limit: 10 });
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const { loading, error, data, execute } = useApiRequest({
    apiFunction: () => authorsApi.list(params),
  });

  useEffect(() => {
    if (!isSearchMode) {
      execute();
    }
  }, [params, isSearchMode]);

  // Page change handler
  const handlePageChange = (page: number) => setParams({ ...params, page });

  // Data refresh after CRUD operations
  const handleDataRefresh = () => {
    if (isSearchMode) {
      setIsSearchMode(false); // Reset to normal list view
    }
    execute();
  };

  // Auto filter using /filter endpoint - executes automatically on 3+ chars
  const handleAutoFilter = async (term: string) => {
    setSearchLoading(true);
    try {
      await authorsApi.filter({
        name: term, // Use name field for auto search
        pagination: { page: 1, limit: 10, sortBy: "createdAt", sortOrder: "DESC" },
      });
      
      setIsSearchMode(true);
      // For now trigger refresh - in production would update data state directly
      setParams({ page: 1, limit: 10 });
      
    } catch (error) {
      console.error('Error auto-filtering authors:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  // Search using /search endpoint from advanced form
  const handleSearch = async (term: string, fuzzySearch?: boolean) => {
    setSearchLoading(true);
    try {
      await authorsApi.search({
        term: term,
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "DESC",
      });
      
      setIsSearchMode(true);
      setParams({ page: 1, limit: 10 });
      
    } catch (error) {
      console.error('Error searching authors:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  // Advanced filter using /filter endpoint with form data
  const handleAdvancedFilter = async (filters: GenericSearchFilters) => {
    setSearchLoading(true);
    try {
      await authorsApi.filter({
        ...filters,
        pagination: { page: 1, limit: 10, sortBy: "createdAt", sortOrder: "DESC" },
      });
      
      setIsSearchMode(true);
      setParams({ page: 1, limit: 10 });
      
    } catch (error) {
      console.error('Error filtering authors:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  // Clear search and return to normal list
  const handleClearSearch = () => {
    setIsSearchMode(false);
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
            setIsSearchMode(false);
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
      showCsvDownload
      onCsvDownload={async () => {
        try {
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
        } catch (error) {
          console.error("Error exporting authors:", error);
        }
      }}
      csvDownloadEnabled
    >
      {/* Advanced Search Component */}
      <div className="mb-6">
        <GenericAdvancedSearch
          entityName="Autores"
          searchFields={authorsSearchConfig}
          onAutoFilter={handleAutoFilter}
          onSearch={handleSearch}
          onAdvancedFilter={handleAdvancedFilter}
          onClear={handleClearSearch}
          loading={searchLoading}
        />
      </div>

      {/* Authors Table with CRUD Operations */}
      <AuthorTable 
        data={data?.data || []} 
        meta={data?.meta as ApiPaginationMeta} 
        loading={loading || searchLoading} 
        onPageChange={handlePageChange}
        onDataRefresh={handleDataRefresh}
        quickSearchComponent={
          <QuickSearchInput
            onAutoFilter={handleAutoFilter}
            loading={searchLoading}
            placeholder="Búsqueda rápida autores (mín. 3 caracteres)"
          />
        }
      />
    </PageWrapper>
  );
}
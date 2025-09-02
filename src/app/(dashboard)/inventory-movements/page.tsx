"use client";

import { SearchFilters } from "@/components/AdvancedSearchForm";
import InventoryMovementTable from "@/components/inventory-movements/InventoryMovementTable";
import ApiErrorState from "@/components/ErrorStates/ApiErrorState";
import PageWrapper from "@/components/PageWrapper";
import PageLoading from "@/components/ui/PageLoading";
import { useApiRequest } from "@/hooks";
import { inventoryMovementsApi, InventoryMovementListParams } from "@/services/api/entities/inventory-movements";
import { ApiPaginationMeta } from "@/types/api/entities";
import { useEffect, useState } from "react";

export default function InventoryMovementsPage() {
  const [params, setParams] = useState<InventoryMovementListParams>({ page: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});

  const { loading, error, data, execute } = useApiRequest({
    apiFunction: () => inventoryMovementsApi.list(params),
  });

  useEffect(() => {
    execute();
  }, [params]);

  const handlePageChange = (page: number) => setParams({ ...params, page });

  const handleSearchChange = async (value: string) => {
    setSearchTerm(value);

    if (value?.trim().length >= 3) {
      try {
        const searchResponse = await inventoryMovementsApi.search({
          term: value.trim(),
        });
        setParams({ ...params, page: 1 });
      } catch (error) {
        console.error('Error searching inventory movements:', error);
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
        const filterResponse = await inventoryMovementsApi.advancedFilter(
          {
            movementType: filters.movementType as 'PURCHASE' | 'SALE' | 'DISCOUNT' | 'INCREASE' | 'OUT_OF_STOCK' | 'ARCHIVED',
            status: filters.status as 'PENDING' | 'COMPLETED' | 'ERROR',
            entityType: filters.entityType as string,
            userId: filters.userId as string,
            userRole: filters.userRole as string,
            dateFrom: filters.startDate as string,
            dateTo: filters.endDate as string,
            minPrice: filters.minPrice as number,
            maxPrice: filters.maxPrice as number,
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
        title="Movimientos de Inventario" 
        breadcrumbs={["Inventario", "Movimientos"]}
        message="Cargando movimientos de inventario..."
      />
    );
  }

  if (error) {
    return (
      <PageWrapper title="Movimientos de Inventario">
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
          title="Error cargando movimientos"
          description="No se pudieron cargar los movimientos de inventario."
          showTechnicalDetails
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Movimientos de Inventario"
      breadcrumbs={["Inventario", "Movimientos"]}
      showSearch
      onSearchChange={handleSearchChange}
      searchPlaceholder="Buscar movimientos..."
      showCsvDownload
      onCsvDownload={async () => {
        const csvData = await inventoryMovementsApi.exportToCsv();
        const blob = new Blob([csvData], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `movimientos_inventario_${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }}
      csvDownloadEnabled
    >
      <InventoryMovementTable data={data?.data || []} meta={data?.meta as ApiPaginationMeta} loading={loading} onPageChange={handlePageChange} />
    </PageWrapper>
  );
}
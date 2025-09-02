"use client";

import { SearchFilters } from "@/components/AdvancedSearchForm";
import BookTable from "@/components/books/BookTable";
import ApiErrorState from "@/components/ErrorStates/ApiErrorState";
import PageWrapper from "@/components/PageWrapper";
import PageLoading from "@/components/ui/PageLoading";
import { useApiRequest } from "@/hooks";
import { bookCatalogApi, BookCatalogListParams } from "@/services/api/entities/book-catalog";
import { PaginationMeta } from "@/types/table";
import { useEffect, useState } from "react";

export default function BooksPage() {
  const [params, setParams] = useState<BookCatalogListParams>({ page: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});

  const { loading, error, data, execute } = useApiRequest({
    apiFunction: () => bookCatalogApi.list(params),
  });

  useEffect(() => {
    execute();
  }, [params]);

  const handlePageChange = (page: number) => setParams({ ...params, page });

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);

    if (value?.trim().length >= 3) {
      bookCatalogApi.filter({
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
      bookCatalogApi.advancedFilter(
        {
          title: filters.title as string,
          isbn: filters.isbn as string,
          authorName: filters.author as string,
          genreId: filters.genre as string,
          publisherId: filters.publisher as string,
          minPrice: filters.minPrice as number,
          maxPrice: filters.maxPrice as number,
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
        title="Catálogo de Libros" 
        breadcrumbs={["Libros"]}
        message="Cargando catálogo de libros..."
      />
    );
  }

  if (error) {
    return (
      <PageWrapper title="Libros">
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
          title="Error cargando libros"
          description="No se pudieron cargar los libros del catálogo."
          showTechnicalDetails
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Catálogo de Libros"
      breadcrumbs={["Libros"]}
      showSearch
      onSearchChange={handleSearchChange}
      searchPlaceholder="Buscar libros..."
      showCsvDownload
      onCsvDownload={async () => {
        const csvData = await bookCatalogApi.exportToCsv();
        const blob = new Blob([csvData], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `libros_${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }}
      csvDownloadEnabled
    >
      <BookTable data={data?.data || []} meta={data?.meta as PaginationMeta} loading={loading} onPageChange={handlePageChange} />
    </PageWrapper>
  );
}
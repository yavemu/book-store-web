"use client";

import { SearchFilters } from "@/components/AdvancedSearchForm";
import BookTable from "@/components/books/BookTable";
import ApiErrorState from "@/components/ErrorStates/ApiErrorState";
import PageWrapper from "@/components/PageWrapper";
import PageLoading from "@/components/ui/PageLoading";
import { useApiRequest } from "@/hooks";
import { booksApi, BookListParams } from "@/services/api/entities/books";
import { ApiPaginationMeta } from "@/types/api/entities";
import { useEffect, useState } from "react";

export default function BooksPage() {
  const [params, setParams] = useState<BookListParams>({ page: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});

  const { loading, error, data, execute } = useApiRequest({
    apiFunction: () => booksApi.list(params),
  });

  useEffect(() => {
    execute();
  }, [params]);

  const handlePageChange = (page: number) => setParams({ ...params, page });

  const handleSearchChange = async (value: string) => {
    setSearchTerm(value);

    if (value?.trim().length >= 3) {
      try {
        const filterResponse = await booksApi.filter({
          filter: value.trim(),
          pagination: { ...params, page: 1, sortBy: "createdAt", sortOrder: "DESC" },
        });
        setParams({ ...params, page: 1 });
      } catch (error) {
        console.error('Error filtering books:', error);
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
        const filterResponse = await booksApi.advancedFilter(
          {
            title: filters.title as string,
            isbnCode: filters.isbn as string,
            authorName: filters.author as string,
            genreId: filters.genre as string,
            publisherId: filters.publisher as string,
            minPrice: filters.minPrice as number,
            maxPrice: filters.maxPrice as number,
            publicationDateFrom: filters.startDate as string,
            publicationDateTo: filters.endDate as string,
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
        const csvData = await booksApi.exportToCsv();
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
      <BookTable data={data?.data || []} meta={data?.meta as ApiPaginationMeta} loading={loading} onPageChange={handlePageChange} />
    </PageWrapper>
  );
}
"use client";

import React from "react";
import { useBooksDashboard } from "@/hooks/books/useBooksDashboard";
import PageWrapper from "@/components/PageWrapper";
import PageLoading from "@/components/ui/PageLoading";
import ApiErrorState from "@/components/ErrorStates/ApiErrorState";
import GenericAdvancedSearch from "@/components/Dashboard/GenericAdvancedSearch";
import BooksTable from "@/components/books/BookTable"; // Assuming this exists
import BooksForm from "@/components/books/BookForm"; // Assuming this exists
import IsbnValidationWidget from "@/components/books/IsbnValidationWidget"; // New component
import GenreEditorialSelector from "@/components/books/GenreEditorialSelector"; // New component

export default function BooksPageOptimized() {
  const books = useBooksDashboard({
    customHandlers: {
      onAfterCreate: (book) => {
        console.log('Libro creado exitosamente:', book.title);
      },
      onAfterUpdate: (book) => {
        console.log('Libro actualizado:', book.title);
      }
    }
  });

  // Loading state
  if (books.state.loading && !books.state.data.length) {
    return (
      <PageLoading 
        title="Gestión de Libros" 
        breadcrumbs={["Libros"]}
        message="Cargando libros del sistema..."
      />
    );
  }

  // Error state
  if (books.state.error) {
    return (
      <PageWrapper title="Gestión de Libros">
        <ApiErrorState
          error={books.state.error}
          canRetry={true}
          isRetrying={books.state.loading}
          onRetry={books.handlers.onDataRefresh}
          onReset={() => {
            books.handlers.onClearSearch?.();
            books.handlers.onDataRefresh?.();
          }}
          title="Error cargando libros"
          description="No se pudieron cargar los libros del sistema."
          showTechnicalDetails
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Gestión de Libros"
      breadcrumbs={["Libros"]}
      showCsvDownload={true}
      onCsvDownload={books.handlers.onExport}
      csvDownloadEnabled={true}
    >
      {/* Advanced Search Component */}
      <div className="mb-6">
        <GenericAdvancedSearch
          entityName="Libros"
          searchFields={[
            { key: 'title', label: 'Título', type: 'text', placeholder: 'Buscar por título' },
            { key: 'isbn', label: 'ISBN', type: 'text', placeholder: 'ISBN-10 o ISBN-13' },
            { key: 'genreId', label: 'Género', type: 'select', options: books.genreEditorial.state.genres.map(g => ({ value: g.id, label: g.name })) },
            { key: 'publisherId', label: 'Editorial', type: 'select', options: books.genreEditorial.state.publishers.map(p => ({ value: p.id, label: p.name })) },
            { key: 'minPrice', label: 'Precio mínimo', type: 'number' },
            { key: 'maxPrice', label: 'Precio máximo', type: 'number' },
          ]}
          onAutoFilter={books.handlers.onAutoFilter}
          onSearch={books.handlers.onSearch}
          onAdvancedFilter={books.handlers.onAdvancedFilter}
          onClear={books.handlers.onClearSearch}
          loading={books.state.searchLoading}
        />
      </div>

      {/* Books Table */}
      <BooksTable 
        data={books.state.data} 
        meta={books.state.meta} 
        loading={books.state.loading || books.state.searchLoading} 
        onPageChange={books.handlers.onPageChange}
        onDataRefresh={books.handlers.onDataRefresh}
        // CRUD handlers
        onCreate={books.handlers.onCreate}
        onEdit={books.handlers.onEdit}
        onView={books.handlers.onView}
        onDelete={books.handlers.onDelete}
        // Form state
        showForm={books.state.showForm}
        isEditing={books.state.isEditing}
        selectedEntity={books.state.selectedEntity}
        formLoading={books.state.isFormLoading}
        onFormCancel={books.handlers.onFormCancel}
        // Modal state
        showViewModal={books.state.showViewModal}
        showDeleteModal={books.state.showDeleteModal}
        onDeleteConfirm={books.handlers.onDeleteConfirm}
        onViewModalClose={books.utils.handleViewModalClose}
        onDeleteModalCancel={books.utils.handleDeleteModalCancel}
        // Book-specific props
        canSubmitForm={books.state.canSubmitForm}
        hasValidationErrors={books.state.hasValidationErrors}
        // Specialized search functions
        onSearchByIsbn={books.books.searchByIsbn}
        onSearchByGenre={books.books.searchByGenre}
        onSearchByPublisher={books.books.searchByPublisher}
        // Custom form component
        formComponent={
          books.state.showForm && (
            <div className="space-y-6">
              <BooksForm
                data={books.bookForm.data}
                onDataChange={books.bookForm.updateData}
                onSubmit={books.handlers.onFormSubmit}
                onCancel={books.handlers.onFormCancel}
                isEditing={books.state.isEditing}
                loading={books.state.isFormLoading}
                canSubmit={books.state.canSubmitForm}
              />
              
              {/* ISBN Validation Widget */}
              <IsbnValidationWidget
                isbn={books.isbn.isbn}
                onIsbnChange={books.isbn.setIsbn}
                isValidating={books.isbn.isValidating}
                isValid={books.isbn.isValid}
                isDuplicate={books.isbn.isDuplicate}
                errorMessage={books.isbn.errorMessage}
                suggestion={books.isbn.suggestion}
                onApplySuggestion={books.isbn.applySuggestion}
                onValidateManually={books.isbn.validateManually}
              />
              
              {/* Genre/Editorial Selector */}
              <GenreEditorialSelector
                // Genre props
                genres={books.genreEditorial.state.genres}
                selectedGenre={books.genreEditorial.state.selectedGenre}
                genreSearchTerm={books.genreEditorial.state.genreSearchTerm}
                genreLoading={books.genreEditorial.state.genreLoading}
                genreError={books.genreEditorial.state.genreError}
                showCreateGenre={books.genreEditorial.state.showCreateGenre}
                newGenreName={books.genreEditorial.state.newGenreName}
                onGenreSelect={books.genreEditorial.selectGenre}
                onGenreSearchChange={books.genreEditorial.setGenreSearchTerm}
                onGenreCreate={books.genreEditorial.createGenre}
                onNewGenreNameChange={books.genreEditorial.setNewGenreName}
                onToggleCreateGenre={books.genreEditorial.toggleCreateGenre}
                canCreateGenre={books.genreEditorial.canCreateGenre}
                // Publisher props
                publishers={books.genreEditorial.state.publishers}
                selectedPublisher={books.genreEditorial.state.selectedPublisher}
                publisherSearchTerm={books.genreEditorial.state.publisherSearchTerm}
                publisherLoading={books.genreEditorial.state.publisherLoading}
                publisherError={books.genreEditorial.state.publisherError}
                showCreatePublisher={books.genreEditorial.state.showCreatePublisher}
                newPublisherName={books.genreEditorial.state.newPublisherName}
                onPublisherSelect={books.genreEditorial.selectPublisher}
                onPublisherSearchChange={books.genreEditorial.setPublisherSearchTerm}
                onPublisherCreate={books.genreEditorial.createPublisher}
                onNewPublisherNameChange={books.genreEditorial.setNewPublisherName}
                onToggleCreatePublisher={books.genreEditorial.toggleCreatePublisher}
                canCreatePublisher={books.genreEditorial.canCreatePublisher}
                // Validation
                hasValidSelections={books.genreEditorial.hasValidSelections}
                isLoading={books.genreEditorial.isLoading}
              />
            </div>
          )
        }
      />
    </PageWrapper>
  );
}
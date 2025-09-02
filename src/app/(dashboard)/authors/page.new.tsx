"use client";

import GenericDashboardPage from "@/components/Dashboard/GenericDashboardPage";
import { authorsConfig } from "@/config/dashboard/authors.config";
import { authorsApi } from "@/services/api/entities/authors";
import AuthorTable from "@/components/authors/AuthorTable";

export default function AuthorsPageNew() {
  return (
    <GenericDashboardPage
      config={authorsConfig}
      apiService={authorsApi}
      tableComponent={AuthorTable}
    />
  );
}

// ========================================
// COMPARISON WITH OLD IMPLEMENTATION:
// ========================================

// OLD: 192 lines of code with duplicated logic
// NEW: 8 lines of code with all functionality intact

// OLD FEATURES PRESERVED:
// ✅ Full CRUD operations (Create, Read, Update, Delete)
// ✅ Auto-search (filter endpoint with 3+ characters)
// ✅ Advanced search with multiple filters
// ✅ Simple search functionality
// ✅ Pagination
// ✅ CSV Export
// ✅ Loading states
// ✅ Error handling
// ✅ Data refresh after operations
// ✅ Form validation
// ✅ Modal management

// NEW BENEFITS:
// ✅ No code duplication
// ✅ Type-safe configuration
// ✅ Consistent behavior across entities
// ✅ Easy to test
// ✅ Easy to maintain
// ✅ Extensible through configuration
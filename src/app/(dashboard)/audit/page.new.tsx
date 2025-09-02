"use client";

import GenericDashboardPage from "@/components/Dashboard/GenericDashboardPage";
import { auditConfig } from "@/config/dashboard/audit.config";
import { auditApi } from "@/services/api/entities/audit";
import AuditTable from "@/components/audit/AuditTable";

export default function AuditPageNew() {
  return (
    <GenericDashboardPage
      config={auditConfig}
      apiService={auditApi}
      tableComponent={AuditTable}
    />
  );
}

// ========================================
// COMPARISON WITH OLD IMPLEMENTATION:
// ========================================

// OLD: 184 lines of code with duplicated logic
// NEW: 8 lines of code with all functionality intact

// OLD FEATURES PRESERVED:
// ✅ Read-only access (no CRUD operations)
// ✅ Advanced search functionality only
// ✅ No auto-search (as configured)
// ✅ Pagination
// ✅ CSV Export
// ✅ Loading states
// ✅ Error handling

// CONFIGURATION DEMONSTRATES:
// ✅ How to disable CRUD operations
// ✅ How to limit search capabilities
// ✅ How to configure read-only entities
// ✅ How different entities can have different capabilities
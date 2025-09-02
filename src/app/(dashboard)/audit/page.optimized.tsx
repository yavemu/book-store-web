"use client";

import GenericDashboardPage from "@/components/Dashboard/GenericDashboardPage";
import { auditConfig } from "@/config/dashboard/audit.config";
import { auditApi } from "@/services/api/entities/audit";
import AuditTable from "@/components/audit/AuditTable";

// Usando el hook optimizado para Audit (read-only)
export default function AuditPageOptimized() {
  return (
    <GenericDashboardPage
      config={auditConfig}
      apiService={auditApi}
      tableComponent={AuditTable}
      customHandlers={{
        // Custom handlers específicos para Audit si es necesario
        onDataRefresh: () => {
          console.log('Datos de auditoría actualizados');
        }
      }}
    />
  );
}
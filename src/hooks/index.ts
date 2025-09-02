// Core hooks
export * from "./useApiRequest";
export * from "./useDebounce";
export * from "./useApiHealth";
export * from "./useEnhancedApiRequest";
export * from "./useGlobalApiMonitor";

// API hooks
export * from "./api/useApiCall";

// Dashboard hooks - New optimized architecture
export * from "./useDashboard"; // Legacy - mantener para compatibilidad
export * from "./dashboard/useDashboardOptimized";

// Specialized entity hooks
export * from "./books/useIsbnValidation";
export * from "./books/useGenreEditorialManager";
export * from "./books/useBooksDashboard";
export * from "./inventory/useInventoryMovements";

// Table hooks
export * from "./table";
export * from "./usePaginationMeta";

// Legacy hooks (deprecated but maintained for compatibility)
export * from "./useSearchApi";
export * from "./useQuickSearch";
// export * from "./useInventoryMovements"; // Legacy version - DISABLED due to conflict with inventory/useInventoryMovements
export * from "./useAdvancedSearch";

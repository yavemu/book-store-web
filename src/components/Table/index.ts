// Exportaciones principales
export { default as OptimizedDynamicTable } from './OptimizedDynamicTable';
export { default as ResponsiveDynamicTable } from './ResponsiveDynamicTable';
export type { TableColumn } from './OptimizedDynamicTable';

// Componentes de tabla
export { default as TableHeader } from './TableHeader';
export { default as TableSearch } from './TableSearch';
export { default as TableActions } from './TableActions';
export { default as TablePagination } from './TablePagination';
export { default as TableInfo } from './TableInfo';
export { default as TableHeaderCell } from './TableHeaderCell';
export { default as TableLoadingRow } from './TableLoadingRow';
export { default as TableCreateButton } from './TableCreateButton';

// Componentes de celdas especializadas
export { default as StatusCell } from './cells/StatusCell';
export { default as DateCell } from './cells/DateCell';
export { default as TextCell } from './cells/TextCell';
export { default as PriceCell } from './cells/PriceCell';
export { default as LinkCell } from './cells/LinkCell';
export { default as BadgeCell } from './cells/BadgeCell';

// Componentes de celdas responsivas
export { default as AdaptiveTextCell } from './cells/AdaptiveTextCell';
export { default as CompactStatusCell } from './cells/CompactStatusCell';
export { default as CompactDateCell } from './cells/CompactDateCell';

// Componente de acciones responsivas
export { default as ResponsiveTableActions } from './ResponsiveTableActions';

// Hooks
export { useTable } from '@/hooks/table/useTable';
export { useTablePagination } from '@/hooks/table/useTablePagination';
export { useTableSorting } from '@/hooks/table/useTableSorting';
export { useTableActions } from '@/hooks/table/useTableActions';
export { useTableSearch } from '@/hooks/table/useTableSearch';

// Tipos
export type { PaginationMeta, PaginationParams } from '@/hooks/table/useTablePagination';
export type { SortConfig } from '@/hooks/table/useTableSorting';
export type { TableAction } from '@/hooks/table/useTableActions';
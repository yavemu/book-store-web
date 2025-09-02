export interface TableColumn {
  key: string;
  label: string;
  render?: (value: any, record: any) => React.ReactNode;
  sortable?: boolean;
}

export interface TableAction {
  label: string;
  onClick: (record: any) => void;
  variant?: "primary" | "secondary" | "danger";
}

export interface PaginationMeta {
  totalPages: number;
  page: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface DynamicTableProps {
  data: any[];
  columns: TableColumn[];
  meta?: PaginationMeta;
  loading?: boolean;
  actions?: TableAction[];
  paginationParams?: PaginationParams;
  onPageChange?: (page: number) => void;
}

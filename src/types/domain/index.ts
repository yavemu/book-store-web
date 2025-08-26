export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}
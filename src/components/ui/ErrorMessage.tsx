import { ApiError } from '@/types/api';

interface ErrorMessageProps {
  error: ApiError | Error | string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  error, 
  onRetry, 
  className = '' 
}) => {
  const getMessage = (error: ApiError | Error | string): string => {
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;
    return error.message || 'An unexpected error occurred';
  };

  return (
    <div className={`card-base border-l-4 border-l-red-500 ${className}`}>
      <div className="card-content">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-semibold text-red-800">Error del Sistema</h3>
            <p className="mt-1 text-sm text-red-700">{getMessage(error)}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-3 btn-secondary text-sm"
              >
                🔄 Reintentar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
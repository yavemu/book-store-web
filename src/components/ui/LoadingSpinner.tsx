interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  className = '',
  message
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`inline-block ${sizeClasses[size]}`}>
        <div className="animate-spin rounded-full border-2 border-neutral-300 border-t-indigo-600"></div>
      </div>
      {message && (
        <p className="mt-3 text-sm text-muted">{message}</p>
      )}
    </div>
  );
};
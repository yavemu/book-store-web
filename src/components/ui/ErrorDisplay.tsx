'use client';

interface ErrorDisplayProps {
  error: string | Error | null;
  className?: string;
  showTitle?: boolean;
  title?: string;
}

export default function ErrorDisplay({ 
  error, 
  className = '', 
  showTitle = true,
  title = 'Error'
}: ErrorDisplayProps) {
  if (!error) return null;

  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div className={`error-display ${className}`}>
      {showTitle && <strong>{title}:</strong>} {errorMessage}
    </div>
  );
}
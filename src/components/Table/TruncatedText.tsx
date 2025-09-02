/**
 * Utility component for truncating text in tables with tooltip support
 */

interface TruncatedTextProps {
  text: string;
  maxLength?: number;
  maxWidth?: string;
  className?: string;
}

export default function TruncatedText({ 
  text, 
  maxLength = 30, 
  maxWidth = "250px",
  className = ""
}: TruncatedTextProps) {
  if (!text) return <span>-</span>;

  const shouldTruncate = text.length > maxLength;

  if (shouldTruncate) {
    return (
      <div 
        className={`truncate ${className}`}
        style={{ maxWidth }}
        title={text}
      >
        {text}
      </div>
    );
  }

  return <span className={className}>{text}</span>;
}

/**
 * Status badge component for better visual representation
 */
interface StatusBadgeProps {
  isActive: boolean;
  activeText?: string;
  inactiveText?: string;
}

export function StatusBadge({ 
  isActive, 
  activeText = "Activo", 
  inactiveText = "Inactivo" 
}: StatusBadgeProps) {
  return (
    <span 
      className={`px-2 py-1 text-xs rounded-full font-medium ${
        isActive 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-red-100 text-red-800 border border-red-200'
      }`}
    >
      {isActive ? activeText : inactiveText}
    </span>
  );
}

/**
 * Number badge component for numeric values
 */
interface NumberBadgeProps {
  value: number;
  className?: string;
}

export function NumberBadge({ value, className = "" }: NumberBadgeProps) {
  return (
    <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full ${className}`}>
      {value || 0}
    </span>
  );
}
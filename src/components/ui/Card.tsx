import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  variant?: 'default' | 'book' | 'status-active' | 'status-inactive' | 'status-warning';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  title, 
  subtitle,
  className = '', 
  variant = 'default',
  hover = false
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'book':
        return 'card-book';
      case 'status-active':
        return 'card-base card-status-active';
      case 'status-inactive':
        return 'card-base card-status-inactive';
      case 'status-warning':
        return 'card-base card-status-warning';
      default:
        return 'card-base';
    }
  };

  const hoverClass = hover ? 'card-hover' : '';

  return (
    <div className={`${getVariantClasses()} ${hoverClass} ${className}`}>
      {title && (
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};
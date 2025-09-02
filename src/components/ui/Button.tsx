interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'link' | 'danger' | 'success';
  fullWidth?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export default function Button({
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  fullWidth = false,
  className = '',
  size = 'md',
  loading = false
}: ButtonProps) {
  const getClassName = () => {
    let classes = 'btn-base ';
    
    // Use new CSS classes from globals.css
    switch (variant) {
      case 'primary':
        classes += 'btn-primary ';
        break;
      case 'secondary':
        classes += 'btn-secondary ';
        break;
      case 'danger':
        classes += 'btn-danger ';
        break;
      case 'success':
        classes += 'btn-success ';
        break;
      case 'link':
        classes += 'btn-secondary '; // Default to secondary for links
        break;
    }
    
    if (size === 'sm') {
      classes += 'btn-sm ';
    } else if (size === 'lg') {
      classes += 'btn-lg ';
    }
    
    if (fullWidth) {
      classes += 'btn-full-width ';
    }
    
    if (disabled || loading) {
      classes += 'btn-disabled ';
    }
    
    return classes + className;
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={getClassName()}
    >
      {loading ? (
        <span className="btn-loading">
          <span className="loading-spinner"></span>
          {typeof children === 'string' ? 'Cargando...' : children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
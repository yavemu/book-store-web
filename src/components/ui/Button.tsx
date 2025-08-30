interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'link';
  fullWidth?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  fullWidth = false,
  className = '',
  size = 'md'
}: ButtonProps) {
  const getClassName = () => {
    let classes = '';
    
    // Use existing CSS classes from globals.css
    switch (variant) {
      case 'primary':
        classes += 'btn-create ';
        break;
      case 'secondary':
        classes += 'button secondary ';
        break;
      case 'link':
        classes += 'button ';
        break;
    }
    
    if (size === 'sm') {
      if (variant === 'primary') {
        classes += 'btn-action-ver '; // Reuse existing small button styles
      }
    }
    
    return classes + className;
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={getClassName()}
    >
      {children}
    </button>
  );
}
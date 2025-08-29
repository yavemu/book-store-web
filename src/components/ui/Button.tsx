interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'link';
  fullWidth?: boolean;
}

export default function Button({
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  fullWidth = false
}: ButtonProps) {
  const getStyles = () => {
    const baseStyles = {
      padding: '12px 24px',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      width: fullWidth ? '100%' : 'auto',
      opacity: disabled ? 0.6 : 1
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: '#007bff',
          color: 'white'
        };
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: '#6c757d',
          color: 'white'
        };
      case 'link':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: '#007bff',
          textDecoration: 'underline',
          padding: '0'
        };
      default:
        return baseStyles;
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={getStyles()}
    >
      {children}
    </button>
  );
}
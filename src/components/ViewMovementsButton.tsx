interface ViewMovementsButtonProps {
  onClick: () => void;
  text?: string;
  loading?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

export default function ViewMovementsButton({
  onClick,
  text = 'Ver Movimientos',
  loading = false,
  disabled = false,
  ariaLabel,
  className = '',
}: ViewMovementsButtonProps) {
  const isDisabled = disabled || loading;
  
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={`btn-action-ver ${className}`}
      aria-label={ariaLabel || (loading ? 'Cargando movimientos' : undefined)}
    >
      {loading ? 'Cargando...' : text}
    </button>
  );
}
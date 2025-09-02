import { useMemo } from 'react';

export interface TableAction {
  label: string;
  onClick: (record: any) => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'default' | 'destructive' | 'ver' | 'editar' | 'eliminar';
  icon?: string;
}

interface UseTableActionsProps {
  entityName?: string;
  customActions?: TableAction[];
  onEdit?: (record: any) => void;
  onDelete?: (record: any) => void;
  onView?: (record: any) => void;
  showDefaultActions?: boolean;
}

export function useTableActions({
  entityName = 'registro',
  customActions = [],
  onEdit,
  onDelete,
  onView,
  showDefaultActions = true
}: UseTableActionsProps = {}) {

  const defaultActions = useMemo<TableAction[]>(() => [
    {
      label: 'Ver',
      onClick: onView || ((record: any) => console.log('Ver', record)),
      variant: 'ver' as const,
      icon: '👁️'
    },
    {
      label: 'Editar',
      onClick: onEdit || ((record: any) => console.log('Editar', record)),
      variant: 'editar' as const,
      icon: '✏️'
    },
    {
      label: 'Eliminar',
      onClick: onDelete || ((record: any) => {
        if (confirm(`¿Estás seguro de eliminar este ${entityName}?`)) {
          console.log('Eliminar', record);
        }
      }),
      variant: 'eliminar' as const,
      icon: '🗑️'
    }
  ], [entityName, onEdit, onDelete, onView]);

  const actions = useMemo(() => {
    if (customActions.length > 0) {
      return customActions;
    }
    return showDefaultActions ? defaultActions : [];
  }, [customActions, defaultActions, showDefaultActions]);

  const getButtonClassName = (variant?: string) => {
    const variantMap = {
      'ver': 'btn-action-ver',
      'editar': 'btn-action-editar', 
      'eliminar': 'btn-action-eliminar',
      'primary': 'btn-action-ver',
      'default': 'btn-action-ver',
      'secondary': 'btn-action-editar',
      'danger': 'btn-action-eliminar',
      'destructive': 'btn-action-eliminar'
    };
    
    return variantMap[variant as keyof typeof variantMap] || 'btn-action-ver';
  };

  return {
    actions,
    getButtonClassName
  };
}
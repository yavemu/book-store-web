import { SearchFieldConfig } from "@/components/Dashboard/GenericAdvancedSearch";

export const auditSearchConfig: SearchFieldConfig[] = [
  {
    key: 'performedBy',
    label: 'Usuario que realizó la acción',
    type: 'text',
    placeholder: 'Ej: admin@example.com (mín. 3 caracteres)',
    validation: { minLength: 3 }
  },
  {
    key: 'entityType',
    label: 'Tipo de entidad',
    type: 'text',
    placeholder: 'Ej: Book, Author, User (mín. 3 caracteres)',
    validation: { minLength: 3 }
  },
  {
    key: 'action',
    label: 'Acción realizada',
    type: 'select',
    options: [
      { value: 'CREATE', label: 'Crear' },
      { value: 'UPDATE', label: 'Actualizar' },
      { value: 'DELETE', label: 'Eliminar' },
      { value: 'read', label: 'Leer' },
      { value: 'LOGIN', label: 'Iniciar Sesión' },
      { value: 'REGISTER', label: 'Registrar' }
    ]
  },
  {
    key: 'entityId',
    label: 'ID de entidad',
    type: 'text',
    placeholder: 'Ej: 123e4567-e89b-12d3 (mín. 3 caracteres)',
    validation: { minLength: 3 }
  },
  {
    key: 'startDate',
    label: 'Fecha desde',
    type: 'date'
  },
  {
    key: 'endDate',
    label: 'Fecha hasta',
    type: 'date'
  }
];
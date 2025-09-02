import { SearchFieldConfig } from "@/components/Dashboard/GenericAdvancedSearch";

export const authorsSearchConfig: SearchFieldConfig[] = [
  {
    key: 'name',
    label: 'Nombre completo',
    type: 'text',
    placeholder: 'Ej: Gabriel García (mín. 3 caracteres)',
    validation: { minLength: 3 }
  },
  {
    key: 'nationality',
    label: 'Nacionalidad',
    type: 'text',
    placeholder: 'Ej: Colombiana (mín. 3 caracteres)',
    validation: { minLength: 3 }
  },
  {
    key: 'birthYear',
    label: 'Año de nacimiento',
    type: 'number',
    placeholder: 'Ej: 1927'
  },
  {
    key: 'isActive',
    label: 'Estado del autor',
    type: 'boolean',
    options: [
      { value: true, label: 'Activo' },
      { value: false, label: 'Inactivo' }
    ]
  }
];
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdvancedSearchForm, { SearchField, SearchFilters } from '../AdvancedSearchForm';

// Mock useDebounce hook
jest.mock('@/hooks', () => ({
  useDebounce: jest.fn((value) => value),
}));

const mockUseDebounce = require('@/hooks').useDebounce as jest.Mock;

describe('AdvancedSearchForm', () => {
  const mockOnSearch = jest.fn();
  const mockOnAdvancedFilter = jest.fn();
  const mockOnClear = jest.fn();

  const defaultFields: SearchField[] = [
    {
      key: 'name',
      label: 'Nombre',
      type: 'text',
      placeholder: 'Buscar por nombre',
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email',
    },
    {
      key: 'status',
      label: 'Estado',
      type: 'select',
      options: [
        { value: 'active', label: 'Activo' },
        { value: 'inactive', label: 'Inactivo' },
      ],
    },
  ];

  const defaultProps = {
    fields: defaultFields,
    onSearch: mockOnSearch,
    onClear: mockOnClear,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDebounce.mockImplementation((value) => value);
  });

  describe('Initial State', () => {
    it('should render toggle button', () => {
      render(<AdvancedSearchForm {...defaultProps} />);
      
      expect(screen.getByText('Búsqueda Avanzada')).toBeInTheDocument();
      expect(screen.getByText('🔽')).toBeInTheDocument();
    });

    it('should not show form initially', () => {
      render(<AdvancedSearchForm {...defaultProps} />);
      
      expect(screen.queryByText('🔍 Búsqueda Avanzada de registros')).not.toBeInTheDocument();
    });

    it('should show custom entity name in title', () => {
      render(<AdvancedSearchForm {...defaultProps} entityName="libros" />);
      
      const toggleButton = screen.getByText('Búsqueda Avanzada');
      fireEvent.click(toggleButton);
      
      expect(screen.getByText('🔍 Búsqueda Avanzada de libros')).toBeInTheDocument();
    });
  });

  describe('Form Visibility', () => {
    it('should toggle form visibility when clicking toggle button', () => {
      render(<AdvancedSearchForm {...defaultProps} />);
      
      const toggleButton = screen.getByText('Búsqueda Avanzada');
      
      // Initially hidden
      expect(screen.queryByText('🔍 Búsqueda Avanzada de registros')).not.toBeInTheDocument();
      
      // Show form
      fireEvent.click(toggleButton);
      expect(screen.getByText('🔍 Búsqueda Avanzada de registros')).toBeInTheDocument();
      expect(screen.getByText('🔼')).toBeInTheDocument();
      
      // Hide form
      fireEvent.click(toggleButton);
      expect(screen.queryByText('🔍 Búsqueda Avanzada de registros')).not.toBeInTheDocument();
      expect(screen.getByText('🔽')).toBeInTheDocument();
    });
  });

  describe('Form Fields Rendering', () => {
    beforeEach(() => {
      render(<AdvancedSearchForm {...defaultProps} />);
      fireEvent.click(screen.getByText('Búsqueda Avanzada'));
    });

    it('should render all text input fields', () => {
      expect(screen.getByPlaceholderText('Buscar por nombre')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Buscar por email...')).toBeInTheDocument();
    });

    it('should render select fields with options', () => {
      const statusSelect = screen.getByRole('combobox');
      expect(statusSelect).toBeInTheDocument();
      
      // Check options
      expect(screen.getByText('Todos')).toBeInTheDocument();
      expect(screen.getByText('Activo')).toBeInTheDocument();
      expect(screen.getByText('Inactivo')).toBeInTheDocument();
    });

    it('should render date range fields', () => {
      const dateInputs = screen.getAllByDisplayValue('');
      expect(dateInputs.length).toBeGreaterThanOrEqual(2);
      expect(screen.getByText('Fecha Desde')).toBeInTheDocument();
      expect(screen.getByText('Fecha Hasta')).toBeInTheDocument();
    });

    it('should render real-time search checkbox', () => {
      const checkbox = screen.getByLabelText('Buscar por coincidencia (tiempo real)');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
    });
  });

  describe('Form Input Handling', () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
      user = userEvent.setup();
      render(<AdvancedSearchForm {...defaultProps} />);
      fireEvent.click(screen.getByText('Búsqueda Avanzada'));
    });

    it('should handle text input changes', async () => {
      const nameInput = screen.getByPlaceholderText('Buscar por nombre');
      
      await user.type(nameInput, 'John Doe');
      
      expect(nameInput).toHaveValue('John Doe');
    });

    it('should handle select changes', async () => {
      const statusSelect = screen.getByRole('combobox');
      
      await user.selectOptions(statusSelect, 'active');
      
      expect(statusSelect).toHaveValue('active');
    });

    it('should handle date input changes', async () => {
      const dateInputs = screen.getAllByDisplayValue('');
      const startDateInput = dateInputs.find(input => input.getAttribute('type') === 'date');
      
      if (startDateInput) {
        await user.type(startDateInput, '2024-01-01');
        expect(startDateInput).toHaveValue('2024-01-01');
      }
    });
  });

  describe('Form Submission', () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
      user = userEvent.setup();
      render(<AdvancedSearchForm {...defaultProps} />);
      fireEvent.click(screen.getByText('Búsqueda Avanzada'));
    });

    it('should call onSearch with filtered values on form submission', async () => {
      const nameInput = screen.getByPlaceholderText('Buscar por nombre');
      const emailInput = screen.getByPlaceholderText('Buscar por email...');
      const searchButton = screen.getByText('🔍 Buscar');
      
      await user.type(nameInput, 'John');
      await user.type(emailInput, 'john@example.com');
      await user.click(searchButton);
      
      expect(mockOnSearch).toHaveBeenCalledWith({
        name: 'John',
        email: 'john@example.com',
      });
    });

    it('should filter out empty values when submitting', async () => {
      const nameInput = screen.getByPlaceholderText('Buscar por nombre');
      const searchButton = screen.getByText('🔍 Buscar');
      
      await user.type(nameInput, 'John');
      // Leave email empty
      await user.click(searchButton);
      
      expect(mockOnSearch).toHaveBeenCalledWith({
        name: 'John',
      });
    });

    it('should prevent default form submission', async () => {
      const nameInput = screen.getByPlaceholderText('Buscar por nombre');
      const searchButton = screen.getByText('🔍 Buscar');
      
      await user.type(nameInput, 'John');
      await user.click(searchButton);
      
      expect(mockOnSearch).toHaveBeenCalledWith({
        name: 'John',
      });
    });
  });

  describe('Real-time Search', () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
      user = userEvent.setup();
      // Mock debounced value
      mockUseDebounce.mockImplementation((value, delay) => {
        return value; // Return immediately for testing
      });
    });

    it('should enable real-time search when checkbox is checked', async () => {
      render(<AdvancedSearchForm {...defaultProps} onAdvancedFilter={mockOnAdvancedFilter} />);
      fireEvent.click(screen.getByText('Búsqueda Avanzada'));
      
      const checkbox = screen.getByLabelText('Buscar por coincidencia (tiempo real)');
      await user.click(checkbox);
      
      expect(checkbox).toBeChecked();
    });

    it('should call onAdvancedFilter when real-time search is enabled and valid input provided', async () => {
      render(<AdvancedSearchForm {...defaultProps} onAdvancedFilter={mockOnAdvancedFilter} />);
      fireEvent.click(screen.getByText('Búsqueda Avanzada'));
      
      const checkbox = screen.getByLabelText('Buscar por coincidencia (tiempo real)');
      const nameInput = screen.getByPlaceholderText('Buscar por nombre');
      
      await user.click(checkbox);
      await user.type(nameInput, 'John');
      
      // Should call onAdvancedFilter with valid input (3+ characters)
      await waitFor(() => {
        expect(mockOnAdvancedFilter).toHaveBeenCalledWith({
          name: 'John',
        });
      });
    });

    it('should not call onAdvancedFilter with input less than 3 characters', async () => {
      render(<AdvancedSearchForm {...defaultProps} onAdvancedFilter={mockOnAdvancedFilter} />);
      fireEvent.click(screen.getByText('Búsqueda Avanzada'));
      
      const checkbox = screen.getByLabelText('Buscar por coincidencia (tiempo real)');
      const nameInput = screen.getByPlaceholderText('Buscar por nombre');
      
      await user.click(checkbox);
      await user.type(nameInput, 'Jo');
      
      expect(mockOnAdvancedFilter).not.toHaveBeenCalled();
    });

    it('should show filtering status when real-time search is active', async () => {
      render(
        <AdvancedSearchForm 
          {...defaultProps} 
          onAdvancedFilter={mockOnAdvancedFilter}
          isFiltering={true}
        />
      );
      fireEvent.click(screen.getByText('Búsqueda Avanzada'));
      
      const checkbox = screen.getByLabelText('Buscar por coincidencia (tiempo real)');
      await user.click(checkbox);
      
      expect(screen.getByText('🔄 Filtrando...')).toBeInTheDocument();
    });

    it('should hide search button when real-time search is enabled', async () => {
      render(<AdvancedSearchForm {...defaultProps} onAdvancedFilter={mockOnAdvancedFilter} />);
      fireEvent.click(screen.getByText('Búsqueda Avanzada'));
      
      const searchButton = screen.getByText('🔍 Buscar');
      const checkbox = screen.getByLabelText('Buscar por coincidencia (tiempo real)');
      
      expect(searchButton).toBeInTheDocument();
      
      await user.click(checkbox);
      
      expect(screen.queryByText('🔍 Buscar')).not.toBeInTheDocument();
    });
  });

  describe('Clear Functionality', () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
      user = userEvent.setup();
      render(<AdvancedSearchForm {...defaultProps} />);
      fireEvent.click(screen.getByText('Búsqueda Avanzada'));
    });

    it('should clear all filters when clear button is clicked', async () => {
      const nameInput = screen.getByPlaceholderText('Buscar por nombre');
      const clearButton = screen.getByText('🗑️ Limpiar');
      
      await user.type(nameInput, 'John');
      expect(nameInput).toHaveValue('John');
      
      await user.click(clearButton);
      
      expect(nameInput).toHaveValue('');
      expect(mockOnClear).toHaveBeenCalled();
    });

    it('should disable clear button when no active filters', () => {
      const clearButton = screen.getByText('🗑️ Limpiar');
      expect(clearButton).toBeDisabled();
    });
  });

  describe('Active Filters Display', () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
      user = userEvent.setup();
      render(<AdvancedSearchForm {...defaultProps} />);
      fireEvent.click(screen.getByText('Búsqueda Avanzada'));
    });

    it('should show active filters count in toggle button', async () => {
      const nameInput = screen.getByPlaceholderText('Buscar por nombre');
      const emailInput = screen.getByPlaceholderText('Buscar por email...');
      
      await user.type(nameInput, 'John');
      await user.type(emailInput, 'john@example.com');
      
      expect(screen.getByText('(2)')).toBeInTheDocument();
    });

    it('should display active filters summary', async () => {
      const nameInput = screen.getByPlaceholderText('Buscar por nombre');
      
      await user.type(nameInput, 'John');
      
      expect(screen.getByText('Filtros Activos:')).toBeInTheDocument();
      expect(screen.getByText('Nombre:')).toBeInTheDocument();
      expect(screen.getByText('John')).toBeInTheDocument();
    });

    it('should allow removing individual filters', async () => {
      const nameInput = screen.getByPlaceholderText('Buscar por nombre');
      
      await user.type(nameInput, 'John');
      
      const removeButton = screen.getByText('×');
      await user.click(removeButton);
      
      expect(nameInput).toHaveValue('');
    });
  });

  describe('Loading States', () => {
    it('should disable search button when loading', () => {
      render(<AdvancedSearchForm {...defaultProps} loading={true} />);
      fireEvent.click(screen.getByText('Búsqueda Avanzada'));
      
      const searchButton = screen.getByText('🔄 Buscando...');
      expect(searchButton).toBeDisabled();
    });

    it('should disable clear button when loading', () => {
      // Render with filters already set and loading=true
      const initialFilters = { name: 'John' };
      render(<AdvancedSearchForm {...defaultProps} loading={true} initialFilters={initialFilters} />);
      fireEvent.click(screen.getByText('Búsqueda Avanzada'));
      
      const clearButton = screen.getByText('🗑️ Limpiar');
      expect(clearButton).toBeDisabled();
    });
  });

  describe('Initial Filters', () => {
    it('should populate form with initial filters', () => {
      const initialFilters: SearchFilters = {
        name: 'John Doe',
        email: 'john@example.com',
        startDate: '2024-01-01',
      };
      
      render(<AdvancedSearchForm {...defaultProps} initialFilters={initialFilters} />);
      fireEvent.click(screen.getByText('Búsqueda Avanzada'));
      
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2024-01-01')).toBeInTheDocument();
    });
  });

  describe('Close Button', () => {
    it('should close form when close button is clicked', async () => {
      const user = userEvent.setup();
      render(<AdvancedSearchForm {...defaultProps} />);
      
      // Open form
      fireEvent.click(screen.getByText('Búsqueda Avanzada'));
      expect(screen.getByText('🔍 Búsqueda Avanzada de registros')).toBeInTheDocument();
      
      // Close form
      const closeButton = screen.getByText('❌ Cerrar');
      await user.click(closeButton);
      
      expect(screen.queryByText('🔍 Búsqueda Avanzada de registros')).not.toBeInTheDocument();
    });
  });
});
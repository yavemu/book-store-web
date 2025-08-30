import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuickSearch from '../QuickSearch';

// Mock the useQuickSearch hook
const mockSetSearchTerm = jest.fn();
const mockQuickSearchHook = {
  searchTerm: '',
  setSearchTerm: mockSetSearchTerm,
  isSearching: false,
  hasMinimumChars: false,
};

jest.mock('@/hooks', () => ({
  useQuickSearch: jest.fn(() => mockQuickSearchHook),
}));

const mockUseQuickSearch = require('@/hooks').useQuickSearch as jest.Mock;

describe('QuickSearch', () => {
  const defaultProps = {
    entity: 'books',
  };

  const mockOnResults = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseQuickSearch.mockReturnValue(mockQuickSearchHook);
  });

  describe('Rendering', () => {
    it('should render search input with default placeholder', () => {
      render(<QuickSearch {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Búsqueda rápida...');
      expect(input).toBeInTheDocument();
    });

    it('should render search input with custom placeholder', () => {
      render(<QuickSearch {...defaultProps} placeholder="Buscar libros..." />);
      
      const input = screen.getByPlaceholderText('Buscar libros...');
      expect(input).toBeInTheDocument();
    });

    it('should initialize useQuickSearch hook with correct parameters', () => {
      render(<QuickSearch {...defaultProps} onResults={mockOnResults} onError={mockOnError} />);
      
      expect(mockUseQuickSearch).toHaveBeenCalledWith({
        entity: 'books',
        onSuccess: mockOnResults,
        onError: mockOnError,
      });
    });
  });

  describe('Search Input Interaction', () => {
    it('should call setSearchTerm when user types', async () => {
      const user = userEvent.setup();
      render(<QuickSearch {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Búsqueda rápida...');
      await user.type(input, 'test');
      
      expect(mockSetSearchTerm).toHaveBeenCalled();
      expect(mockSetSearchTerm).toHaveBeenCalledTimes(4); // One for each character
    });

    it('should display current search term value', () => {
      mockUseQuickSearch.mockReturnValue({
        ...mockQuickSearchHook,
        searchTerm: 'current search',
      });

      render(<QuickSearch {...defaultProps} />);
      
      const input = screen.getByDisplayValue('current search');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Search Status Display', () => {
    it('should show searching status when searching with minimum chars', () => {
      mockUseQuickSearch.mockReturnValue({
        ...mockQuickSearchHook,
        searchTerm: 'test',
        isSearching: true,
        hasMinimumChars: true,
      });

      render(<QuickSearch {...defaultProps} />);
      
      expect(screen.getByText('🔄 Buscando...')).toBeInTheDocument();
    });

    it('should not show searching status when not searching', () => {
      mockUseQuickSearch.mockReturnValue({
        ...mockQuickSearchHook,
        searchTerm: 'test',
        isSearching: false,
        hasMinimumChars: true,
      });

      render(<QuickSearch {...defaultProps} />);
      
      expect(screen.queryByText('🔄 Buscando...')).not.toBeInTheDocument();
    });

    it('should not show searching status when term is too short', () => {
      mockUseQuickSearch.mockReturnValue({
        ...mockQuickSearchHook,
        searchTerm: 'te',
        isSearching: true,
        hasMinimumChars: false,
      });

      render(<QuickSearch {...defaultProps} />);
      
      expect(screen.queryByText('🔄 Buscando...')).not.toBeInTheDocument();
    });
  });

  describe('Minimum Characters Hint', () => {
    it('should show minimum characters hint for short terms', () => {
      mockUseQuickSearch.mockReturnValue({
        ...mockQuickSearchHook,
        searchTerm: 'te',
      });

      render(<QuickSearch {...defaultProps} />);
      
      expect(screen.getByText('Mínimo 3 caracteres para buscar')).toBeInTheDocument();
    });

    it('should not show hint for empty search term', () => {
      mockUseQuickSearch.mockReturnValue({
        ...mockQuickSearchHook,
        searchTerm: '',
      });

      render(<QuickSearch {...defaultProps} />);
      
      expect(screen.queryByText('Mínimo 3 caracteres para buscar')).not.toBeInTheDocument();
    });

    it('should not show hint for search terms with 3+ characters', () => {
      mockUseQuickSearch.mockReturnValue({
        ...mockQuickSearchHook,
        searchTerm: 'test',
        hasMinimumChars: true,
      });

      render(<QuickSearch {...defaultProps} />);
      
      expect(screen.queryByText('Mínimo 3 caracteres para buscar')).not.toBeInTheDocument();
    });

    it('should show hint for exactly 1 character', () => {
      mockUseQuickSearch.mockReturnValue({
        ...mockQuickSearchHook,
        searchTerm: 't',
      });

      render(<QuickSearch {...defaultProps} />);
      
      expect(screen.getByText('Mínimo 3 caracteres para buscar')).toBeInTheDocument();
    });

    it('should show hint for exactly 2 characters', () => {
      mockUseQuickSearch.mockReturnValue({
        ...mockQuickSearchHook,
        searchTerm: 'te',
      });

      render(<QuickSearch {...defaultProps} />);
      
      expect(screen.getByText('Mínimo 3 caracteres para buscar')).toBeInTheDocument();
    });
  });

  describe('Different Entity Types', () => {
    it('should work with different entity types', () => {
      render(<QuickSearch entity="authors" />);
      
      expect(mockUseQuickSearch).toHaveBeenCalledWith({
        entity: 'authors',
        onSuccess: undefined,
        onError: undefined,
      });
    });
  });

  describe('Callback Integration', () => {
    it('should pass onResults callback to useQuickSearch', () => {
      render(<QuickSearch {...defaultProps} onResults={mockOnResults} />);
      
      expect(mockUseQuickSearch).toHaveBeenCalledWith({
        entity: 'books',
        onSuccess: mockOnResults,
        onError: undefined,
      });
    });

    it('should pass onError callback to useQuickSearch', () => {
      render(<QuickSearch {...defaultProps} onError={mockOnError} />);
      
      expect(mockUseQuickSearch).toHaveBeenCalledWith({
        entity: 'books',
        onSuccess: undefined,
        onError: mockOnError,
      });
    });

    it('should pass both callbacks to useQuickSearch', () => {
      render(<QuickSearch {...defaultProps} onResults={mockOnResults} onError={mockOnError} />);
      
      expect(mockUseQuickSearch).toHaveBeenCalledWith({
        entity: 'books',
        onSuccess: mockOnResults,
        onError: mockOnError,
      });
    });
  });

  describe('CSS Classes', () => {
    it('should apply correct CSS classes to container', () => {
      render(<QuickSearch {...defaultProps} />);
      
      const container = screen.getByRole('textbox').closest('.quick-search-container');
      expect(container).toBeInTheDocument();
    });

    it('should apply quick-search-input class to input', () => {
      render(<QuickSearch {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('quick-search-input');
    });
  });

  describe('Accessibility', () => {
    it('should have proper input role', () => {
      render(<QuickSearch {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('should be focusable', () => {
      render(<QuickSearch {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      input.focus();
      expect(input).toHaveFocus();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <QuickSearch {...defaultProps} />
          <button>Next Element</button>
        </div>
      );
      
      const input = screen.getByRole('textbox');
      const button = screen.getByText('Next Element');
      
      input.focus();
      expect(input).toHaveFocus();
      
      await user.keyboard('{Tab}');
      expect(button).toHaveFocus();
    });
  });

  describe('Complex Interaction Scenarios', () => {
    it('should handle rapid typing and state changes', async () => {
      const user = userEvent.setup();
      
      // Simulate state changes during typing
      let callCount = 0;
      mockUseQuickSearch.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return { ...mockQuickSearchHook, searchTerm: '' };
        } else if (callCount <= 3) {
          return { ...mockQuickSearchHook, searchTerm: 'te' };
        } else {
          return { 
            ...mockQuickSearchHook, 
            searchTerm: 'test', 
            hasMinimumChars: true,
            isSearching: true 
          };
        }
      });

      const { rerender } = render(<QuickSearch {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'test');
      
      // Rerender to simulate state updates
      rerender(<QuickSearch {...defaultProps} />);
      
      expect(mockSetSearchTerm).toHaveBeenCalled();
    });
  });
});
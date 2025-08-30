import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookMovementsModal from '../BookMovementsModal';

// Mock useInventoryMovements hook
const mockFetchMovementsByBookId = jest.fn();
const mockUseInventoryMovements = {
  loading: false,
  error: null,
  movements: null,
  fetchMovementsByBookId: mockFetchMovementsByBookId,
  fetchMovementsByUserId: jest.fn(),
  searchMovements: jest.fn(),
};

jest.mock('@/hooks/useInventoryMovements', () => ({
  useInventoryMovements: jest.fn(() => mockUseInventoryMovements),
}));

const mockUseInventoryMovementsImport = require('@/hooks/useInventoryMovements').useInventoryMovements as jest.Mock;

describe('BookMovementsModal', () => {
  const mockBook = {
    id: 'book-123',
    title: 'Test Book Title',
    isbn: '978-1234567890',
    stock: 10,
    price: 25.99,
  };

  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    book: mockBook,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseInventoryMovementsImport.mockReturnValue(mockUseInventoryMovements);
  });

  describe('Rendering', () => {
    it('should render modal when open', () => {
      render(<BookMovementsModal {...defaultProps} />);
      
      expect(screen.getByText('Movimientos de Inventario')).toBeInTheDocument();
      expect(screen.getByText('Test Book Title')).toBeInTheDocument();
    });

    it('should not render when closed', () => {
      render(<BookMovementsModal {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByText('Movimientos de Inventario')).not.toBeInTheDocument();
    });

    it('should not render when book is null', () => {
      render(<BookMovementsModal {...defaultProps} book={null} />);
      
      expect(screen.queryByText('Movimientos de Inventario')).not.toBeInTheDocument();
    });

    it('should display book information', () => {
      render(<BookMovementsModal {...defaultProps} />);
      
      expect(screen.getByText('Test Book Title')).toBeInTheDocument();
      expect(screen.getByText('978-1234567890')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('ISBN:')).toBeInTheDocument();
      expect(screen.getByText('Stock actual:')).toBeInTheDocument();
    });

    it('should show loading state', () => {
      mockUseInventoryMovementsImport.mockReturnValue({
        ...mockUseInventoryMovements,
        loading: true,
      });

      render(<BookMovementsModal {...defaultProps} />);
      
      expect(screen.getByText('Cargando movimientos...')).toBeInTheDocument();
    });

    it('should show error state', () => {
      mockUseInventoryMovementsImport.mockReturnValue({
        ...mockUseInventoryMovements,
        error: 'Error loading movements',
      });

      render(<BookMovementsModal {...defaultProps} />);
      
      expect(screen.getByText('Error loading movements')).toBeInTheDocument();
    });
  });

  describe('Data Fetching', () => {
    it('should fetch movements when modal opens', () => {
      render(<BookMovementsModal {...defaultProps} />);
      
      expect(mockFetchMovementsByBookId).toHaveBeenCalledWith('book-123');
    });

    it('should not fetch movements when modal is closed', () => {
      render(<BookMovementsModal {...defaultProps} isOpen={false} />);
      
      expect(mockFetchMovementsByBookId).not.toHaveBeenCalled();
    });

    it('should refetch movements when book changes', () => {
      const { rerender } = render(<BookMovementsModal {...defaultProps} />);
      
      expect(mockFetchMovementsByBookId).toHaveBeenCalledWith('book-123');
      
      const newBook = { ...mockBook, id: 'book-456', title: 'Another Book' };
      rerender(<BookMovementsModal {...defaultProps} book={newBook} />);
      
      expect(mockFetchMovementsByBookId).toHaveBeenCalledWith('book-456');
    });
  });

  describe('Movements Display', () => {
    const mockMovements = {
      data: [
        {
          id: 'mov-1',
          type: 'IN',
          quantity: 5,
          status: 'COMPLETED',
          createdAt: '2024-01-15T10:00:00Z',
          reason: 'Stock replenishment'
        },
        {
          id: 'mov-2',
          type: 'OUT',
          quantity: 2,
          status: 'COMPLETED',
          createdAt: '2024-01-16T14:30:00Z',
          reason: 'Sale'
        }
      ],
      meta: {
        totalItems: 2,
        currentPage: 1,
        totalPages: 1
      }
    };

    it('should display movements when available', () => {
      mockUseInventoryMovementsImport.mockReturnValue({
        ...mockUseInventoryMovements,
        movements: mockMovements,
      });

      render(<BookMovementsModal {...defaultProps} />);
      
      expect(screen.getByText('mov-1')).toBeInTheDocument();
      expect(screen.getByText('mov-2')).toBeInTheDocument();
      expect(screen.getByText('Entrada')).toBeInTheDocument();
      expect(screen.getByText('Salida')).toBeInTheDocument();
    });

    it('should show empty state when no movements', () => {
      mockUseInventoryMovementsImport.mockReturnValue({
        ...mockUseInventoryMovements,
        movements: { data: [], meta: { totalItems: 0 } },
      });

      render(<BookMovementsModal {...defaultProps} />);
      
      expect(screen.getByText('No se encontraron movimientos para este libro')).toBeInTheDocument();
    });

    it('should format movement types correctly', () => {
      mockUseInventoryMovementsImport.mockReturnValue({
        ...mockUseInventoryMovements,
        movements: {
          data: [
            { id: 'mov-1', type: 'IN', quantity: 5, status: 'COMPLETED', createdAt: '2024-01-15T10:00:00Z' },
            { id: 'mov-2', type: 'OUT', quantity: 2, status: 'COMPLETED', createdAt: '2024-01-16T14:30:00Z' },
            { id: 'mov-3', type: 'TRANSFER', quantity: 3, status: 'COMPLETED', createdAt: '2024-01-17T16:00:00Z' }
          ]
        },
      });

      render(<BookMovementsModal {...defaultProps} />);
      
      expect(screen.getByText('Entrada')).toBeInTheDocument();
      expect(screen.getByText('Salida')).toBeInTheDocument();
      expect(screen.getByText('Transferencia')).toBeInTheDocument();
    });

    it('should format dates correctly', () => {
      mockUseInventoryMovementsImport.mockReturnValue({
        ...mockUseInventoryMovements,
        movements: {
          data: [
            { id: 'mov-1', type: 'IN', quantity: 5, status: 'COMPLETED', createdAt: '2024-01-15T10:00:00Z' }
          ]
        },
      });

      render(<BookMovementsModal {...defaultProps} />);
      
      // Check that date is formatted (exact format may vary by locale)
      expect(screen.getByText(/15\/1\/2024|15-1-2024|Jan|enero/i)).toBeInTheDocument();
    });
  });

  describe('Modal Interactions', () => {
    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnClose = jest.fn();
      
      render(<BookMovementsModal {...defaultProps} onClose={mockOnClose} />);
      
      const closeButton = screen.getByRole('button', { name: /cerrar|close/i });
      await user.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when escape key is pressed', async () => {
      const user = userEvent.setup();
      const mockOnClose = jest.fn();
      
      render(<BookMovementsModal {...defaultProps} onClose={mockOnClose} />);
      
      await user.keyboard('{Escape}');
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when overlay is clicked', async () => {
      const user = userEvent.setup();
      const mockOnClose = jest.fn();
      
      render(<BookMovementsModal {...defaultProps} onClose={mockOnClose} />);
      
      const backdrop = screen.getByTestId('modal-backdrop');
      await user.click(backdrop);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling', () => {
    it('should display retry button on error', async () => {
      const user = userEvent.setup();
      mockUseInventoryMovementsImport.mockReturnValue({
        ...mockUseInventoryMovements,
        error: 'Network error',
      });

      render(<BookMovementsModal {...defaultProps} />);
      
      const retryButton = screen.getByRole('button', { name: /reintentar|retry/i });
      expect(retryButton).toBeInTheDocument();
      
      await user.click(retryButton);
      expect(mockFetchMovementsByBookId).toHaveBeenCalledTimes(2); // Initial + retry
    });

    it('should handle fetch errors gracefully', () => {
      mockUseInventoryMovementsImport.mockReturnValue({
        ...mockUseInventoryMovements,
        error: 'Failed to fetch movements',
      });

      render(<BookMovementsModal {...defaultProps} />);
      
      expect(screen.getByText('Failed to fetch movements')).toBeInTheDocument();
      expect(screen.queryByText('Cargando movimientos...')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<BookMovementsModal {...defaultProps} />);
      
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-labelledby');
      expect(modal).toBeInTheDocument();
    });

    it('should focus on modal when opened', async () => {
      render(<BookMovementsModal {...defaultProps} />);
      
      const modal = screen.getByRole('dialog');
      await waitFor(() => {
        expect(modal).toHaveFocus();
      });
    });

    it('should trap focus within modal', async () => {
      const user = userEvent.setup();
      
      render(<BookMovementsModal {...defaultProps} />);
      
      // Tab through focusable elements
      await user.keyboard('{Tab}');
      
      const focusedElement = document.activeElement;
      const modal = screen.getByRole('dialog');
      
      expect(modal.contains(focusedElement)).toBe(true);
    });
  });
});
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ViewMovementsButton from '../ViewMovementsButton';

describe('ViewMovementsButton', () => {
  const mockOnClick = jest.fn();
  
  const defaultProps = {
    onClick: mockOnClick,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render button with default text', () => {
      render(<ViewMovementsButton {...defaultProps} />);
      
      expect(screen.getByText('Ver Movimientos')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render with custom text', () => {
      render(<ViewMovementsButton {...defaultProps} text="Movimientos de Movimientos" />);
      
      expect(screen.getByText("Movimientos de Movimientos")).toBeInTheDocument();
    });

    it('should apply correct CSS classes', () => {
      render(<ViewMovementsButton {...defaultProps} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn-action-ver');
    });

    it('should be disabled when loading', () => {
      render(<ViewMovementsButton {...defaultProps} loading={true} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should show loading state', () => {
      render(<ViewMovementsButton {...defaultProps} loading={true} />);
      
      expect(screen.getByText('Cargando...')).toBeInTheDocument();
    });

    it('should be disabled when disabled prop is true', () => {
      render(<ViewMovementsButton {...defaultProps} disabled={true} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Interaction', () => {
    it('should call onClick when clicked', async () => {
      const user = userEvent.setup();
      render(<ViewMovementsButton {...defaultProps} />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const user = userEvent.setup();
      render(<ViewMovementsButton {...defaultProps} disabled={true} />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when loading', async () => {
      const user = userEvent.setup();
      render(<ViewMovementsButton {...defaultProps} loading={true} />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('should handle keyboard interaction', async () => {
      const user = userEvent.setup();
      render(<ViewMovementsButton {...defaultProps} />);
      
      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper role', () => {
      render(<ViewMovementsButton {...defaultProps} />);
      
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should be focusable when not disabled', () => {
      render(<ViewMovementsButton {...defaultProps} />);
      
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });

    it('should have appropriate aria-label when loading', () => {
      render(<ViewMovementsButton {...defaultProps} loading={true} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Cargando movimientos');
    });

    it('should support custom aria-label', () => {
      render(<ViewMovementsButton {...defaultProps} ariaLabel="Ver movimientos del libro" />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Ver movimientos del libro');
    });
  });

  describe('Props Validation', () => {
    it('should work with all props provided', () => {
      render(
        <ViewMovementsButton 
          {...defaultProps}
          text="Custom Text"
          loading={false}
          disabled={false}
          ariaLabel="Custom Aria Label"
          className="custom-class"
        />
      );
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(screen.getByText('Custom Text')).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'Custom Aria Label');
      expect(button).toHaveClass('custom-class');
    });

    it('should work with minimal props', () => {
      render(<ViewMovementsButton onClick={mockOnClick} />);
      
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('Ver Movimientos')).toBeInTheDocument();
    });
  });
});
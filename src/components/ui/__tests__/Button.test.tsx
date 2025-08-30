import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

describe('Button', () => {
  const defaultProps = {
    children: 'Test Button',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders button with children', () => {
      render(<Button {...defaultProps} />);
      
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('Test Button')).toBeInTheDocument();
    });

    it('applies default type as button', () => {
      render(<Button {...defaultProps} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('applies correct type when specified', () => {
      render(<Button {...defaultProps} type="submit" />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('applies primary variant class by default', () => {
      render(<Button {...defaultProps} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn-create');
    });

    it('applies correct variant classes', () => {
      const { rerender } = render(<Button {...defaultProps} variant="secondary" />);
      expect(screen.getByRole('button')).toHaveClass('button', 'secondary');

      rerender(<Button {...defaultProps} variant="link" />);
      expect(screen.getByRole('button')).toHaveClass('button');
    });

    it('applies small size class when specified', () => {
      render(<Button {...defaultProps} size="sm" variant="primary" />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn-action-ver');
    });

    it('applies custom className', () => {
      render(<Button {...defaultProps} className="custom-class" />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('is disabled when disabled prop is true', () => {
      render(<Button {...defaultProps} disabled />);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Interaction', () => {
    it('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<Button {...defaultProps} onClick={handleClick} />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<Button {...defaultProps} onClick={handleClick} disabled />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('handles keyboard interaction', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<Button {...defaultProps} onClick={handleClick} />);
      
      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('has proper role', () => {
      render(<Button {...defaultProps} />);
      
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('is focusable when not disabled', () => {
      render(<Button {...defaultProps} />);
      
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });

    it('is not focusable when disabled', () => {
      render(<Button {...defaultProps} disabled />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('disabled');
      expect(button).not.toHaveFocus();
    });
  });

  describe('Complex content', () => {
    it('renders complex children', () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      );
      
      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
    });

    it('preserves children structure', () => {
      const ComplexContent = () => (
        <div data-testid="complex-content">
          <strong>Bold</strong> and <em>italic</em>
        </div>
      );
      
      render(<Button><ComplexContent /></Button>);
      
      expect(screen.getByTestId('complex-content')).toBeInTheDocument();
      expect(screen.getByText('Bold')).toBeInTheDocument();
      expect(screen.getByText('italic')).toBeInTheDocument();
    });
  });
});
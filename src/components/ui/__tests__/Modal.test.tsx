import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '../Modal';

// Mock document.body.style
Object.defineProperty(document.body.style, 'overflow', {
  writable: true,
  value: 'auto',
});

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: 'Test Modal',
    children: <div>Modal content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Reset body overflow after each test
    document.body.style.overflow = 'auto';
  });

  describe('Rendering', () => {
    it('renders modal when isOpen is true', () => {
      render(<Modal {...defaultProps} />);
      
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('does not render modal when isOpen is false', () => {
      render(<Modal {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
      expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
    });

    it('renders close button by default', () => {
      render(<Modal {...defaultProps} />);
      
      const closeButton = screen.getByRole('button');
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveTextContent('✕');
    });

    it('does not render close button when showCloseButton is false', () => {
      render(<Modal {...defaultProps} showCloseButton={false} />);
      
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('applies correct size class', () => {
      const { rerender } = render(<Modal {...defaultProps} size="sm" />);
      expect(screen.getByRole('dialog')).toHaveClass('max-w-md');

      rerender(<Modal {...defaultProps} size="lg" />);
      expect(screen.getByRole('dialog')).toHaveClass('max-w-2xl');

      rerender(<Modal {...defaultProps} size="xl" />);
      expect(screen.getByRole('dialog')).toHaveClass('max-w-4xl');
    });
  });

  describe('Interaction', () => {
    it('calls onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      render(<Modal {...defaultProps} />);
      
      const closeButton = screen.getByRole('button');
      await user.click(closeButton);
      
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when backdrop is clicked', async () => {
      const user = userEvent.setup();
      render(<Modal {...defaultProps} />);
      
      const backdrop = screen.getByTestId('modal-backdrop');
      await user.click(backdrop);
      
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when Escape key is pressed', () => {
      render(<Modal {...defaultProps} />);
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when modal content is clicked', async () => {
      const user = userEvent.setup();
      render(<Modal {...defaultProps} />);
      
      const modalContent = screen.getByText('Modal content');
      await user.click(modalContent);
      
      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });
  });

  describe('Body overflow handling', () => {
    it('sets body overflow to hidden when modal opens', () => {
      render(<Modal {...defaultProps} isOpen={true} />);
      
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('resets body overflow when modal closes', () => {
      const { rerender } = render(<Modal {...defaultProps} isOpen={true} />);
      expect(document.body.style.overflow).toBe('hidden');
      
      rerender(<Modal {...defaultProps} isOpen={false} />);
      expect(document.body.style.overflow).toBe('unset');
    });

    it('resets body overflow on unmount', () => {
      const { unmount } = render(<Modal {...defaultProps} isOpen={true} />);
      expect(document.body.style.overflow).toBe('hidden');
      
      unmount();
      expect(document.body.style.overflow).toBe('unset');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<Modal {...defaultProps} />);
      
      const modal = screen.getByRole('dialog');
      expect(modal).toBeInTheDocument();
      expect(modal).toHaveAttribute('aria-labelledby');
    });

    it('focuses the modal when opened', () => {
      render(<Modal {...defaultProps} />);
      
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveFocus();
    });
  });
});
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../Input';

describe('Input', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders input element', () => {
      render(<Input {...defaultProps} />);
      
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('applies default type as text', () => {
      render(<Input {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('applies correct type when specified', () => {
      render(<Input {...defaultProps} type="email" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('displays placeholder text', () => {
      render(<Input {...defaultProps} placeholder="Enter text here" />);
      
      const input = screen.getByPlaceholderText('Enter text here');
      expect(input).toBeInTheDocument();
    });

    it('displays current value', () => {
      render(<Input {...defaultProps} value="Test value" />);
      
      const input = screen.getByDisplayValue('Test value');
      expect(input).toBeInTheDocument();
    });

    it('is disabled when disabled prop is true', () => {
      render(<Input {...defaultProps} disabled />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('is required when required prop is true', () => {
      render(<Input {...defaultProps} required />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
    });

    it('applies default search-input class', () => {
      render(<Input {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('search-input');
    });

    it('applies custom className in addition to default', () => {
      render(<Input {...defaultProps} className="custom-class" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('search-input', 'custom-class');
    });
  });

  describe('Interaction', () => {
    it('calls onChange when user types', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      
      render(<Input {...defaultProps} onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'Hello');
      
      expect(handleChange).toHaveBeenCalledTimes(5); // One for each character
      expect(handleChange).toHaveBeenLastCalledWith('Hello');
    });

    it('calls onChange with correct value on each keystroke', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      
      render(<Input {...defaultProps} onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'Hi');
      
      expect(handleChange).toHaveBeenCalledWith('H');
      expect(handleChange).toHaveBeenCalledWith('Hi');
    });

    it('does not call onChange when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      
      render(<Input {...defaultProps} onChange={handleChange} disabled />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'test');
      
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('handles clearing input value', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      
      render(<Input {...defaultProps} value="initial" onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      await user.clear(input);
      
      expect(handleChange).toHaveBeenCalledWith('');
    });

    it('handles paste events', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      
      render(<Input {...defaultProps} onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.paste('pasted text');
      
      expect(handleChange).toHaveBeenCalledWith('pasted text');
    });
  });

  describe('Different input types', () => {
    it('renders password input correctly', () => {
      render(<Input {...defaultProps} type="password" />);
      
      const input = screen.getByLabelText(/password/i) || screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('renders email input correctly', () => {
      render(<Input {...defaultProps} type="email" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('renders number input correctly', () => {
      render(<Input {...defaultProps} type="number" />);
      
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('type', 'number');
    });
  });

  describe('Accessibility', () => {
    it('is focusable when not disabled', () => {
      render(<Input {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      input.focus();
      expect(input).toHaveFocus();
    });

    it('is not focusable when disabled', () => {
      render(<Input {...defaultProps} disabled />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      
      render(
        <div>
          <Input {...defaultProps} />
          <Input {...defaultProps} />
        </div>
      );
      
      const inputs = screen.getAllByRole('textbox');
      inputs[0].focus();
      
      await user.keyboard('{Tab}');
      expect(inputs[1]).toHaveFocus();
    });
  });
});
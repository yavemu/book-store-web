import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../utils/test-utils';
import { EntityForm } from '@/components/forms';
import { authorsFormConfig, booksFormConfig, usersFormConfig, publishersFormConfig, genresFormConfig } from '@/config/forms';
import * as authorsApi from '@/services/api/entities/authors';
import * as booksApi from '@/services/api';
import * as usersApi from '@/services/api/entities/users';
import * as publishersApi from '@/services/api/entities/publishing-houses';
import * as genresApi from '@/services/api/entities/genres';

// Mock APIs
jest.mock('@/services/api/entities/authors');
jest.mock('@/services/api');
jest.mock('@/services/api/entities/users');
jest.mock('@/services/api/entities/publishing-houses');
jest.mock('@/services/api/entities/genres');

describe('Direct Form Testing - Error and Success Scenarios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authors Form', () => {
    const mockOnSubmit = jest.fn();

    test('SUCCESS: Valid author creation', async () => {
      (authorsApi.authorsApi.create as jest.Mock).mockResolvedValue({ id: '1', firstName: 'Test', lastName: 'Author' });
      
      renderWithProviders(
        <EntityForm
          mode="create"
          config={authorsFormConfig}
          onCreateSubmit={mockOnSubmit}
          createLoading={false}
        />
      );

      fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Gabriel' } });
      fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: 'García Márquez' } });
      fireEvent.change(screen.getByLabelText(/nacionalidad/i), { target: { value: 'Colombiano' } });
      fireEvent.change(screen.getByLabelText(/fecha de nacimiento/i), { target: { value: '1927-03-06' } });
      
      fireEvent.click(screen.getByRole('button', { name: /crear/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          firstName: 'Gabriel',
          lastName: 'García Márquez',
          nationality: 'Colombiano',
          birthDate: '1927-03-06'
        });
      });
    });

    test('ERROR: Missing required fields', async () => {
      renderWithProviders(
        <EntityForm
          mode="create"
          config={authorsFormConfig}
          onCreateSubmit={mockOnSubmit}
          createLoading={false}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /crear/i }));

      await waitFor(() => {
        expect(screen.getByText(/nombre es requerido/i)).toBeInTheDocument();
        expect(screen.getByText(/apellido es requerido/i)).toBeInTheDocument();
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });

    test('ERROR: Name too short', async () => {
      renderWithProviders(
        <EntityForm
          mode="create"
          config={authorsFormConfig}
          onCreateSubmit={mockOnSubmit}
          createLoading={false}
        />
      );

      fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'A' } });
      fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: 'García' } });
      
      fireEvent.click(screen.getByRole('button', { name: /crear/i }));

      await waitFor(() => {
        expect(screen.getByText(/debe tener al menos 2 caracteres/i)).toBeInTheDocument();
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });

    test('ERROR: Invalid website URL format', async () => {
      renderWithProviders(
        <EntityForm
          mode="create"
          config={authorsFormConfig}
          onCreateSubmit={mockOnSubmit}
          createLoading={false}
        />
      );

      fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Gabriel' } });
      fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: 'García' } });
      fireEvent.change(screen.getByLabelText(/sitio web/i), { target: { value: 'invalid-url' } });
      
      fireEvent.click(screen.getByRole('button', { name: /crear/i }));

      await waitFor(() => {
        expect(screen.getByText(/url válida/i)).toBeInTheDocument();
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe('Books Form', () => {
    const mockOnSubmit = jest.fn();

    test('SUCCESS: Valid book creation with all fields', async () => {
      (booksApi.bookCatalogApi.create as jest.Mock).mockResolvedValue({ id: '1', title: 'Test Book' });
      
      renderWithProviders(
        <EntityForm
          mode="create"
          config={booksFormConfig}
          onCreateSubmit={mockOnSubmit}
          createLoading={false}
        />
      );

      fireEvent.change(screen.getByLabelText(/título/i), { target: { value: 'Cien años de soledad' } });
      fireEvent.change(screen.getByLabelText(/isbn/i), { target: { value: '978-3-16-148410-0' } });
      fireEvent.change(screen.getByLabelText(/precio/i), { target: { value: '25.99' } });
      fireEvent.change(screen.getByLabelText(/stock/i), { target: { value: '100' } });
      
      fireEvent.click(screen.getByRole('button', { name: /crear/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
          title: 'Cien años de soledad',
          isbnCode: '978-3-16-148410-0',
          price: 25.99,
          stockQuantity: 100
        }));
      });
    });

    test('ERROR: Invalid ISBN format', async () => {
      renderWithProviders(
        <EntityForm
          mode="create"
          config={booksFormConfig}
          onCreateSubmit={mockOnSubmit}
          createLoading={false}
        />
      );

      fireEvent.change(screen.getByLabelText(/título/i), { target: { value: 'Test Book' } });
      fireEvent.change(screen.getByLabelText(/isbn/i), { target: { value: '123' } });
      
      fireEvent.click(screen.getByRole('button', { name: /crear/i }));

      await waitFor(() => {
        expect(screen.getByText(/formato isbn válido/i)).toBeInTheDocument();
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });

    test('ERROR: Negative price', async () => {
      renderWithProviders(
        <EntityForm
          mode="create"
          config={booksFormConfig}
          onCreateSubmit={mockOnSubmit}
          createLoading={false}
        />
      );

      fireEvent.change(screen.getByLabelText(/título/i), { target: { value: 'Test Book' } });
      fireEvent.change(screen.getByLabelText(/precio/i), { target: { value: '-10' } });
      
      fireEvent.click(screen.getByRole('button', { name: /crear/i }));

      await waitFor(() => {
        expect(screen.getByText(/precio debe ser mayor a 0/i)).toBeInTheDocument();
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });

    test('ERROR: Stock quantity too high', async () => {
      renderWithProviders(
        <EntityForm
          mode="create"
          config={booksFormConfig}
          onCreateSubmit={mockOnSubmit}
          createLoading={false}
        />
      );

      fireEvent.change(screen.getByLabelText(/título/i), { target: { value: 'Test Book' } });
      fireEvent.change(screen.getByLabelText(/stock/i), { target: { value: '100000' } });
      
      fireEvent.click(screen.getByRole('button', { name: /crear/i }));

      await waitFor(() => {
        expect(screen.getByText(/stock no puede exceder 99999/i)).toBeInTheDocument();
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe('Users Form', () => {
    const mockOnSubmit = jest.fn();

    test('SUCCESS: Valid user creation', async () => {
      (usersApi.usersApi.create as jest.Mock).mockResolvedValue({ id: '1', username: 'testuser' });
      
      renderWithProviders(
        <EntityForm
          mode="create"
          config={usersFormConfig}
          onCreateSubmit={mockOnSubmit}
          createLoading={false}
        />
      );

      fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'testuser123' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'SecurePass123!' } });
      
      fireEvent.click(screen.getByRole('button', { name: /crear/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          username: 'testuser123',
          email: 'test@example.com',
          password: 'SecurePass123!'
        });
      });
    });

    test('ERROR: Invalid email format', async () => {
      renderWithProviders(
        <EntityForm
          mode="create"
          config={usersFormConfig}
          onCreateSubmit={mockOnSubmit}
          createLoading={false}
        />
      );

      fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'testuser' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
      fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'password' } });
      
      fireEvent.click(screen.getByRole('button', { name: /crear/i }));

      await waitFor(() => {
        expect(screen.getByText(/email válido/i)).toBeInTheDocument();
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });

    test('ERROR: Password too weak', async () => {
      renderWithProviders(
        <EntityForm
          mode="create"
          config={usersFormConfig}
          onCreateSubmit={mockOnSubmit}
          createLoading={false}
        />
      );

      fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'testuser' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: '123' } });
      
      fireEvent.click(screen.getByRole('button', { name: /crear/i }));

      await waitFor(() => {
        expect(screen.getByText(/contraseña debe tener al menos 8 caracteres/i)).toBeInTheDocument();
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });

    test('ERROR: Username too short', async () => {
      renderWithProviders(
        <EntityForm
          mode="create"
          config={usersFormConfig}
          onCreateSubmit={mockOnSubmit}
          createLoading={false}
        />
      );

      fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'ab' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'password123' } });
      
      fireEvent.click(screen.getByRole('button', { name: /crear/i }));

      await waitFor(() => {
        expect(screen.getByText(/debe tener al menos 3 caracteres/i)).toBeInTheDocument();
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe('Publishers Form', () => {
    const mockOnSubmit = jest.fn();

    test('SUCCESS: Valid publisher creation', async () => {
      (publishersApi.publishingHousesApi.create as jest.Mock).mockResolvedValue({ id: '1', name: 'Test Publisher' });
      
      renderWithProviders(
        <EntityForm
          mode="create"
          config={publishersFormConfig}
          onCreateSubmit={mockOnSubmit}
          createLoading={false}
        />
      );

      fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Editorial Planeta' } });
      fireEvent.change(screen.getByLabelText(/país/i), { target: { value: 'España' } });
      fireEvent.change(screen.getByLabelText(/sitio web/i), { target: { value: 'https://www.planeta.com' } });
      
      fireEvent.click(screen.getByRole('button', { name: /crear/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'Editorial Planeta',
          country: 'España',
          websiteUrl: 'https://www.planeta.com'
        });
      });
    });

    test('ERROR: Name too short', async () => {
      renderWithProviders(
        <EntityForm
          mode="create"
          config={publishersFormConfig}
          onCreateSubmit={mockOnSubmit}
          createLoading={false}
        />
      );

      fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'A' } });
      
      fireEvent.click(screen.getByRole('button', { name: /crear/i }));

      await waitFor(() => {
        expect(screen.getByText(/debe tener al menos 2 caracteres/i)).toBeInTheDocument();
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe('Genres Form', () => {
    const mockOnSubmit = jest.fn();

    test('SUCCESS: Valid genre creation', async () => {
      (genresApi.genresApi.create as jest.Mock).mockResolvedValue({ id: '1', name: 'Test Genre' });
      
      renderWithProviders(
        <EntityForm
          mode="create"
          config={genresFormConfig}
          onCreateSubmit={mockOnSubmit}
          createLoading={false}
        />
      );

      fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Realismo Mágico' } });
      fireEvent.change(screen.getByLabelText(/descripción/i), { target: { value: 'Género literario que combina elementos fantásticos con la realidad.' } });
      
      fireEvent.click(screen.getByRole('button', { name: /crear/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'Realismo Mágico',
          description: 'Género literario que combina elementos fantásticos con la realidad.'
        });
      });
    });

    test('ERROR: Empty name field', async () => {
      renderWithProviders(
        <EntityForm
          mode="create"
          config={genresFormConfig}
          onCreateSubmit={mockOnSubmit}
          createLoading={false}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /crear/i }));

      await waitFor(() => {
        expect(screen.getByText(/nombre es requerido/i)).toBeInTheDocument();
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe('Edit Form Testing', () => {
    test('SUCCESS: Author edit with valid data', async () => {
      const mockOnUpdate = jest.fn();
      (authorsApi.authorsApi.update as jest.Mock).mockResolvedValue({ id: '1' });
      
      renderWithProviders(
        <EntityForm
          mode="edit"
          config={authorsFormConfig}
          initialData={{
            id: '1',
            firstName: 'Gabriel',
            lastName: 'García',
            nationality: 'Colombian'
          }}
          onUpdateSubmit={mockOnUpdate}
          updateLoading={false}
        />
      );

      fireEvent.change(screen.getByDisplayValue('García'), { target: { value: 'García Márquez' } });
      fireEvent.click(screen.getByRole('button', { name: /actualizar/i }));

      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith('1', expect.objectContaining({
          firstName: 'Gabriel',
          lastName: 'García Márquez',
          nationality: 'Colombian'
        }));
      });
    });

    test('ERROR: Edit with invalid data', async () => {
      const mockOnUpdate = jest.fn();
      
      renderWithProviders(
        <EntityForm
          mode="edit"
          config={authorsFormConfig}
          initialData={{
            id: '1',
            firstName: 'Gabriel',
            lastName: 'García'
          }}
          onUpdateSubmit={mockOnUpdate}
          updateLoading={false}
        />
      );

      fireEvent.change(screen.getByDisplayValue('Gabriel'), { target: { value: '' } });
      fireEvent.click(screen.getByRole('button', { name: /actualizar/i }));

      await waitFor(() => {
        expect(screen.getByText(/nombre es requerido/i)).toBeInTheDocument();
        expect(mockOnUpdate).not.toHaveBeenCalled();
      });
    });
  });
});
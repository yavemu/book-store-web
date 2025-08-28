'use client';

import { useState, useEffect } from 'react';
import { SearchSelect, Button, Modal } from '@/components';
import { authorsApi } from '@/services/api/entities/authors';
import { BookAuthor } from '@/types/authors';

interface BookAuthorSelectorProps {
  selectedAuthors: BookAuthor[];
  onAuthorsChange: (authors: BookAuthor[]) => void;
  error?: string;
}

interface AuthorWithRole extends BookAuthor {
  role: 'author' | 'co-author' | 'editor' | 'translator';
  order: number;
}

export function BookAuthorSelector({ selectedAuthors, onAuthorsChange, error }: BookAuthorSelectorProps) {
  const [authorsWithRoles, setAuthorsWithRoles] = useState<AuthorWithRole[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    setAuthorsWithRoles(
      selectedAuthors.map((author, index) => ({
        ...author,
        role: 'author' as const,
        order: index + 1,
      }))
    );
  }, [selectedAuthors]);

  const searchAuthors = async (term: string) => {
    try {
      const response = await authorsApi.search({ term });
      return response.data.map(author => ({
        id: author.id,
        label: `${author.firstName} ${author.lastName}`,
        value: author,
      }));
    } catch (err) {
      console.error('Error searching authors:', err);
      return [];
    }
  };

  const createAuthor = async (name: string) => {
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ') || firstName;
    
    try {
      const newAuthor = await authorsApi.create({
        firstName: firstName,
        lastName: lastName,
        nationality: '',
        birthDate: '',
        biography: '',
      });
      
      return {
        id: (newAuthor as any).id,
        label: `${newAuthor.firstName} ${newAuthor.lastName}`,
        value: newAuthor as BookAuthor,
      };
    } catch (err) {
      console.error('Error creating author:', err);
      throw err;
    }
  };

  const handleAddAuthor = (option: { id: string; label: string; value?: unknown } | null) => {
    if (option && option.value && !authorsWithRoles.find(a => a.id === (option.value as BookAuthor).id)) {
      const author = option.value as BookAuthor;
      const newAuthorWithRole: AuthorWithRole = {
        ...author,
        role: 'author',
        order: authorsWithRoles.length + 1,
      };
      
      const updatedAuthors = [...authorsWithRoles, newAuthorWithRole];
      setAuthorsWithRoles(updatedAuthors);
      onAuthorsChange(updatedAuthors);
    }
  };

  const handleRemoveAuthor = (authorId: string) => {
    const updatedAuthors = authorsWithRoles
      .filter(a => a.id !== authorId)
      .map((author, index) => ({ ...author, order: index + 1 }));
    
    setAuthorsWithRoles(updatedAuthors);
    onAuthorsChange(updatedAuthors);
  };

  const handleRoleChange = (authorId: string, role: AuthorWithRole['role']) => {
    const updatedAuthors = authorsWithRoles.map(author =>
      author.id === authorId ? { ...author, role } : author
    );
    
    setAuthorsWithRoles(updatedAuthors);
    onAuthorsChange(updatedAuthors);
  };

  const moveAuthor = (authorId: string, direction: 'up' | 'down') => {
    const currentIndex = authorsWithRoles.findIndex(a => a.id === authorId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= authorsWithRoles.length) return;

    const updatedAuthors = [...authorsWithRoles];
    [updatedAuthors[currentIndex], updatedAuthors[newIndex]] = [updatedAuthors[newIndex], updatedAuthors[currentIndex]];
    
    // Actualizar orden
    updatedAuthors.forEach((author, index) => {
      author.order = index + 1;
    });

    setAuthorsWithRoles(updatedAuthors);
    onAuthorsChange(updatedAuthors);
  };

  return (
    <div className="space-y-4">
      <div>
        <SearchSelect
          label="Agregar Autor"
          placeholder="Buscar autor..."
          value={null}
          onChange={handleAddAuthor}
          onSearch={searchAuthors}
          onCreate={createAuthor}
          error={error}
          createLabel="Crear autor"
        />
      </div>

      {authorsWithRoles.length > 0 && (
        <div className="border rounded-lg p-4 space-y-3">
          <h4 className="font-medium text-gray-700">Autores seleccionados</h4>
          
          {authorsWithRoles.map((author, index) => (
            <div key={author.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
              <div className="flex-1">
                <span className="font-medium">{author.firstName} {author.lastName}</span>
              </div>
              
              <select
                value={author.role}
                onChange={(e) => handleRoleChange(author.id, e.target.value as AuthorWithRole['role'])}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value="author">Autor</option>
                <option value="co-author">Co-autor</option>
                <option value="editor">Editor</option>
                <option value="translator">Traductor</option>
              </select>
              
              <div className="flex space-x-1">
                <Button
                  type="button"
                  className="px-2 py-1 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => moveAuthor(author.id, 'up')}
                  disabled={index === 0}
                  title="Mover arriba"
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  className="px-2 py-1 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => moveAuthor(author.id, 'down')}
                  disabled={index === authorsWithRoles.length - 1}
                  title="Mover abajo"
                >
                  ↓
                </Button>
                <Button
                  type="button"
                  className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  onClick={() => handleRemoveAuthor(author.id)}
                  title="Remover autor"
                >
                  ×
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
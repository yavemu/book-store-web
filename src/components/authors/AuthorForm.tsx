"use client";

import { useState, useEffect } from "react";
import { CreateBookAuthorDto, UpdateBookAuthorDto, BookAuthorResponseDto } from "@/types/api/entities";
import Button from "@/components/ui/Button";

interface AuthorFormProps {
  author?: BookAuthorResponseDto; // For editing
  onSubmit: (data: CreateBookAuthorDto | UpdateBookAuthorDto) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  isEditing?: boolean;
}

export default function AuthorForm({ 
  author, 
  onSubmit, 
  onCancel, 
  loading = false,
  isEditing = false 
}: AuthorFormProps) {
  const [formData, setFormData] = useState<CreateBookAuthorDto>({
    firstName: "",
    lastName: "",
    nationality: "",
    birthDate: "",
    biography: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form when editing
  useEffect(() => {
    if (author && isEditing) {
      setFormData({
        firstName: author.firstName || "",
        lastName: author.lastName || "",
        nationality: author.nationality || "",
        birthDate: author.birthDate ? author.birthDate.split('T')[0] : "", // Convert to YYYY-MM-DD format
        biography: author.biography || "",
      });
    }
  }, [author, isEditing]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido";
    }

    if (formData.birthDate && formData.birthDate > new Date().toISOString().split('T')[0]) {
      newErrors.birthDate = "La fecha de nacimiento no puede ser futura";
    }

    if (formData.biography && formData.biography.length > 1000) {
      newErrors.biography = "La biografía no puede exceder 1000 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Clean up empty optional fields
      const cleanData = {
        ...formData,
        nationality: formData.nationality?.trim() || undefined,
        birthDate: formData.birthDate || undefined,
        biography: formData.biography?.trim() || undefined,
      };

      await onSubmit(cleanData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleInputChange = (field: keyof CreateBookAuthorDto, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  return (
    <div className="author-form">
      <div className="form-header">
        <h3 className="form-title">
          {isEditing ? "✏️ Editar Autor" : "➕ Crear Nuevo Autor"}
        </h3>
        <p className="form-subtitle">
          {isEditing 
            ? "Modifica la información del autor seleccionado"
            : "Completa la información para crear un nuevo autor"
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="form-content">
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="firstName" className="form-label">
              Nombre <span className="required">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className={`form-input ${errors.firstName ? "error" : ""}`}
              placeholder="Ej: Gabriel"
              disabled={loading}
            />
            {errors.firstName && (
              <span className="form-error">{errors.firstName}</span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="lastName" className="form-label">
              Apellido <span className="required">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className={`form-input ${errors.lastName ? "error" : ""}`}
              placeholder="Ej: García Márquez"
              disabled={loading}
            />
            {errors.lastName && (
              <span className="form-error">{errors.lastName}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="nationality" className="form-label">
              Nacionalidad
            </label>
            <input
              type="text"
              id="nationality"
              value={formData.nationality}
              onChange={(e) => handleInputChange("nationality", e.target.value)}
              className="form-input"
              placeholder="Ej: Colombiana"
              disabled={loading}
            />
          </div>

          <div className="form-field">
            <label htmlFor="birthDate" className="form-label">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              id="birthDate"
              value={formData.birthDate}
              onChange={(e) => handleInputChange("birthDate", e.target.value)}
              className={`form-input ${errors.birthDate ? "error" : ""}`}
              max={new Date().toISOString().split('T')[0]}
              disabled={loading}
            />
            {errors.birthDate && (
              <span className="form-error">{errors.birthDate}</span>
            )}
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="biography" className="form-label">
            Biografía
          </label>
          <textarea
            id="biography"
            value={formData.biography}
            onChange={(e) => handleInputChange("biography", e.target.value)}
            className={`form-textarea ${errors.biography ? "error" : ""}`}
            placeholder="Breve biografía del autor..."
            rows={4}
            maxLength={1000}
            disabled={loading}
          />
          <div className="form-hint">
            {formData.biography.length}/1000 caracteres
          </div>
          {errors.biography && (
            <span className="form-error">{errors.biography}</span>
          )}
        </div>

        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            loading={loading}
          >
            {isEditing ? "💾 Actualizar" : "➕ Crear"} Autor
          </Button>
        </div>
      </form>
    </div>
  );
}
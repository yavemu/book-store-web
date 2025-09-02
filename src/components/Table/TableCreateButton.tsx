"use client";

import React from 'react';

interface TableCreateButtonProps {
  entityName: string;
  onClick: () => void;
  isFormVisible?: boolean;
  isEditing?: boolean;
  customLabel?: string;
  disabled?: boolean;
}

export default function TableCreateButton({
  entityName,
  onClick,
  isFormVisible = false,
  isEditing = false,
  customLabel,
  disabled = false
}: TableCreateButtonProps) {
  const getButtonLabel = () => {
    if (customLabel) return customLabel;
    
    if (isFormVisible) {
      return isEditing ? `✏️ Editando ${entityName}` : `🔧 Creando ${entityName}`;
    }
    
    return `+ Crear ${entityName}`;
  };

  return (
    <div className="create-section">
      <button
        onClick={onClick}
        disabled={disabled}
        className="btn-create"
        type="button"
      >
        {getButtonLabel()}
      </button>
    </div>
  );
}
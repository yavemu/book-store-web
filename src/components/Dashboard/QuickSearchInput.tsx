"use client";

import { useState, useEffect } from "react";

interface QuickSearchInputProps {
  onAutoFilter: (term: string) => void;
  loading?: boolean;
  placeholder?: string;
}

export default function QuickSearchInput({
  onAutoFilter,
  loading = false,
  placeholder = "Búsqueda rápida (mín. 3 caracteres)"
}: QuickSearchInputProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Auto search with debounce when typing 3+ characters
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim().length >= 3) {
        onAutoFilter(searchTerm.trim());
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, onAutoFilter]);

  return (
    <div className="quick-search-input">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="search-input-quick"
        disabled={loading}
      />
      {searchTerm.trim().length >= 3 && (
        <div className="search-indicator-quick">
          {loading ? "🔄" : "✅"}
        </div>
      )}
    </div>
  );
}
/**
 * Hook especializado para manejo de géneros y editoriales en Books
 * Permite seleccionar existentes o crear nuevos on-the-fly
 */

import { useState, useCallback, useEffect } from 'react';
import { genresApi } from '@/services/api/entities/genres';
import { publishingHousesApi } from '@/services/api/entities/publishing-houses';
import { useDebounce } from '../useDebounce';

interface GenreEditorialState {
  // Géneros
  genres: any[];
  selectedGenre: any | null;
  genreSearchTerm: string;
  genreLoading: boolean;
  genreError: string | null;
  showCreateGenre: boolean;
  newGenreName: string;
  
  // Editoriales
  publishers: any[];
  selectedPublisher: any | null;
  publisherSearchTerm: string;
  publisherLoading: boolean;
  publisherError: string | null;
  showCreatePublisher: boolean;
  newPublisherName: string;
  
  // Estados generales
  isCreatingGenre: boolean;
  isCreatingPublisher: boolean;
}

export function useGenreEditorialManager() {
  const [state, setState] = useState<GenreEditorialState>({
    // Géneros
    genres: [],
    selectedGenre: null,
    genreSearchTerm: '',
    genreLoading: false,
    genreError: null,
    showCreateGenre: false,
    newGenreName: '',
    
    // Editoriales
    publishers: [],
    selectedPublisher: null,
    publisherSearchTerm: '',
    publisherLoading: false,
    publisherError: null,
    showCreatePublisher: false,
    newPublisherName: '',
    
    // Estados generales
    isCreatingGenre: false,
    isCreatingPublisher: false
  });

  // Debounce para búsquedas
  const debouncedGenreSearch = useDebounce(state.genreSearchTerm, 300);
  const debouncedPublisherSearch = useDebounce(state.publisherSearchTerm, 300);

  // Actualizar estado
  const updateState = useCallback((updates: Partial<GenreEditorialState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // ===== MANEJO DE GÉNEROS =====

  // Buscar géneros
  const searchGenres = useCallback(async (searchTerm: string) => {
    if (!searchTerm) {
      updateState({ genres: [], genreLoading: false });
      return;
    }

    updateState({ genreLoading: true, genreError: null });

    try {
      const result = await genresApi.filter({
        name: searchTerm,
        pagination: { page: 1, limit: 10 }
      });

      updateState({ 
        genres: result?.data || [],
        genreLoading: false,
        showCreateGenre: !result?.data?.length // Show create option if no results
      });
    } catch (error) {
      updateState({ 
        genreError: 'Error buscando géneros',
        genreLoading: false,
        genres: []
      });
    }
  }, [updateState]);

  // Cargar géneros iniciales
  const loadInitialGenres = useCallback(async () => {
    updateState({ genreLoading: true });
    try {
      const result = await genresApi.list({ page: 1, limit: 20 });
      updateState({ 
        genres: result?.data || [],
        genreLoading: false
      });
    } catch (error) {
      updateState({ 
        genreError: 'Error cargando géneros',
        genreLoading: false
      });
    }
  }, [updateState]);

  // Crear nuevo género
  const createGenre = useCallback(async (genreName: string) => {
    updateState({ isCreatingGenre: true, genreError: null });

    try {
      const newGenre = await genresApi.create({
        name: genreName,
        description: `Género: ${genreName}`
      });

      updateState({
        selectedGenre: newGenre,
        showCreateGenre: false,
        newGenreName: '',
        genreSearchTerm: genreName,
        genres: [newGenre, ...state.genres],
        isCreatingGenre: false
      });

      return newGenre;
    } catch (error) {
      updateState({
        genreError: 'Error creando género',
        isCreatingGenre: false
      });
      throw error;
    }
  }, [updateState, state.genres]);

  // Seleccionar género
  const selectGenre = useCallback((genre: any) => {
    updateState({
      selectedGenre: genre,
      genreSearchTerm: genre?.name || '',
      showCreateGenre: false
    });
  }, [updateState]);

  // ===== MANEJO DE EDITORIALES =====

  // Buscar editoriales
  const searchPublishers = useCallback(async (searchTerm: string) => {
    if (!searchTerm) {
      updateState({ publishers: [], publisherLoading: false });
      return;
    }

    updateState({ publisherLoading: true, publisherError: null });

    try {
      const result = await publishingHousesApi.filter({
        name: searchTerm,
        pagination: { page: 1, limit: 10 }
      });

      updateState({ 
        publishers: result?.data || [],
        publisherLoading: false,
        showCreatePublisher: !result?.data?.length
      });
    } catch (error) {
      updateState({ 
        publisherError: 'Error buscando editoriales',
        publisherLoading: false,
        publishers: []
      });
    }
  }, [updateState]);

  // Cargar editoriales iniciales
  const loadInitialPublishers = useCallback(async () => {
    updateState({ publisherLoading: true });
    try {
      const result = await publishingHousesApi.list({ page: 1, limit: 20 });
      updateState({ 
        publishers: result?.data || [],
        publisherLoading: false
      });
    } catch (error) {
      updateState({ 
        publisherError: 'Error cargando editoriales',
        publisherLoading: false
      });
    }
  }, [updateState]);

  // Crear nueva editorial
  const createPublisher = useCallback(async (publisherName: string) => {
    updateState({ isCreatingPublisher: true, publisherError: null });

    try {
      const newPublisher = await publishingHousesApi.create({
        name: publisherName,
        country: 'No especificado',
        website: '',
        contactEmail: ''
      });

      updateState({
        selectedPublisher: newPublisher,
        showCreatePublisher: false,
        newPublisherName: '',
        publisherSearchTerm: publisherName,
        publishers: [newPublisher, ...state.publishers],
        isCreatingPublisher: false
      });

      return newPublisher;
    } catch (error) {
      updateState({
        publisherError: 'Error creando editorial',
        isCreatingPublisher: false
      });
      throw error;
    }
  }, [updateState, state.publishers]);

  // Seleccionar editorial
  const selectPublisher = useCallback((publisher: any) => {
    updateState({
      selectedPublisher: publisher,
      publisherSearchTerm: publisher?.name || '',
      showCreatePublisher: false
    });
  }, [updateState]);

  // ===== EFECTOS =====

  // Efecto para búsqueda de géneros
  useEffect(() => {
    if (debouncedGenreSearch) {
      searchGenres(debouncedGenreSearch);
    } else if (debouncedGenreSearch === '') {
      loadInitialGenres();
    }
  }, [debouncedGenreSearch, searchGenres, loadInitialGenres]);

  // Efecto para búsqueda de editoriales
  useEffect(() => {
    if (debouncedPublisherSearch) {
      searchPublishers(debouncedPublisherSearch);
    } else if (debouncedPublisherSearch === '') {
      loadInitialPublishers();
    }
  }, [debouncedPublisherSearch, searchPublishers, loadInitialPublishers]);

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialGenres();
    loadInitialPublishers();
  }, [loadInitialGenres, loadInitialPublishers]);

  // ===== MÉTODOS DE UTILIDAD =====

  // Limpiar selecciones
  const clearSelections = useCallback(() => {
    updateState({
      selectedGenre: null,
      selectedPublisher: null,
      genreSearchTerm: '',
      publisherSearchTerm: '',
      showCreateGenre: false,
      showCreatePublisher: false,
      newGenreName: '',
      newPublisherName: ''
    });
  }, [updateState]);

  // Validar que ambos estén seleccionados
  const isValidSelection = useCallback(() => {
    return state.selectedGenre && state.selectedPublisher;
  }, [state.selectedGenre, state.selectedPublisher]);

  // Obtener IDs para el formulario
  const getSelectedIds = useCallback(() => {
    return {
      genreId: state.selectedGenre?.id || null,
      publisherId: state.selectedPublisher?.id || null
    };
  }, [state.selectedGenre, state.selectedPublisher]);

  return {
    // Estado completo
    state,
    
    // Métodos de géneros
    selectGenre,
    createGenre,
    setGenreSearchTerm: (term: string) => updateState({ genreSearchTerm: term }),
    setNewGenreName: (name: string) => updateState({ newGenreName: name }),
    toggleCreateGenre: () => updateState({ showCreateGenre: !state.showCreateGenre }),
    
    // Métodos de editoriales
    selectPublisher,
    createPublisher,
    setPublisherSearchTerm: (term: string) => updateState({ publisherSearchTerm: term }),
    setNewPublisherName: (name: string) => updateState({ newPublisherName: name }),
    toggleCreatePublisher: () => updateState({ showCreatePublisher: !state.showCreatePublisher }),
    
    // Métodos de utilidad
    clearSelections,
    isValidSelection,
    getSelectedIds,
    
    // Estados derivados
    canCreateGenre: state.newGenreName.trim().length >= 2 && !state.isCreatingGenre,
    canCreatePublisher: state.newPublisherName.trim().length >= 2 && !state.isCreatingPublisher,
    hasValidSelections: isValidSelection(),
    isLoading: state.genreLoading || state.publisherLoading || state.isCreatingGenre || state.isCreatingPublisher
  };
}
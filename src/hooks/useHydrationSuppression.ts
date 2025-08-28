"use client";

import { useEffect, useState } from 'react';

/**
 * Hook para suprimir errores de hidratación causados por extensiones del navegador
 * o diferencias entre servidor y cliente
 */
export function useHydrationSuppression() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Marcar como hidratado después del primer render del cliente
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

/**
 * Hook para detectar si hay extensiones del navegador que pueden causar problemas de hidratación
 */
export function useBrowserExtensionDetection() {
  const [hasExtensions, setHasExtensions] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detectar algunos atributos comunes agregados por extensiones
    const checkForExtensions = () => {
      const body = document.body;
      const commonExtensionAttributes = [
        'cz-shortcut-listen', // ColorZilla
        'data-new-gr-c-s-check-loaded', // Grammarly
        'data-adblock-key', // AdBlock
        'spellcheck', // Varios correctores ortográficos
      ];

      const hasExtensionAttributes = commonExtensionAttributes.some(
        attr => body.hasAttribute(attr) || document.documentElement.hasAttribute(attr)
      );

      setHasExtensions(hasExtensionAttributes);
    };

    // Verificar inmediatamente y después de un delay para capturar extensiones que se cargan tardíamente
    checkForExtensions();
    const timer = setTimeout(checkForExtensions, 100);

    return () => clearTimeout(timer);
  }, []);

  return hasExtensions;
}
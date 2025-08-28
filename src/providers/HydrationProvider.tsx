"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface HydrationContextType {
  isHydrated: boolean;
  hasExtensionInterference: boolean;
}

const HydrationContext = createContext<HydrationContextType>({
  isHydrated: false,
  hasExtensionInterference: false,
});

export const useHydration = () => useContext(HydrationContext);

interface HydrationProviderProps {
  children: ReactNode;
}

export function HydrationProvider({ children }: HydrationProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasExtensionInterference, setHasExtensionInterference] = useState(false);

  useEffect(() => {
    // Detectar interferencias de extensiones
    const detectExtensions = () => {
      if (typeof window === 'undefined') return false;

      const commonExtensionMarkers = [
        () => document.body?.hasAttribute('cz-shortcut-listen'), // ColorZilla
        () => document.body?.hasAttribute('data-new-gr-c-s-check-loaded'), // Grammarly
        () => document.querySelector('[data-adblock-key]'), // AdBlock
        () => document.querySelector('[data-lastpass-icon-root]'), // LastPass
        () => window.navigator.userAgent.includes('Chrome') && (window as unknown as { chrome?: { runtime: unknown } }).chrome?.runtime, // Chrome extensions general
      ];

      return commonExtensionMarkers.some(check => {
        try {
          return check();
        } catch {
          return false;
        }
      });
    };

    // Limpiar atributos problemáticos
    const cleanupExtensionAttributes = () => {
      const problematicSelectors = [
        '[cz-shortcut-listen]',
        '[data-new-gr-c-s-check-loaded]',
        '[data-gr-ext-installed]',
        '[data-adblock-key]',
        '[data-lastpass-icon-root]',
      ];

      problematicSelectors.forEach(selector => {
        try {
          document.querySelectorAll(selector).forEach(element => {
            const attrName = selector.slice(1, -1); // Remove [ and ]
            element.removeAttribute(attrName);
          });
        } catch (error) {
          console.warn('[HydrationProvider] Error cleaning attribute:', selector, error);
        }
      });
    };

    const initialize = () => {
      const hasInterference = detectExtensions();
      setHasExtensionInterference(hasInterference);

      if (hasInterference) {
        cleanupExtensionAttributes();
        
        // Configurar un observer para limpiar atributos dinámicos
        const observer = new MutationObserver((mutations) => {
          let needsCleanup = false;
          
          mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName) {
              const attrName = mutation.attributeName;
              if (attrName.startsWith('cz-') || 
                  attrName.startsWith('data-gr-') ||
                  attrName.startsWith('data-adblock-') ||
                  attrName.startsWith('data-lastpass-')) {
                needsCleanup = true;
              }
            }
          });

          if (needsCleanup) {
            cleanupExtensionAttributes();
          }
        });

        // Observar cambios en el documento
        observer.observe(document.body, { 
          attributes: true, 
          subtree: true,
          attributeOldValue: true 
        });

        // Cleanup function
        return () => observer.disconnect();
      }
    };

    // Ejecutar después de que el DOM esté listo
    const timer = setTimeout(() => {
      initialize();
      setIsHydrated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const contextValue: HydrationContextType = {
    isHydrated,
    hasExtensionInterference,
  };

  return (
    <HydrationContext.Provider value={contextValue}>
      {children}
    </HydrationContext.Provider>
  );
}
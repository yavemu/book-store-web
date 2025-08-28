"use client";

import { useEffect, useState, ReactNode } from 'react';

interface HydrationGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Componente que previene errores de hidratación causados por extensiones del navegador
 * o diferencias entre servidor y cliente
 */
export default function HydrationGuard({ children, fallback }: HydrationGuardProps) {
  const [isHydrationSafe, setIsHydrationSafe] = useState(false);

  useEffect(() => {
    // Detectar y limpiar atributos problemáticos agregados por extensiones
    const cleanupBrowserExtensionAttributes = () => {
      if (typeof window === 'undefined') return;

      const elementsToClean = [document.body, document.documentElement];
      const problematicAttributes = [
        'cz-shortcut-listen', // ColorZilla
        'data-new-gr-c-s-check-loaded', // Grammarly  
        'data-gr-ext-installed', // Grammarly
        'data-adblock-key', // AdBlock
        'spellcheck-loaded', // Spell checkers
        'data-lastpass-icon-root', // LastPass
      ];

      elementsToClean.forEach(element => {
        if (element) {
          problematicAttributes.forEach(attr => {
            if (element.hasAttribute(attr)) {
              console.warn(`[HydrationGuard] Removing problematic attribute: ${attr}`);
              element.removeAttribute(attr);
            }
          });
        }
      });
    };

    // Ejecutar limpieza inmediatamente
    cleanupBrowserExtensionAttributes();

    // Observer para detectar cambios dinámicos en atributos
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.target) {
          const target = mutation.target as Element;
          const attrName = mutation.attributeName;
          
          if (attrName && (
            attrName.startsWith('cz-') ||
            attrName.startsWith('data-gr-') ||
            attrName.startsWith('data-adblock-') ||
            attrName.startsWith('data-lastpass-')
          )) {
            console.warn(`[HydrationGuard] Removing dynamically added attribute: ${attrName}`);
            target.removeAttribute(attrName);
          }
        }
      });
    });

    // Observar cambios en body y html
    if (document.body) {
      observer.observe(document.body, { 
        attributes: true, 
        attributeOldValue: true 
      });
    }
    
    if (document.documentElement) {
      observer.observe(document.documentElement, { 
        attributes: true, 
        attributeOldValue: true 
      });
    }

    // Marcar como seguro después de la limpieza inicial
    const timer = setTimeout(() => {
      setIsHydrationSafe(true);
    }, 50);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  if (!isHydrationSafe) {
    return fallback || (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
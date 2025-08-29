// Script para prevenir errores de hidratación causados por extensiones del navegador
(function() {
  'use strict';
  
  // Lista de atributos problemáticos conocidos
  const PROBLEMATIC_ATTRIBUTES = [
    'cz-shortcut-listen', // ColorZilla
    'data-new-gr-c-s-check-loaded', // Grammarly
    'data-gr-ext-installed', // Grammarly
    'data-adblock-key', // AdBlock
    'data-lastpass-icon-root', // LastPass
    'spellcheck-loaded', // Spell checkers
  ];

  function cleanupExtensionAttributes() {
    try {
      // Limpiar atributos del body
      if (document.body) {
        PROBLEMATIC_ATTRIBUTES.forEach(function(attr) {
          if (document.body.hasAttribute(attr)) {
            console.log('[HydrationFix] Removing attribute from body:', attr);
            document.body.removeAttribute(attr);
          }
        });
      }

      // Limpiar atributos del html
      if (document.documentElement) {
        PROBLEMATIC_ATTRIBUTES.forEach(function(attr) {
          if (document.documentElement.hasAttribute(attr)) {
            console.log('[HydrationFix] Removing attribute from html:', attr);
            document.documentElement.removeAttribute(attr);
          }
        });
      }
    } catch (error) {
      console.warn('[HydrationFix] Error during cleanup:', error);
    }
  }

  // Ejecutar limpieza cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanupExtensionAttributes);
  } else {
    cleanupExtensionAttributes();
  }

  // Observer para limpiar atributos que se agreguen dinámicamente
  if (window.MutationObserver) {
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName) {
          var attrName = mutation.attributeName;
          if (PROBLEMATIC_ATTRIBUTES.indexOf(attrName) !== -1) {
            console.log('[HydrationFix] Removing dynamically added attribute:', attrName);
            if (mutation.target && mutation.target.removeAttribute) {
              mutation.target.removeAttribute(attrName);
            }
          }
        }
      });
    });

    // Comenzar a observar cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', function() {
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
    });
  }
})();
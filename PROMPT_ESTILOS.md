# 🎨 Prompt de Diseño para "book-store"

Eres un diseñador web senior con experiencia en UX/UI, encargado de definir los estilos visuales, gamas de colores y organización de componentes de una aplicación llamada **"book-store"**. El objetivo es lograr **una experiencia limpia, moderna y atractiva**, optimizada para **lectura, descubrimiento de libros y gestión intuitiva**.  
Utiliza **TailwindCSS** con un enfoque en **flexbox y grid**, priorizando la **legibilidad, consistencia y estética minimalista**.  
Además, centraliza estilos repetitivos mediante clases personalizadas en `global.css` y pequeños archivos de estilos específicos por componente para mantener el código limpio.

---

## 📌 Lineamientos de diseño

### 1. Paleta de colores principal

- Fondo: `bg-neutral-50`
- Texto: `text-neutral-800`
- Color primario: `indigo-600 hover:indigo-700`
- Color secundario: `emerald-500 hover:emerald-600`
- Resaltados: `amber-500`
- Bordes y separadores: `border-neutral-200`

---

### 2. Login de autenticación

- Centrado en pantalla: `flex items-center justify-center min-h-screen`
- Tarjeta: `bg-white rounded-2xl shadow-lg`
- Inputs: `focus:ring-2 focus:ring-indigo-500`
- Botón login: `btn-primary w-full`

---

### 3. Listado de libros

- Contenedor: `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`
- Tarjeta libro: `card-book`
- Imagen: `object-cover h-48 w-full rounded-t-2xl`
- Título: `text-lg font-semibold text-neutral-800`
- Autor/editorial: `text-sm text-neutral-500`
- Botón acción: `btn-primary px-3 py-1`

---

### 4. Filtros y búsqueda

- Barra filtros: `filters-bar`
- Inputs/selects: `input-base`
- Buscador: `search-box`
- Animaciones hover: `transition-colors duration-200`

---

### 5. Formulario alta/edición de libro

- Layout: `grid grid-cols-1 md:grid-cols-2 gap-6`
- Labels: `text-sm font-medium text-neutral-700`
- Validación:
  - Correcto: `border-emerald-500`
  - Error: `border-red-500 text-red-600 text-xs`
- Upload imagen: `upload-box`

---

### 6. Visualización de datos de un libro

- Layout: `flex flex-col md:flex-row gap-8`
- Columna 1 (portada): `shadow-xl rounded-2xl`
- Columna 2 (detalles):
  - Título: `text-2xl font-bold text-neutral-800`
  - Texto: `text-sm text-neutral-600`
- Botón acción: `btn-secondary px-4 py-2`

---

### 7. Estética general

- Márgenes: `p-6 lg:p-10`
- Bordes redondeados: `rounded-2xl` en tarjetas y botones
- Sombras: `shadow-sm`, `shadow-md`
- Animaciones: `transition hover:scale-105`

---

## 📂 Organización de estilos

Para mantener los componentes limpios, define clases utilitarias en `global.css` y extiende con archivos específicos cuando sea necesario:

### `global.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition;
  }

  .btn-secondary {
    @apply bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition;
  }

  .card-book {
    @apply bg-white rounded-2xl shadow-md hover:shadow-lg transition flex flex-col;
  }

  .filters-bar {
    @apply flex gap-4 bg-white p-4 rounded-xl shadow-sm;
  }

  .input-base {
    @apply rounded-lg border border-neutral-300 focus:ring-2 focus:ring-indigo-500 px-3 py-2;
  }

  .search-box {
    @apply flex items-center bg-neutral-100 rounded-lg px-3;
  }

  .upload-box {
    @apply border-2 border-dashed border-neutral-300 rounded-xl p-6 flex flex-col items-center justify-center hover:border-indigo-500;
  }
}
```

Archivos sugeridos

styles/forms.css → validaciones de formularios, inputs específicos.

styles/cards.css → estilos particulares de tarjetas.

styles/layout.css → reglas de espaciado y grids para páginas principales.

De este modo, los componentes JSX solo utilizan clases limpias como btn-primary, card-book, input-base, manteniendo el código más legible y fácil de escalar.

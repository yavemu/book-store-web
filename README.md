# Book Store Web - Guía Completa de Instalación y Desarrollo

Esta guía te llevará paso a paso por todo el proceso de configuración de la aplicación web Book Store (Interfaz de Usuario) para trabajar con la API Book Store.

## Prerequisitos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu sistema:

### Software Requerido

1. **Git** (versión 2.25+)

   - Descarga: https://git-scm.com/downloads
   - Verificar instalación: `git --version`

2. **Docker** (versión 20.10+)

   - Descarga: https://www.docker.com/products/docker-desktop
   - Verificar instalación: `docker --version`

3. **Docker Compose** (versión 2.0+)

   - Generalmente incluido con Docker Desktop
   - Verificar instalación: `docker-compose --version`

4. **Node.js** (versión 20.12+)
   - Descarga: https://nodejs.org/en/download/
   - Verificar instalación: `node --version` y `npm --version`

### Requisitos Mínimos del Sistema

- **Sistema Operativo**: Windows 10+, macOS 10.14+, o Linux
- **RAM**: Mínimo 4GB, recomendado 8GB+
- **Almacenamiento**: Al menos 2GB de espacio libre

## Configuración de la Estructura del Proyecto

### Paso 1: Crear Directorio Raíz

Primero, crea el directorio principal del proyecto donde vivirán tanto la aplicación API como Web:

```bash
# Navega a la ubicación deseada (ej. Escritorio, Documentos, etc.)
cd ~/Documents  # o donde quieras crear el proyecto

# Crea la carpeta principal del proyecto
mkdir book-store
cd book-store
```

Tu estructura de directorios debería verse así:

```
book-store/           # ← Estás aquí
├── (vacío por ahora)
```

### Paso 2: Clonar Repositorios

Clona tanto el repositorio de la API como el Web dentro del directorio book-store:

```bash
# Asegúrate de estar en el directorio book-store
pwd  # Debería mostrar: /ruta/hacia/tu/book-store

# Clona el repositorio de la API (requerido para funcionar)
git clone https://github.com/yavemu/book-store-api.git

# Clona el repositorio Web
git clone https://github.com/yavemu/book-store-web.git
```

Después de clonar, tu estructura debería ser:

```
book-store/
├── book-store-api/
│   ├── src/
│   ├── package.json
│   ├── Dockerfile
│   └── ...
└── book-store-web/
    ├── src/
    ├── package.json
    ├── Dockerfile
    ├── next.config.js
    └── ...
```

### Paso 3: Crear archivo .env para la Web

Copiar el archivo .env.example y renombrarlo a .env:

```bash
# Navegar al directorio de la aplicación web
cd book-store-web

# Copia el archivo .env.example
cp .env.example .env
```

Luego, edita el archivo .env para configurar las variables de entorno:

```env
# URL de la API (debe coincidir con la configuración de la API)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# URL del frontend para detección de entorno
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3001

# Puerto del servidor (por defecto 3001)
PORT=3001

# Variables de entorno para Docker
NODE_ENV=development
```

## 🏗️ Arquitectura de la Aplicación Web

### Tecnologías Principales

La aplicación Book Store Web está construida con tecnologías modernas:

- **Next.js 15.5** - Framework React con App Router
- **React 19.1** - Biblioteca de interfaz de usuario con features concurrentes
- **TypeScript 5** - Tipado estático para mayor seguridad
- **TailwindCSS 4** - Framework CSS utility-first
- **Redux Toolkit** - Gestión de estado global
- **Zod 4.1** - Validación y inferencia de tipos

### Patrón de Arquitectura

#### 1. **Sistema de Proxy API**
La aplicación usa rutas API de Next.js como proxy hacia el backend:

```
Frontend (3001) → Next.js API Routes → Backend API (3000)
```

- Todas las llamadas API pasan por `/api/[...slug]/route.ts`
- Proxy automático hacia `NEXT_PUBLIC_API_URL`
- Manejo de autenticación con JWT
- Gestión centralizada de errores

#### 2. **Gestión de Estado**
- **Redux Toolkit** para estado global
- **Hook personalizado `useApiRequest`** para llamadas API con validación Zod
- **ApiClient centralizado** con manejo automático de tokens

#### 3. **Sistema de Validación**
- **Esquemas Zod** en `src/services/validation/schemas/`
- Validación en tiempo de ejecución
- Inferencia de tipos TypeScript automática

### Estructura de Carpetas

```
src/
├── app/                    # Next.js 15 App Router
│   ├── (dashboard)/       # Rutas del dashboard
│   │   ├── authors/       # Gestión de autores
│   │   ├── books/         # Gestión de libros
│   │   ├── genres/        # Gestión de géneros
│   │   ├── publishers/    # Gestión de editoriales
│   │   ├── users/         # Gestión de usuarios
│   │   ├── audit/         # Auditoría del sistema
│   │   └── inventory-movements/ # Movimientos de inventario
│   ├── api/[...slug]/     # Rutas proxy API
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página de inicio
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes base UI
│   ├── Dashboard/        # Componentes del dashboard
│   ├── authors/          # Componentes específicos de autores
│   ├── books/            # Componentes específicos de libros
│   └── ...              # Otros módulos
├── config/               # Archivos de configuración
│   ├── dashboard/        # Configuraciones de módulos dashboard
│   └── environment.ts    # Variables de entorno
├── hooks/                # Hooks personalizados de React
│   ├── useApiRequest.ts  # Hook para llamadas API
│   ├── useDashboard.ts   # Hook centralizado del dashboard
│   └── ...              # Hooks especializados
├── services/             # Lógica de negocio
│   ├── api/              # Clientes API y entidades
│   └── validation/       # Esquemas Zod
├── store/                # Redux store
│   └── slices/           # Redux slices
└── types/                # Definiciones de tipos TypeScript
```

### Patrones de Componentes

#### **Componentes de Dashboard Unificados**
La aplicación implementa un patrón de dashboard genérico que elimina duplicación de código:

```typescript
// Configuración por módulo
export const authorsConfig: DashboardConfig = {
  entityName: 'authors',
  displayName: 'Autores',
  capabilities: {
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canFilter: true,
    canSearch: true
  }
};

// Uso en página
export default function AuthorsPage() {
  return <DashboardPageWrapper config={authorsConfig} />;
}
```

Este patrón reduce **91% del código duplicado** entre módulos del dashboard.

## Ejecución de la Aplicación

### 📝 Scripts npm Disponibles

| Script                         | Descripción                                                      | 
| ------------------------------ | ---------------------------------------------------------------- |
| `npm run dev`                  | Inicia el servidor de desarrollo en puerto 3001                 |
| `npm run build`                | Construye la aplicación para producción                         |
| `npm run start`                | Inicia el servidor de producción                                |
| `npm run lint`                 | Ejecuta ESLint para verificar código                            |
| `npm test`                     | Ejecuta tests con Jest                                           |
| `npm run test:watch`           | Ejecuta tests en modo watch                                      |
| `npm run test:coverage`        | Genera reporte de cobertura de tests                            |

### Scripts Docker para la Web

| Script                         | Descripción                                                      | Equivalente Docker                                              |
| ------------------------------ | ---------------------------------------------------------------- | --------------------------------------------------------------- |
| `npm run docker:dev`           | Inicia contenedor de desarrollo con hot reload                  | docker-compose up -d                                            |
| `npm run docker:dev:build`     | Construye imagen y inicia en modo desarrollo                    | docker-compose up --build -d                                    |
| `npm run docker:dev:detached`  | Inicia desarrollo en segundo plano                              | docker-compose up -d                                            |
| `npm run docker:down`          | Detiene contenedores                                             | docker-compose down                                             |
| `npm run docker:down:clean`    | Detiene contenedores y limpia volúmenes                         | docker-compose down -v                                          |
| `npm run docker:logs`          | Muestra logs del contenedor web                                 | docker logs book-store-web-container -f                         |
| `npm run docker:shell`         | Accede al shell del contenedor                                  | docker exec -it book-store-web-container /bin/sh                |
| `npm run docker:exec:build`    | Construye la aplicación dentro del contenedor                   | docker-compose exec web npm run build                          |
| `npm run docker:exec:lint`     | Ejecuta lint dentro del contenedor                              | docker-compose exec web npm run lint                           |

### Comandos de Desarrollo Local

#### **Desarrollo Local (Recomendado para desarrollo activo)**

```bash
# Navegar al directorio del proyecto web
cd book-store/book-store-web

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# URLs disponibles:
# 🌐 Aplicación Web: http://localhost:3001
# 📚 Interfaz de Dashboard: http://localhost:3001/authors (página por defecto)
```

#### **Usando Docker Compose**

```bash
# Navegar al directorio del proyecto web
cd book-store/book-store-web

# Construir y ejecutar contenedor de desarrollo
npm run docker:dev:build

# Solo ejecutar (si ya está construido)
npm run docker:dev

# Ver estado del contenedor
docker-compose ps
```

### Comandos de Producción

#### **Build de Producción**

```bash
# Construir para producción
npm run build

# Iniciar servidor de producción
npm run start

# O usando Docker
npm run docker:exec:build
```

#### **Verificación de Calidad**

```bash
# Verificar código con ESLint
npm run lint

# Ejecutar tests
npm test

# Tests con cobertura (objetivo: >80%)
npm run test:coverage

# Verificación completa
npm run lint && npm test && npm run build
```

## 🧪 Testing

### Configuración de Tests

El proyecto usa **Jest** con configuración optimizada para Next.js:

```javascript
// jest.config.js configurado para:
- Testing Library para componentes React
- jsdom environment para DOM
- Soporte para TypeScript
- Path aliases (@/, @/components/, etc.)
```

### Tipos de Tests

```bash
# Tests unitarios de componentes
npm test

# Tests en modo watch (desarrollo)
npm run test:watch

# Reporte de cobertura detallado
npm run test:coverage
```

### Cobertura de Tests

El sistema colecta cobertura de:
- `src/**/*.{js,jsx,ts,tsx}`
- Excluye archivos de definición de tipos, stories e index

## 🔧 Integración con la API

### Configuración de Proxy

La aplicación web se conecta a la API mediante un sistema de proxy:

```typescript
// src/app/api/[...slug]/route.ts
export async function GET(request: NextRequest) {
  const response = await fetch(`${API_URL}${pathname}`, {
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    },
  });
  return response;
}
```

### Flujo de Autenticación

1. **Login** → Guarda JWT en localStorage
2. **ApiClient** → Incluye token automáticamente en headers
3. **Proxy Routes** → Reenvían autenticación al backend
4. **Manejo de Errores** → Redirige a login si token expira

### Patrones de Llamadas API

```typescript
// Hook personalizado con validación Zod
const { data, loading, error, execute } = useApiRequest({
  apiCall: () => authorsApi.getAll(),
  schema: authorsResponseSchema,
  onSuccess: (data) => console.log('Autores cargados:', data.length),
  onError: (error) => console.error('Error:', error)
});
```

## 🎨 Sistema de Dashboard

### Arquitectura del Dashboard

El dashboard implementa un sistema **configuration-driven** que elimina duplicación:

#### 1. **Hook Centralizado**
```typescript
// src/hooks/useDashboard.ts
export function useDashboard<T>(config: DashboardConfig<T>) {
  // Maneja todo: CRUD, búsqueda, paginación, filtros
  return {
    data, loading, error,
    pagination, search, filters,
    handleCreate, handleUpdate, handleDelete
  };
}
```

#### 2. **Configuración por Módulo**
```typescript
// src/config/dashboard/authors.config.ts
export const authorsConfig: DashboardConfig = {
  entityName: 'authors',
  displayName: 'Autores',
  capabilities: {
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canFilter: true,
    canSearch: true,
    canAdvancedSearch: true,
    canExport: true
  },
  columns: [
    { key: 'name', label: 'Nombre', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'booksCount', label: 'Libros', render: (value) => String(value || 0) }
  ],
  searchFields: ['name', 'email', 'biography'],
  filterOptions: {
    isActive: { type: 'boolean', label: 'Estado' },
    createdAt: { type: 'dateRange', label: 'Fecha de creación' }
  }
};
```

#### 3. **Módulos Disponibles**

| Módulo | Funcionalidades | Permisos |
|--------|----------------|----------|
| **Autores** | CRUD completo, búsqueda avanzada, exportación | Todos los usuarios |
| **Libros** | CRUD con validaciones ISBN, gestión género/editorial | Todos los usuarios |
| **Géneros** | CRUD simple, verificación de libros asociados | Todos los usuarios |
| **Editoriales** | CRUD simple, verificación de libros asociados | Todos los usuarios |
| **Movimientos** | Movimientos de stock, reportes | Todos los usuarios |
| **Usuarios** | CRUD con validaciones de roles | Solo ADMIN |
| **Auditoría** | Solo lectura, búsqueda avanzada | Solo ADMIN |

### Funcionalidades del Dashboard

#### **Búsqueda y Filtrado**
- Búsqueda rápida por texto
- Búsqueda avanzada por campos específicos
- Filtros por fechas, estado, categorías
- Combinación de múltiples filtros

#### **Gestión de Datos**
- Paginación automática
- Ordenamiento por columnas
- Operaciones CRUD con validación
- Manejo de errores contextual

#### **Experiencia de Usuario**
- Loading states durante operaciones
- Mensajes de éxito/error
- Navegación intuitiva entre módulos
- Diseño responsive

## 🔐 Seguridad y Autenticación

### Sistema de Autenticación

```typescript
// Flujo de autenticación
1. Login → JWT storage en localStorage
2. ApiClient → Auto-inclusión de Authorization header
3. Middleware → Verificación de rutas protegidas
4. Redirects → Login automático si token expira
```

### Roles y Permisos

- **USER**: Acceso a módulos básicos (Autores, Libros, Géneros, Editoriales, Movimientos)
- **ADMIN**: Acceso completo incluyendo Usuarios y Auditoría

### Validación de Datos

```typescript
// Validación client-side con Zod
const authorSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  biography: z.string().optional(),
  isActive: z.boolean()
});
```

## 🐳 Docker Configuration

### Desarrollo con Docker

```yaml
# docker-compose.yml para desarrollo
services:
  web:
    build: .
    ports:
      - "3001:3001"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_API_URL=http://host.docker.internal:3000/api
```

### Producción

```dockerfile
# Dockerfile multi-stage para optimización
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Solución de Problemas

### Problemas Comunes

1. **Error de Conexión a la API**
   ```bash
   Error: fetch failed connecting to http://localhost:3000
   ```
   **Solución**: Asegúrate de que la API esté ejecutándose en puerto 3000

2. **Puerto Ya en Uso**
   ```bash
   Error: Port 3001 is already in use
   ```
   **Solución**: Cambia el puerto en `.env` o detén el servicio que usa el puerto

3. **Variables de Entorno No Cargadas**
   ```bash
   Error: NEXT_PUBLIC_API_URL is not defined
   ```
   **Solución**: Verifica que el archivo `.env` esté en la raíz y reinicia el servidor

4. **Problemas de Hot Reload en Docker**
   ```bash
   Changes not reflected in browser
   ```
   **Solución**: Verifica que los volúmenes estén correctamente montados

### Comandos de Diagnóstico

```bash
# Verificar estado de la aplicación
npm run dev  # ¿Inicia correctamente?
curl http://localhost:3001  # ¿Responde la aplicación?
curl http://localhost:3001/api/health  # ¿Funciona el proxy?

# Verificar variables de entorno
node -e "console.log(process.env.NEXT_PUBLIC_API_URL)"

# Verificar dependencias
npm list  # Ver dependencias instaladas
npm outdated  # Ver dependencias obsoletas

# Limpiar cache
rm -rf .next node_modules
npm install
npm run dev
```

### Logs y Debugging

```bash
# Ver logs detallados de Next.js
DEBUG=* npm run dev

# Logs de Docker
npm run docker:logs

# Inspeccionar red de Docker
docker network inspect book-store-web_default
```

## Variables de Entorno

### Variables Requeridas

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3001

# Server Configuration
PORT=3001
NODE_ENV=development

# Docker Configuration (si usas Docker)
DOCKER_WEB_PORT=3001
DOCKER_API_HOST=host.docker.internal
```

### Variables Opcionales

```env
# Analytics (futuro)
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# Feature Flags (futuro)
ENABLE_EXPERIMENTAL_FEATURES=false

# Debug
DEBUG=book-store:*
```

## Desarrollo y Contribución

### Estándares de Código

#### **TypeScript Configuration**
- Strict mode habilitado con relajaciones selectivas
- Path aliases configurados (`@/`, `@/components/`, etc.)
- Integración optimizada con Next.js

#### **ESLint Configuration**
- Configuración recomendada de Next.js con TypeScript
- Reglas de Core Web Vitals habilitadas
- Ignora archivos de build y generados

#### **Patrones de Desarrollo**
1. **Componentes Cliente**: Usar directiva 'use client' para componentes interactivos
2. **Componentes Servidor**: Por defecto para contenido estático
3. **Hooks Personalizados**: useApiRequest para llamadas API con validación
4. **Gestión de Errores**: Implementar interfaz `ApiError` consistente

### Flujo de Desarrollo

```bash
# 1. Clonar y configurar
git clone <repository>
cd book-store-web
npm install
cp .env.example .env

# 2. Desarrollo local
npm run dev

# 3. Antes de commit
npm run lint
npm test
npm run build

# 4. Docker (opcional)
npm run docker:dev:build
```

### Estructura de Commits

```bash
# Convención de commits
feat: add new dashboard module for inventory
fix: resolve API proxy timeout issues
docs: update README with Docker instructions
refactor: optimize dashboard hook performance
test: add unit tests for authentication flow
```

## Información del Proyecto

- **Framework**: Next.js 15.5 con App Router
- **UI Library**: React 19.1 con features concurrentes
- **Language**: TypeScript 5 con strict mode
- **Styling**: TailwindCSS 4 utility-first
- **State Management**: Redux Toolkit
- **Validation**: Zod 4.1 con inferencia de tipos
- **Testing**: Jest 30 con Testing Library
- **Container Platform**: Docker con multi-stage builds
- **Development Server**: Next.js dev server con hot reload
- **Production Server**: Next.js optimized production build

### Rendimiento

- **Bundle Optimization**: Automática con Next.js
- **Code Splitting**: Por rutas y componentes
- **Image Optimization**: Next.js Image component
- **Static Generation**: Para páginas apropiadas
- **API Caching**: Cache inteligente de 15 minutos

### Arquitectura Destacada

- **Reducción de Código**: 91% menos duplicación con dashboard genérico
- **Type Safety**: Inferencia de tipos con Zod schemas
- **Error Handling**: Sistema centralizado de manejo de errores
- **Development Experience**: Hot reload, TypeScript, ESLint integrados

## Próximos Pasos

Una vez que tengas la aplicación funcionando:

1. **Explora el Dashboard**: Navega por todos los módulos disponibles
2. **Prueba las Funcionalidades**: CRUD, búsqueda, filtros en cada módulo
3. **Revisa la Documentación**: Cada hook y componente está documentado
4. **Contribuye**: El sistema genérico permite agregar módulos fácilmente

## Soporte

Si encuentras problemas:

1. Revisa los logs usando los comandos de arriba
2. Asegúrate de que la API esté ejecutándose en puerto 3000
3. Verifica que las variables de entorno estén configuradas correctamente
4. Consulta la sección de solución de problemas
5. Verifica que los puertos 3000 (API) y 3001 (Web) estén disponibles

---

¡Bienvenido a Book Store Web! 🚀📚
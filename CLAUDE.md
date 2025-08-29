# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.5 frontend application for a book store management system. The app is built with TypeScript, React 19, TailwindCSS 4, and Redux Toolkit, designed to work with a separate backend API. The application runs on port 3001 and includes Docker support for development and production environments.

## Development Commands

### Local Development
- `npm run dev` - Start development server on port 3001
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

### Docker Commands
- `npm run docker:dev` - Start development environment with docker-compose
- `npm run docker:dev:build` - Rebuild and start development environment
- `npm run docker:dev:detached` - Start development environment in background
- `npm run docker:down` - Stop all containers
- `npm run docker:down:clean` - Stop containers and clean volumes
- `npm run docker:logs` - View web container logs
- `npm run docker:shell` - Access web container shell
- `npm run docker:exec:build` - Build inside container
- `npm run docker:exec:lint` - Run lint inside container

## Architecture

### API Proxy Pattern
The application uses Next.js API routes as a proxy to the backend API:
- All API calls go through `/api/[...slug]/route.ts`
- The proxy forwards requests to backend at `NEXT_PUBLIC_API_URL` (default: http://host.docker.internal:3000/api)
- Handles GET, POST, PUT, DELETE methods
- Forwards authorization headers
- Provides error handling for backend connection issues

### State Management Architecture
- **Redux Toolkit** for global state management
- **Custom useApiRequest hook** for API calls with built-in loading, error states, and Zod validation
- **ApiClient class** centralized HTTP client with:
  - Automatic JWT token handling from localStorage
  - Unified error handling and normalization
  - Automatic response unwrapping and pagination structure normalization

### Validation System
- **Zod schemas** for runtime validation in `src/services/validation/schemas/`
- Schemas are organized by domain (auth, books, authors, etc.)
- Integration with useApiRequest hook for client-side validation
- Type inference from Zod schemas for TypeScript types

### Folder Structure
```
src/
├── app/                    # Next.js 15 App Router
│   ├── api/[...slug]/     # API proxy routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   └── ui/               # Base UI components
├── config/               # Configuration files
│   └── environment.ts    # Environment variables
├── hooks/                # Custom React hooks
│   └── useApiRequest.ts  # API request hook with validation
├── services/             # Business logic services
│   ├── api/              # API clients and entities
│   └── validation/       # Zod schemas and validation utilities
└── types/                # TypeScript type definitions
```

### Component Patterns
- **Client Components**: Use 'use client' directive for interactive components
- **Server Components**: Default for static content and layouts
- **Custom Hooks**: useApiRequest for API calls with validation and state management

## Testing

### Configuration
- **Jest** with Next.js integration
- **jsdom** environment for component testing
- **Testing Library** for React component testing
- Test files: `**/__tests__/**/*.{test,spec}.{js,tsx}` or `**/*.{test,spec}.{js,tsx}`

### Coverage
- Collects coverage from `src/**/*.{js,jsx,ts,tsx}`
- Excludes type definitions, stories, and index files
- Use `npm run test:coverage` to generate reports

## Environment Variables

### Required for Development
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://host.docker.internal:3000/api)
- `NEXT_PUBLIC_FRONTEND_URL` - Frontend URL for environment detection
- `PORT` - Server port (default: 3001)

### Docker Environment
- Development mode uses volume mounts for hot reload
- Production mode uses multi-stage builds with optimized Next.js output

## Code Standards

### TypeScript Configuration
- Strict mode enabled with selective relaxations (noImplicitAny: false)
- Path aliases configured for clean imports (@/, @/components/, @/services/, etc.)
- Next.js plugin for optimal TypeScript integration

### ESLint Configuration
- Next.js recommended configuration with TypeScript support
- Core Web Vitals rules enabled
- Ignores build artifacts and generated files

### API Integration Patterns
1. **Define Zod schemas** in `src/services/validation/schemas/`
2. **Create API entity interfaces** in `src/services/api/entities/`
3. **Use useApiRequest hook** with schema validation
4. **Handle loading, error, and success states** consistently
5. **Leverage automatic response normalization** in ApiClient

### Error Handling
- API errors implement `ApiError` interface with message, error, and statusCode
- Client-side validation errors provide field-specific feedback
- Backend connection errors are handled gracefully with retry options

## Key Dependencies

### Core
- **Next.js 15.5** - React framework with App Router
- **React 19.1** - Latest React with concurrent features
- **TypeScript 5** - Type safety and developer experience

### State & Data
- **@reduxjs/toolkit** - State management
- **Zod 4.1** - Runtime validation and type inference

### Styling
- **TailwindCSS 4** - Utility-first CSS framework

### Testing
- **Jest 30** - Testing framework
- **@testing-library/react** - Component testing utilities
- **@testing-library/jest-dom** - Custom Jest matchers
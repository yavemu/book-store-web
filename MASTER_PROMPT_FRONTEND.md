Next.js Frontend Master Prompt - Clean Architecture & Best Practices
INDEX_TAGS

<!-- ARCHITECTURE_OVERVIEW --><!-- PROJECT_STRUCTURE --><!-- CLEAN_ARCHITECTURE_PRINCIPLES --><!-- STATE_MANAGEMENT --><!-- COMPONENT_PATTERNS --><!-- STYLING_PATTERNS --><!-- API_COMMUNICATION --><!-- TESTING_PATTERNS --><!-- PERFORMANCE_PATTERNS --><!-- DEPLOYMENT_PATTERNS -->
<!-- ARCHITECTURE_OVERVIEW --> Architecture Overview

This is a Next.js application following Clean Architecture principles with clear separation of concerns:

Core Principles
Clean Architecture: Domain-driven design with dependency inversion

DRY (Don't Repeat Yourself): Extensive use of reusable components and utilities

SOLID Principles: Applied to frontend components and services

Separation of Concerns: Each layer has distinct responsibilities

Type Safety: Full TypeScript implementation with strict mode

Layer Structure
text
Pages → Components → Services → Hooks → State Management → API

<!-- PROJECT_STRUCTURE --> Project Structure

text
src/
├── app/ # Next.js App Router (if using)
│ ├── [routes]/
│ │ ├── page.tsx
│ │ ├── loading.tsx
│ │ └── error.tsx
│ └── globals.css
├── components/ # Reusable UI components
│ ├── ui/ # Basic UI components (Button, Input, etc.)
│ │ ├── Button/
│ │ │ ├── Button.tsx
│ │ │ ├── Button.test.tsx
│ │ │ └── index.ts
│ │ └── index.ts
│ ├── forms/ # Form components
│ ├── layout/ # Layout components
│ └── domain/ # Domain-specific components
├── hooks/ # Custom React hooks
│ ├── useApi.ts
│ ├── useLocalStorage.ts
│ └── index.ts
├── services/ # Business logic and API services
│ ├── api/ # API clients and endpoints
│ │ ├── client.ts
│ │ ├── entities/ # Entity-specific API calls
│ │ └── index.ts
│ ├── validation/ # Validation services
│ └── index.ts
├── stores/ # State management (Zustand/Redux)
│ ├── slices/
│ └── index.ts
├── types/ # TypeScript type definitions
│ ├── domain/ # Domain-specific types
│ ├── api/ # API response types
│ └── index.ts
├── utils/ # Utility functions
│ ├── formatters.ts
│ ├── validators.ts
│ └── index.ts
├── styles/ # Global styles and themes
│ ├── globals.css
│ ├── variables.css
│ └── components/ # Component-specific styles
├── constants/ # Application constants
└── config/ # Application configuration

<!-- CLEAN_ARCHITECTURE_PRINCIPLES --> Clean Architecture Principles

Dependency Flow
text
Pages → Components → Services/Hooks → State Management → API
Responsibility Separation
Pages (Routing Layer)
ONLY handle routing and page composition

NEVER contain business logic

ALWAYS use components and services

Handle loading and error states

typescript
// app/entities/page.tsx
export default function EntitiesPage() {
const { data, loading, error } = useEntities();

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;

return (
<Layout>
<EntityList entities={data} />
</Layout>
);
}
Components (Presentation Layer)
ONLY handle UI presentation

NEVER contain API calls or business logic

Receive data and callbacks via props

Are highly reusable and testable

typescript
// components/domain/EntityList.tsx
interface EntityListProps {
entities: Entity[];
onEntityClick: (entity: Entity) => void;
isLoading?: boolean;
}

export const EntityList: React.FC<EntityListProps> = ({
entities,
onEntityClick,
isLoading = false
}) => {
if (isLoading) return <SkeletonList />;

return (
<div className="entity-list">
{entities.map(entity => (
<EntityCard
key={entity.id}
entity={entity}
onClick={() => onEntityClick(entity)}
/>
))}
</div>
);
};
Services (Application Layer)
Contain business logic

Handle API communication

Transform data between API and UI formats

typescript
// services/api/entities.ts
export const entityService = {
getAll: async (filters?: EntityFilters): Promise<Entity[]> => {
const response = await apiClient.get<ApiResponse<Entity[]>>('/entities', { params: filters });
return response.data.data;
},

create: async (entityData: CreateEntityDto): Promise<Entity> => {
const response = await apiClient.post<ApiResponse<Entity>>('/entities', entityData);
return response.data.data;
}
};
Hooks (Bridge Layer)
Connect components to services and state

Handle side effects

Provide clean interfaces to components

typescript
// hooks/useEntities.ts
export const useEntities = (filters?: EntityFilters) => {
const [entities, setEntities] = useState<Entity[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<Error | null>(null);

useEffect(() => {
const fetchEntities = async () => {
try {
setLoading(true);
const data = await entityService.getAll(filters);
setEntities(data);
} catch (err) {
setError(err as Error);
} finally {
setLoading(false);
}
};

    fetchEntities();

}, [filters]);

return { entities, loading, error };
};

<!-- STATE_MANAGEMENT --> State Management Patterns

Zustand for Global State
typescript
// stores/entities.ts
import { create } from 'zustand';

interface EntityState {
entities: Entity[];
selectedEntity: Entity | null;
loading: boolean;
error: string | null;
actions: {
fetchEntities: (filters?: EntityFilters) => Promise<void>;
selectEntity: (entity: Entity) => void;
clearError: () => void;
};
}

export const useEntityStore = create<EntityState>((set, get) => ({
entities: [],
selectedEntity: null,
loading: false,
error: null,
actions: {
fetchEntities: async (filters) => {
set({ loading: true, error: null });
try {
const entities = await entityService.getAll(filters);
set({ entities, loading: false });
} catch (error) {
set({ error: (error as Error).message, loading: false });
}
},
selectEntity: (entity) => set({ selectedEntity: entity }),
clearError: () => set({ error: null }),
},
}));

// Hook to access only actions (prevents unnecessary re-renders)
export const useEntityActions = () => useEntityStore(state => state.actions);
React Query for Server State
typescript
// hooks/useEntitiesQuery.ts
export const useEntitiesQuery = (filters?: EntityFilters) => {
return useQuery({
queryKey: ['entities', filters],
queryFn: () => entityService.getAll(filters),
staleTime: 5 _ 60 _ 1000, // 5 minutes
});
};

<!-- COMPONENT_PATTERNS --> Component Patterns

Component Design Principles

1. Atomic Design Structure
   text
   Atoms → Molecules → Organisms → Templates → Pages
2. Compound Components
   typescript
   // components/ui/Accordion.tsx
   interface AccordionContextType {
   openIndex: number | null;
   setOpenIndex: (index: number | null) => void;
   }

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

export const Accordion: React.FC<{ children: ReactNode }> & {
Item: typeof AccordionItem;
Trigger: typeof AccordionTrigger;
Content: typeof AccordionContent;
} = ({ children }) => {
const [openIndex, setOpenIndex] = useState<number | null>(null);

return (
<AccordionContext.Provider value={{ openIndex, setOpenIndex }}>
<div className="accordion">{children}</div>
</AccordionContext.Provider>
);
};

// Subcomponents
const AccordionItem: React.FC<{ children: ReactNode; index: number }> = ({ children, index }) => {
// Implementation
};

// Attach subcomponents
Accordion.Item = AccordionItem;
// ... other subcomponents 3. Higher-Order Components
typescript
// components/hoc/withErrorBoundary.tsx
const withErrorBoundary = <P extends object>(
WrappedComponent: React.ComponentType<P>
) => {
return (props: P) => (
<ErrorBoundary>
<WrappedComponent {...props} />
</ErrorBoundary>
);
};

<!-- STYLING_PATTERNS --> Styling Patterns

CSS-in-JS with Styled Components
typescript
// components/ui/Button.tsx
import styled from 'styled-components';

interface ButtonProps {
variant?: 'primary' | 'secondary';
size?: 'small' | 'medium' | 'large';
}

const StyledButton = styled.button<ButtonProps>`
background-color: ${props =>
props.variant === 'primary' ? props.theme.colors.primary : props.theme.colors.secondary};
padding: ${props => {
switch (props.size) {
case 'small': return '0.5rem 1rem';
case 'large': return '1rem 2rem';
default: return '0.75rem 1.5rem';
}
}};
border: none;
border-radius: 0.25rem;
cursor: pointer;
transition: background-color 0.2s;

&:hover {
background-color: ${props =>
props.variant === 'primary'
? props.theme.colors.primaryDark
: props.theme.colors.secondaryDark};
}
`;

export const Button: React.FC<ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
variant = 'primary',
size = 'medium',
children,
...props
}) => {
return (
<StyledButton variant={variant} size={size} {...props}>
{children}
</StyledButton>
);
};
CSS Modules for Component Scoping
typescript
// components/EntityCard.module.css
.card {
border: 1px solid #e0e0e0;
border-radius: 8px;
padding: 1rem;
margin-bottom: 1rem;
transition: box-shadow 0.2s;
}

.card:hover {
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.title {
font-size: 1.25rem;
margin-bottom: 0.5rem;
color: #333;
}

// components/EntityCard.tsx
import styles from './EntityCard.module.css';

export const EntityCard: React.FC<Entity> = ({ title, description }) => {
return (
<div className={styles.card}>
<h3 className={styles.title}>{title}</h3>
<p className={styles.description}>{description}</p>
</div>
);
};

<!-- API_COMMUNICATION --> API Communication Patterns

API Client Configuration
typescript
// services/api/client.ts
const apiClient = axios.create({
baseURL: process.env.NEXT_PUBLIC_API_URL,
timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
(config) => {
const token = localStorage.getItem('authToken');
if (token) {
config.headers.Authorization = `Bearer ${token}`;
}
return config;
},
(error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
(response) => response,
(error) => {
if (error.response?.status === 401) {
// Handle unauthorized
localStorage.removeItem('authToken');
window.location.href = '/login';
}
return Promise.reject(error);
}
);

export default apiClient;
React Query for Data Fetching
typescript
// hooks/useEntities.ts
export const useEntities = (filters?: EntityFilters) => {
return useQuery({
queryKey: ['entities', filters],
queryFn: () => entityService.getAll(filters),
staleTime: 5 _ 60 _ 1000, // 5 minutes
});
};

// hooks/useCreateEntity.ts
export const useCreateEntity = () => {
const queryClient = useQueryClient();

return useMutation({
mutationFn: entityService.create,
onSuccess: (newEntity) => {
// Update cache
queryClient.setQueryData<Entity[]>(['entities'], (old = []) => [...old, newEntity]);
},
});
};

<!-- TESTING_PATTERNS --> Testing Patterns

Testing Strategy
Unit Tests: Components, hooks, utilities

Integration Tests: Component interactions

E2E Tests: Critical user flows with Cypress

Mock Data: MSW for API mocking

Component Testing
typescript
// components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
it('renders with correct text', () => {
render(<Button>Click me</Button>);
expect(screen.getByText('Click me')).toBeInTheDocument();
});

it('calls onClick when clicked', () => {
const handleClick = jest.fn();
render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);

});
});
Hook Testing
typescript
// hooks/useCounter.test.ts
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
it('should increment counter', () => {
const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);

});
});
API Mocking with MSW
typescript
// src/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// src/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
rest.get('/api/entities', (req, res, ctx) => {
return res(
ctx.status(200),
ctx.json({
success: true,
data: mockEntities,
})
);
}),
];

<!-- PERFORMANCE_PATTERNS --> Performance Patterns

Code Splitting
typescript
// Lazy loading components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

const MyPage = () => {
return (
<Suspense fallback={<LoadingSpinner />}>
<HeavyComponent />
</Suspense>
);
};

// Dynamic imports
const DynamicForm = dynamic(() => import('./DynamicForm'), {
ssr: false,
loading: () => <LoadingSpinner />,
});
Memoization
typescript
// Memoized components
const ExpensiveComponent = memo(({ data }: { data: DataType }) => {
// Expensive rendering
return <div>{/_ render _/}</div>;
});

// Memoized calculations
const MyComponent = ({ items }: { items: Item[] }) => {
const expensiveValue = useMemo(() => {
return items.reduce((acc, item) => acc + item.value, 0);
}, [items]);

return <div>{expensiveValue}</div>;
};
Image Optimization
typescript
import Image from 'next/image';

const OptimizedImage = () => {
return (
<Image
src="/path/to/image.jpg"
alt="Description"
width={500}
height={300}
placeholder="blur"
blurDataURL="data:image/jpeg;base64,..."
priority={false} // Only for above-the-fold images
/>
);
};

<!-- DEPLOYMENT_PATTERNS --> Deployment Patterns

Environment Configuration
typescript
// config/environment.ts
export const environment = {
isProduction: process.env.NODE_ENV === 'production',
apiUrl: process.env.NEXT_PUBLIC_API_URL,
appVersion: process.env.NEXT_PUBLIC_APP_VERSION,
sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
};
Docker Configuration
dockerfile

# Dockerfile

FROM node:18-alpine AS base

# Dependencies stage

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Build stage

FROM base AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

# Production stage

FROM base AS production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "start"]
Next.js Configuration
javascript
// next.config.js
/\*_ @type {import('next').NextConfig} _/
const nextConfig = {
reactStrictMode: true,
swcMinify: true,
compiler: {
removeConsole: process.env.NODE_ENV === 'production',
},
images: {
domains: ['example.com'],
formats: ['image/webp', 'image/avif'],
},
experimental: {
optimizeCss: true,
},
};

module.exports = nextConfig;
IMPLEMENTATION CHECKLIST
For New Feature:
Create TypeScript interfaces

Implement API service

Create custom hooks

Build reusable components

Add proper error handling

Implement loading states

Write comprehensive tests

Add Storybook stories (if applicable)

Update documentation

For Component Creation:
Follow atomic design principles

Implement proper TypeScript typing

Add prop validation

Ensure accessibility compliance

Write unit tests

Add Storybook stories

Implement responsive design

For Performance Optimization:
Implement code splitting

Add memoization where needed

Optimize images and assets

Implement virtual scrolling for large lists

Use proper bundle analysis

For Testing:
Unit test all components

Test custom hooks

Test utility functions

Implement integration tests

Set up E2E tests for critical flows

For Deployment:
Configure environment variables

Set up CI/CD pipeline

Implement proper error tracking

Set up performance monitoring

Configure caching strategies

Implement proper security headers

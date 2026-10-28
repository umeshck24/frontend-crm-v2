# React Frontend Check24 Template

A modern React frontend template built for Check24 projects, featuring TypeScript, Tailwind CSS, and a comprehensive developer experience setup.

## 🚀 Tech Stack

### Core Framework

- **React 19.3.1** - Latest React with modern features
- **TypeScript 7.0** - Type-safe JavaScript development
- **Vite 8.3** - Fast build tool and development server

### Styling & UI

- **Tailwind CSS 4.3** - Utility-first CSS framework with Vite plugin
- **shadcn/ui** - Reusable component library
- **Base UI** - Unstyled accessible primitives (used instead of Radix)
- **Lucide React** - Icon library

### Routing & Data Fetching

- **React Router 8.5** - Declarative routing for React
- **TanStack Query 5.105** - Powerful data synchronization for React

### API Integration

- **@hey-api/openapi-ts** - Generates TypeScript types from the OpenAPI schema (types only, plugin `@hey-api/typescript`; pinned `@next` build for TypeScript 7 support). Requests go through the small typed `fetch` helper in `src/api/http.ts`.

### Development Tools

- **Oxlint 1.90** - Linting (replaces ESLint)
- **Oxfmt 0.75** - Formatting, import sorting and Tailwind class sorting (replaces Prettier)

Editor setup: VS Code/Cursor recommend the Oxc extension and use it as formatter on save (`.vscode/`). JetBrains IDEs declare the Oxc plugin in `.idea/externalDependencies.xml`; enable format on save in the plugin's Oxfmt settings. Run `pnpm install` first, the editors use the project's local binaries.

## 📁 Project Structure

```
src/
├── components/
│   └── ui/              # Reusable Atomic UI components (shadcn/ui)
│       ├── button/      # Button component with variants
│       └── input.tsx    # Input component
|       └── ... (basicaly other ui atomic components)
├── lib/
│   └── utils.ts         # Utility functions
├── pages/
│   └── home/            # Home page components
│       └── (-components)/ # Page-specific components
├── main.tsx             # Application entry point
├── index.css            # Global styles
└── vite-env.d.ts        # Vite type definitions
```

## 🛠 Available Scripts

```bash
# Development
pnpm dev          # Start development server

# Building
pnpm build        # Build for production (TypeScript + Vite)

# Code Quality
pnpm lint         # Run Oxlint
pnpm format       # Format with Oxfmt
pnpm format:check # Check formatting (CI)

# Preview
pnpm preview      # Preview production build

# API Generation
pnpm gen:api      # Generate API types from OpenAPI schema (needs VITE_API_SCHEMA_URL in .env)

# Testing
pnpm test         # Run tests with Vitest
```

## 🧪 Testing

This template uses **Vitest** with **React Testing Library** for comprehensive testing capabilities.

### Testing Stack

- **Vitest 5.0** - Fast unit test framework (Vite-native)
- **React Testing Library 16.3** - Simple and complete testing utilities
- **Jest DOM 7.0** - Custom Jest matchers for DOM assertions
- **jsdom 30.1** - DOM environment for Node.js testing
- **React Router Testing** - Built-in utilities for routing tests

### Running Tests

```bash
# Run all tests once
pnpm test
```

### Test Organization

Tests are organized using the `_test` folder convention within each page/component directory:

```
src/
├── pages/
│   └── home/
│       ├── _test/
│       │   └── home.test.tsx    # Tests for Home component
│       └── Home.tsx
├── components/
│   └── ui/
│       └── button/
│           ├── _test/
│           │   └── button.test.tsx
│           └── button.tsx
```

### Test Configuration

Testing is configured in `vite.config.ts` (`defineConfig` is imported from `vitest/config`; jest-dom matchers load via `@testing-library/jest-dom/vitest` in `src/test-setup.ts`):

```typescript
test: {
  globals: true,           // Global test functions (describe, it, expect)
  environment: "jsdom",    // Browser-like environment
  setupFiles: ["./src/test-setup.ts"], // Global setup
}
```

### Testing Best Practices

1. **Use data-testid attributes** for reliable element selection:

   ```tsx
   <button data-testid="submit-button">Submit</button>
   ```

2. **Test user interactions** with `@testing-library/user-event`:

   ```typescript
   import userEvent from "@testing-library/user-event";

   it("should handle click events", async () => {
     const user = userEvent.setup();
     render(<MyButton />);

     await user.click(screen.getByRole("button"));
     // Assert expected behavior
   });
   ```

3. **Mock API calls** for isolated testing:

   ```typescript
   import { vi } from "vitest";

   // Mock API function
   vi.mock("@/api/users", () => ({
     getUsers: vi.fn().mockResolvedValue([{ id: 1, name: "John" }]),
   }));
   ```

4. **Test accessibility** with built-in queries:

   ```typescript
   // Prefer semantic queries
   screen.getByRole("button", { name: /submit/i })
   screen.getByLabelText(/email address/i)
   screen.getByText(/welcome/i)
   ```

5. **Clean up after tests** (automatically handled by Testing Library):

   ```typescript
   import { cleanup } from "@testing-library/react";
   import { afterEach } from "vitest";

   afterEach(() => {
     cleanup(); // Usually automatic, but explicit when needed
   });
   ```

## 🚀 Getting Started

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.dist .env
   # Edit .env with your configuration
   ```

3. **Start development server:**

   ```bash
   pnpm dev
   ```

4. **Generate API types (if using OpenAPI):**
   ```bash
   pnpm gen:api
   ```

## 🎨 UI Components

This template uses **shadcn/ui** with the following configuration:

- **Style:** New York
- **Base Color:** Neutral
- **CSS Variables:** Enabled
- **Icon Library:** Lucide React

### Adding New Components

Use the shadcn/ui CLI to add new components:

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add dialog
```

## 📡 TanStack Query Usage

This template uses **TanStack Query 5.105** for server state management with specific organizational conventions.

### Query Organization Conventions

#### 1. Shared Query Hooks (`src/api/`)

Place **only** query hooks that need to be shared across multiple pages in the `src/api/` folder:

```typescript
// src/api/auth.ts
export const useCurrentUser = () => {
  return useQuery({
    queryKey: [QueryKeys.CURRENT_USER],
    queryFn: () => api.getCurrentUser(),
  });
};
```

#### 2. Page-Scoped Query Hooks

Keep page-specific query hooks **within the page directory** in a `(-hooks)/` folder or directly in the page file:

```typescript
// src/pages/dashboard/(-hooks)/useDashboardData.ts
export const useDashboardStats = () => {
  return useQuery({
    queryKey: [QueryKeys.DASHBOARD_STATS],
    queryFn: () => api.getDashboardStats(),
  });
};
```

#### 3. Query Keys Management

Maintain all query keys in a centralized `as const` object. Do not use `enum`: `erasableSyntaxOnly` is enabled in the tsconfig, which forbids it.

```typescript
// src/lib/queryKeys.ts
export const QueryKeys = {
  // Auth
  CURRENT_USER: 'currentUser',
  USER_PERMISSIONS: 'userPermissions',

  // Dashboard
  DASHBOARD_STATS: 'dashboardStats',
  DASHBOARD_CHARTS: 'dashboardCharts',

  // Products
  PRODUCTS_LIST: 'productsList',
  PRODUCT_DETAIL: 'productDetail',

  // Orders
  ORDERS_LIST: 'ordersList',
  ORDER_DETAIL: 'orderDetail',
} as const;
```

### Query Hook Examples

#### Shared Query Hook (src/api/)

```typescript
// src/api/auth.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/lib/queryKeys';
import { useParams } from 'react-router';

export const useCurrentUser = () => {
  const [userId] = useParams();
  return useQuery({
    queryKey: [QueryKeys.CURRENT_USER, userId],
    queryFn: () => api.getCurrentUser(),
  });
};

export const useLogout = ({userId}: {userId: string}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.logout(),
    onSuccess: () => {
      queryClient.invalidateQueries[QueryKeys.CURRENT_USER, userId]
    },
  });
};
```

#### Page-Scoped Query Hook

```typescript
// src/pages/products/(-hooks)/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '@/lib/queryKeys';

export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: [QueryKeys.PRODUCTS_LIST, filters],
    queryFn: () => api.getProducts(filters),
    enabled: !!filters,
  });
};

export const useProductDetail = (id: string) => {
  return useQuery({
    queryKey: [QueryKeys.PRODUCT_DETAIL, id],
    queryFn: () => api.getProduct(id),
    enabled: !!id,
  });
};
```

### Best Practices

1. **Naming Convention**: Use descriptive names prefixed with `use`
2. **Query Keys**: Always use the centralized `QueryKeys` enum
3. **Parameters**: Include dynamic parameters in the query key array
4. **Enabled Queries**: Use `enabled` option for conditional queries
5. **Error Handling**: Implement error boundaries or error states in components
6. **Loading States**: Handle loading states appropriately in your UI

### Query Client Setup

Ensure your app is wrapped with the QueryClient provider in `main.tsx`:

```typescript
// src/main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute default
      retry: 3,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
```

## 🔧 Configuration

### Path Aliases

The project uses TypeScript path aliases for cleaner imports:

- `@/components` → `src/components`
- `@/lib` → `src/lib`
- `@/utils` → `src/lib/utils`
- `@/ui` → `src/components/ui`
- `@/hooks` → `src/hooks`

### Tailwind CSS

Tailwind is configured with:

- CSS variables support
- Neutral base color scheme
- Custom component variants via `class-variance-authority`

### API Integration

- OpenAPI schema URL configured via `VITE_API_SCHEMA_URL` environment variable
- `pnpm gen:api` writes types to `src/api/crm` (config: `openapi-ts.config.mjs`). Never edit it by hand. `service-offer` gets its own folder later.
- Call the backend with `http` from `src/api/http.ts`, typed by the generated `*Data` type of the operation. The url, path params, query and body are checked; pass the response type yourself:

  ```typescript
  import type { CustomerOfferData, CustomerOfferResponses } from "@/api/crm";
  import { http } from "@/api/http";

  const offer = await http.get<CustomerOfferData, CustomerOfferResponses[200]>(
    "/api/crm/customer/{customerId}/offer/{offerId}",
    { path: { customerId, offerId } },
  );
  ```

  Failed responses throw `ApiError` (`status`, `body`). Wrap calls in TanStack Query hooks.
- Dev proxy (`vite.config.ts`): only `/api/crm` is proxied, to `VITE_SERVER_URL` (same settings as frontend-crm, including the `x-local` header). Add more backend paths there when a feature needs them.
- To generate only part of the API, add `parser: { filters: { tags: { include: ["some-tag"] } } }` to the config; schemas used by those operations are kept

## 📦 Key Dependencies

| Category       | Package                 | Purpose           |
| -------------- | ----------------------- | ----------------- |
| **Core**       | React, TypeScript, Vite | Foundation        |
| **Styling**    | Tailwind CSS, Base UI   | UI & Design       |
| **Components** | shadcn/ui, Lucide React | Component Library |
| **Routing**    | React Router            | Navigation        |
| **Data**       | TanStack Query          | Server State      |
| **API**        | @hey-api/openapi-ts     | Generated types   |
| **Testing**    | Vitest                  | Unit Tests        |
| **Dev Tools**  | Oxlint, Oxfmt           | Code Quality      |

## 🌟 Features

- ⚡ **Fast Development** - Vite HMR with React Refresh
- 🎨 **Modern UI** - Tailwind CSS + shadcn/ui components
- 🔒 **Type Safety** - Full TypeScript coverage
- 🎯 **Developer Experience** - Oxlint + Oxfmt + organized imports
- 📱 **Responsive** - Mobile-first design approach
- 🚀 **Production Ready** - Optimized build configuration
- 🔌 **API Ready** - OpenAPI integration with type generation

## 🤝 Contributing

1. Follow the established code style (Oxlint + Oxfmt, run `pnpm lint` and `pnpm format`)
2. Use TypeScript for all new code
3. Follow the component structure in `src/components/ui/`
4. Update this README when adding major dependencies or features

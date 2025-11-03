# Ingaa Baby Products E-commerce

## Overview

Ingaa is a premium e-commerce platform for baby products built with a modern tech stack. The application features a full-featured online store with product browsing, cart management, wishlist functionality, order processing, and an admin dashboard for managing inventory and orders. The platform emphasizes safety, trust, and parent-friendly design with a warm, nurturing aesthetic inspired by premium baby retailers like Babylist and The Honest Company.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Routing**
- React with TypeScript for type-safe component development
- Wouter for lightweight client-side routing
- Vite as the build tool and development server with HMR support

**UI Component System**
- Shadcn/ui component library (New York style) with Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Component composition using Radix UI headless components for accessibility
- Custom design system with rounded, friendly typography (Quicksand/Nunito primary, Inter/Open Sans secondary)

**State Management**
- TanStack Query (React Query) for server state management and caching
- Query client configured with strict refetch policies (no automatic refetching, infinite stale time)
- Session-based authentication state via `/api/auth/user` endpoint

**Design Philosophy**
- Nurturing & Safe aesthetic with warm colors and rounded corners
- Trust-first approach with prominent safety certifications and reviews
- Mobile-first responsive design with specific breakpoints (md: 768px, lg: 1024px, xl: 1280px)
- Consistent spacing system based on multiples of 4 (2, 4, 8, 12, 16, 24)

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for the API layer
- Session-based authentication using express-session with PostgreSQL session store (connect-pg-simple)
- Custom middleware for request logging and JSON body parsing

**Database Layer**
- Drizzle ORM for type-safe database operations
- Neon serverless PostgreSQL as the database provider
- WebSocket support for serverless database connections
- Schema-first design with Zod validation schemas generated from Drizzle tables

**Data Model**
The application follows a relational e-commerce pattern:
- **Users**: Core user table with admin flag, integrated with session storage
- **Categories**: Hierarchical product categorization with slugs for routing
- **Products**: Rich product data including pricing, inventory, images, certifications, and features
- **Reviews**: Product reviews with ratings linked to users and products
- **Orders**: Order management with status tracking and shipping information
- **OrderItems**: Line items for orders with pricing snapshots
- **CartItems**: Temporary shopping cart storage per user
- **WishlistItems**: User wishlist functionality
- **Sessions**: PostgreSQL-backed session storage (required for authentication)

**Authentication Strategy**
- Session-based authentication (likely using Replit Auth based on session table structure)
- Protected routes using `requireAuth` and `requireAdmin` middleware
- User context available on Express Request object via TypeScript declaration merging

**API Design**
- RESTful API endpoints with consistent patterns:
  - GET for retrieval
  - POST for creation
  - PUT for updates
  - DELETE for removal
- Centralized error handling with appropriate HTTP status codes
- Response logging for API endpoints only (paths starting with `/api`)

### External Dependencies

**Payment Processing**
- Stripe integration via `@stripe/stripe-js` and `@stripe/react-stripe-js` for card payments
- PayPal SDK (`@paypal/paypal-server-sdk`) for alternative payment method
- Dual payment method support in checkout flow

**Database & Storage**
- Neon serverless PostgreSQL (`@neondatabase/serverless`) for database hosting
- PostgreSQL session store (`connect-pg-simple`) for session persistence
- Drizzle ORM (`drizzle-orm`) for database queries and migrations

**Authentication**
- Session-based authentication (infrastructure in place for Replit Auth or similar)
- OpenID Connect client (`openid-client`) dependency suggests OAuth/OIDC integration capability

**UI Component Libraries**
- Radix UI primitives for accessible component foundations (@radix-ui/react-*)
- Lucide React for iconography
- Tailwind CSS for styling utilities
- Class Variance Authority (CVA) for component variant management

**Development Tools**
- Replit-specific plugins for development experience:
  - `@replit/vite-plugin-runtime-error-modal` for error overlay
  - `@replit/vite-plugin-cartographer` for code navigation
  - `@replit/vite-plugin-dev-banner` for development environment indicator
- TypeScript for type safety across client and server
- ESBuild for server-side bundling in production

**Form Handling**
- React Hook Form for form state management
- Hookform Resolvers for validation integration
- Zod schemas (generated from Drizzle tables) for runtime validation
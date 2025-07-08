# RestaurantPro - Restaurant Management System

## Overview

RestaurantPro is a modern full-stack restaurant management system built with React, Express.js, and PostgreSQL. The application provides comprehensive functionality for managing restaurant operations including orders, tables, menu items, inventory, staff, and customer data. It features a responsive web interface with real-time updates and a clean, intuitive design.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with shadcn/ui styling system
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Pattern**: RESTful API with JSON responses
- **Middleware**: Express middleware for logging, JSON parsing, and error handling

### Project Structure
```
├── client/          # React frontend application
├── server/          # Express.js backend server
├── shared/          # Shared types and schemas
├── migrations/      # Database migration files
└── dist/           # Built application (production)
```

## Key Components

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Centralized schema definitions in `shared/schema.ts`
- **Tables**: users, menu_items, tables, orders, inventory, staff, customers, sales
- **Migrations**: Automated database schema management with drizzle-kit

### API Layer
- **Route Structure**: Organized RESTful endpoints by resource
- **Validation**: Zod schema validation for request/response data
- **Error Handling**: Centralized error handling middleware
- **Logging**: Request/response logging with timing information

### Frontend Features
- **Dashboard**: Real-time statistics and overview
- **Order Management**: Create, update, and track orders
- **Table Management**: Visual table layout with status tracking
- **Menu Management**: CRUD operations for menu items
- **Inventory Tracking**: Stock levels and low-stock alerts
- **Staff Management**: Employee data and scheduling
- **Customer Management**: Customer profiles and preferences
- **Reports**: Sales analytics and performance metrics

### UI/UX Architecture
- **Design System**: Consistent component library with shadcn/ui
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: ARIA-compliant components from Radix UI
- **Theme System**: CSS variables for light/dark mode support
- **Toast Notifications**: User feedback for actions and errors

## Data Flow

### Client-Server Communication
1. **Frontend**: React components trigger API calls through TanStack Query
2. **API Layer**: Express routes handle requests, validate data, and interact with database
3. **Database**: Drizzle ORM executes type-safe queries against PostgreSQL
4. **Response**: Data flows back through the same pipeline with proper error handling

### State Management
- **Server State**: Managed by TanStack Query with caching and synchronization
- **Client State**: Local React state for UI interactions
- **Form State**: React Hook Form for form handling and validation
- **Global State**: Context API for theme and user preferences

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Data fetching and caching
- **@radix-ui/react-***: Unstyled, accessible UI primitives
- **react-hook-form**: Form handling and validation
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Runtime type validation
- **tailwindcss**: Utility-first CSS framework

### Development Dependencies
- **vite**: Fast build tool and development server
- **typescript**: Static type checking
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production

### UI Dependencies
- **lucide-react**: Icon library
- **class-variance-authority**: Type-safe variant API
- **clsx**: Conditional class names utility
- **tailwind-merge**: Tailwind CSS class merging

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite HMR for instant updates
- **Type Checking**: Real-time TypeScript compilation
- **Database**: Local or cloud PostgreSQL instance
- **Environment**: NODE_ENV=development

### Production Build
- **Frontend**: Vite builds optimized static assets
- **Backend**: esbuild bundles server code for Node.js
- **Database**: Production PostgreSQL with connection pooling
- **Static Files**: Served by Express in production mode

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string
- **NODE_ENV**: Environment mode (development/production)
- **Port Configuration**: Configurable server port

## Changelog

- July 07, 2025. Initial setup
- July 07, 2025. Preparação completa para deploy no Vercel - APIs serverless, banco PostgreSQL, build configurado
- July 08, 2025. Correção do erro de build no Vercel - buildCommand alterado para 'vite build'
- July 08, 2025. Consolidação das APIs serverless: 15 funções → 1 função única (api/index.ts)
- July 08, 2025. Correção do erro 500 ao criar pedidos - API otimizada para serverless, removidas dependências problemáticas
- July 08, 2025. Interface melhorada para criação de pedidos - formulário visual em vez de JSON manual
- July 08, 2025. Migrações do banco criadas - Schema completo com 8 tabelas prontas para Neon Database
- July 08, 2025. Conexão com Neon Database configurada e testada - API funcionando localmente
- July 08, 2025. Corrigido problema de import do schema para Vercel - API totalmente independente
- July 08, 2025. MIGRAÇÃO NEON DATABASE CONCLUÍDA - Sistema local e Vercel usando banco PostgreSQL real

## User Preferences

Preferred communication style: Simple, everyday language.

## Deployment Status

✅ **PRONTO PARA DEPLOY NO VERCEL - 100% INDEPENDENTE DO REPLIT**

- APIs serverless criadas em `/api/` com DatabaseStorage
- Banco PostgreSQL configurado e funcionando (testado)
- DatabaseStorage implementado para produção
- `vercel.json` e configurações de build prontas
- Environment variables mapeadas
- Frontend otimizado para deploy estático
- Dependências do Replit removidas das APIs de produção
- Projeto testado e funcionando localmente

**Status:** ✅ **MIGRAÇÃO NEON DATABASE COMPLETA - SISTEMA TOTALMENTE FUNCIONAL**

**Próximo passo:** Deploy no Vercel seguindo instruções no `README.vercel.md`
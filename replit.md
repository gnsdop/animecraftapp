# replit.md

## Overview

This is a full-stack web application for an anime papercraft catalog called "AnimeCraft". The application allows users to browse anime collections, view character models, and download papercraft PDFs. It's built with a React frontend using modern UI components and an Express.js backend with PostgreSQL database integration.

## User Preferences

Preferred communication style: Simple, everyday language.
Visual theme: Red and black color scheme with black background.
Logo: https://i.imgur.com/miRWpec.png

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Simple email/password authentication with localStorage
- **API Design**: RESTful API endpoints
- **Development**: Hot reload with Vite integration

### Key Components

#### Authentication System
- Simple login system accepting any valid email/password combination
- Client-side authentication state management
- LocalStorage for session persistence
- Protected routes using custom ProtectedRoute component

#### Database Schema
- **Users**: Basic user information (id, email, password)
- **Animes**: Anime collections (id, name, model_count, image_url)
- **Characters**: Individual character models (id, anime_id, name, image_url, pdf_url, video_url)

#### UI Components
- Responsive design with mobile-first approach
- Custom anime and character card components
- Header with navigation and logout functionality
- Search functionality for anime catalog
- Loading states and error handling

### Data Flow

1. **Authentication Flow**: User logs in → credentials validated → user stored in localStorage → auth state updated
2. **Catalog Flow**: Load animes → display in grid → filter by search → navigate to sub-catalog
3. **Character Flow**: Select anime → load characters → display character grid → navigate to product page
4. **Download Flow**: View character details → trigger download → serve PDF file

### External Dependencies

#### Frontend Dependencies
- **UI Framework**: React, Radix UI components
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **State Management**: TanStack React Query
- **Routing**: Wouter
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Utilities**: date-fns for date handling

#### Backend Dependencies
- **Database**: Drizzle ORM with @neondatabase/serverless
- **Validation**: Zod for schema validation
- **Development**: tsx for TypeScript execution

### Deployment Strategy

- **Development**: Vite dev server with Express backend
- **Production Build**: 
  - Frontend: Vite build to `dist/public`
  - Backend: esbuild bundle to `dist/index.js`
- **Database**: PostgreSQL (configured for Neon serverless)
- **Static Assets**: Served from Express in production
- **Environment**: Node.js with ES modules

#### Build Scripts
- `dev`: Development mode with hot reload
- `build`: Production build for both frontend and backend
- `start`: Production server
- `db:push`: Database schema migration

#### Configuration Files
- **Vite**: Custom configuration with path aliases and Replit integration
- **TypeScript**: Shared configuration for client, server, and shared code
- **Tailwind**: Custom theme with CSS variables
- **Drizzle**: PostgreSQL configuration with migration support

The application follows a monorepo structure with clear separation between client, server, and shared code, making it easy to maintain and scale.
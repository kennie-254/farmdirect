# Overview

This is a farm-to-table marketplace application called "Farm Direct" that connects local farmers with consumers. The platform enables farmers to list their products (vegetables, fruits, dairy, meat, etc.) and allows customers to browse, search, and purchase fresh produce directly from local farms. The application features user authentication, product catalogs, farmer profiles, order management, and a responsive web interface built with modern React and Node.js technologies.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: shadcn/ui component library built on top of Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Authentication**: Firebase Authentication for user management

## Backend Architecture
- **Runtime**: Node.js with Express.js REST API
- **Database**: PostgreSQL with Drizzle ORM for type-safe database queries
- **Database Provider**: Neon serverless PostgreSQL
- **API Design**: RESTful endpoints organized by resource (products, farmers, categories, orders, reviews)
- **Development**: Hot module replacement with Vite middleware in development mode

## Data Model
The application uses a relational database schema with the following core entities:
- **Users**: Basic user information with farmer flag
- **Farmers**: Extended profile information for users who are farmers
- **Categories**: Product categorization (vegetables, fruits, dairy, etc.)
- **Products**: Items for sale with pricing, descriptions, and availability
- **Orders**: Purchase records with status tracking
- **Order Items**: Line items within orders
- **Reviews**: Product and farmer ratings and feedback

## Key Features
- **Product Discovery**: Browse by category, search, and featured product listings
- **Farmer Profiles**: Detailed farmer information with product listings and ratings
- **Shopping Cart**: Add products to cart with quantity management
- **Order Management**: Track order status and history
- **Authentication**: Sign up/sign in with email and password
- **Responsive Design**: Mobile-first responsive layout

## Design Patterns
- **Component Composition**: Reusable UI components with consistent prop interfaces
- **Custom Hooks**: Encapsulated logic for authentication, mobile detection, and toasts
- **Type Safety**: End-to-end TypeScript with shared schema definitions
- **Error Handling**: Centralized error handling with user-friendly toast notifications

# External Dependencies

## Database
- **Neon**: Serverless PostgreSQL database hosting
- **Drizzle ORM**: Type-safe database toolkit with schema migrations

## Authentication
- **Firebase Auth**: User authentication and session management
- Environment variables required: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`

## UI Framework
- **Radix UI**: Unstyled, accessible UI primitives for components
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography

## Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind and Autoprefixer

## Runtime Environment
- Environment variable required: `DATABASE_URL` for PostgreSQL connection
- Development uses tsx for TypeScript execution
- Production builds to ESM modules for Node.js deployment
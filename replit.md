# RJ Motorworld - Car Dealership Platform

## Overview

RJ Motorworld is a comprehensive full-stack car dealership website that enables customers to browse, search, and inquire about vehicles while providing administrators with complete inventory management capabilities. The platform serves both public users looking to buy or sell cars and admin users managing the dealership's operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and modern component development
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: Custom component library built on Radix UI primitives with Tailwind CSS styling
- **Form Handling**: React Hook Form with Zod validation for robust form management
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety across the entire stack
- **API Design**: RESTful API architecture with consistent endpoint patterns
- **Authentication**: JWT-based authentication system with access and refresh tokens
- **File Handling**: ImageKit integration for optimized image storage and delivery
- **Email Service**: EmailJS integration for customer inquiry notifications

### Database Design
- **Primary Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Fallback Storage**: In-memory storage system when database connection fails
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Neon serverless PostgreSQL for production deployment

### Key Data Models
- **Cars**: Comprehensive vehicle listings with specifications, images, and metadata
- **Car Brands/Models**: Normalized brand and model data for filtering
- **Sell Inquiries**: Customer submissions for selling vehicles
- **Users**: Admin user management with role-based access

### Authentication & Authorization
- **Admin Access**: JWT token-based authentication with role verification
- **Session Management**: Access tokens with refresh token rotation
- **Route Protection**: Middleware-based route protection for admin endpoints
- **Security**: Environment variable-based secrets and CORS configuration

### Image Management
- **Storage**: ImageKit CDN for optimized image delivery
- **Upload Pipeline**: Base64 encoding with backend proxy for secure uploads
- **Optimization**: Automatic image resizing and format optimization
- **Fallback**: Graceful degradation with placeholder images

### Form Processing
- **Multi-step Forms**: Complex sell-your-car form with progressive validation
- **Validation**: Zod schemas for client and server-side validation
- **Error Handling**: Comprehensive error states and user feedback
- **Data Flow**: Form data processing through validated API endpoints

## External Dependencies

### Core Infrastructure
- **Database**: PostgreSQL via Neon serverless platform
- **Image CDN**: ImageKit for image storage, optimization, and delivery
- **Email Service**: EmailJS for automated email notifications
- **Hosting**: Vercel for frontend deployment with serverless API functions

### Development Tools
- **Package Manager**: npm with lockfile for dependency management
- **Build System**: Vite with TypeScript compilation and asset optimization
- **CSS Framework**: Tailwind CSS with custom design system
- **Code Quality**: TypeScript for static typing across the entire stack

### Third-party Integrations
- **UI Components**: Radix UI for accessible, unstyled component primitives
- **Icons**: Lucide React for consistent iconography
- **Fonts**: Google Fonts (Inter and Lato) for typography
- **Maps/Location**: Integration points for location-based features
- **Communication**: WhatsApp and phone call integration for customer contact

### API Dependencies
- **ImageKit API**: For image upload, transformation, and delivery
- **EmailJS API**: For sending inquiry notifications to administrators
- **Database API**: Neon PostgreSQL connection for data persistence
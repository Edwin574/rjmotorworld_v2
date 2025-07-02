# RJ Motorworld - Car Dealership Platform

## Overview

RJ Motorworld is a full-stack car dealership website built with a React frontend, Express backend, and PostgreSQL database. The platform allows customers to browse and search for cars while providing administrative capabilities for managing inventory and customer inquiries.

## System Architecture

### Technology Stack
- **Frontend**: React with TypeScript, Vite, Tailwind CSS, Radix UI components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Image Storage**: ImageKit integration for car images
- **Email Service**: EmailJS for customer inquiries
- **Authentication**: Simple hardcoded admin credentials

### Database Architecture
The system uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The schema includes:
- Car listings with comprehensive details (make, model, year, price, images, etc.)
- Sell inquiry submissions from customers
- Car brands and models for filtering
- User management for admin access

A fallback in-memory storage system is implemented when MongoDB connection fails, ensuring the application remains functional.

## Key Components

### Frontend Architecture
- **React Router**: Uses Wouter for client-side routing
- **State Management**: React Query (TanStack Query) for server state management
- **UI Framework**: Custom component library built with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **API Layer**: RESTful API with Express.js
- **Database Layer**: Drizzle ORM with PostgreSQL
- **File Upload**: ImageKit integration for car image management
- **Email Service**: EmailJS for customer inquiry notifications
- **Authentication**: Header-based authentication for admin routes

### Admin Dashboard
- Protected admin area with hardcoded credentials
- CRUD operations for car listings
- Sell inquiry management
- Image upload capabilities

## Data Flow

### Customer Journey
1. **Browse Cars**: Customers can view cars on homepage, filter by condition (new/used), and search
2. **Car Details**: Individual car pages with image carousels and WhatsApp inquiry buttons
3. **Sell Car**: Multi-step form for customers to submit sell requests
4. **Contact**: Static contact and about pages

### Admin Workflow
1. **Authentication**: Login with hardcoded credentials stored in environment variables
2. **Car Management**: Add, edit, delete car listings with image uploads
3. **Inquiry Management**: Review and manage customer sell requests
4. **Dashboard**: Overview of system statistics

### Data Processing
- Form submissions validated with Zod schemas
- Images processed through ImageKit API
- Email notifications sent via EmailJS
- Database operations handled through Drizzle ORM

## External Dependencies

### Core Services
- **ImageKit**: Cloud-based image storage and optimization
- **EmailJS**: Email service for customer inquiries
- **Neon Database**: PostgreSQL hosting (via @neondatabase/serverless)

### UI Dependencies
- **Radix UI**: Comprehensive set of accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

### Backend Dependencies
- **Drizzle**: Type-safe ORM for PostgreSQL
- **Mongoose**: MongoDB integration (fallback storage)
- **Express**: Web application framework

## Deployment Strategy

### Build Process
- Frontend built with Vite for optimized production bundles
- Backend compiled with esbuild for Node.js deployment
- TypeScript compilation for type checking

### Environment Configuration
- Development mode with hot reloading via Vite
- Production build outputs to `dist/` directory
- Environment variables for database connections and API keys

### Database Management
- Drizzle migrations for schema management
- Push command for development schema updates
- Fallback to in-memory storage if database unavailable

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 02, 2025. Initial setup
- January 27, 2025. Fixed dropdown functionality in multi-step selling form and advanced car filters
  - Replaced HTML select elements with proper shadcn/ui Select components
  - Fixed make, model, year, accident history, and contact time dropdowns
  - Added condition filter to advanced search
  - Improved form validation and user experience
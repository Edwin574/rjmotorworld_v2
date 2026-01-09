# RJ Motorworld - Car Dealership Platform

## Overview

RJ Motorworld is a full-stack car dealership website built with Next.js, React, and MongoDB. The platform allows customers to browse and search for cars while providing administrative capabilities for managing inventory and customer inquiries.

## System Architecture

### Technology Stack
- **Frontend**: Next.js 15 with React 18, TypeScript, Tailwind CSS, Radix UI components
- **Backend**: Next.js API Routes with Express.js integration
- **Database**: MongoDB with Mongoose ODM
- **Image Storage**: ImageKit integration for car images
- **Email Service**: EmailJS for customer inquiries
- **Authentication**: JWT-based admin authentication

### Database Architecture
The system uses MongoDB as the primary database with Mongoose ODM for type-safe database operations. The schema includes:
- Car listings with comprehensive details (make, model, year, price, images, etc.)
- Sell inquiry submissions from customers
- Car brands and models for filtering
- User management for admin access
- Counter collections for ID generation

## Key Components

### Frontend Architecture
- **Routing**: Next.js App Router with file-based routing
- **State Management**: React Query (TanStack Query) for server state management
- **UI Framework**: Custom component library built with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system and RJ Motorworld theme
- **Form Handling**: React Hook Form with Zod validation
- **Image Optimization**: Next.js Image component with custom asset aliases

### Backend Architecture
- **API Layer**: Next.js API Routes with Express.js integration
- **Database Layer**: Mongoose ODM with MongoDB
- **File Upload**: ImageKit integration for car image management
- **Email Service**: EmailJS for customer inquiry notifications
- **Authentication**: JWT-based authentication for admin routes
- **Storage**: MongoDB with connection pooling and caching

### Admin Dashboard
- Protected admin area with JWT authentication
- CRUD operations for car listings
- Sell inquiry management
- Image upload capabilities
- Modern, responsive admin interface

## Data Flow

### Customer Journey
1. **Browse Cars**: Customers can view cars on homepage, filter by condition (new/used), and search
2. **Car Details**: Individual car pages with image carousels and WhatsApp inquiry buttons
3. **Sell Car**: Multi-step form for customers to submit sell requests
4. **Contact**: Static contact and about pages

### Admin Workflow
1. **Authentication**: Login with JWT-based authentication
2. **Car Management**: Add, edit, delete car listings with image uploads
3. **Inquiry Management**: Review and manage customer sell requests
4. **Dashboard**: Overview of system statistics

### Data Processing
- Form submissions validated with Zod schemas
- Images processed through ImageKit API
- Email notifications sent via EmailJS
- Database operations handled through Mongoose ODM
- Server-side rendering with Next.js for SEO optimization

## External Dependencies

### Core Services
- **ImageKit**: Cloud-based image storage and optimization
- **EmailJS**: Email service for customer inquiries
- **MongoDB**: Document database for data storage

### UI Dependencies
- **Radix UI**: Comprehensive set of accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom theme
- **Lucide React**: Icon library
- **Framer Motion**: Animation library

### Backend Dependencies
- **Mongoose**: MongoDB ODM for Node.js
- **Next.js**: Full-stack React framework
- **Express**: Web application framework (integrated with Next.js)
- **JWT**: JSON Web Token authentication

## Development Setup

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd rjmotorworldv2

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Environment Variables
```env
# Database
MONGODB_URI=mongodb://localhost:27017/rjmotorworld

# Admin Authentication
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret

# ImageKit Configuration
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

### Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Type checking
npm run check

# Database operations (if using Drizzle)
npm run db:push
```

## Deployment Strategy

### Build Process
- Next.js builds optimized production bundles
- Static assets optimized with Next.js Image component
- TypeScript compilation for type checking
- Standalone output for Docker deployment

### Environment Configuration
- Development mode with hot reloading
- Production build outputs optimized bundles
- Environment variables for database connections and API keys
- Docker support with standalone output

### Database Management
- Mongoose connection pooling and caching
- MongoDB Atlas for cloud deployment
- Local MongoDB for development
- Database seeding scripts included

## Project Structure

```
rjmotorworldv2/
├── components/           # Reusable React components
│   ├── admin/           # Admin-specific components
│   ├── car/            # Car-related components
│   ├── cars/           # Car listing components
│   ├── home/           # Homepage components
│   ├── sell/           # Sell form components
│   └── ui/             # Base UI components (Radix UI)
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
│   ├── utils/          # Helper functions
│   └── mongodb.ts      # Database connection
├── models/             # Mongoose models
├── pages/              # Next.js pages and API routes
│   ├── api/            # API endpoints
│   ├── admin/          # Admin pages
│   ├── car/            # Car detail pages
│   └── cars/           # Car listing pages
├── server/             # Express.js server integration
├── shared/             # Shared schemas and types
├── types/              # TypeScript type definitions
└── attached_assets/    # Static assets (images, etc.)
```

## Features

### Customer Features
- **Car Browsing**: Browse cars with advanced filtering
- **Search**: Search by make, model, or keywords
- **Car Details**: Detailed car information with image galleries
- **Sell Car**: Submit car for sale with multi-step form
- **Contact**: Contact information and inquiry forms
- **Responsive Design**: Mobile-first responsive design

### Admin Features
- **Authentication**: Secure JWT-based login
- **Car Management**: Full CRUD operations for car listings
- **Image Upload**: ImageKit integration for car photos
- **Inquiry Management**: Review and manage sell requests
- **Dashboard**: Admin dashboard with statistics
- **Modern UI**: Clean, professional admin interface

## User Preferences

Preferred communication style: Simple, everyday language.


# Smart Travel Companion Website

## Overview

This is a comprehensive travel companion website built to help tourists and locals discover destinations in Jharkhand, India (with focus on places like Netarhat). The platform combines AI-powered itinerary planning, interactive maps, real-time information, and a local services marketplace to create a complete travel experience.

The application serves as a digital travel assistant that provides personalized recommendations, facilitates trip planning, enables communication through an AI chatbot, and connects travelers with local services and accommodations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database serverless PostgreSQL
- **Session Management**: PostgreSQL-based sessions using connect-pg-simple
- **API Design**: RESTful API with JSON responses
- **Development**: Hot module replacement with Vite integration

### Database Schema Design
The system uses a relational database structure with the following core entities:
- **Users**: Authentication and user management
- **Destinations**: Travel locations with ratings, pricing, and categorization
- **Itineraries**: AI-generated travel plans with activities and budget breakdowns
- **Reviews**: User feedback and ratings for destinations
- **Services**: Local marketplace offerings (homestays, guides, handicrafts)
- **Chat Messages**: AI chatbot conversation history

### AI Integration Architecture
- **AI Provider**: OpenAI API integration for intelligent features
- **Chatbot**: Conversational AI for travel assistance and recommendations
- **Itinerary Generation**: AI-powered trip planning based on user preferences
- **Multilingual Support**: Planned support for Hindi and English languages

### Key Architectural Decisions

**Full-Stack TypeScript**: Chosen for type safety across the entire application stack, reducing runtime errors and improving developer experience.

**Drizzle ORM**: Selected over traditional ORMs for its lightweight nature, excellent TypeScript support, and SQL-like query syntax that provides better control over database operations.

**Component-Based UI**: Radix UI primitives provide accessible, unstyled components that can be customized with Tailwind CSS, ensuring both accessibility and design flexibility.

**Server State Management**: TanStack Query handles caching, synchronization, and background updates for server data, reducing the complexity of state management.

**Real-time Features**: Architecture supports real-time updates for weather information, transport status, and chat functionality.

## External Dependencies

### Core Infrastructure
- **Database**: Neon Database (Serverless PostgreSQL)
- **AI Services**: OpenAI API for chatbot and itinerary generation
- **Maps**: Planned integration with Leaflet.js, Mapbox, or Google Maps API
- **Weather**: Real-time weather data API integration (planned)

### Development Tools
- **Build System**: Vite for fast development and optimized production builds
- **Deployment**: Configured for Node.js hosting with static asset serving
- **Development Environment**: Replit-optimized with hot reload and error overlay

### Third-Party Services
- **Authentication**: Planned integration with social login providers
- **Payment Processing**: Future integration for booking and service payments
- **Image Storage**: Cloud storage solution for destination and service images
- **Analytics**: User behavior tracking and performance monitoring (planned)

### API Integrations
- **Transport APIs**: Real-time bus, train, and flight information
- **Local Services**: Integration with local business directories
- **Review Systems**: User-generated content and rating aggregation
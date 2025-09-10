import { 
  users,
  destinations,
  itineraries,
  reviews,
  services,
  chatMessages,
  type User, 
  type UpsertUser,
  type Destination, 
  type InsertDestination,
  type Itinerary,
  type InsertItinerary,
  type Review,
  type InsertReview,
  type Service,
  type InsertService,
  type ChatMessage,
  type InsertChatMessage
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Destination methods
  getDestinations(): Promise<Destination[]>;
  getDestination(id: string): Promise<Destination | undefined>;
  searchDestinations(query?: string, category?: string): Promise<Destination[]>;
  createDestination(destination: InsertDestination): Promise<Destination>;

  // Itinerary methods
  getItinerary(id: string): Promise<Itinerary | undefined>;
  createItinerary(itinerary: InsertItinerary): Promise<Itinerary>;

  // Review methods
  getReviewsByDestination(destinationId: string): Promise<Review[]>;
  getAllReviews(): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Service methods
  getServices(): Promise<Service[]>;
  getServicesByCategory(category: string): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;

  // Chat methods
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private destinations: Map<string, Destination>;
  private itineraries: Map<string, Itinerary>;
  private reviews: Map<string, Review>;
  private services: Map<string, Service>;
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.users = new Map();
    this.destinations = new Map();
    this.itineraries = new Map();
    this.reviews = new Map();
    this.services = new Map();
    this.chatMessages = new Map();
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize sample destinations
    const destinations: Destination[] = [
      {
        id: "dest-1",
        name: "Netarhat",
        description: "Queen of Chotanagpur - Famous for mesmerizing sunrises and scenic beauty",
        location: "Netarhat, Jharkhand",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        rating: 48,
        pricePerPerson: 8000,
        recommendedDays: 2,
        category: "hill-station",
        features: ["sunrise-point", "nature-trails", "scenic-beauty", "adventure"],
        createdAt: new Date(),
      },
      {
        id: "dest-2",
        name: "Dassam Falls",
        description: "Spectacular waterfall perfect for nature lovers and photographers",
        location: "Taimara, Jharkhand",
        imageUrl: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        rating: 46,
        pricePerPerson: 5500,
        recommendedDays: 1,
        category: "waterfall",
        features: ["photography", "nature", "swimming", "adventure"],
        createdAt: new Date(),
      },
      {
        id: "dest-3",
        name: "Ranchi Heritage",
        description: "Rich cultural heritage with historic temples and modern attractions",
        location: "Ranchi, Jharkhand",
        imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        rating: 45,
        pricePerPerson: 12000,
        recommendedDays: 3,
        category: "heritage",
        features: ["temples", "museums", "cultural-sites", "cultural"],
        createdAt: new Date(),
      },
      {
        id: "dest-4",
        name: "Betla National Park",
        description: "Wildlife sanctuary with tigers, elephants and diverse flora and fauna",
        location: "Latehar, Jharkhand",
        imageUrl: "https://images.unsplash.com/photo-1549366021-9f761d040a94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        rating: 47,
        pricePerPerson: 15000,
        recommendedDays: 3,
        category: "wildlife",
        features: ["safari", "nature", "wildlife", "photography", "adventure"],
        createdAt: new Date(),
      },
      {
        id: "dest-5",
        name: "Hundru Falls",
        description: "Majestic waterfall cascading from 320 feet height, perfect for picnics",
        location: "Ranchi, Jharkhand",
        imageUrl: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        rating: 44,
        pricePerPerson: 4000,
        recommendedDays: 1,
        category: "waterfall",
        features: ["picnic", "nature", "photography", "relaxation"],
        createdAt: new Date(),
      },
      {
        id: "dest-6",
        name: "Deoghar Temple Complex",
        description: "Sacred pilgrimage site with ancient Shiva temples and spiritual atmosphere",
        location: "Deoghar, Jharkhand",
        imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        rating: 49,
        pricePerPerson: 6000,
        recommendedDays: 2,
        category: "heritage",
        features: ["temples", "pilgrimage", "cultural", "spiritual"],
        createdAt: new Date(),
      },
      {
        id: "dest-7",
        name: "Parasnath Hill",
        description: "Highest peak in Jharkhand, sacred Jain pilgrimage site with trekking trails",
        location: "Giridih, Jharkhand",
        imageUrl: "https://images.unsplash.com/photo-1464822759844-d150baec93d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        rating: 46,
        pricePerPerson: 9000,
        recommendedDays: 2,
        category: "hill-station",
        features: ["trekking", "pilgrimage", "adventure", "nature"],
        createdAt: new Date(),
      },
      {
        id: "dest-8",
        name: "Jamshedpur City Tour",
        description: "Industrial city with beautiful parks, lakes and modern attractions",
        location: "Jamshedpur, Jharkhand",
        imageUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        rating: 43,
        pricePerPerson: 7500,
        recommendedDays: 2,
        category: "city",
        features: ["parks", "lakes", "museums", "cultural"],
        createdAt: new Date(),
      },
    ];

    // Initialize sample reviews
    const reviews: Review[] = [
      {
        id: "review-1",
        destinationId: "dest-1",
        userName: "Priya Sharma",
        userAvatar: "https://pixabay.com/get/g0540d75090551bfef78705dcb9dd1a26ec01914b0c813d8a00730685d923524a2a49ac8a804ee1aaf443ee2a84b5292b4631daac4c6f8951e7c7daa352c17c11_1280.jpg",
        rating: 5,
        comment: "The AI itinerary planner was incredible! It suggested hidden gems in Netarhat that I would never have found on my own. The local guide recommendations were spot on.",
        location: "Netarhat, Jharkhand",
        createdAt: new Date(),
      },
      {
        id: "review-2",
        destinationId: "dest-2",
        userName: "Rajesh Kumar",
        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        rating: 5,
        comment: "Perfect for family trips! The budget planning feature helped us stay within our limits while experiencing everything. The kids loved the interactive map features.",
        location: "Dassam Falls, Jharkhand",
        createdAt: new Date(),
      },
      {
        id: "review-3",
        destinationId: "dest-3",
        userName: "Anjali Singh",
        userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        rating: 4,
        comment: "The multilingual chat support made everything so easy! I could ask questions in Hindi and get instant responses. Real-time weather updates were very helpful.",
        location: "Ranchi, Jharkhand",
        createdAt: new Date(),
      },
    ];

    // Initialize sample services
    const services: Service[] = [
      {
        id: "service-1",
        name: "Mountain View Homestay",
        category: "homestay",
        description: "Experience authentic village life with panoramic mountain views and traditional meals.",
        imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        price: 1500,
        priceUnit: "per night",
        rating: 49,
        location: "Netarhat",
        createdAt: new Date(),
      },
      {
        id: "service-2",
        name: "Expert Local Guide",
        category: "guide",
        description: "Professional guide with 15+ years experience. Fluent in Hindi, English, and local dialects.",
        imageUrl: "https://pixabay.com/get/gaabbc5b68008c538ce7e1ae256274f3f931bd27e7d11323a011176ee34e88905dc0b1e028818796a47d3794b5bec6d21c980a8adb5073b7b06a36e0d4ab16e7d_1280.jpg",
        price: 2000,
        priceUnit: "per day",
        rating: 48,
        location: "Jharkhand",
        createdAt: new Date(),
      },
      {
        id: "service-3",
        name: "Traditional Handicrafts",
        category: "handicraft",
        description: "Authentic handcrafted items made by local artisans. Perfect souvenirs and gifts.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        price: 500,
        priceUnit: "onwards",
        rating: 47,
        location: "Local Markets",
        createdAt: new Date(),
      },
    ];

    destinations.forEach(dest => this.destinations.set(dest.id, dest));
    reviews.forEach(review => this.reviews.set(review.id, review));
    services.forEach(service => this.services.set(service.id, service));
  }

  // User methods (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const userId = userData.id || randomUUID();
    const existingUser = this.users.get(userId);
    
    if (existingUser) {
      // Update existing user
      const updatedUser: User = {
        ...existingUser,
        ...userData,
        id: userId,
        updatedAt: new Date(),
      };
      this.users.set(userId, updatedUser);
      return updatedUser;
    } else {
      // Create new user
      const newUser: User = {
        id: userId,
        email: userData.email || null,
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        profileImageUrl: userData.profileImageUrl || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.set(userId, newUser);
      return newUser;
    }
  }

  // Destination methods
  async getDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values());
  }

  async getDestination(id: string): Promise<Destination | undefined> {
    return this.destinations.get(id);
  }

  async searchDestinations(query?: string, category?: string): Promise<Destination[]> {
    let destinations = Array.from(this.destinations.values());
    
    if (query) {
      const lowerQuery = query.toLowerCase();
      destinations = destinations.filter(dest => 
        dest.name.toLowerCase().includes(lowerQuery) ||
        dest.description.toLowerCase().includes(lowerQuery) ||
        dest.location.toLowerCase().includes(lowerQuery)
      );
    }
    
    if (category) {
      destinations = destinations.filter(dest => dest.category === category);
    }
    
    return destinations;
  }

  async createDestination(insertDestination: InsertDestination): Promise<Destination> {
    const id = randomUUID();
    const destination: Destination = { 
      ...insertDestination, 
      id, 
      rating: insertDestination.rating ?? 0,
      features: insertDestination.features ?? [],
      createdAt: new Date() 
    };
    this.destinations.set(id, destination);
    return destination;
  }

  // Itinerary methods
  async getItinerary(id: string): Promise<Itinerary | undefined> {
    return this.itineraries.get(id);
  }

  async createItinerary(insertItinerary: InsertItinerary): Promise<Itinerary> {
    const id = randomUUID();
    const itinerary: Itinerary = { 
      ...insertItinerary, 
      id, 
      destinationId: insertItinerary.destinationId ?? null,
      createdAt: new Date() 
    };
    this.itineraries.set(id, itinerary);
    return itinerary;
  }

  // Review methods
  async getReviewsByDestination(destinationId: string): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      review => review.destinationId === destinationId
    );
  }

  async getAllReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values());
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = { 
      ...insertReview, 
      id, 
      destinationId: insertReview.destinationId ?? null,
      createdAt: new Date() 
    };
    this.reviews.set(id, review);
    return review;
  }

  // Service methods
  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getServicesByCategory(category: string): Promise<Service[]> {
    return Array.from(this.services.values()).filter(
      service => service.category === category
    );
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = randomUUID();
    const service: Service = { 
      ...insertService, 
      id, 
      rating: insertService.rating ?? 0,
      location: insertService.location ?? null,
      createdAt: new Date() 
    };
    this.services.set(id, service);
    return service;
  }

  // Chat methods
  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(msg => msg.sessionId === sessionId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = { 
      ...insertMessage, 
      id, 
      isBot: insertMessage.isBot ?? false,
      timestamp: new Date() 
    };
    this.chatMessages.set(id, message);
    return message;
  }
}

export class DatabaseStorage implements IStorage {
  // User methods (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const userId = userData.id || randomUUID();
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        id: userId,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          id: userId,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Destination methods
  async getDestinations(): Promise<Destination[]> {
    return await db.select().from(destinations);
  }

  async getDestination(id: string): Promise<Destination | undefined> {
    const [destination] = await db.select().from(destinations).where(eq(destinations.id, id));
    return destination;
  }

  async searchDestinations(query?: string, category?: string): Promise<Destination[]> {
    let queryBuilder = db.select().from(destinations);
    
    // Add filters as needed - for now using MemStorage logic
    const allDestinations = await queryBuilder;
    let filteredDestinations = allDestinations;
    
    if (query) {
      const lowerQuery = query.toLowerCase();
      filteredDestinations = filteredDestinations.filter(dest => 
        dest.name.toLowerCase().includes(lowerQuery) ||
        dest.description.toLowerCase().includes(lowerQuery) ||
        dest.location.toLowerCase().includes(lowerQuery)
      );
    }
    
    if (category) {
      filteredDestinations = filteredDestinations.filter(dest => dest.category === category);
    }
    
    return filteredDestinations;
  }

  async createDestination(insertDestination: InsertDestination): Promise<Destination> {
    const [destination] = await db
      .insert(destinations)
      .values({
        ...insertDestination,
        rating: insertDestination.rating ?? 0,
        features: insertDestination.features ?? [],
      })
      .returning();
    return destination;
  }

  // Itinerary methods
  async getItinerary(id: string): Promise<Itinerary | undefined> {
    const [itinerary] = await db.select().from(itineraries).where(eq(itineraries.id, id));
    return itinerary;
  }

  async createItinerary(insertItinerary: InsertItinerary): Promise<Itinerary> {
    const [itinerary] = await db
      .insert(itineraries)
      .values({
        ...insertItinerary,
        destinationId: insertItinerary.destinationId ?? null,
      })
      .returning();
    return itinerary;
  }

  // Review methods
  async getReviewsByDestination(destinationId: string): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.destinationId, destinationId));
  }

  async getAllReviews(): Promise<Review[]> {
    return await db.select().from(reviews);
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db
      .insert(reviews)
      .values({
        ...insertReview,
        destinationId: insertReview.destinationId ?? null,
      })
      .returning();
    return review;
  }

  // Service methods
  async getServices(): Promise<Service[]> {
    return await db.select().from(services);
  }

  async getServicesByCategory(category: string): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.category, category));
  }

  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db
      .insert(services)
      .values({
        ...insertService,
        rating: insertService.rating ?? 0,
        location: insertService.location ?? null,
      })
      .returning();
    return service;
  }

  // Chat methods
  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages).where(eq(chatMessages.sessionId, sessionId));
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db
      .insert(chatMessages)
      .values({
        ...insertMessage,
        isBot: insertMessage.isBot ?? false,
      })
      .returning();
    return message;
  }
}

// Use memory storage for development, database for production
export const storage = process.env.NODE_ENV === 'production' 
  ? new DatabaseStorage() 
  : new MemStorage();

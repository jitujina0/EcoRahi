import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
// import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  searchDestinationsSchema, 
  generateItinerarySchema, 
  chatMessageSchema 
} from "@shared/schema";
import { generateItinerary, chatWithAI } from "../client/src/lib/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Destination routes
  app.get("/api/destinations", async (req, res) => {
    try {
      const { query, category } = req.query as { query?: string; category?: string };
      const destinations = await storage.searchDestinations(query, category);
      res.json(destinations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch destinations" });
    }
  });

  app.get("/api/destinations/:id", async (req, res) => {
    try {
      const destination = await storage.getDestination(req.params.id);
      if (!destination) {
        return res.status(404).json({ error: "Destination not found" });
      }
      res.json(destination);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch destination" });
    }
  });

  // Search destinations
  app.post("/api/search", async (req, res) => {
    try {
      console.log('Search request body:', req.body);
      const searchParams = searchDestinationsSchema.parse(req.body);
      
      // Use query parameter for destination search
      const destinations = await storage.searchDestinations(
        searchParams.query, 
        searchParams.category
      );
      
      console.log('Found destinations:', destinations.length);
      
      // Filter by additional criteria if provided
      let filteredDestinations = destinations;
      
      if (searchParams.budget) {
        const budgetStr = searchParams.budget.replace(/[^\d-]/g, '');
        let maxBudget = 100000; // Default high value
        
        if (budgetStr.includes('-')) {
          const range = budgetStr.split('-');
          maxBudget = parseInt(range[1]) || parseInt(range[0]) * 2;
        } else {
          maxBudget = parseInt(budgetStr) || 100000;
        }
        
        filteredDestinations = filteredDestinations.filter(dest => 
          dest.pricePerPerson <= maxBudget
        );
        console.log('After budget filter:', filteredDestinations.length);
      }
      
      if (searchParams.duration) {
        let maxDays = 30; // Default high value
        
        if (searchParams.duration.includes('-')) {
          const range = searchParams.duration.split('-');
          maxDays = parseInt(range[1]) || parseInt(range[0]) + 2;
        } else if (searchParams.duration.includes('week')) {
          maxDays = searchParams.duration.includes('2+') ? 30 : 7;
        } else {
          maxDays = parseInt(searchParams.duration) || 30;
        }
        
        filteredDestinations = filteredDestinations.filter(dest => 
          dest.recommendedDays <= maxDays
        );
        console.log('After duration filter:', filteredDestinations.length);
      }

      if (searchParams.travelStyle) {
        // Filter by travel style - match against category or features
        const style = searchParams.travelStyle.toLowerCase();
        filteredDestinations = filteredDestinations.filter(dest => 
          dest.category.toLowerCase().includes(style) ||
          dest.features.some(feature => feature.toLowerCase().includes(style)) ||
          dest.description.toLowerCase().includes(style)
        );
        console.log('After travel style filter:', filteredDestinations.length);
      }

      console.log('Final filtered destinations:', filteredDestinations.length);
      res.json(filteredDestinations);
    } catch (error) {
      console.error('Search error:', error);
      res.status(400).json({ error: "Invalid search parameters" });
    }
  });

  // Generate itinerary
  app.post("/api/itinerary/generate", async (req, res) => {
    try {
      const itineraryRequest = generateItinerarySchema.parse(req.body);
      
      // Use OpenAI to generate itinerary
      const generatedItinerary = await generateItinerary(itineraryRequest);
      
      // Save to storage
      const savedItinerary = await storage.createItinerary({
        destinationId: null, // Could be linked to a destination if found
        title: generatedItinerary.title,
        duration: itineraryRequest.duration,
        budget: itineraryRequest.budget,
        travelStyle: itineraryRequest.travelStyle,
        activities: generatedItinerary.activities,
        budgetBreakdown: generatedItinerary.budgetBreakdown,
      });

      res.json(savedItinerary);
    } catch (error) {
      console.error('Itinerary generation error:', error);
      res.status(500).json({ error: "Failed to generate itinerary. Please try again." });
    }
  });

  // Get itinerary
  app.get("/api/itinerary/:id", async (req, res) => {
    try {
      const itinerary = await storage.getItinerary(req.params.id);
      if (!itinerary) {
        return res.status(404).json({ error: "Itinerary not found" });
      }
      res.json(itinerary);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch itinerary" });
    }
  });

  // Reviews routes
  app.get("/api/reviews", async (req, res) => {
    try {
      const { destinationId } = req.query as { destinationId?: string };
      
      const reviews = destinationId 
        ? await storage.getReviewsByDestination(destinationId)
        : await storage.getAllReviews();
        
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  // Services routes
  app.get("/api/services", async (req, res) => {
    try {
      const { category } = req.query as { category?: string };
      
      const services = category 
        ? await storage.getServicesByCategory(category)
        : await storage.getServices();
        
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  // Chat routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, sessionId } = chatMessageSchema.parse(req.body);
      
      // Save user message
      await storage.createChatMessage({
        sessionId,
        message,
        isBot: false,
      });

      // Get AI response
      const chatResponse = await chatWithAI(message);
      
      // Save bot response
      const botMessage = await storage.createChatMessage({
        sessionId,
        message: chatResponse.message,
        isBot: true,
      });

      res.json({
        message: chatResponse.message,
        suggestions: chatResponse.suggestions,
        id: botMessage.id,
      });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: "Failed to process chat message. Please try again." });
    }
  });

  app.get("/api/chat/:sessionId", async (req, res) => {
    try {
      const messages = await storage.getChatMessages(req.params.sessionId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  });

  // Weather API (mock for now - in production would integrate with real weather service)
  app.get("/api/weather/:location", async (req, res) => {
    try {
      // This would integrate with a real weather API like OpenWeatherMap
      const mockWeather = {
        location: req.params.location,
        temperature: 28,
        condition: "Clear Sky",
        icon: "☀️",
        humidity: 65,
        windSpeed: 12,
        forecast: [
          { day: "Today", high: 30, low: 22, condition: "Sunny" },
          { day: "Tomorrow", high: 28, low: 20, condition: "Partly Cloudy" },
          { day: "Day After", high: 26, low: 18, condition: "Light Rain" },
        ]
      };
      
      res.json(mockWeather);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch weather data" });
    }
  });

  // Create and return the HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
// ...existing code...

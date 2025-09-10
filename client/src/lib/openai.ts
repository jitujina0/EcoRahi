import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user

function getOpenAIApiKey() {
  if (typeof process !== 'undefined' && process.env && process.env.OPENAI_API_KEY) {
    return process.env.OPENAI_API_KEY;
  }
  try {
    // @ts-ignore
    if (import.meta && import.meta.env && import.meta.env.VITE_OPENAI_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_OPENAI_API_KEY;
    }
  } catch (e) {}
  throw new Error("OpenAI API key not found in environment variables");
}

const openai = new OpenAI({
  apiKey: getOpenAIApiKey(),
  dangerouslyAllowBrowser: true
});

export interface ItineraryRequest {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelStyle: string[];
  duration: number;
}

export interface ItineraryResponse {
  title: string;
  activities: {
    day: number;
    title: string;
    items: {
      time: string;
      activity: string;
      icon: string;
      description?: string;
    }[];
  }[];
  budgetBreakdown: {
    accommodation: number;
    activities: number;
    meals: number;
    transport: number;
    total: number;
  };
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
}

export async function generateItinerary(request: ItineraryRequest): Promise<ItineraryResponse> {
  try {
    const prompt = `Create a detailed ${request.duration}-day travel itinerary for ${request.destination} with the following preferences:
- Budget: ₹${request.budget.toLocaleString('en-IN')}
- Travel Style: ${request.travelStyle.join(', ')}
- Start Date: ${request.startDate}
- End Date: ${request.endDate}

Please provide a comprehensive itinerary with:
1. Daily activities with specific times and locations
2. Budget breakdown for accommodation, activities, meals, and transport
3. Local recommendations and hidden gems
4. Weather considerations and best times to visit attractions

Format the response as JSON with this structure:
{
  "title": "string",
  "activities": [
    {
      "day": number,
      "title": "string", 
      "items": [
        {
          "time": "string",
          "activity": "string", 
          "icon": "fas fa-icon-name",
          "description": "string"
        }
      ]
    }
  ],
  "budgetBreakdown": {
    "accommodation": number,
    "activities": number, 
    "meals": number,
    "transport": number,
    "total": number
  }
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert travel planner specializing in Indian destinations. Create detailed, realistic itineraries with accurate budget estimates in Indian Rupees."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result as ItineraryResponse;
  } catch (error) {
    console.error('Failed to generate itinerary:', error);
    throw new Error("Failed to generate itinerary. Please try again.");
  }
}

export async function chatWithAI(message: string, context?: string): Promise<ChatResponse> {
  try {
    const systemPrompt = `You are a helpful travel assistant for Indian destinations, especially Jharkhand. You can help with:
- Travel planning and recommendations
- Local attractions and hidden gems
- Budget planning and cost estimates
- Cultural insights and local customs
- Weather and best travel times
- Transportation options
- Local cuisine recommendations

You can respond in both English and Hindi. Keep responses helpful, friendly, and concise.
${context ? `Context: ${context}` : ''}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      message: result.message || "I'm sorry, I couldn't understand that. Could you please rephrase your question?",
      suggestions: result.suggestions || []
    };
  } catch (error) {
    console.error('Failed to get chat response:', error);
    throw new Error("Failed to get response. Please try again.");
  }
}

export async function searchDestinations(query: string): Promise<string[]> {
  try {
    const prompt = `Based on the search query "${query}", suggest relevant travel destinations in India, especially in Jharkhand. Focus on places that match the user's intent.

Provide a JSON response with an array of destination suggestions:
{
  "destinations": ["destination1", "destination2", "destination3"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a travel destination search assistant for Indian tourism."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.destinations || [];
  } catch (error) {
    console.error('Failed to search destinations:', error);
    return [];
  }
}

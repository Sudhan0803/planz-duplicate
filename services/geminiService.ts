import { GoogleGenAI, Type } from "@google/genai";
import type { TripPlan } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const commonItinerarySchema = {
  type: Type.OBJECT,
  properties: {
    tripTitle: { type: Type.STRING },
    totalDuration: { type: Type.INTEGER },
    estimatedTotalBudget: { type: Type.STRING, description: "An estimated total budget for the entire trip in Indian Rupees, formatted as a range (e.g., '₹10,000 - ₹12,000')." },
    itinerary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER },
          title: { type: Type.STRING },
          city: { type: Type.STRING },
          lat: { type: Type.NUMBER, description: "Latitude of the city for the day." },
          lng: { type: Type.NUMBER, description: "Longitude of the city for the day." },
          transport: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                mode: { type: Type.STRING, enum: ['Train', 'Bus', 'Metro', 'Local Bus', 'Ferry', 'Auto Rickshaw', 'Other'] },
                from: { type: Type.STRING },
                to: { type: Type.STRING },
                details: { type: Type.STRING, description: "Detailed information like Bus/Train Number, name of the State Transport Corporation (e.g., KSRTC, MSRTC), type of bus ('Express', 'Ordinary', 'Sleeper'), and specific bus stand/depot names." },
                price: { type: Type.STRING, description: "Estimated ticket price for the journey, especially for local transport." },
                bookingLink: { type: Type.STRING, description: "URL to the official government website for booking this transport leg." },
                departureTime: { type: Type.STRING, description: "The scheduled departure time for the bus or train (e.g., '08:30 AM')." },
                arrivalTime: { type: Type.STRING, description: "The estimated arrival time for the bus or train (e.g., '01:45 PM')." }
              },
              required: ['mode', 'from', 'to', 'details']
            },
          },
          activities: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
         required: ['day', 'title', 'city', 'lat', 'lng', 'transport', 'activities']
      },
    },
  },
   required: ['tripTitle', 'totalDuration', 'itinerary', 'estimatedTotalBudget']
};


const parseAndHandleError = (text: string): TripPlan => {
    try {
        // The API may return markdown JSON, so we need to clean it.
        const cleanedText = text.replace(/^```json\s*|```\s*$/g, '');
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("Failed to parse JSON response from API:", text);
        throw new Error("The travel plan returned by the AI was in an unexpected format. Please try again.");
    }
};

export const generateTripPlan = async (from: string, to: string, travelStyle: string, preferences: string[]): Promise<TripPlan> => {
    const preferenceText = preferences.includes('Bus') 
      ? `The user has a strong preference for travelling by Bus. Please prioritize bus routes, especially those from state-run corporations that connect to smaller, less-known destinations.`
      : `The user is open to all forms of public transport, but the itinerary should still emphasize bus travel to explore India's interior.`;
    
    const prompt = `You are an expert travel planner for India, specializing in budget-friendly, off-the-beaten-path itineraries using exclusively public transport. Your focus is on discovering the real India by traveling from villages to deep interior parts via public bus.
    
    **CRITICAL INSTRUCTIONS:**
    1.  **Sequential Plan:** The itinerary must be a clear, step-by-step sequence. When the traveler arrives at a destination, the plan must specify the single, next bus/train to take to continue the journey. Do not list multiple options.
    2.  **Precise Timings:** For each transport leg, you MUST provide a scheduled 'departureTime' and an estimated 'arrivalTime'. AVOID vague descriptions like 'frequent buses' or 'runs every hour'. If an exact time is not available for a rural bus, provide the best known time slot (e.g., 'Morning, around 9:00 AM').
    3.  **Bus Details:** For each 'Bus' journey, provide precise details: the name of the state transport corporation (e.g., KSRTC, MSRTC), type of bus (e.g., 'Express', 'Ordinary', 'Sleeper'), and the specific bus stand/depot for departure and arrival.
    4.  **Public Transport Only:** The itinerary must ONLY use public transport (trains, government buses, local transport). Do NOT include flights or private taxis.
    5.  **Links:** For each inter-city 'Train' journey, provide a 'bookingLink' to 'https://www.irctc.co.in'.
    6.  **Budget Calculation:** You MUST calculate and provide an 'estimatedTotalBudget' for the entire trip, considering all costs (transport, food, activities) based on the user's travel style. Present it as a range in Indian Rupees (e.g., '₹10,000 - ₹12,000').

    **USER REQUEST:**
    Create a detailed, day-by-day itinerary from ${from} to ${to}.
    The user's preferred travel style is '${travelStyle}'. Based on this, determine an appropriate total duration for the trip.
    ${preferenceText}
    For each day, provide the city, its geographic coordinates (lat, lng), and suggest 1-2 budget-friendly activities that reflect local culture.
    The response must be in JSON format.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: commonItinerarySchema,
            },
        });
        return parseAndHandleError(response.text.trim());
    } catch (error) {
        console.error("Error generating trip plan:", error);
        throw new Error("Failed to generate trip plan. The model might be unable to create a route with the given constraints. Please try different locations or styles.");
    }
};


export const generateTransportRoute = async (from: string, to: string, preferences: string[]): Promise<TripPlan> => {
    const preferenceText = preferences.includes('Bus')
      ? `The user has a strong preference for travelling by Bus. Please find the most direct and efficient bus route.`
      : `The user is open to both Train and Bus options.`;

    const prompt = `You are a public transport route specialist for India, with a focus on bus travel. Your task is to find the most efficient route from a starting point to a destination, detailing all necessary changes and transfers.

    **CRITICAL INSTRUCTIONS:**
    1.  **Multi-Leg Journey:** The route from ${from} to ${to} may require multiple bus or train changes. You MUST detail every single leg of the journey sequentially in the 'transport' array. For example, if a user needs to go from Village A to City C, the plan might include a bus from A to Town B, and then another bus from B to C.
    2.  **Precise Timings:** For each transport leg, you MUST provide a scheduled 'departureTime' and an estimated 'arrivalTime'. Do not use vague terms like 'frequent service'.
    3.  **Bus Details:** For each bus, include the state transport corporation name and bus type (e.g., 'Express', 'Ordinary'). For a train, provide the train number.
    4.  **Links:** Provide a 'bookingLink' to the official government booking website where applicable.
    5.  **Public Transport Only:** The route must exclusively use public transport like government buses (state-run services) or trains (Indian Railways). Do NOT include flights, private taxis, or ride-sharing.
    6.  **Single Day Plan:** Present the entire journey as a single-day itinerary. The 'day' property should be 1, and the 'activities' array should be empty.
    7.  **Budget:** Include an 'estimatedTotalBudget' for the entire end-to-end journey.

    **USER REQUEST:**
    Find the complete public transport route from ${from} to ${to}.
    ${preferenceText}

    The response must be in JSON format.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: commonItinerarySchema,
            },
        });

       return parseAndHandleError(response.text.trim());
    } catch (error) {
        console.error("Error generating transport route:", error);
        throw new Error("Failed to find a transport route. Please check the locations and try again.");
    }
};

export const refineTripPlan = async (originalPlan: TripPlan, request: string): Promise<TripPlan> => {
    const prompt = `You are an expert travel planner for India.
    Given the existing travel itinerary below, please modify it based on the user's request.
    
    **CRITICAL INSTRUCTIONS:**
    1.  **Adhere to Core Rules:** The itinerary must continue to ONLY use public transport (trains, government buses), with a strong preference for buses that connect to smaller towns and villages.
    2.  **Maintain Precision:** For each bus journey, provide precise details: state transport corporation, bus type, and specific bus stand names. Provide specific 'departureTime' and 'arrivalTime' for all transport legs.
    3.  **Handle Breaks:** If the user requests a break or a delay, recalculate the subsequent travel legs with new, realistic timings. For example, if they add a 3-hour break, the next bus departure must be at least 3 hours later than the original plan.
    4.  **Budget Adjustment:** If the user requests a budget change (e.g., 'Make the budget ₹8,000'), you must re-evaluate all costs. This may involve changing bus types (e.g., from AC to ordinary), suggesting cheaper or free activities, and adjusting daily food estimates. You must also update the 'estimatedTotalBudget' field in the final JSON response to reflect the new budget.
    5.  **Follow Schema:** Adhere to the exact original JSON format and schema.

    **USER'S REQUEST:** "${request}"

    **EXISTING ITINERARY (in JSON format):**
    ${JSON.stringify(originalPlan)}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: commonItinerarySchema,
            },
        });
        return parseAndHandleError(response.text.trim());
    } catch (error) {
        console.error("Error refining trip plan:", error);
        throw new Error("Failed to refine the trip plan. The model might be unable to fulfill the request. Please try a different refinement.");
    }
};

export const getCityFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    const prompt = `What is the name of the city and state/country at latitude ${lat} and longitude ${lng}? Respond with only the city and state/country name, in the format "City, State/Country". For example: "Jaipur, Rajasthan" or "Kathmandu, Nepal".`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error getting city from coordinates:", error);
        throw new Error("Could not determine city from your location.");
    }
};
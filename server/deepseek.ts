import axios from "axios";
import { type AIRouteRequest, type Route, type Waypoint, type InsertRoutePlan } from "@shared/schema";
import { storage } from "./storage";

// DeepSeek API configuration
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "sk-dummy-key-for-development";
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

/**
 * Generates a route plan using DeepSeek based on the user's request
 */
export async function generateRoutePlan(request: AIRouteRequest): Promise<{
  route: Route;
  recommendations: string;
}> {
  try {
    // If API key is not set, return a fallback response for development
    if (!process.env.DEEPSEEK_API_KEY) {
      console.warn("DeepSeek API key not provided. Using fallback response.");
      return await getFallbackRoutePlan(request);
    }

    // Create a detailed prompt for DeepSeek
    const promptText = createPrompt(request);

    // Call DeepSeek API for route planning
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: "deepseek-coder", // Using DeepSeek's model for structured outputs
        messages: [
          { 
            role: "system", 
            content: "You are an expert drone route planner with knowledge of spatial planning, flight paths, and optimized routing algorithms. Provide route details in a structured JSON format." 
          },
          { 
            role: "user", 
            content: promptText 
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
        }
      }
    );

    // Parse the response
    const content = response.data.choices[0].message.content;
    const parsedResponse = JSON.parse(content);

    // Transform the response into our application format
    const routeResult = {
      route: {
        distance: parsedResponse.route.totalDistance,
        duration: parsedResponse.route.estimatedDuration,
        waypoints: parsedResponse.route.waypoints.map((wp: any, index: number) => ({
          id: `WP${index + 1}`,
          latitude: wp.latitude,
          longitude: wp.longitude,
          description: wp.description
        })),
        path: generateSVGPath(parsedResponse.route.waypoints)
      },
      recommendations: parsedResponse.recommendations
    };

    // Store in the database
    try {
      const routePlan: InsertRoutePlan = {
        prompt: request.prompt,
        route: JSON.stringify(routeResult.route),
        recommendations: routeResult.recommendations,
        taskId: null
      };
      
      await storage.createRoutePlan(routePlan);
      console.log("Route plan stored successfully in the database");
    } catch (dbError) {
      console.error("Error storing route plan in database:", dbError);
      // Continue with the response even if database storage fails
    }

    return routeResult;
  } catch (err: any) {
    console.error("Error generating route plan with DeepSeek:", err);
    
    // Return a fallback if there's an API error
    if (err.response && err.response.status >= 400) {
      console.warn(`DeepSeek API error (${err.response.status}). Using fallback response.`);
      return await getFallbackRoutePlan(request);
    }
    
    throw new Error(`Failed to generate route plan: ${err.message}`);
  }
}

/**
 * Creates a detailed prompt for DeepSeek based on the user's request
 */
function createPrompt(request: AIRouteRequest): string {
  // Extract constraints from the request
  const distanceConstraint = request.maxDistance 
    ? `The route should not exceed ${request.maxDistance} kilometers.`
    : "";
  
  const durationConstraint = request.maxDuration
    ? `The total flight time should not exceed ${request.maxDuration} minutes.`
    : "";
  
  const noFlyZoneInfo = request.includeNoFlyZones
    ? "Please consider no-fly zones such as airports, restricted government facilities, and heavily populated areas."
    : "";

  return `
  Generate an optimized drone flight route based on the following request:
  
  ${request.prompt}
  
  ${distanceConstraint}
  ${durationConstraint}
  ${noFlyZoneInfo}
  
  Please provide a response in JSON format with the following structure:
  
  {
    "route": {
      "totalDistance": "4.2 km",
      "estimatedDuration": "36 minutes",
      "waypoints": [
        {
          "latitude": "37.7749",
          "longitude": "-122.4194",
          "description": "Starting point"
        },
        {
          "latitude": "37.7752",
          "longitude": "-122.4180",
          "description": "Waypoint description"
        }
      ]
    },
    "recommendations": "Detailed text with recommendations for the flight mission, including optimal time of day, drone model suggestions, camera settings, etc."
  }
  
  The route should be practical and flight-ready, with realistic GPS coordinates.
  `;
}

/**
 * Generates an SVG path based on waypoints for visualization
 */
function generateSVGPath(waypoints: any[]): string {
  if (!waypoints || waypoints.length < 2) {
    return "";
  }

  // Transform coordinates to SVG path
  // This is a simplistic transformation that maps lat/long to a viewbox
  // In a real app, we'd need proper map projection
  
  // Start the path at the first waypoint
  let path = `M100,250`;
  
  // Add curve commands between waypoints
  const horizontalSpacing = 650 / (waypoints.length - 1);
  
  waypoints.forEach((wp, index) => {
    if (index === 0) return; // Skip first point as it's the start

    const x = 100 + index * horizontalSpacing;
    // Vary the y value to create a more interesting path
    const y = 250 - (Math.sin(index * Math.PI / 4) * 100);
    
    if (index === 1) {
      // First curve
      path += ` C${x - 50},${y - 50} ${x - 30},${y + 50} ${x},${y}`;
    } else {
      // Subsequent curves
      path += ` S${x - 30},${y + (index % 2 ? 50 : -50)} ${x},${y}`;
    }
  });
  
  return path;
}

/**
 * Provides a fallback route plan when the DeepSeek API key is not available
 */
async function getFallbackRoutePlan(request: AIRouteRequest): Promise<{
  route: Route;
  recommendations: string;
}> {
  // Create a reasonable fallback based on the request
  const waypoints: Waypoint[] = [
    {
      id: "WP1",
      latitude: "37.7749",
      longitude: "-122.4194",
      description: "Starting point - Riverside park entrance"
    },
    {
      id: "WP2",
      latitude: "37.7752",
      longitude: "-122.4180",
      description: "North residential area - focus on apartment buildings"
    },
    {
      id: "WP3",
      latitude: "37.7758",
      longitude: "-122.4166",
      description: "Riverbank erosion hotspot"
    },
    {
      id: "WP4",
      latitude: "37.7765",
      longitude: "-122.4152",
      description: "Damaged bridge infrastructure"
    },
    {
      id: "WP5",
      latitude: "37.7772",
      longitude: "-122.4138",
      description: "End point - Emergency response staging area"
    }
  ];

  // Create an SVG path for visualization
  const path = "M100,250 C150,150 250,100 350,200 S450,300 550,250 S650,100 750,180";

  const routeResult = {
    route: {
      distance: "4.2 km",
      duration: "36 minutes",
      waypoints,
      path
    },
    recommendations: `Based on the request "${request.prompt}", we recommend deploying during the morning hours (7-10 AM) for optimal lighting conditions. Use drone model DJI-422 with the higher capacity battery for this mission. Consider capturing both RGB and thermal imagery to identify water ingress in structures.`
  };

  // Store in the database
  try {
    const routePlan: InsertRoutePlan = {
      prompt: request.prompt,
      route: JSON.stringify(routeResult.route),
      recommendations: routeResult.recommendations,
      taskId: null
    };
    
    await storage.createRoutePlan(routePlan);
    console.log("Fallback route plan stored successfully in the database");
  } catch (dbError) {
    console.error("Error storing fallback route plan in database:", dbError);
    // Continue with the response even if database storage fails
  }

  return routeResult;
}
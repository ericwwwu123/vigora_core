import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, validateTaskSchema, insertActivitySchema, insertRoutePlanSchema, taskStatusEnum, taskPriorityEnum, type AIRouteRequest } from "@shared/schema";
import { generateRoutePlan } from "./openai";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Prefix all routes with /api
  
  // Tasks endpoints
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getAllTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }

      const task = await storage.getTask(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch task" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const validationResult = validateTaskSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid task data", 
          errors: validationResult.error.errors 
        });
      }

      const newTask = await storage.createTask(validationResult.data);
      
      // Create activity record for the new task
      await storage.createActivity({
        type: "task_created",
        description: `New task #${newTask.id} "${newTask.name}" created`,
        relatedId: newTask.id,
        status: "new"
      });

      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }

      const existingTask = await storage.getTask(id);
      if (!existingTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      const validationResult = validateTaskSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid task data", 
          errors: validationResult.error.errors 
        });
      }

      const updatedTask = await storage.updateTask(id, validationResult.data);
      
      // Create activity record for status changes
      if (existingTask.status !== updatedTask.status) {
        await storage.createActivity({
          type: "task_updated",
          description: `Task #${id} "${updatedTask.name}" status changed from ${existingTask.status} to ${updatedTask.status}`,
          relatedId: id,
          status: updatedTask.status
        });
      }

      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }

      const task = await storage.getTask(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      await storage.deleteTask(id);
      
      // Create activity record for the deleted task
      await storage.createActivity({
        type: "task_deleted",
        description: `Task #${id} "${task.name}" deleted`,
        relatedId: id,
        status: "cancelled"
      });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Activities endpoints
  app.get("/api/activities", async (req, res) => {
    try {
      const activities = await storage.getAllActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Drones endpoints
  app.get("/api/drones", async (req, res) => {
    try {
      const drones = await storage.getAllDrones();
      res.json(drones);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch drones" });
    }
  });

  // AI Route Planning endpoints
  app.post("/api/insights", async (req, res) => {
    try {
      const requestSchema = z.object({
        prompt: z.string().min(10, "Prompt must be at least 10 characters"),
        maxDistance: z.number().optional(),
        maxDuration: z.number().optional(),
        includeNoFlyZones: z.boolean().optional()
      });

      const validationResult = requestSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid request data", 
          errors: validationResult.error.errors 
        });
      }

      const request: AIRouteRequest = validationResult.data;
      const routePlan = await generateRoutePlan(request);
      
      // Store the generated route plan
      const savedRoutePlan = await storage.createRoutePlan({
        prompt: request.prompt,
        route: JSON.stringify(routePlan.route),
        recommendations: routePlan.recommendations,
        taskId: null
      });

      // Create activity record for the AI insight
      await storage.createActivity({
        type: "ai_insight",
        description: `AI generated a new route plan based on the prompt`,
        relatedId: savedRoutePlan.id,
        status: "new"
      });

      res.json({
        id: savedRoutePlan.id,
        ...routePlan
      });
    } catch (error) {
      console.error("Error generating route plan:", error);
      res.status(500).json({ 
        message: "Failed to generate route plan", 
        error: error.message 
      });
    }
  });

  app.get("/api/route-plans", async (req, res) => {
    try {
      const routePlans = await storage.getAllRoutePlans();
      res.json(routePlans.map(plan => ({
        ...plan,
        route: JSON.parse(plan.route)
      })));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch route plans" });
    }
  });

  app.get("/api/route-plans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid route plan ID" });
      }

      const routePlan = await storage.getRoutePlan(id);
      if (!routePlan) {
        return res.status(404).json({ message: "Route plan not found" });
      }

      res.json({
        ...routePlan,
        route: JSON.parse(routePlan.route)
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch route plan" });
    }
  });

  // Dashboard stats endpoint
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const tasks = await storage.getAllTasks();
      const drones = await storage.getAllDrones();
      
      // Calculate stats
      const activeTasks = tasks.filter(task => task.status === "in_progress").length;
      const completedTasks = tasks.filter(task => task.status === "completed").length;
      const availableDrones = drones.filter(drone => drone.status === "available").length;
      const totalDrones = drones.length;

      // System health is just a mock value since we don't have real drone telemetry
      const systemHealth = 98;
      
      res.json({
        activeTasks,
        completedTasks,
        droneFleetStatus: `${availableDrones}/${totalDrones}`,
        systemHealth: `${systemHealth}%`
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Initialize with seed data if needed
  await initializeSeedData();
  
  const httpServer = createServer(app);
  return httpServer;
}

// Initialize seed data for demo purposes
async function initializeSeedData() {
  try {
    // Check if we already have data
    const existingTasks = await storage.getAllTasks();
    if (existingTasks.length > 0) {
      return; // Already initialized
    }
    
    // Initialize with sample drones
    const drones = [
      { identifier: "DJI-422", model: "DJI Mavic 3", status: "available", batteryLevel: 100 },
      { identifier: "HS-119", model: "Holy Stone HS720E", status: "available", batteryLevel: 85 },
      { identifier: "SR-201", model: "Skydio R1", status: "in_mission", batteryLevel: 72 }
    ];
    
    for (const drone of drones) {
      await storage.createDrone(drone);
    }
    
    // Initialize with sample tasks
    const tasks = [
      {
        name: "Riverside Monitoring",
        description: "Monitor water levels and potential flood risks",
        latitude: "37.7749",
        longitude: "-122.4194",
        duration: 45,
        status: "in_progress",
        priority: "medium",
        assignedTo: "DJI-422"
      },
      {
        name: "Downtown Survey",
        description: "Comprehensive survey of downtown infrastructure",
        latitude: "37.7833",
        longitude: "-122.4167",
        duration: 60,
        status: "completed",
        priority: "low",
        assignedTo: "DJI-422"
      },
      {
        name: "Traffic Monitoring",
        description: "Real-time traffic monitoring of main highways",
        latitude: "37.7833",
        longitude: "-122.4167",
        duration: 120,
        status: "on_hold",
        priority: "high",
        assignedTo: "HS-119"
      },
      {
        name: "Building Inspection",
        description: "Structural integrity assessment of old buildings",
        latitude: "37.7935",
        longitude: "-122.3964",
        duration: 30,
        status: "in_progress",
        priority: "medium",
        assignedTo: "SR-201"
      },
      {
        name: "Night Patrol",
        description: "Security patrol of industrial area at night",
        latitude: "37.7935",
        longitude: "-122.3964",
        duration: 180,
        status: "cancelled",
        priority: "high",
        assignedTo: null
      }
    ];
    
    for (const task of tasks) {
      await storage.createTask(task);
    }
    
    // Initialize with sample activities
    const activities = [
      {
        type: "drone_active",
        description: "Drone DJI-422 started emergency response task",
        relatedId: 1,
        status: "active"
      },
      {
        type: "task_completed",
        description: "Task #341 \"Downtown Survey\" completed successfully",
        relatedId: 2,
        status: "completed"
      },
      {
        type: "drone_warning",
        description: "Drone HS-119 reported low battery warning",
        relatedId: 3,
        status: "warning"
      },
      {
        type: "task_created",
        description: "New task #342 \"Riverside Monitoring\" created",
        relatedId: 1,
        status: "new"
      },
      {
        type: "task_cancelled",
        description: "Task #339 \"Night Patrol\" cancelled",
        relatedId: 5,
        status: "cancelled"
      }
    ];
    
    for (const activity of activities) {
      await storage.createActivity(activity);
    }
    
    console.log("Seed data initialized successfully");
  } catch (error) {
    console.error("Failed to initialize seed data:", error);
  }
}

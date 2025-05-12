import { pgTable, text, serial, integer, boolean, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema remains unchanged
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Task schema for Vigora Core
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  duration: integer("duration").notNull(), // duration in minutes
  status: text("status").notNull().default("pending"), // pending, in_progress, completed, cancelled, on_hold
  priority: text("priority").notNull().default("medium"), // low, medium, high
  assignedTo: text("assigned_to"), // drone identifier
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  name: true,
  description: true,
  latitude: true,
  longitude: true,
  duration: true,
  status: true,
  priority: true,
  assignedTo: true,
});

// Activity schema for tracking system events
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // task_created, task_completed, drone_warning, etc.
  description: text("description").notNull(),
  relatedId: integer("related_id"), // related task or drone id
  status: text("status"), // active, warning, completed, cancelled, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  type: true,
  description: true,
  relatedId: true,
  status: true,
});

// Route plan schema for AI-generated routes
export const routePlans = pgTable("route_plans", {
  id: serial("id").primaryKey(),
  prompt: text("prompt").notNull(),
  route: text("route").notNull(), // JSON string with waypoints and path data
  recommendations: text("recommendations"),
  taskId: integer("task_id"), // related task if any
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRoutePlanSchema = createInsertSchema(routePlans).pick({
  prompt: true,
  route: true,
  recommendations: true,
  taskId: true,
});

// Drone schema for drones in the system
export const drones = pgTable("drones", {
  id: serial("id").primaryKey(),
  identifier: text("identifier").notNull().unique(),
  model: text("model").notNull(),
  status: text("status").notNull().default("available"), // available, in_mission, maintenance, etc.
  batteryLevel: integer("battery_level").notNull().default(100),
});

export const insertDroneSchema = createInsertSchema(drones).pick({
  identifier: true,
  model: true,
  status: true,
  batteryLevel: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type RoutePlan = typeof routePlans.$inferSelect;
export type InsertRoutePlan = z.infer<typeof insertRoutePlanSchema>;

export type Drone = typeof drones.$inferSelect;
export type InsertDrone = z.infer<typeof insertDroneSchema>;

// Define relations between tables
export const tasksRelations = relations(tasks, ({ one, many }) => ({
  drone: one(drones, {
    fields: [tasks.assignedTo],
    references: [drones.identifier],
  }),
  activities: many(activities),
  routePlan: one(routePlans, {
    fields: [tasks.id],
    references: [routePlans.taskId],
  }),
}));

export const dronesRelations = relations(drones, ({ many }) => ({
  tasks: many(tasks),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  task: one(tasks, {
    fields: [activities.relatedId],
    references: [tasks.id],
    relationName: 'task_activities',
  }),
}));

export const routePlansRelations = relations(routePlans, ({ one }) => ({
  task: one(tasks, {
    fields: [routePlans.taskId],
    references: [tasks.id],
  }),
}));

// Zod schemas for validation
export const taskStatusEnum = z.enum([
  "pending", 
  "in_progress", 
  "completed", 
  "cancelled", 
  "on_hold"
]);

export const taskPriorityEnum = z.enum([
  "low", 
  "medium", 
  "high"
]);

export const validateTaskSchema = insertTaskSchema.extend({
  status: taskStatusEnum,
  priority: taskPriorityEnum,
  latitude: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Latitude must be a valid number",
  }),
  longitude: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Longitude must be a valid number",
  }),
  duration: z.number().positive({
    message: "Duration must be a positive number",
  }),
});

// Waypoint type for route plans
export type Waypoint = {
  id: string;
  latitude: string;
  longitude: string;
  description?: string;
};

// Route type for AI-generated routes
export type Route = {
  distance: string;
  duration: string;
  waypoints: Waypoint[];
  path: string; // SVG path data
};

// AI request type
export type AIRouteRequest = {
  prompt: string;
  maxDistance?: number;
  maxDuration?: number;
  includeNoFlyZones?: boolean;
};

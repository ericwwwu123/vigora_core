import { 
  users, type User, type InsertUser,
  tasks, type Task, type InsertTask,
  activities, type Activity, type InsertActivity,
  drones, type Drone, type InsertDrone,
  routePlans, type RoutePlan, type InsertRoutePlan,
  tasksRelations, dronesRelations, activitiesRelations, routePlansRelations
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Task methods
  getTask(id: number): Promise<Task | undefined>;
  getAllTasks(): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task>;
  deleteTask(id: number): Promise<void>;
  
  // Activity methods
  getActivity(id: number): Promise<Activity | undefined>;
  getAllActivities(): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Drone methods
  getDrone(id: number): Promise<Drone | undefined>;
  getAllDrones(): Promise<Drone[]>;
  createDrone(drone: InsertDrone): Promise<Drone>;
  
  // Route Plan methods
  getRoutePlan(id: number): Promise<RoutePlan | undefined>;
  getAllRoutePlans(): Promise<RoutePlan[]>;
  createRoutePlan(routePlan: InsertRoutePlan): Promise<RoutePlan>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tasks: Map<number, Task>;
  private activities: Map<number, Activity>;
  private drones: Map<number, Drone>;
  private routePlans: Map<number, RoutePlan>;
  
  private userIdCounter: number;
  private taskIdCounter: number;
  private activityIdCounter: number;
  private droneIdCounter: number;
  private routePlanIdCounter: number;
  
  currentId: number; // Legacy, keep for compatibility

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.activities = new Map();
    this.drones = new Map();
    this.routePlans = new Map();
    
    this.userIdCounter = 1;
    this.taskIdCounter = 1;
    this.activityIdCounter = 1;
    this.droneIdCounter = 1;
    this.routePlanIdCounter = 1;
    
    this.currentId = 1; // Legacy, keep for compatibility
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Task methods
  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }
  
  async getAllTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }
  
  async createTask(task: InsertTask): Promise<Task> {
    const id = this.taskIdCounter++;
    const now = new Date();
    const newTask: Task = { 
      ...task, 
      id, 
      createdAt: now,
      status: task.status || "pending",
      description: task.description || null,
      priority: task.priority || "medium",
      assignedTo: task.assignedTo || null
    };
    this.tasks.set(id, newTask);
    return newTask;
  }
  
  async updateTask(id: number, taskUpdate: Partial<InsertTask>): Promise<Task> {
    const existingTask = this.tasks.get(id);
    if (!existingTask) {
      throw new Error(`Task with id ${id} not found`);
    }
    
    const updatedTask: Task = { ...existingTask, ...taskUpdate };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }
  
  async deleteTask(id: number): Promise<void> {
    this.tasks.delete(id);
  }
  
  // Activity methods
  async getActivity(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }
  
  async getAllActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values());
  }
  
  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = this.activityIdCounter++;
    const now = new Date();
    const newActivity: Activity = { 
      ...activity, 
      id, 
      createdAt: now,
      status: activity.status || null,
      relatedId: activity.relatedId || null 
    };
    this.activities.set(id, newActivity);
    return newActivity;
  }
  
  // Drone methods
  async getDrone(id: number): Promise<Drone | undefined> {
    return this.drones.get(id);
  }
  
  async getAllDrones(): Promise<Drone[]> {
    return Array.from(this.drones.values());
  }
  
  async createDrone(drone: InsertDrone): Promise<Drone> {
    const id = this.droneIdCounter++;
    const newDrone: Drone = { 
      ...drone, 
      id,
      status: drone.status || "available",
      batteryLevel: drone.batteryLevel || 100
    };
    this.drones.set(id, newDrone);
    return newDrone;
  }
  
  // Route Plan methods
  async getRoutePlan(id: number): Promise<RoutePlan | undefined> {
    return this.routePlans.get(id);
  }
  
  async getAllRoutePlans(): Promise<RoutePlan[]> {
    return Array.from(this.routePlans.values());
  }
  
  async createRoutePlan(routePlan: InsertRoutePlan): Promise<RoutePlan> {
    const id = this.routePlanIdCounter++;
    const now = new Date();
    const newRoutePlan: RoutePlan = { 
      ...routePlan, 
      id, 
      createdAt: now,
      recommendations: routePlan.recommendations || null,
      taskId: routePlan.taskId || null
    };
    this.routePlans.set(id, newRoutePlan);
    return newRoutePlan;
  }
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Task methods
  async getTask(id: number): Promise<Task | undefined> {
    // Using a simple query for now to ensure compatibility
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    
    // In a future update, we could expand this to include related entities
    // by using the relations we've established
    return task;
  }
  
  async getAllTasks(): Promise<Task[]> {
    return await db.select()
      .from(tasks)
      .orderBy(desc(tasks.createdAt));
  }
  
  async createTask(task: InsertTask): Promise<Task> {
    const now = new Date();
    const taskToInsert = {
      ...task,
      createdAt: now,
      status: task.status || "pending",
      description: task.description || null,
      priority: task.priority || "medium",
      assignedTo: task.assignedTo || null
    };
    
    const [newTask] = await db
      .insert(tasks)
      .values(taskToInsert)
      .returning();
    return newTask;
  }
  
  async updateTask(id: number, taskUpdate: Partial<InsertTask>): Promise<Task> {
    const [updatedTask] = await db
      .update(tasks)
      .set(taskUpdate)
      .where(eq(tasks.id, id))
      .returning();
    
    if (!updatedTask) {
      throw new Error(`Task with id ${id} not found`);
    }
    
    return updatedTask;
  }
  
  async deleteTask(id: number): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }
  
  // Activity methods
  async getActivity(id: number): Promise<Activity | undefined> {
    const [activity] = await db.select().from(activities).where(eq(activities.id, id));
    return activity;
  }
  
  async getAllActivities(): Promise<Activity[]> {
    return await db.select()
      .from(activities)
      .orderBy(desc(activities.createdAt));
  }
  
  async createActivity(activity: InsertActivity): Promise<Activity> {
    const now = new Date();
    const activityToInsert = {
      ...activity,
      createdAt: now,
      status: activity.status || null,
      relatedId: activity.relatedId || null
    };
    
    const [newActivity] = await db
      .insert(activities)
      .values(activityToInsert)
      .returning();
    return newActivity;
  }
  
  // Drone methods
  async getDrone(id: number): Promise<Drone | undefined> {
    const [drone] = await db.select().from(drones).where(eq(drones.id, id));
    return drone;
  }
  
  async getAllDrones(): Promise<Drone[]> {
    return await db.select().from(drones);
  }
  
  async createDrone(drone: InsertDrone): Promise<Drone> {
    const droneToInsert = {
      ...drone,
      status: drone.status || "available",
      batteryLevel: drone.batteryLevel || 100
    };
    
    const [newDrone] = await db
      .insert(drones)
      .values(droneToInsert)
      .returning();
    return newDrone;
  }
  
  // Route Plan methods
  async getRoutePlan(id: number): Promise<RoutePlan | undefined> {
    const [routePlan] = await db.select().from(routePlans).where(eq(routePlans.id, id));
    return routePlan;
  }
  
  async getAllRoutePlans(): Promise<RoutePlan[]> {
    return await db.select()
      .from(routePlans)
      .orderBy(desc(routePlans.createdAt));
  }
  
  async createRoutePlan(routePlan: InsertRoutePlan): Promise<RoutePlan> {
    const now = new Date();
    const routePlanToInsert = {
      ...routePlan,
      createdAt: now,
      recommendations: routePlan.recommendations || null,
      taskId: routePlan.taskId || null
    };
    
    const [newRoutePlan] = await db
      .insert(routePlans)
      .values(routePlanToInsert)
      .returning();
    return newRoutePlan;
  }
}

export const storage = new DatabaseStorage();

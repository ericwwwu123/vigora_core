import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { validateTaskSchema, Task, Drone } from "@shared/schema";

interface TaskFormProps {
  onSubmit: (data: Omit<Task, 'id' | 'createdAt'>) => void;
  task: Task | null;
  drones: Drone[];
  isSubmitting?: boolean;
  onCancel: () => void;
}

export default function TaskForm({ onSubmit, task, drones, isSubmitting = false, onCancel }: TaskFormProps) {
  // Create form
  const form = useForm<z.infer<typeof validateTaskSchema>>({
    resolver: zodResolver(validateTaskSchema),
    defaultValues: {
      name: task?.name || "",
      description: task?.description || "",
      latitude: task?.latitude || "",
      longitude: task?.longitude || "",
      duration: task?.duration || 30,
      status: task?.status || "pending",
      priority: task?.priority || "medium",
      assignedTo: task?.assignedTo || undefined
    },
  });

  // Form submission handler
  function handleSubmit(values: z.infer<typeof validateTaskSchema>) {
    onSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-400">Task Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter task name" 
                  {...field} 
                  className="bg-gray-900 border-gray-700 text-white" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-400">Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Task description" 
                  {...field} 
                  className="bg-gray-900 border-gray-700 text-white" 
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-400">Latitude</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="37.7749" 
                    {...field} 
                    className="bg-gray-900 border-gray-700 text-white" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-400">Longitude</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="-122.4194" 
                    {...field} 
                    className="bg-gray-900 border-gray-700 text-white" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-400">Duration (minutes)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Enter duration" 
                  {...field}
                  value={field.value}
                  onChange={e => field.onChange(parseInt(e.target.value))}
                  className="bg-gray-900 border-gray-700 text-white" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assignedTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-400">Assign Drone</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Select a drone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                  <SelectItem value="">Not assigned</SelectItem>
                  {drones?.map(drone => (
                    <SelectItem key={drone.id} value={drone.identifier}>
                      {drone.identifier} ({drone.model}) - {drone.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-400">Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-gray-400">Priority</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="low" className="text-primary" />
                    </FormControl>
                    <FormLabel className="text-gray-300">Low</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="medium" className="text-warning" />
                    </FormControl>
                    <FormLabel className="text-gray-300">Medium</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="high" className="text-destructive" />
                    </FormControl>
                    <FormLabel className="text-gray-300">High</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-3 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : (task ? "Update Task" : "Create Task")}
          </Button>
        </div>
      </form>
    </Form>
  );
}

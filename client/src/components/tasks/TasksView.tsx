import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { PlusIcon } from 'lucide-react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { Task } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function TasksView() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch tasks
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
  });
  
  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (task: Omit<Task, 'id' | 'createdAt'>) => {
      const response = await apiRequest('POST', '/api/tasks', task);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Task created",
        description: "The task has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      setSelectedTask(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to create task",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, task }: { id: number, task: Omit<Task, 'id' | 'createdAt'> }) => {
      const response = await apiRequest('PUT', `/api/tasks/${id}`, task);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Task updated",
        description: "The task has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      setSelectedTask(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to update task",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/tasks/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete task",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Handle form submission
  const handleSubmit = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (selectedTask) {
      // Update existing task
      await updateTaskMutation.mutate({ id: selectedTask.id, task: taskData });
    } else {
      // Create new task
      await createTaskMutation.mutate(taskData);
    }
  };
  
  // Handle edit action
  const handleEdit = (task: Task) => {
    setSelectedTask(task);
  };
  
  // Handle delete action
  const handleDelete = async (id: number) => {
    await deleteTaskMutation.mutate(id);
  };
  
  // Fetch all available drones for dropdown in form
  const { data: drones } = useQuery({
    queryKey: ['/api/drones'],
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Task Management</h1>
        <div>
          <Button onClick={() => setSelectedTask(null)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Task Form */}
        <div className="md:col-span-1">
          <Card className="bg-[#161a1d] border-gray-800 shadow-lg">
            <CardHeader>
              <h3 className="font-semibold text-white">
                {selectedTask ? `Edit Task #${selectedTask.id}` : 'Create New Task'}
              </h3>
            </CardHeader>
            <CardContent>
              <TaskForm 
                onSubmit={handleSubmit} 
                task={selectedTask}
                drones={drones || []}
                isSubmitting={createTaskMutation.isPending || updateTaskMutation.isPending}
                onCancel={() => setSelectedTask(null)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Task List */}
        <div className="md:col-span-2">
          <Card className="bg-[#161a1d] border-gray-800 shadow-lg">
            <CardHeader className="p-4 border-b border-gray-800">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-white">Task List</h3>
                <div className="flex space-x-2">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search tasks..." 
                      className="w-64 px-3 py-1.5 pr-8 rounded-md bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                    </div>
                  </div>
                  <Button variant="outline" size="icon" className="p-2 rounded-md bg-gray-900 border border-gray-700 text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <TaskList 
              tasks={tasks || []} 
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={deleteTaskMutation.isPending}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

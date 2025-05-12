import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Task } from "@shared/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

export default function TaskList({ tasks, isLoading, onEdit, onDelete, isDeleting }: TaskListProps) {
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  
  // Calculate pagination
  const totalTasks = tasks.length;
  const totalPages = Math.ceil(totalTasks / pageSize);
  const startIndex = (page - 1) * pageSize;
  const displayedTasks = tasks.slice(startIndex, startIndex + pageSize);
  
  // Handle delete confirmation
  const confirmDelete = () => {
    if (deleteTask) {
      onDelete(deleteTask.id);
      setDeleteTask(null);
    }
  };
  
  // Render status badge with appropriate color
  const StatusBadge = ({ status }: { status: string }) => {
    let badgeClass = "";
    let label = "";
    
    switch (status) {
      case 'pending':
        badgeClass = "bg-gray-500/20 text-gray-500";
        label = "Pending";
        break;
      case 'in_progress':
        badgeClass = "bg-primary/20 text-primary";
        label = "In Progress";
        break;
      case 'completed':
        badgeClass = "bg-success/20 text-success";
        label = "Completed";
        break;
      case 'on_hold':
        badgeClass = "bg-warning/20 text-warning";
        label = "On Hold";
        break;
      case 'cancelled':
        badgeClass = "bg-destructive/20 text-destructive";
        label = "Cancelled";
        break;
    }
    
    return (
      <Badge variant="outline" className={`${badgeClass} border-0`}>
        {label}
      </Badge>
    );
  };
  
  // Render priority badge with appropriate color
  const PriorityBadge = ({ priority }: { priority: string }) => {
    let badgeClass = "";
    let label = "";
    
    switch (priority) {
      case 'low':
        badgeClass = "bg-primary/20 text-primary";
        label = "Low";
        break;
      case 'medium':
        badgeClass = "bg-warning/20 text-warning";
        label = "Medium";
        break;
      case 'high':
        badgeClass = "bg-destructive/20 text-destructive";
        label = "High";
        break;
    }
    
    return (
      <Badge variant="outline" className={`${badgeClass} border-0`}>
        {label}
      </Badge>
    );
  };
  
  // Format date to readable format
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800">
              <TableHead className="text-gray-400">ID</TableHead>
              <TableHead className="text-gray-400">Task</TableHead>
              <TableHead className="text-gray-400">Location</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400">Priority</TableHead>
              <TableHead className="text-gray-400">Created</TableHead>
              <TableHead className="text-right text-gray-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-gray-400">
                  Loading tasks...
                </TableCell>
              </TableRow>
            ) : displayedTasks.length > 0 ? (
              displayedTasks.map((task) => (
                <TableRow key={task.id} className="border-gray-800 hover:bg-gray-800/50">
                  <TableCell className="font-medium text-white">#{task.id}</TableCell>
                  <TableCell className="text-gray-300">{task.name}</TableCell>
                  <TableCell className="text-gray-300">{task.latitude}° N, {task.longitude}° W</TableCell>
                  <TableCell>
                    <StatusBadge status={task.status} />
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={task.priority} />
                  </TableCell>
                  <TableCell className="text-gray-300">{formatDate(task.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-gray-300 mr-3"
                      onClick={() => onEdit(task)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => setDeleteTask(task)}
                      disabled={isDeleting}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-gray-400">
                  No tasks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-800 flex justify-between">
          <div className="text-sm text-gray-400">
            Showing {startIndex + 1}-{Math.min(startIndex + pageSize, totalTasks)} of {totalTasks} tasks
          </div>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              className="px-3 py-1 rounded-md bg-gray-900 border border-gray-700 text-gray-400"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === page ? "default" : "outline"}
                size="sm"
                className={pageNum === page 
                  ? "px-3 py-1 rounded-md bg-primary border border-primary text-white" 
                  : "px-3 py-1 rounded-md bg-gray-900 border border-gray-700 text-gray-400"
                }
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              className="px-3 py-1 rounded-md bg-gray-900 border border-gray-700 text-gray-400"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </Button>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTask} onOpenChange={() => setDeleteTask(null)}>
        <AlertDialogContent className="bg-[#161a1d] border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete task #{deleteTask?.id} "{deleteTask?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

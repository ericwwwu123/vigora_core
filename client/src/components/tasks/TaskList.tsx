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
  const formatDate = (dateString: string | Date | null) => {
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
              <TableHead className="text-gray-400 w-16">#</TableHead>
              <TableHead className="text-gray-400">Task Details</TableHead>
              <TableHead className="text-gray-400">Location & Duration</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400">Priority</TableHead>
              <TableHead className="text-gray-400">Created At</TableHead>
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
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-white font-medium">{task.name}</span>
                      {task.description && (
                        <span className="text-gray-400 text-sm mt-1 line-clamp-2">{task.description}</span>
                      )}
                      {task.assignedTo && (
                        <span className="text-primary text-xs mt-1 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                          </svg>
                          Assigned to: {task.assignedTo}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="text-white flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>{task.latitude}° N, {task.longitude}° W</span>
                      </div>
                      <div className="text-gray-400 text-sm mt-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>{task.duration} minutes</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <StatusBadge status={task.status} />
                      <div className="text-gray-400 text-xs">
                        {task.status === 'in_progress' ? 'Started 2 hours ago' : 
                         task.status === 'completed' ? 'Completed yesterday' : 
                         task.status === 'on_hold' ? 'On hold since yesterday' : 
                         'Waiting to start'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <PriorityBadge priority={task.priority} />
                      <div className="text-xs text-gray-400 flex items-center">
                        {task.priority === 'high' ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-destructive" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="12" y1="8" x2="12" y2="12"></line>
                              <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            Urgent attention needed
                          </>
                        ) : task.priority === 'medium' ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                              <line x1="12" y1="9" x2="12" y2="13"></line>
                              <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                            Handle within 24 hours
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                              <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                            Scheduled task
                          </>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    <div className="flex flex-col">
                      <span>{formatDate(task.createdAt)}</span>
                      <span className="text-xs text-gray-400 mt-1">
                        ID: #{task.id}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" className="mr-2 flex items-center bg-primary/10 hover:bg-primary/20 border-primary/20 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        Details
                      </Button>
                      <div className="flex">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-gray-300 mr-1"
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
                      </div>
                    </div>
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

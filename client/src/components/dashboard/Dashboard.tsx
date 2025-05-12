import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon, PlusIcon } from 'lucide-react';
import StatCard from './StatCard';
import MapView from './MapView';
import ActivityList from './ActivityList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Task } from '@shared/schema';

export default function Dashboard() {
  // Fetch dashboard stats
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  // Fetch tasks
  const { data: tasks, isLoading: isTasksLoading } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
  });

  // Fetch activities
  const { data: activities, isLoading: isActivitiesLoading } = useQuery({
    queryKey: ['/api/activities'],
  });

  // Filter just active tasks for the table
  const activeTasks = tasks?.filter(task => 
    task.status === 'in_progress' || task.status === 'on_hold'
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Operational Dashboard</h1>
        <div className="flex space-x-4">
          <Button variant="outline" className="bg-[#161a1d] border-gray-700 text-white hover:bg-gray-800">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Last 24 hours
          </Button>
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Active Tasks"
          value={isStatsLoading ? "Loading..." : stats?.activeTasks.toString() || "0"}
          icon="tasks"
          trend={{
            value: "12%",
            direction: "up",
            label: "from yesterday"
          }}
          color="primary"
        />
        
        <StatCard
          title="Drone Fleet Status"
          value={isStatsLoading ? "Loading..." : stats?.droneFleetStatus || "0/0"}
          icon="drone"
          trend={{
            value: "2",
            direction: "warning",
            label: "in maintenance"
          }}
          color="warning"
        />
        
        <StatCard
          title="Completed Tasks"
          value={isStatsLoading ? "Loading..." : stats?.completedTasks.toString() || "0"}
          icon="check-circle"
          trend={{
            value: "8%",
            direction: "up",
            label: "from last week"
          }}
          color="success"
        />
        
        <StatCard
          title="System Health"
          value={isStatsLoading ? "Loading..." : stats?.systemHealth || "0%"}
          icon="heartbeat"
          trend={{
            value: "",
            direction: "up",
            label: "All systems operational"
          }}
          color="success"
        />
      </div>

      {/* Map and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View */}
        <div className="lg:col-span-2">
          <Card className="bg-[#161a1d] border-gray-800 shadow-lg">
            <CardHeader className="p-4 border-b border-gray-800">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-white">Operational Map</h3>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" className="hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
                  </Button>
                  <Button variant="ghost" size="icon" className="hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative h-96">
                <MapView />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed */}
        <Card className="bg-[#161a1d] border-gray-800 shadow-lg">
          <CardHeader className="p-4 border-b border-gray-800">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-white">Recent Activity</h3>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38"/></svg>
              </Button>
            </div>
          </CardHeader>
          <ActivityList activities={activities} isLoading={isActivitiesLoading} />
          <div className="p-3 border-t border-gray-800">
            <Button variant="ghost" className="w-full text-sm text-gray-400 hover:text-white">
              View All Activity
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </Button>
          </div>
        </Card>
      </div>

      {/* Active Tasks Section */}
      <div className="mt-6">
        <h2 className="text-xl font-bold text-white mb-4">Active Tasks</h2>
        <Card className="bg-[#161a1d] border-gray-800 shadow-lg">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-400">Task ID</TableHead>
                  <TableHead className="text-gray-400">Name</TableHead>
                  <TableHead className="text-gray-400">Location</TableHead>
                  <TableHead className="text-gray-400">Duration</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Assigned To</TableHead>
                  <TableHead className="text-right text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isTasksLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Loading tasks...
                    </TableCell>
                  </TableRow>
                ) : activeTasks && activeTasks.length > 0 ? (
                  activeTasks.map((task) => (
                    <TableRow key={task.id} className="border-gray-800 hover:bg-gray-800/50">
                      <TableCell className="font-medium text-white">#{task.id}</TableCell>
                      <TableCell className="text-gray-300">{task.name}</TableCell>
                      <TableCell className="text-gray-300">{task.latitude}° N, {task.longitude}° W</TableCell>
                      <TableCell className="text-gray-300">{task.duration} minutes</TableCell>
                      <TableCell>
                        <StatusBadge status={task.status} />
                      </TableCell>
                      <TableCell className="text-gray-300">{task.assignedTo || 'Unassigned'}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-gray-400">
                      No active tasks found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  let badgeClass = "";
  let label = "";
  
  switch (status) {
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
    default:
      badgeClass = "bg-gray-500/20 text-gray-500";
      label = "Pending";
  }
  
  return (
    <Badge variant="outline" className={`${badgeClass} border-0`}>
      {label}
    </Badge>
  );
}

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
  const { data: statsRaw, isLoading: isStatsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  // Fetch tasks
  const { data: tasksRaw, isLoading: isTasksLoading } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
  });

  // Fetch activities
  const { data: activitiesRaw, isLoading: isActivitiesLoading } = useQuery({
    queryKey: ['/api/activities'],
  });

  // Filter just active tasks for the table
  const activeTasks = tasksRaw?.filter(task => 
    task.status === 'in_progress' || task.status === 'on_hold'
  );

  // Demo mock data
  const demoStats = {
    activeTasks: 2,
    droneFleetStatus: '2/3',
    completedTasks: 1,
    systemHealth: '98%'
  };
  const demoTasks = [
    { id: 4, name: 'Building Inspection', latitude: '37.7935', longitude: '-122.3964', duration: 30, status: 'in_progress', assignedTo: 'SR-201' },
    { id: 3, name: 'Traffic Monitoring', latitude: '37.7833', longitude: '-122.4167', duration: 120, status: 'on_hold', assignedTo: 'HS-119' },
    { id: 1, name: 'Riverside Monitoring', latitude: '37.7749', longitude: '-122.4194', duration: 45, status: 'in_progress', assignedTo: 'DJI-422' }
  ];
  const demoActivities = [
    { id: 1, description: 'Task #339 "Night Patrol" cancelled', status: 'cancelled', createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), type: 'task_cancelled', relatedId: 339 },
    { id: 2, description: 'New task #342 "Riverside Monitoring" created', status: 'new', createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), type: 'task_created', relatedId: 342 },
    { id: 3, description: 'Drone HS-119 reported low battery warning', status: 'warning', createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), type: 'drone_warning', relatedId: null },
    { id: 4, description: 'Task #341 "Downtown Survey" completed successfully', status: 'completed', createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), type: 'task_completed', relatedId: 341 },
    { id: 5, description: 'Drone DJI-422 started emergency response task', status: 'active', createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), type: 'drone_active', relatedId: null }
  ];

  // useQuery获取数据后：
  const stats = statsRaw ? statsRaw as any : demoStats;
  const tasks = tasksRaw ? tasksRaw as any[] : demoTasks;
  const activities = activitiesRaw ? activitiesRaw as any[] : demoActivities;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181c22] to-[#23272f] p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">AI Drone Control Center</h1>
        <div className="flex space-x-4">
          <Button variant="outline" className="bg-[#23272f] border-gray-700 text-white hover:bg-gray-800 shadow-md hover:shadow-xl transition">
            <CalendarIcon className="mr-2 h-5 w-5" />
            Last 24 hours
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-2xl transition">
            <PlusIcon className="mr-2 h-5 w-5" />
            New Task
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <StatCard
          title="Active Tasks"
          value={isStatsLoading ? "Loading..." : stats?.activeTasks?.toString() || "0"}
          icon="tasks"
          trend={{ value: "12%", direction: "up", label: "from yesterday" }}
          color="primary"
        />
        <StatCard
          title="Drone Fleet Status"
          value={isStatsLoading ? "Loading..." : stats?.droneFleetStatus || "0/0"}
          icon="drone"
          trend={{ value: "2", direction: "warning", label: "in maintenance" }}
          color="warning"
        />
        <StatCard
          title="Completed Tasks"
          value={isStatsLoading ? "Loading..." : stats?.completedTasks?.toString() || "0"}
          icon="check-circle"
          trend={{ value: "8%", direction: "up", label: "from last week" }}
          color="success"
        />
        <StatCard
          title="System Health"
          value={isStatsLoading ? "Loading..." : stats?.systemHealth || "0%"}
          icon="heartbeat"
          trend={{ value: "", direction: "up", label: "All systems operational" }}
          color="success"
        />
      </div>

      {/* Map and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map View */}
        <div className="lg:col-span-2">
          <Card className="bg-[#23272f] border-none shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="p-4 border-b border-gray-800 bg-gradient-to-r from-[#23272f] to-[#181c22]">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-white text-lg tracking-wide">Operational Map</h3>
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
              <div className="relative h-96 bg-[#181c22]">
                {/* 网格背景 */}
                <div className="absolute inset-0 pointer-events-none opacity-20 z-0" style={{backgroundImage: 'url(/grid.svg)'}} />
                <MapView />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed */}
        <Card className="bg-[#23272f] border-none shadow-2xl rounded-2xl">
          <CardHeader className="p-4 border-b border-gray-800 bg-gradient-to-r from-[#23272f] to-[#181c22]">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-white text-lg tracking-wide">Recent Activity</h3>
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

      {/* Active Tasks Section - 可折叠 */}
      <div className="mt-8">
        <details className="bg-[#23272f] rounded-2xl shadow-2xl">
          <summary className="text-xl font-bold text-white mb-4 px-6 py-4 cursor-pointer select-none">Active Tasks</summary>
          <div className="overflow-x-auto px-6 pb-6">
            <Card className="bg-[#23272f] border-none">
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
                      <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                        {/* 空状态插画和提示 */}
                        <div className="flex flex-col items-center justify-center">
                          <svg width="64" height="64" fill="none" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#23272f"/><path d="M32 44c6.627 0 12-5.373 12-12S38.627 20 32 20 20 25.373 20 32s5.373 12 12 12Z" fill="#2d3748"/><path d="M32 36a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" fill="#4fd1c5"/></svg>
                          <div className="mt-2">No active tasks. Click "New Task" to create one!</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
        </details>
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

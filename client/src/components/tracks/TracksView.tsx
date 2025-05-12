import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import TrackControls from './TrackControls';
import TrackSimulation from './TrackSimulation';
import { useMap } from '@/hooks/use-map';
import { generateDemoRoute } from '@/lib/utils/mapUtils';
import { Task, RoutePlan } from '@shared/schema';

export default function TracksView() {
  const [selectedTask, setSelectedTask] = useState<string>('riverside');
  const [selectedDrone, setSelectedDrone] = useState<string>('DJI-422');
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  
  // Fetch tasks for dropdown
  const { data: tasks, isLoading: isTasksLoading } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
  });
  
  // Fetch drones for dropdown
  const { data: drones, isLoading: isDronesLoading } = useQuery({
    queryKey: ['/api/drones'],
  });
  
  // Fetch route plans
  const { data: routePlans, isLoading: isRoutePlansLoading } = useQuery<RoutePlan[]>({
    queryKey: ['/api/route-plans'],
  });
  
  // Initialize map with demo data
  const demoRoute = generateDemoRoute();
  const map = useMap({
    waypoints: demoRoute.waypoints,
    paths: demoRoute.paths,
    noFlyZones: demoRoute.noFlyZones,
    dronePosition: {
      latitude: "37.7749",
      longitude: "-122.4194",
      heading: 75,
      altitude: 120,
      speed: 7.2,
      batteryLevel: 100
    }
  });
  
  // Handle simulation controls
  const handleStart = () => {
    map.startSimulation();
  };
  
  const handlePause = () => {
    map.pauseSimulation();
  };
  
  const handleStop = () => {
    map.stopSimulation();
  };
  
  const handleReset = () => {
    map.resetSimulation();
  };
  
  const handleSpeedChange = (speed: number) => {
    setSimulationSpeed(speed);
    map.setSimulationSpeed(speed);
  };
  
  // Handle dropdown changes
  const handleTaskChange = (taskId: string) => {
    setSelectedTask(taskId);
    // In a real app, we would load the route for this task
  };
  
  const handleDroneChange = (droneId: string) => {
    setSelectedDrone(droneId);
    // In a real app, we might update drone-specific settings
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Track Simulation</h1>
        <div className="flex space-x-3">
          <Button variant="outline" className="bg-[#161a1d] border-gray-700 text-white hover:bg-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            History
          </Button>
          <Button 
            onClick={handleStart}
            disabled={map.isSimulating}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Start Simulation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Track Controls */}
        <div className="md:col-span-1">
          <TrackControls 
            selectedTask={selectedTask}
            selectedDrone={selectedDrone}
            simulationSpeed={simulationSpeed}
            tasks={tasks}
            drones={drones}
            isSimulating={map.isSimulating}
            onTaskChange={handleTaskChange}
            onDroneChange={handleDroneChange}
            onSpeedChange={handleSpeedChange}
            onStart={handleStart}
            onPause={handlePause}
            onStop={handleStop}
            onReset={handleReset}
          />
        </div>

        {/* Simulation View */}
        <div className="md:col-span-3">
          <Card className="bg-[#161a1d] border-gray-800 shadow-lg">
            <CardHeader className="p-4 border-b border-gray-800">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-white">
                  Simulation: {selectedTask === 'riverside' ? 'Riverside Monitoring (#342)' : selectedTask}
                </h3>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" className="p-2 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 3h18v18H3z"></path>
                      <path d="M8 3v18"></path>
                      <path d="M16 3v18"></path>
                      <path d="M3 8h18"></path>
                      <path d="M3 16h18"></path>
                    </svg>
                  </Button>
                  <Button variant="ghost" size="icon" className="p-2 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  </Button>
                  <Button variant="ghost" size="icon" className="p-2 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="1"></circle>
                      <circle cx="19" cy="12" r="1"></circle>
                      <circle cx="5" cy="12" r="1"></circle>
                    </svg>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <TrackSimulation 
                map={map}
                selectedDrone={selectedDrone}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

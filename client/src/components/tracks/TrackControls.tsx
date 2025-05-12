import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Task, Drone } from '@shared/schema';

interface TrackControlsProps {
  selectedTask: string;
  selectedDrone: string;
  simulationSpeed: number;
  tasks?: Task[];
  drones?: Drone[];
  isSimulating: boolean;
  onTaskChange: (taskId: string) => void;
  onDroneChange: (droneId: string) => void;
  onSpeedChange: (speed: number) => void;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onReset: () => void;
}

export default function TrackControls({ 
  selectedTask,
  selectedDrone,
  simulationSpeed,
  tasks,
  drones,
  isSimulating,
  onTaskChange,
  onDroneChange,
  onSpeedChange,
  onStart,
  onPause,
  onStop,
  onReset
}: TrackControlsProps) {
  const [speedLabel, setSpeedLabel] = useState(`${simulationSpeed}x`);
  
  // Update speed label when simulation speed changes
  useEffect(() => {
    setSpeedLabel(`${simulationSpeed}x`);
  }, [simulationSpeed]);
  
  // Handle slider change
  const handleSpeedSliderChange = (value: number[]) => {
    onSpeedChange(value[0]);
  };

  return (
    <Card className="bg-[#161a1d] border-gray-800 shadow-lg">
      <CardHeader>
        <h3 className="font-semibold text-white">Select Track</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="block text-gray-400 text-sm font-medium mb-2" htmlFor="track-select">
            Task Route
          </Label>
          <Select 
            value={selectedTask} 
            onValueChange={onTaskChange}
          >
            <SelectTrigger className="w-full px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white">
              <SelectValue placeholder="Select a task route" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700 text-white">
              <SelectItem value="riverside">Riverside Monitoring (#342)</SelectItem>
              <SelectItem value="downtown">Downtown Survey (#341)</SelectItem>
              <SelectItem value="traffic">Traffic Monitoring (#340)</SelectItem>
              <SelectItem value="building">Building Inspection (#338)</SelectItem>
              {tasks?.map(task => (
                <SelectItem key={task.id} value={`custom-${task.id}`}>
                  {task.name} (#{task.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="block text-gray-400 text-sm font-medium mb-2" htmlFor="drone-select">
            Drone
          </Label>
          <Select 
            value={selectedDrone} 
            onValueChange={onDroneChange}
          >
            <SelectTrigger className="w-full px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white">
              <SelectValue placeholder="Select a drone" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700 text-white">
              <SelectItem value="DJI-422">DJI-422</SelectItem>
              <SelectItem value="HS-119">HS-119</SelectItem>
              <SelectItem value="SR-201">SR-201</SelectItem>
              {drones?.map((drone: any) => (
                drone.identifier !== 'DJI-422' && 
                drone.identifier !== 'HS-119' && 
                drone.identifier !== 'SR-201' && (
                  <SelectItem key={drone.id} value={drone.identifier}>
                    {drone.identifier} ({drone.model})
                  </SelectItem>
                )
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="mb-6">
          <Label className="block text-gray-400 text-sm font-medium mb-2" htmlFor="simulation-speed">
            Simulation Speed: <span id="speed-value">{speedLabel}</span>
          </Label>
          <Slider
            defaultValue={[simulationSpeed]}
            min={0.5}
            max={10}
            step={0.5}
            onValueChange={handleSpeedSliderChange}
            className="w-full h-2"
          />
        </div>
        
        <div className="space-y-3">
          <Button 
            className="w-full bg-primary hover:bg-primary/80 text-white py-2 rounded-md font-medium"
            onClick={onStart}
            disabled={isSimulating}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Start
          </Button>
          <Button 
            className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-md font-medium"
            onClick={onPause}
            disabled={!isSimulating}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
            Pause
          </Button>
          <Button 
            className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-md font-medium"
            onClick={onStop}
            disabled={!isSimulating}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
            </svg>
            Stop
          </Button>
          <Button 
            className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-md font-medium"
            onClick={onReset}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38"></path>
            </svg>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

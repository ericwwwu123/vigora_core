import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  type DronePosition, 
  type MapWaypoint,
  type MapPath, 
  type NoFlyZone
} from '@/hooks/use-map';

interface TrackSimulationProps {
  map: {
    waypoints: MapWaypoint[];
    paths: MapPath[];
    noFlyZones?: NoFlyZone[];
    dronePosition?: DronePosition;
    progress: number;
    isSimulating: boolean;
    startSimulation: () => void;
    pauseSimulation: () => void;
    stopSimulation: () => void;
  };
  selectedDrone: string;
}

export default function TrackSimulation({ map, selectedDrone }: TrackSimulationProps) {
  const { waypoints, paths, noFlyZones, dronePosition, progress, isSimulating } = map;
  const [timeElapsed, setTimeElapsed] = useState("00:00");
  const [timeTotal, setTimeTotal] = useState("36:00");

  // Update time elapsed based on progress
  useEffect(() => {
    if (progress >= 0) {
      const totalSeconds = 36 * 60; // 36 minutes in seconds
      const elapsedSeconds = Math.floor(progress * totalSeconds);
      const elapsedMinutes = Math.floor(elapsedSeconds / 60);
      const remainingSeconds = elapsedSeconds % 60;
      
      setTimeElapsed(
        `${elapsedMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
      );
    }
  }, [progress]);

  return (
    <div className="relative h-[500px] bg-gray-900 w-full" style={{ 
      backgroundImage: 'url("https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&h=720&q=80")', 
      backgroundSize: 'cover', 
      backgroundPosition: 'center'
    }}>
      {/* Overlay for map information */}
      <div className="absolute inset-0 bg-gray-900/30"></div>
      
      {/* SVG Path Overlay */}
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
          </marker>
        </defs>
        
        {/* Completed path */}
        <path 
          d="M100,400 C150,350 250,300 350,320 S450,380 550,350" 
          fill="none" 
          stroke="#22d3ee" 
          strokeWidth="4" 
          strokeOpacity="0.85"
          filter="drop-shadow(0 0 3px rgba(34, 211, 238, 0.5))"  
          className={isSimulating ? 'path' : ''}
        />
        
        {/* Remaining path (dashed) */}
        <path 
          d="M550,350 S650,300 780,320" 
          fill="none" 
          stroke="#22d3ee" 
          strokeWidth="3" 
          strokeOpacity="0.6" 
          strokeDasharray="5,5"
          filter="drop-shadow(0 0 2px rgba(34, 211, 238, 0.3))" 
        />
        
        {/* Direction indicators */}
        <path 
          d="M100,400 C150,350 250,300 350,320 S450,380 550,350" 
          fill="none" 
          stroke="#22d3ee" 
          strokeWidth="1" 
          strokeOpacity="0" 
          markerEnd="url(#arrowhead)" 
        />
        
        {/* Waypoints */}
        <circle cx="100" cy="400" r="8" fill="#10b981" stroke="#ffffff" strokeWidth="2" filter="drop-shadow(0 0 4px rgba(16, 185, 129, 0.7))" />
        <circle cx="250" cy="300" r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" filter="drop-shadow(0 0 3px rgba(245, 158, 11, 0.7))" />
        <circle cx="450" cy="380" r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" filter="drop-shadow(0 0 3px rgba(245, 158, 11, 0.7))" />
        <circle cx="650" cy="300" r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" filter="drop-shadow(0 0 3px rgba(245, 158, 11, 0.7))" />
        <circle cx="780" cy="320" r="8" fill="#ef4444" stroke="#ffffff" strokeWidth="2" filter="drop-shadow(0 0 4px rgba(239, 68, 68, 0.7))" />
        
        {/* Waypoint labels */}
        <text x="100" y="385" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" filter="drop-shadow(0 0 3px rgba(0, 0, 0, 0.8))">START</text>
        <text x="780" y="305" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" filter="drop-shadow(0 0 3px rgba(0, 0, 0, 0.8))">END</text>
        
        {/* Current drone position */}
        {dronePosition && (
          <>
            <circle 
              cx={progress > 0 ? 100 + (450 * progress) : 100} 
              cy={progress > 0 ? 400 - (50 * progress) : 400} 
              r="10" 
              fill="#06b6d4" 
              stroke="white"
              strokeWidth="2"
              className="animate-pulse" 
              filter="drop-shadow(0 0 6px rgba(6, 182, 212, 0.8))"
            />
            <circle 
              cx={progress > 0 ? 100 + (450 * progress) : 100} 
              cy={progress > 0 ? 400 - (50 * progress) : 400} 
              r="40" 
              fill="#06b6d4" 
              fillOpacity="0.15" 
              stroke="#06b6d4" 
              strokeWidth="1.5" 
              strokeDasharray="3,3" 
            />
          </>
        )}
        
        {/* No-fly zones */}
        <circle 
          cx="400" 
          cy="200" 
          r="50" 
          fill="#ef4444" 
          fillOpacity="0.25" 
          stroke="#ef4444" 
          strokeWidth="3" 
          strokeDasharray="5,5"
          filter="drop-shadow(0 0 4px rgba(239, 68, 68, 0.5))" 
        />
        <path 
          d="M370,170 L430,230 M430,170 L370,230" 
          stroke="#ef4444" 
          strokeWidth="3" 
          strokeLinecap="round"
          strokeOpacity="0.8"
          filter="drop-shadow(0 0 2px rgba(239, 68, 68, 0.5))"
        />
        <text 
          x="400" 
          y="245" 
          textAnchor="middle" 
          dominantBaseline="middle" 
          fill="white" 
          fontSize="11"
          fontWeight="bold"
          filter="drop-shadow(0 0 3px rgba(0, 0, 0, 0.8))"
        >
          NO-FLY ZONE
        </text>
      </svg>
      
      {/* Telemetry overlay */}
      <div className="absolute top-4 left-4 bg-[#161a1d]/80 backdrop-blur-sm p-3 rounded-md border border-gray-700 text-xs max-w-[280px]">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span className="text-gray-400">Coordinates:</span>
          </div>
          <div className="font-mono">
            {dronePosition ? `${dronePosition.latitude.substring(0, 6)}°N, ${dronePosition.longitude.substring(0, 8)}°W` : "37.775°N, 122.419°W"}
          </div>
          
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12h20"></path>
              <path d="M12 2v20"></path>
            </svg>
            <span className="text-gray-400">Altitude:</span>
          </div>
          <div className="font-mono">{dronePosition?.altitude || 120} m</div>
          
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="16 12 12 8 8 12"></polyline>
              <line x1="12" y1="16" x2="12" y2="8"></line>
            </svg>
            <span className="text-gray-400">Speed:</span>
          </div>
          <div className="font-mono">{dronePosition?.speed || 7.2} km/h</div>
          
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
            </svg>
            <span className="text-gray-400">Heading:</span>
          </div>
          <div className="font-mono">{dronePosition?.heading || 75}° NE</div>
          
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 6.184V9c0 .513 1.263 2.678 1.263 2.678a.5.5 0 0 0 .949-.316L8 9"></path>
              <path d="M6 6.184V9c0 .513 1.263 2.678 1.263 2.678a.5.5 0 0 0 .949-.316L8 9"></path>
              <rect x="4" y="4" width="16" height="6" rx="2"></rect>
              <path d="m 6.2 14 h 11.6 c 1.1 0 2 .9 2 2 v 0 c 0 1.1 -.9 2 -2 2 h -11.6 c -1.1 0 -2 -.9 -2 -2 v 0 c 0 -1.1 .9 -2 2 -2 Z"></path>
              <line x1="15" y1="14" x2="15" y2="18"></line>
              <line x1="18" y1="14" x2="18" y2="18"></line>
            </svg>
            <span className="text-gray-400">Battery:</span>
          </div>
          <div className="font-mono">{dronePosition?.batteryLevel || 68}%</div>
          
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span className="text-gray-400">Time Elapsed:</span>
          </div>
          <div className="font-mono">{timeElapsed}</div>
        </div>
      </div>
      
      {/* Mission Status */}
      <div className="absolute bottom-4 left-4 bg-[#161a1d]/80 backdrop-blur-sm p-3 rounded-md border border-gray-700 text-xs">
        <h4 className="font-medium text-white mb-2">Mission Progress</h4>
        <div className="mb-2">
          <div className="flex justify-between mb-1">
            <span className="text-gray-400">Distance</span>
            <span className="text-white">{progress > 0 ? (2.1 * progress).toFixed(1) : '0'} / 4.2 km</span>
          </div>
          <Progress value={progress * 100} className="w-full bg-gray-700 h-1.5" />
        </div>
        <div className="mb-2">
          <div className="flex justify-between mb-1">
            <span className="text-gray-400">Time</span>
            <span className="text-white">{timeElapsed} / {timeTotal}</span>
          </div>
          <Progress value={progress * 100} className="w-full bg-gray-700 h-1.5" />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-400">Waypoints</span>
            <span className="text-white">{Math.ceil(progress * 5)} / 5</span>
          </div>
          <Progress value={progress * 100} className="w-full bg-gray-700 h-1.5" />
        </div>
      </div>
      
      {/* Camera Feed */}
      <div className="absolute bottom-4 right-4 w-64 h-36 bg-black rounded-md overflow-hidden border border-gray-700">
        <img 
          src="https://pixabay.com/get/g8a576b7317663ce127aa8081a952a8c454d38e23bd3551bfe704db1b64042be2879073dd00911a64e811bc72fa9e9b59abfe2ccdb18b2b02a79baa3bf3d3b410_1280.jpg" 
          alt="Drone Camera Feed" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute top-2 left-2 bg-black/70 text-xs text-white px-2 py-1 rounded">LIVE FEED</div>
        <div className="absolute bottom-2 right-2 flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-white text-xs">REC</span>
        </div>
      </div>
      
      {/* Playback Controls */}
      <div className="absolute bottom-0 inset-x-0 p-4 flex justify-center">
        <div className="bg-[#161a1d]/80 backdrop-blur-sm px-4 py-2 rounded-md border border-gray-700 flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-400 hover:text-white"
            onClick={() => map.stopSimulation()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="19 20 9 12 19 4 19 20"></polygon>
              <line x1="5" y1="19" x2="5" y2="5"></line>
            </svg>
          </Button>
          <Button 
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${isSimulating ? 'bg-primary hover:bg-primary/80' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={isSimulating ? map.pauseSimulation : map.startSimulation}
          >
            {isSimulating ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-400 hover:text-white"
            onClick={() => map.startSimulation()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 4 15 12 5 20 5 4"></polygon>
              <line x1="19" y1="5" x2="19" y2="19"></line>
            </svg>
          </Button>
          <div className="h-4 bg-gray-700 rounded-full w-48 relative">
            <div 
              className="h-4 bg-primary rounded-full absolute left-0 top-0" 
              style={{ width: `${progress * 100}%` }}
            ></div>
            <div 
              className="h-6 w-6 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 cursor-pointer" 
              style={{ left: `${progress * 100}%` }}
            ></div>
          </div>
          <span className="text-white text-sm">{timeElapsed} / {timeTotal}</span>
        </div>
      </div>
    </div>
  );
}

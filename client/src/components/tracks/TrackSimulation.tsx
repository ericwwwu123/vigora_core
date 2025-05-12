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
      <div className="absolute top-4 left-4 bg-[#0f1215]/85 backdrop-blur-md p-4 rounded-md border border-gray-700 text-xs max-w-[280px] shadow-lg shadow-black/30">
        <h4 className="font-semibold text-white text-sm mb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 9l-3 3v7.5M12 9l3 3v7.5M12 9v12M5.2 13.5L12 9M18.8 13.5L12 9M12 3L2 9.5M22 9.5L12 3"></path>
          </svg>
          DRONE TELEMETRY · {selectedDrone}
        </h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
          <div className="flex items-center">
            <div className="flex items-center justify-center bg-cyan-900/30 w-6 h-6 rounded-full mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <span className="text-gray-300 font-medium">Location:</span>
          </div>
          <div className="font-mono text-white">
            {dronePosition ? `${dronePosition.latitude.substring(0, 6)}°N, ${dronePosition.longitude.substring(0, 8)}°W` : "37.775°N, 122.419°W"}
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center justify-center bg-cyan-900/30 w-6 h-6 rounded-full mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12h20"></path>
                <path d="M12 2v20"></path>
              </svg>
            </div>
            <span className="text-gray-300 font-medium">Altitude:</span>
          </div>
          <div className="font-mono text-white">{dronePosition?.altitude || 120} m</div>
          
          <div className="flex items-center">
            <div className="flex items-center justify-center bg-cyan-900/30 w-6 h-6 rounded-full mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="16 12 12 8 8 12"></polyline>
                <line x1="12" y1="16" x2="12" y2="8"></line>
              </svg>
            </div>
            <span className="text-gray-300 font-medium">Speed:</span>
          </div>
          <div className="font-mono text-white">{dronePosition?.speed || 7.2} km/h</div>
          
          <div className="flex items-center">
            <div className="flex items-center justify-center bg-cyan-900/30 w-6 h-6 rounded-full mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
              </svg>
            </div>
            <span className="text-gray-300 font-medium">Heading:</span>
          </div>
          <div className="font-mono text-white">{dronePosition?.heading || 75}° NE</div>
          
          <div className="flex items-center">
            <div className="flex items-center justify-center bg-green-900/30 w-6 h-6 rounded-full mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 6.184V9c0 .513 1.263 2.678 1.263 2.678a.5.5 0 0 0 .949-.316L8 9"></path>
                <path d="M6 6.184V9c0 .513 1.263 2.678 1.263 2.678a.5.5 0 0 0 .949-.316L8 9"></path>
                <rect x="4" y="4" width="16" height="6" rx="2"></rect>
                <path d="m 6.2 14 h 11.6 c 1.1 0 2 .9 2 2 v 0 c 0 1.1 -.9 2 -2 2 h -11.6 c -1.1 0 -2 -.9 -2 -2 v 0 c 0 -1.1 .9 -2 2 -2 Z"></path>
                <line x1="15" y1="14" x2="15" y2="18"></line>
                <line x1="18" y1="14" x2="18" y2="18"></line>
              </svg>
            </div>
            <span className="text-gray-300 font-medium">Battery:</span>
          </div>
          <div className="font-mono text-white flex items-center">
            <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden mr-2">
              <div 
                className={`h-full rounded-full ${dronePosition?.batteryLevel && dronePosition.batteryLevel > 50 ? 'bg-green-500' : dronePosition?.batteryLevel && dronePosition.batteryLevel > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{width: `${dronePosition?.batteryLevel || 68}%`}}
              ></div>
            </div>
            <span>{dronePosition?.batteryLevel || 68}%</span>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center justify-center bg-cyan-900/30 w-6 h-6 rounded-full mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <span className="text-gray-300 font-medium">Elapsed:</span>
          </div>
          <div className="font-mono text-white">{timeElapsed} / {timeTotal}</div>
        </div>
      </div>
      
      {/* Mission Status */}
      <div className="absolute bottom-4 left-4 bg-[#0f1215]/85 backdrop-blur-md p-4 rounded-md border border-gray-700 text-xs shadow-lg shadow-black/30">
        <h4 className="font-semibold text-white text-sm mb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          MISSION PROGRESS
        </h4>
        <div className="mb-3 space-y-3">
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-gray-300 font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 8v10a1 1 0 0 0 1 1h1"></path>
                  <path d="M17 7v10a1 1 0 0 1-1 1h-1"></path>
                  <path d="M8 20h6.5a1.5 1.5 0 0 0 1.5-1.5v-2"></path>
                  <path d="M8 5v10a1 1 0 0 0 1 1h6"></path>
                  <path d="M7 4h8a1 1 0 0 1 1 1v2.5"></path>
                  <path d="M12 11v5"></path>
                  <path d="M19 8a3 3 0 0 0-3-3h-1"></path>
                  <path d="M17 17a3 3 0 0 0 3 3h1"></path>
                </svg>
                Distance
              </span>
              <span className="text-white">{progress > 0 ? (2.1 * progress).toFixed(1) : '0'} / 4.2 km</span>
            </div>
            <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full" style={{width: `${progress * 100}%`}}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-gray-300 font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Time
              </span>
              <span className="text-white">{timeElapsed} / {timeTotal}</span>
            </div>
            <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full" style={{width: `${progress * 100}%`}}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-gray-300 font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Waypoints
              </span>
              <span className="text-white">{Math.ceil(progress * 5)} / 5</span>
            </div>
            <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full" style={{width: `${progress * 100}%`}}></div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-3 mt-1">
          <div className="flex justify-between">
            <div>
              <div className="text-gray-400 text-xs mb-1">Mission Status</div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse mr-2"></div>
                <span className="text-white font-medium">In Progress</span>
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-xs mb-1">Estimated Completion</div>
              <div className="text-white font-medium font-mono">12:45 PM</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Camera Feed */}
      <div className="absolute bottom-4 right-4 w-80 h-48 bg-black rounded-md overflow-hidden border border-gray-700 shadow-lg shadow-black/30">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <img 
          src="https://pixabay.com/get/g8a576b7317663ce127aa8081a952a8c454d38e23bd3551bfe704db1b64042be2879073dd00911a64e811bc72fa9e9b59abfe2ccdb18b2b02a79baa3bf3d3b410_1280.jpg" 
          alt="Drone Camera Feed" 
          className="w-full h-full object-cover" 
        />
        
        {/* Camera interface overlay */}
        <div className="absolute inset-0 z-20 p-3 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="bg-black/70 backdrop-blur-sm text-xs text-white px-2 py-1 rounded-sm flex items-center border border-gray-700">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse mr-1.5"></div>
              <span className="font-semibold tracking-wide">LIVE CAMERA FEED</span>
            </div>
            <div className="font-mono text-white text-xs flex items-center bg-black/60 px-2 py-1 rounded-sm border border-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                <path d="M17 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                <path d="M7 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
              </svg>
              1080p / 30fps
            </div>
          </div>
          
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2 mb-1">
                <div className="font-mono text-xs text-white bg-black/60 px-2 py-1 rounded-sm border border-gray-700">
                  f/2.8
                </div>
                <div className="font-mono text-xs text-white bg-black/60 px-2 py-1 rounded-sm border border-gray-700">
                  1/60s
                </div>
                <div className="font-mono text-xs text-white bg-black/60 px-2 py-1 rounded-sm border border-gray-700">
                  ISO 400
                </div>
              </div>
              <div className="text-xs text-white bg-black/60 px-2 py-1 rounded-sm flex items-center space-x-2 border border-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>Object detection active</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="font-mono text-xs text-white bg-black/60 px-2 py-1 rounded-sm mb-1 border border-gray-700">
                REC 00:12:34
              </div>
              <div className="flex items-center space-x-2">
                <div className="font-mono text-xs text-white bg-black/60 px-2 py-1 rounded-sm border border-gray-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  SNAPSHOT
                </div>
                <div className="font-mono text-xs text-white bg-red-600/90 px-2 py-1 rounded-sm border border-red-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                  RECORDING
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Crosshair/focus point */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="30" r="25" stroke="white" strokeOpacity="0.6" strokeWidth="1" strokeDasharray="2 2" />
            <circle cx="30" cy="30" r="1" fill="white" />
            <line x1="30" y1="25" x2="30" y2="27" stroke="white" strokeOpacity="0.8" strokeWidth="1" />
            <line x1="30" y1="33" x2="30" y2="35" stroke="white" strokeOpacity="0.8" strokeWidth="1" />
            <line x1="25" y1="30" x2="27" y2="30" stroke="white" strokeOpacity="0.8" strokeWidth="1" />
            <line x1="33" y1="30" x2="35" y2="30" stroke="white" strokeOpacity="0.8" strokeWidth="1" />
          </svg>
        </div>
      </div>
      
      {/* Playback Controls */}
      <div className="absolute bottom-0 inset-x-0 p-4 flex justify-center">
        <div className="bg-[#0f1215]/85 backdrop-blur-md px-6 py-3 rounded-md border border-gray-700 flex items-center space-x-6 shadow-lg shadow-black/30">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-800 border border-gray-700 h-8 w-8"
              onClick={() => map.stopSimulation()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="19 20 9 12 19 4 19 20"></polygon>
                <line x1="5" y1="19" x2="5" y2="5"></line>
              </svg>
            </Button>
            <Button 
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md ${isSimulating ? 'bg-cyan-500 hover:bg-cyan-600' : 'bg-cyan-600 hover:bg-cyan-700'}`}
              onClick={isSimulating ? map.pauseSimulation : map.startSimulation}
            >
              {isSimulating ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-800 border border-gray-700 h-8 w-8"
              onClick={() => map.startSimulation()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 4 15 12 5 20 5 4"></polygon>
                <line x1="19" y1="5" x2="19" y2="19"></line>
              </svg>
            </Button>
          </div>

          <div className="flex flex-col space-y-1.5 flex-grow max-w-[400px]">
            <div className="flex justify-between px-1 text-xs text-gray-400">
              <span>{timeElapsed}</span>
              <span>{timeTotal}</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full relative group">
              {/* Progress segments (checkpoints) */}
              <div className="absolute top-1/2 left-[20%] transform -translate-y-1/2 h-3 w-1 bg-cyan-700 rounded-full z-10"></div>
              <div className="absolute top-1/2 left-[40%] transform -translate-y-1/2 h-3 w-1 bg-cyan-700 rounded-full z-10"></div>
              <div className="absolute top-1/2 left-[70%] transform -translate-y-1/2 h-3 w-1 bg-cyan-700 rounded-full z-10"></div>
              <div className="absolute top-1/2 left-[90%] transform -translate-y-1/2 h-3 w-1 bg-cyan-700 rounded-full z-10"></div>
            
              {/* Progress bar */}
              <div 
                className="h-2 bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full absolute left-0 top-0" 
                style={{ width: `${progress * 100}%` }}
              ></div>
              
              {/* Thumb for seeking */}
              <div 
                className="h-4 w-4 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 cursor-pointer shadow-md border border-gray-200 group-hover:scale-110 transition-transform z-20" 
                style={{ left: `calc(${progress * 100}% - 8px)` }}
              ></div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs bg-gray-800/50 border-gray-700 text-white hover:bg-gray-800 px-2.5 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
              SAVE
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs bg-gray-800/50 border-gray-700 text-white hover:bg-gray-800 px-2.5 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              EXPORT
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

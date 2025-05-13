import { useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useMap, type MapWaypoint, type MapPath, type NoFlyZone } from '@/hooks/use-map';
import { generateDemoRoute } from '@/lib/utils/mapUtils';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export default function MapView() {
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Initialize map with demo route
  const { waypoints, paths, noFlyZones } = generateDemoRoute();
  const mapHook = useMap({
    waypoints,
    paths,
    noFlyZones
  });

  return (
    <div ref={mapRef} className="h-full w-full relative">
      {/* Subtle SVG grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#2d3748" strokeWidth="0.5" />
            </pattern>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="url(#smallGrid)" />
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#4a5568" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      {/* Map background - high-contrast satellite imagery for better visibility */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ 
          backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/-122.4194,37.7749,12,0/1200x800?access_token=pk.eyJ1IjoiZGVtb21hcCIsImEiOiJjamV4ZW43N2UwZWk2MzNxb3Vubm0ydXp1In0.B8ycYaErckHawYwjRKbJmw')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '0.5rem'
        }}
      />
      
      {/* SVG Overlay for paths and points */}
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <linearGradient id="pathGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <radialGradient id="waypointGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.7" />
          </radialGradient>
          <filter id="droneGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <g id="warningIcon">
            <circle cx="6" cy="6" r="6" fill="#ef4444" />
            <text x="6" y="10" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">!</text>
          </g>
          <g id="droneIcon">
            <circle cx="0" cy="0" r="6" fill="#3b82f6" stroke="white" strokeWidth="2" />
            <rect x="-2" y="-8" width="4" height="16" rx="2" fill="#60a5fa" />
            <rect x="-8" y="-2" width="16" height="4" rx="2" fill="#60a5fa" />
          </g>
        </defs>
        {/* Render paths with animation */}
        {mapHook.paths.map((path, index) => (
          <path
            key={`path-${index}`}
            d={path.path}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="5"
            strokeDasharray={path.isDashed ? "5,5" : ""}
            className={path.isAnimated ? "path-animate" : ""}
            style={{
              strokeOpacity: path.isCompleted ? 1 : 0.85,
              filter: "drop-shadow(0px 0px 6px #60a5fa)"
            }}
          />
        ))}
        {/* Render waypoints */}
        {mapHook.waypoints.map((waypoint) => (
          <g key={waypoint.id}>
            {waypoint.type === 'start' && (
              <>
                <circle cx="150" cy="250" r="16" fill="url(#waypointGradient)" filter="url(#droneGlow)" />
                <circle cx="150" cy="250" r="10" fill="#10b981" stroke="white" strokeWidth="2" />
                <text x="150" y="280" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" style={{ filter: "drop-shadow(0px 0px 4px #10b981)" }}>START</text>
              </>
            )}
            {waypoint.type === 'end' && (
              <>
                <circle cx="850" cy="180" r="16" fill="url(#waypointGradient)" filter="url(#droneGlow)" />
                <circle cx="850" cy="180" r="10" fill="#ef4444" stroke="white" strokeWidth="2" />
                <text x="850" y="210" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" style={{ filter: "drop-shadow(0px 0px 4px #ef4444)" }}>END</text>
              </>
            )}
            {waypoint.type === 'waypoint' && (
              <>
                <circle cx={350 + parseInt(waypoint.id.replace('wp', '')) * 100} cy={200 - parseInt(waypoint.id.replace('wp', '')) * 20} r="12" fill="url(#waypointGradient)" filter="url(#droneGlow)" />
                <circle cx={350 + parseInt(waypoint.id.replace('wp', '')) * 100} cy={200 - parseInt(waypoint.id.replace('wp', '')) * 20} r="8" fill="#f59e0b" stroke="white" strokeWidth="2" />
                <text x={350 + parseInt(waypoint.id.replace('wp', '')) * 100} y={220 - parseInt(waypoint.id.replace('wp', '')) * 20} textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" style={{ filter: "drop-shadow(0px 0px 4px #f59e0b)" }}>{waypoint.type === 'waypoint' ? `Scan Zone ${waypoint.id.replace('wp', '')}` : waypoint.id}</text>
              </>
            )}
          </g>
        ))}
        {/* No-fly zones */}
        {mapHook.noFlyZones?.map((zone) => (
          <g key={zone.id}>
            <circle cx="400" cy="200" r={zone.radius} fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" strokeWidth="3" strokeDasharray="5,5" />
            <rect x="350" y="190" width="120" height="24" rx="8" fill="rgba(0,0,0,0.7)" />
            <use href="#warningIcon" x="360" y="194" />
            <text x="400" y="210" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="14" fontWeight="bold">NO-FLY ZONE</text>
          </g>
        ))}
        {/* Active drone with icon and glow */}
        <g>
          <use href="#droneIcon" x="550" y="150" filter="url(#droneGlow)" />
          <text x="550" y="170" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" style={{ filter: "drop-shadow(0px 0px 4px #3b82f6)" }}>ACTIVE DRONE</text>
        </g>
      </svg>
      
      {/* Map controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <Tooltip><TooltipTrigger asChild>
        <button className="bg-[#161a1d] p-2 rounded-md shadow-lg border border-gray-700 hover:bg-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button></TooltipTrigger><TooltipContent>Zoom In</TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild>
        <button className="bg-[#161a1d] p-2 rounded-md shadow-lg border border-gray-700 hover:bg-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button></TooltipTrigger><TooltipContent>Zoom Out</TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild>
        <button className="bg-[#161a1d] p-2 rounded-md shadow-lg border border-gray-700 hover:bg-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><path d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z"></path></svg>
        </button></TooltipTrigger><TooltipContent>Reset View</TooltipContent></Tooltip>
      </div>
      
      {/* Map legend */}
      <div className="absolute bottom-4 left-4 bg-[#161a1d]/80 backdrop-blur-md p-4 rounded-xl border border-gray-700 text-xs shadow-xl">
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow mr-2"></div>
          <span className="font-semibold text-white">Starting Point</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 shadow mr-2"></div>
          <span className="font-semibold text-white">Waypoint</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow mr-2"></div>
          <span className="font-semibold text-white">Destination</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow mr-2"></div>
          <span className="font-semibold text-white">Active Drone</span>
        </div>
      </div>
    </div>
  );
}

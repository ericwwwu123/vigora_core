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
        {/* Render paths with animation */}
        {mapHook.paths.map((path, index) => (
          <path
            key={`path-${index}`}
            d={path.path}
            fill="none"
            stroke="#60a5fa"
            strokeWidth="4"
            strokeDasharray={path.isDashed ? "5,5" : ""}
            className={path.isAnimated ? "path-animate" : ""}
            style={{
              strokeOpacity: path.isCompleted ? 1 : 0.8,
              filter: "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.5))"
            }}
          />
        ))}
        
        {/* Render waypoints */}
        {mapHook.waypoints.map((waypoint) => (
          <g key={waypoint.id}>
            {waypoint.type === 'start' && (
              <>
                {/* Outer highlight for visibility */}
                <circle
                  cx="150"
                  cy="250"
                  r="14"
                  fill="white"
                  fillOpacity="0.5"
                />
                <circle
                  cx="150"
                  cy="250"
                  r="10"
                  fill="#10b981" // Success green
                  stroke="white"
                  strokeWidth="2"
                />
                <circle
                  cx="150"
                  cy="250"
                  r="16"
                  fill="#10b981"
                  fillOpacity="0.3"
                  className="animate-pulse"
                />
                {/* Label for better readability */}
                <text
                  x="150"
                  y="280"
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                  style={{ filter: "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.8))" }}
                >
                  START
                </text>
              </>
            )}
            {waypoint.type === 'end' && (
              <>
                {/* Outer highlight for visibility */}
                <circle
                  cx="850"
                  cy="180"
                  r="14"
                  fill="white"
                  fillOpacity="0.5"
                />
                <circle
                  cx="850"
                  cy="180"
                  r="10"
                  fill="#ef4444" // Danger red
                  stroke="white"
                  strokeWidth="2"
                />
                <circle
                  cx="850"
                  cy="180"
                  r="16"
                  fill="#ef4444"
                  fillOpacity="0.3"
                  className="animate-pulse"
                />
                {/* Label for better readability */}
                <text
                  x="850"
                  y="210"
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                  style={{ filter: "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.8))" }}
                >
                  END
                </text>
              </>
            )}
            {waypoint.type === 'waypoint' && (
              <>
                {/* Improved waypoints with labels */}
                <circle
                  cx={350 + parseInt(waypoint.id.replace('wp', '')) * 100}
                  cy={200 - parseInt(waypoint.id.replace('wp', '')) * 20}
                  r="8"
                  fill="#f59e0b" // Warning orange
                  stroke="white"
                  strokeWidth="2"
                />
                <text
                  x={350 + parseInt(waypoint.id.replace('wp', '')) * 100}
                  y={220 - parseInt(waypoint.id.replace('wp', '')) * 20}
                  textAnchor="middle"
                  fill="white"
                  fontSize="10"
                  fontWeight="bold"
                  style={{ filter: "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.8))" }}
                >
                  {waypoint.type === 'waypoint' ? `Scan Zone ${waypoint.id.replace('wp', '')}` : waypoint.id}
                </text>
              </>
            )}
          </g>
        ))}
        
        {/* No-fly zones */}
        {mapHook.noFlyZones?.map((zone) => (
          <g key={zone.id}>
            <circle
              cx="400"
              cy="200"
              r={zone.radius}
              fill="#ef4444"
              fillOpacity="0.2"
              stroke="#ef4444"
              strokeWidth="3"
              strokeDasharray="5,5"
            />
            {/* Improved label with background for readability */}
            <rect
              x="350"
              y="190"
              width="100"
              height="20"
              rx="5"
              fill="rgba(0,0,0,0.5)"
            />
            <text
              x="400"
              y="204"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="12"
              fontWeight="bold"
            >
              NO-FLY ZONE
            </text>
          </g>
        ))}
        
        {/* Active drone position with improved visibility */}
        <circle
          cx="550"
          cy="150"
          r="10"
          fill="rgba(0,0,0,0.4)"
          stroke="white"
          strokeWidth="1"
        />
        <circle
          cx="550"
          cy="150"
          r="6"
          fill="#3b82f6"
          stroke="white"
          strokeWidth="2"
          className="animate-pulse"
        />
        <text
          x="550"
          y="170"
          textAnchor="middle"
          fill="white"
          fontSize="10"
          fontWeight="bold"
          style={{ filter: "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.8))" }}
        >
          ACTIVE DRONE
        </text>
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
      <div className="absolute bottom-4 left-4 bg-[#161a1d]/80 backdrop-blur-sm p-3 rounded-md border border-gray-700 text-xs">
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 rounded-full bg-[#10b981] mr-2"></div>
          <span>Starting Point</span>
        </div>
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 rounded-full bg-[#f59e0b] mr-2"></div>
          <span>Waypoint</span>
        </div>
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 rounded-full bg-[#ef4444] mr-2"></div>
          <span>Destination</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#3b82f6] mr-2"></div>
          <span>Active Drone</span>
        </div>
      </div>
    </div>
  );
}

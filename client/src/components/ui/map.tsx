import { useRef, useEffect } from 'react';
import { type MapWaypoint, type MapPath, type NoFlyZone } from '@/hooks/use-map';

interface MAPProps {
  waypoints: MapWaypoint[];
  paths: MapPath[];
  noFlyZones?: NoFlyZone[];
  dronePosition?: {
    latitude: string;
    longitude: string;
    heading: number;
  };
  isDarkMode?: boolean;
}

export function MAP({ 
  waypoints, 
  paths, 
  noFlyZones, 
  dronePosition,
  isDarkMode = true
}: MAPProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={mapRef} className="h-full w-full relative">
      {/* Map background - satellite imagery */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1549396560-0171c1faa82c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '0.5rem'
        }}
      />
      
      {/* SVG Overlay for paths and points */}
      <svg width="100%" height="100%" className="absolute inset-0">
        {/* Render paths */}
        {paths.map((path, index) => (
          <path
            key={`path-${index}`}
            d={path.path}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeDasharray={path.isDashed ? "5,5" : ""}
            className={path.isAnimated ? "path" : ""}
            style={{
              strokeOpacity: path.isCompleted ? 1 : 0.7,
            }}
          />
        ))}
        
        {/* Render waypoints */}
        {waypoints.map((waypoint) => (
          <g key={waypoint.id}>
            {waypoint.type === 'start' && (
              <>
                <circle
                  cx="150"
                  cy="250"
                  r="8"
                  fill="#10b981" // Success green
                />
                <circle
                  cx="150"
                  cy="250"
                  r="12"
                  fill="#10b981"
                  fillOpacity="0.3"
                  className="animate-pulse"
                />
              </>
            )}
            {waypoint.type === 'end' && (
              <>
                <circle
                  cx="850"
                  cy="180"
                  r="8"
                  fill="#ef4444" // Danger red
                />
                <circle
                  cx="850"
                  cy="180"
                  r="12"
                  fill="#ef4444"
                  fillOpacity="0.3"
                  className="animate-pulse"
                />
              </>
            )}
            {waypoint.type === 'waypoint' && (
              <>
                <circle
                  cx={350 + parseInt(waypoint.id.replace(/\D/g, '')) * 100}
                  cy={200 - parseInt(waypoint.id.replace(/\D/g, '')) * 20}
                  r="5"
                  fill="#f59e0b" // Warning orange
                />
              </>
            )}
          </g>
        ))}
        
        {/* No-fly zones */}
        {noFlyZones?.map((zone) => (
          <g key={zone.id}>
            <circle
              cx="400"
              cy="200"
              r={zone.radius}
              fill="#ef4444"
              fillOpacity="0.15"
              stroke="#ef4444"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <text
              x="400"
              y="200"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#ef4444"
              fontSize="10"
            >
              NO-FLY ZONE
            </text>
          </g>
        ))}
        
        {/* Active drone position */}
        {dronePosition && (
          <circle
            cx="550"
            cy="150"
            r="6"
            fill="#3b82f6"
            className="animate-pulse"
          />
        )}
      </svg>
      
      {/* Map controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <button className="bg-[#161a1d] p-2 rounded-md shadow-lg border border-gray-700 hover:bg-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
        <button className="bg-[#161a1d] p-2 rounded-md shadow-lg border border-gray-700 hover:bg-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
        <button className="bg-[#161a1d] p-2 rounded-md shadow-lg border border-gray-700 hover:bg-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><path d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z"></path></svg>
        </button>
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

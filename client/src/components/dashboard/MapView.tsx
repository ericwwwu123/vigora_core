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
      <div className="absolute inset-0 pointer-events-none opacity-30 z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#18223a" strokeWidth="0.7" />
            </pattern>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="url(#smallGrid)" />
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#22305a" strokeWidth="1.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      {/* 3D深蓝渐变背景 */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#101A2B] via-[#181C24] to-[#22305a]" 
        style={{ borderRadius: '0.5rem', zIndex: 0 }}
      />
      {/* SVG Overlay for paths and points */}
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <linearGradient id="pathGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3ABEFF" />
            <stop offset="100%" stopColor="#00BFFF" />
          </linearGradient>
          <radialGradient id="waypointGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3ABEFF" stopOpacity="1" />
            <stop offset="100%" stopColor="#22305a" stopOpacity="0.7" />
          </radialGradient>
          <filter id="droneGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="pointShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#3ABEFF"/>
          </filter>
          <g id="droneIcon3D">
            <ellipse cx="0" cy="0" rx="10" ry="4" fill="#3ABEFF" opacity="0.5" />
            <circle cx="0" cy="-6" r="8" fill="#3ABEFF" stroke="#fff" strokeWidth="2" filter="url(#droneGlow)" />
            <rect x="-2" y="-16" width="4" height="12" rx="2" fill="#00BFFF" />
            <rect x="-8" y="-8" width="16" height="4" rx="2" fill="#00BFFF" />
          </g>
        </defs>
        {/* Render paths with 3D感发光阴影 */}
        {mapHook.paths.map((path, index) => (
          <path
            key={`path-${index}`}
            d={path.path}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="7"
            strokeDasharray={path.isDashed ? "8,8" : ""}
            className={path.isAnimated ? "path-animate" : ""}
            style={{
              strokeOpacity: path.isCompleted ? 1 : 0.85,
              filter: "drop-shadow(0px 0px 12px #3ABEFF)"
            }}
          />
        ))}
        {/* Render waypoints with 3D立体球体效果 */}
        {mapHook.waypoints.map((waypoint) => (
          <g key={waypoint.id}>
            {waypoint.type === 'start' && (
              <>
                <circle cx="150" cy="250" r="22" fill="url(#waypointGradient)" filter="url(#pointShadow)" />
                <circle cx="150" cy="250" r="14" fill="#3ABEFF" stroke="#fff" strokeWidth="3" filter="url(#droneGlow)" />
                <text x="150" y="280" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold" style={{ filter: "drop-shadow(0px 0px 4px #3ABEFF)" }}>START</text>
              </>
            )}
            {waypoint.type === 'end' && (
              <>
                <circle cx="850" cy="180" r="22" fill="url(#waypointGradient)" filter="url(#pointShadow)" />
                <circle cx="850" cy="180" r="14" fill="#00BFFF" stroke="#fff" strokeWidth="3" filter="url(#droneGlow)" />
                <text x="850" y="210" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold" style={{ filter: "drop-shadow(0px 0px 4px #00BFFF)" }}>END</text>
              </>
            )}
            {waypoint.type === 'waypoint' && (
              <>
                <circle cx={350 + parseInt(waypoint.id.replace('wp', '')) * 100} cy={200 - parseInt(waypoint.id.replace('wp', '')) * 20} r="18" fill="url(#waypointGradient)" filter="url(#pointShadow)" />
                <circle cx={350 + parseInt(waypoint.id.replace('wp', '')) * 100} cy={200 - parseInt(waypoint.id.replace('wp', '')) * 20} r="10" fill="#3ABEFF" stroke="#fff" strokeWidth="2" filter="url(#droneGlow)" />
                <text x={350 + parseInt(waypoint.id.replace('wp', '')) * 100} y={220 - parseInt(waypoint.id.replace('wp', '')) * 20} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="bold" style={{ filter: "drop-shadow(0px 0px 4px #3ABEFF)" }}>{waypoint.type === 'waypoint' ? `Scan Zone ${waypoint.id.replace('wp', '')}` : waypoint.id}</text>
              </>
            )}
          </g>
        ))}
        {/* No-fly zones 3D立体圆柱表现 */}
        {mapHook.noFlyZones?.map((zone) => (
          <g key={zone.id}>
            <ellipse cx="400" cy="200" rx={zone.radius * 1.2} ry={zone.radius * 0.5} fill="#FF5C5C" fillOpacity="0.18" />
            <circle cx="400" cy="200" r={zone.radius} fill="#FF5C5C" fillOpacity="0.13" stroke="#FF5C5C" strokeWidth="3" strokeDasharray="8,8" />
            <rect x="350" y="190" width="120" height="24" rx="8" fill="rgba(0,0,0,0.7)" />
            <text x="410" y="210" textAnchor="middle" dominantBaseline="middle" fill="#FF5C5C" fontSize="14" fontWeight="bold">NO-FLY ZONE</text>
          </g>
        ))}
        {/* Active drone 3D icon和发光 */}
        <g>
          <use href="#droneIcon3D" x="550" y="150" filter="url(#droneGlow)" />
          <text x="550" y="170" textAnchor="middle" fill="#3ABEFF" fontSize="13" fontWeight="bold" style={{ filter: "drop-shadow(0px 0px 4px #3ABEFF)" }}>ACTIVE DRONE</text>
        </g>
      </svg>
      {/* Map controls 天蓝色高亮 */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <Tooltip><TooltipTrigger asChild>
        <button className="bg-[#16243a] p-2 rounded-md shadow-lg border border-[#3ABEFF] hover:bg-[#22305a]">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3ABEFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button></TooltipTrigger><TooltipContent>Zoom In</TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild>
        <button className="bg-[#16243a] p-2 rounded-md shadow-lg border border-[#3ABEFF] hover:bg-[#22305a]">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3ABEFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button></TooltipTrigger><TooltipContent>Zoom Out</TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild>
        <button className="bg-[#16243a] p-2 rounded-md shadow-lg border border-[#3ABEFF] hover:bg-[#22305a]">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3ABEFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z"></path></svg>
        </button></TooltipTrigger><TooltipContent>Reset View</TooltipContent></Tooltip>
      </div>
      {/* Map legend 天蓝色高亮 */}
      <div className="absolute bottom-4 left-4 bg-[#16243a]/90 backdrop-blur-md p-4 rounded-xl border border-[#3ABEFF] text-xs shadow-xl">
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#3ABEFF] to-[#00BFFF] shadow-lg mr-2"></div>
          <span className="font-semibold text-[#3ABEFF]">Starting Point</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#3ABEFF] to-[#22305a] shadow-lg mr-2"></div>
          <span className="font-semibold text-[#3ABEFF]">Waypoint</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#00BFFF] to-[#22305a] shadow-lg mr-2"></div>
          <span className="font-semibold text-[#00BFFF]">Destination</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#3ABEFF] to-[#00BFFF] shadow-lg mr-2"></div>
          <span className="font-semibold text-[#3ABEFF]">Active Drone</span>
        </div>
      </div>
    </div>
  );
}

import type { MapWaypoint, MapPath, NoFlyZone } from '@/hooks/use-map';

/**
 * Generates SVG coordinates for waypoints
 * This is a mock implementation that would be replaced with real geo-mapping
 * in a production environment using a real mapping library
 */
export function generateSVGCoordinates(
  waypoints: { latitude: string; longitude: string }[], 
  width: number = 1000, 
  height: number = 500
): [number, number][] {
  if (!waypoints.length) return [];
  
  // For a simple demo, we'll just spread points evenly
  return waypoints.map((_, index) => {
    // Simple linear mapping
    const x = 100 + (index * ((width - 200) / Math.max(waypoints.length - 1, 1)));
    
    // Add some variation to y to make it look more natural
    const y = Math.sin(index * Math.PI / 4) * 100 + height / 2;
    
    return [x, y];
  });
}

/**
 * Generates a SVG path string from waypoints
 * Creates a smooth curve through the given waypoints
 */
export function generateSVGPath(coordinates: [number, number][]): string {
  if (coordinates.length < 2) return '';
  
  // Start at the first point
  let path = `M${coordinates[0][0]},${coordinates[0][1]}`;
  
  // For just two points, do a simple line
  if (coordinates.length === 2) {
    path += ` L${coordinates[1][0]},${coordinates[1][1]}`;
    return path;
  }
  
  // For multiple points, create a smooth curve
  for (let i = 1; i < coordinates.length; i++) {
    const [x, y] = coordinates[i];
    
    if (i === 1) {
      // First curve
      const controlX1 = coordinates[0][0] + (coordinates[1][0] - coordinates[0][0]) / 2;
      const controlY1 = coordinates[0][1];
      
      const controlX2 = coordinates[0][0] + (coordinates[1][0] - coordinates[0][0]) / 2;
      const controlY2 = coordinates[1][1];
      
      path += ` C${controlX1},${controlY1} ${controlX2},${controlY2} ${x},${y}`;
    } else {
      // Subsequent curves
      const prevX = coordinates[i-1][0];
      const prevY = coordinates[i-1][1];
      
      // Calculate control points
      const controlX1 = prevX + (x - prevX) / 3;
      const controlY1 = prevY + (y - prevY) / 6;
      
      const controlX2 = prevX + 2 * (x - prevX) / 3;
      const controlY2 = y - (y - prevY) / 6;
      
      path += ` S${controlX2},${controlY2} ${x},${y}`;
    }
  }
  
  return path;
}

/**
 * Creates a simulated route configuration from waypoints
 */
export function createRouteConfig(
  waypoints: { id: string; latitude: string; longitude: string; description?: string }[]
): { waypoints: MapWaypoint[]; paths: MapPath[] } {
  if (!waypoints.length) {
    return { waypoints: [], paths: [] };
  }
  
  // Transform waypoints to MapWaypoint format
  const mappedWaypoints: MapWaypoint[] = waypoints.map((wp, index) => ({
    ...wp,
    type: index === 0 ? 'start' : index === waypoints.length - 1 ? 'end' : 'waypoint'
  }));
  
  // Generate SVG coordinates
  const coordinates = generateSVGCoordinates(waypoints);
  
  // Create the path
  const svgPath = generateSVGPath(coordinates);
  
  // Define the paths
  const completedPath: MapPath = {
    path: svgPath,
    isAnimated: true,
    isCompleted: true
  };
  
  return {
    waypoints: mappedWaypoints,
    paths: [completedPath]
  };
}

/**
 * Generates a simulated route for demo purposes
 */
export function generateDemoRoute(): { 
  waypoints: MapWaypoint[]; 
  paths: MapPath[]; 
  noFlyZones: NoFlyZone[] 
} {
  const waypoints: MapWaypoint[] = [
    { id: 'wp1', latitude: '37.7749', longitude: '-122.4194', type: 'start', description: 'Starting point - Riverside park entrance' },
    { id: 'wp2', latitude: '37.7752', longitude: '-122.4180', type: 'waypoint', description: 'North residential area' },
    { id: 'wp3', latitude: '37.7758', longitude: '-122.4166', type: 'waypoint', description: 'Riverbank erosion hotspot' },
    { id: 'wp4', latitude: '37.7765', longitude: '-122.4152', type: 'waypoint', description: 'Damaged bridge infrastructure' },
    { id: 'wp5', latitude: '37.7772', longitude: '-122.4138', type: 'end', description: 'Emergency response staging area' }
  ];
  
  const coordinates = generateSVGCoordinates(waypoints);
  const svgPath = generateSVGPath(coordinates);
  
  const paths: MapPath[] = [
    {
      path: svgPath,
      isAnimated: true
    }
  ];
  
  const noFlyZones: NoFlyZone[] = [
    {
      id: 'nfz1',
      latitude: '37.7760',
      longitude: '-122.4170',
      radius: 40,
      description: 'No-Fly Zone'
    }
  ];
  
  return { waypoints, paths, noFlyZones };
}

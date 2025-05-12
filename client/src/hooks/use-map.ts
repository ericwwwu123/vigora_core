import { useState, useEffect, useRef } from 'react';

export type MapPosition = {
  latitude: string;
  longitude: string;
};

export type MapWaypoint = MapPosition & {
  id: string;
  type: 'start' | 'end' | 'waypoint';
  description?: string;
};

export type MapPath = {
  path: string;
  isAnimated?: boolean;
  isCompleted?: boolean;
  isDashed?: boolean;
};

export type NoFlyZone = MapPosition & {
  id: string;
  radius: number;
  description?: string;
};

export type DronePosition = MapPosition & {
  heading: number;
  altitude: number;
  speed: number;
  batteryLevel: number;
};

export type MapConfig = {
  waypoints: MapWaypoint[];
  paths: MapPath[];
  noFlyZones?: NoFlyZone[];
  dronePosition?: DronePosition;
};

/**
 * This hook provides functionality for the map visualization
 * In a real application, this would interface with Mapbox or another mapping library
 */
export function useMap(initialConfig?: Partial<MapConfig>) {
  const [waypoints, setWaypoints] = useState<MapWaypoint[]>(initialConfig?.waypoints || []);
  const [paths, setPaths] = useState<MapPath[]>(initialConfig?.paths || []);
  const [noFlyZones, setNoFlyZones] = useState<NoFlyZone[]>(initialConfig?.noFlyZones || []);
  const [dronePosition, setDronePosition] = useState<DronePosition | undefined>(initialConfig?.dronePosition);
  
  // For animation of drone along path
  const animationRef = useRef<number | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  
  // Methods to update map state
  const addWaypoint = (waypoint: MapWaypoint) => {
    setWaypoints([...waypoints, waypoint]);
  };
  
  const removeWaypoint = (id: string) => {
    setWaypoints(waypoints.filter(wp => wp.id !== id));
  };
  
  const addPath = (path: MapPath) => {
    setPaths([...paths, path]);
  };
  
  const updateDronePosition = (position: Partial<DronePosition>) => {
    setDronePosition(prev => prev ? { ...prev, ...position } : undefined);
  };
  
  const startSimulation = () => {
    setIsSimulating(true);
    setProgress(0);
    
    // Set up animation frame for drone movement
    let startTime: number | null = null;
    const duration = 36000; // 36 seconds in milliseconds
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) * simulationSpeed;
      const newProgress = Math.min(elapsed / duration, 1);
      setProgress(newProgress);
      
      // Update drone position based on progress along path
      if (paths.length > 0 && newProgress < 1) {
        // In a real implementation, we would calculate the position along the path
        // For now, just simulate movement with a simple calculation
        const pathLength = 650; // Total horizontal distance
        const x = 100 + (pathLength * newProgress);
        const y = 250 - (Math.sin(newProgress * Math.PI) * 50);
        
        // Convert x,y to lat,long (mock values for demonstration)
        const lat = (37.7749 + (newProgress * 0.0023)).toFixed(4);
        const long = (-122.4194 + (newProgress * 0.0056)).toFixed(4);
        
        updateDronePosition({
          latitude: lat,
          longitude: long,
          heading: Math.floor(45 + (newProgress * 30)),
          speed: 7.2,
          batteryLevel: Math.floor(100 - (newProgress * 32))
        });
      }
      
      if (newProgress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsSimulating(false);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };
  
  const pauseSimulation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsSimulating(false);
  };
  
  const stopSimulation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsSimulating(false);
    setProgress(0);
  };
  
  const resetSimulation = () => {
    stopSimulation();
    setProgress(0);
    // Reset drone to start position
    if (waypoints.length > 0) {
      const startWaypoint = waypoints.find(wp => wp.type === 'start');
      if (startWaypoint) {
        updateDronePosition({
          latitude: startWaypoint.latitude,
          longitude: startWaypoint.longitude,
          heading: 0,
          speed: 0,
          batteryLevel: 100
        });
      }
    }
  };
  
  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  return {
    waypoints,
    paths,
    noFlyZones,
    dronePosition,
    progress,
    isSimulating,
    simulationSpeed,
    setWaypoints,
    setPaths,
    setNoFlyZones,
    setDronePosition,
    addWaypoint,
    removeWaypoint,
    addPath,
    updateDronePosition,
    startSimulation,
    pauseSimulation,
    stopSimulation,
    resetSimulation,
    setSimulationSpeed
  };
}

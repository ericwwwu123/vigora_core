import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MAP } from '@/components/ui/map';
import { Route, Waypoint } from '@shared/schema';
import { createRouteConfig } from '@/lib/utils/mapUtils';

interface InsightResultProps {
  result: {
    id: number;
    route: Route;
    recommendations: string;
  };
  activeTab: 'route' | 'recommendations' | 'analysis';
  onCreateTask: () => void;
  onSimulateRoute: () => void;
  onRegenerate: () => void;
}

export default function InsightResult({ 
  result, 
  activeTab, 
  onCreateTask, 
  onSimulateRoute, 
  onRegenerate 
}: InsightResultProps) {
  const { route, recommendations } = result;
  
  // Transform waypoints for the map
  const mapConfig = createRouteConfig(route.waypoints);
  
  // Render content based on the active tab
  function renderContent() {
    switch (activeTab) {
      case 'route':
        return (
          <>
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-white">Optimized Route Plan</h3>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" className="p-2 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="p-2 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                </Button>
              </div>
            </div>
            
            {/* Map View */}
            <div className="map-container h-72 mb-6 rounded-lg overflow-hidden relative">
              <MAP 
                waypoints={mapConfig.waypoints}
                paths={mapConfig.paths}
                noFlyZones={[{
                  id: 'nfz1',
                  latitude: '37.4760',
                  longitude: '-122.4170',
                  radius: 40,
                  description: 'No-Fly Zone'
                }]}
              />
            </div>
            
            {/* AI-Generated Response */}
            <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-700">
              <div className="flex items-start space-x-3 mb-3">
                <div className="rounded-full bg-primary/20 p-2 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10Z"></path>
                    <path d="M12 16a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path>
                    <path d="M12 12V8"></path>
                  </svg>
                </div>
                <div>
                  <div className="text-white font-medium">AI Response</div>
                  <div className="text-xs text-gray-400">Generated just now</div>
                </div>
              </div>
              
              <div className="pl-9 text-gray-300 text-sm">
                <p className="mb-3">Based on your requirements, I've generated an optimal route that covers the required area efficiently.</p>
                
                <p className="mb-3"><span className="text-white font-medium">Route Summary:</span></p>
                <ul className="list-disc list-inside mb-3 space-y-1 text-gray-400">
                  <li>Total distance: {route.distance}</li>
                  <li>Estimated flight time: {route.duration}</li>
                  <li>Altitude: 120 meters (maintaining safe distance from structures)</li>
                  <li>Camera angle: 45° downward tilt for optimal coverage</li>
                  <li>Speed: 7 km/h (for detailed image capture)</li>
                </ul>
                
                <p className="mb-3"><span className="text-white font-medium">Waypoints:</span></p>
                <table className="min-w-full text-xs mb-3">
                  <thead>
                    <tr>
                      <th className="text-left py-1 text-gray-400">ID</th>
                      <th className="text-left py-1 text-gray-400">Coordinates</th>
                      <th className="text-left py-1 text-gray-400">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {route.waypoints.map((waypoint, index) => (
                      <tr key={waypoint.id}>
                        <td className="py-1">{waypoint.id}</td>
                        <td className="py-1">{waypoint.latitude}°N, {waypoint.longitude}°W</td>
                        <td className="py-1">{waypoint.description || `Waypoint ${index + 1}`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <p className="text-white font-medium">Recommendations:</p>
                <p className="text-gray-400">{recommendations}</p>
              </div>
            </div>
          </>
        );
      case 'recommendations':
        return (
          <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-700">
            <h3 className="font-semibold text-white mb-4">Flight Recommendations</h3>
            <div className="text-gray-300 text-sm space-y-4">
              <p>{recommendations}</p>
              
              <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                <h4 className="text-primary font-medium mb-2">Optimal Flight Conditions</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  <li>Time of day: Early morning (7-10 AM) for best lighting</li>
                  <li>Weather: Clear skies, wind speed below 15 km/h</li>
                  <li>Flight altitude: 120 meters above ground level</li>
                  <li>Camera settings: 4K resolution, 30fps, medium sharpness</li>
                </ul>
              </div>
              
              <div className="bg-warning/10 p-4 rounded-lg border border-warning/20">
                <h4 className="text-warning font-medium mb-2">Safety Considerations</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  <li>Maintain visual line of sight at all times</li>
                  <li>Notify local authorities before flight</li>
                  <li>Avoid flying directly over people or moving vehicles</li>
                  <li>Create a buffer zone of at least 50m from all structures</li>
                </ul>
              </div>
              
              <div className="bg-success/10 p-4 rounded-lg border border-success/20">
                <h4 className="text-success font-medium mb-2">Equipment Recommendations</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  <li>Drone model: DJI-422 with extended battery pack</li>
                  <li>Camera: RGB + thermal imaging for comprehensive data</li>
                  <li>Storage: Minimum 64GB high-speed memory card</li>
                  <li>Spare batteries: At least 2 fully charged spares</li>
                </ul>
              </div>
            </div>
          </div>
        );
      case 'analysis':
        return (
          <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-700">
            <h3 className="font-semibold text-white mb-4">Data Analysis</h3>
            <div className="text-gray-300 text-sm space-y-4">
              <p>This section would typically contain in-depth analysis of the route and surrounding environment based on historical data and AI predictions.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-card p-4 rounded-lg border border-gray-700">
                  <h4 className="text-white font-medium mb-2">Coverage Analysis</h4>
                  <div className="h-40 bg-gray-800 rounded-lg mb-2 flex items-center justify-center">
                    <span className="text-gray-500">Coverage heat map visualization</span>
                  </div>
                  <p className="text-gray-400 text-xs">The proposed route provides optimal coverage of the target area, with 98% of critical infrastructure included in the image capture zone.</p>
                </div>
                
                <div className="bg-card p-4 rounded-lg border border-gray-700">
                  <h4 className="text-white font-medium mb-2">Risk Assessment</h4>
                  <div className="h-40 bg-gray-800 rounded-lg mb-2 flex items-center justify-center">
                    <span className="text-gray-500">Risk factor visualization</span>
                  </div>
                  <p className="text-gray-400 text-xs">The route has a risk factor of 2.3/10, with primary risks being variable wind conditions near tall structures and potential bird activity.</p>
                </div>
              </div>
              
              <div className="bg-card p-4 rounded-lg border border-gray-700">
                <h4 className="text-white font-medium mb-2">Historical Comparison</h4>
                <p className="text-gray-400 mb-2">Comparison with 5 previous missions in this area:</p>
                <table className="min-w-full text-xs">
                  <thead className="border-b border-gray-700">
                    <tr>
                      <th className="text-left py-2 text-gray-400">Date</th>
                      <th className="text-left py-2 text-gray-400">Duration</th>
                      <th className="text-left py-2 text-gray-400">Coverage</th>
                      <th className="text-left py-2 text-gray-400">Efficiency</th>
                      <th className="text-left py-2 text-gray-400">Issues</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    <tr>
                      <td className="py-2">2023-09-15</td>
                      <td className="py-2">42 min</td>
                      <td className="py-2">91%</td>
                      <td className="py-2">Medium</td>
                      <td className="py-2">Wind interference</td>
                    </tr>
                    <tr>
                      <td className="py-2">2023-10-02</td>
                      <td className="py-2">38 min</td>
                      <td className="py-2">94%</td>
                      <td className="py-2">High</td>
                      <td className="py-2">None</td>
                    </tr>
                    <tr>
                      <td className="py-2">2023-11-18</td>
                      <td className="py-2">45 min</td>
                      <td className="py-2">97%</td>
                      <td className="py-2">High</td>
                      <td className="py-2">Battery limit</td>
                    </tr>
                    <tr className="border-t-2 border-primary/30">
                      <td className="py-2 font-medium text-primary">Current Plan</td>
                      <td className="py-2 font-medium text-primary">36 min</td>
                      <td className="py-2 font-medium text-primary">98%</td>
                      <td className="py-2 font-medium text-primary">Very High</td>
                      <td className="py-2 font-medium text-primary">None predicted</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
    }
  }
  
  return (
    <>
      {renderContent()}
      
      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button 
          className="flex-1 bg-primary hover:bg-primary/80 text-white py-2 rounded-md font-medium"
          onClick={onSimulateRoute}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          Simulate Route
        </Button>
        <Button 
          className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-md font-medium"
          onClick={onCreateTask}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create Task
        </Button>
        <Button 
          className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-md font-medium"
          onClick={onRegenerate}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38"></path>
          </svg>
          Regenerate
        </Button>
      </div>
    </>
  );
}

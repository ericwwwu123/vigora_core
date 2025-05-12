import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';
import InsightForm from './InsightForm';
import InsightResult from './InsightResult';
import { AIRouteRequest } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function InsightsView() {
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'route' | 'recommendations' | 'analysis'>('route');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mutation for generating insights
  const generateInsightsMutation = useMutation({
    mutationFn: async (request: AIRouteRequest) => {
      const response = await apiRequest('POST', '/api/insights', request);
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
      toast({
        title: "Insights generated",
        description: "Route plan has been generated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/route-plans'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to generate insights",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Handle form submission
  const handleSubmit = (data: AIRouteRequest) => {
    generateInsightsMutation.mutate(data);
  };

  // Create task from generated route
  const handleCreateTask = () => {
    if (!result) return;
    
    // In a real app, you would extract coordinates from the route
    // and create a task with those details
    toast({
      title: "Task creation",
      description: "This would create a new task with the route details.",
    });
  };
  
  // Simulate route animation
  const handleSimulateRoute = () => {
    toast({
      title: "Route simulation",
      description: "This would redirect to the Tracks view with this route loaded.",
    });
  };
  
  // Regenerate route with new parameters
  const handleRegenerate = () => {
    toast({
      title: "Regenerating route",
      description: "This would allow adjusting parameters and regenerating the route.",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">AI-Powered Insights</h1>
        <div>
          <Button variant="outline" className="bg-[#161a1d] border-gray-700 text-white hover:bg-gray-800">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Historical Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* AI Insight Generator */}
        <div className="md:col-span-1">
          <Card className="bg-[#161a1d] border-gray-800 shadow-lg">
            <CardHeader className="pb-2">
              <h3 className="font-semibold text-white">Generate Route Insights</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-6">
                Describe your task requirements in natural language, and our AI will generate optimal route plans and recommendations.
              </p>
              
              <InsightForm 
                onSubmit={handleSubmit} 
                isSubmitting={generateInsightsMutation.isPending} 
              />
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Results */}
        <div className="md:col-span-2">
          <Card className="bg-[#161a1d] border-gray-800 shadow-lg">
            {/* Tabs */}
            <div className="border-b border-gray-800">
              <div className="flex">
                <Button 
                  variant="ghost"
                  className={`px-6 py-3 rounded-none ${activeTab === 'route' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setActiveTab('route')}
                >
                  Route Plan
                </Button>
                <Button 
                  variant="ghost"
                  className={`px-6 py-3 rounded-none ${activeTab === 'recommendations' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setActiveTab('recommendations')}
                >
                  Recommendations
                </Button>
                <Button 
                  variant="ghost"
                  className={`px-6 py-3 rounded-none ${activeTab === 'analysis' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setActiveTab('analysis')}
                >
                  Data Analysis
                </Button>
              </div>
            </div>
            
            {/* Content */}
            <CardContent className="pt-6">
              {generateInsightsMutation.isPending ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 border-4 border-t-primary border-gray-700 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-400">Generating insights with AI...</p>
                  <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
                </div>
              ) : result ? (
                <InsightResult 
                  result={result} 
                  activeTab={activeTab}
                  onCreateTask={handleCreateTask}
                  onSimulateRoute={handleSimulateRoute}
                  onRegenerate={handleRegenerate}
                />
              ) : (
                <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-700 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">No Insights Generated Yet</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    Use the form on the left to describe your task requirements and generate AI-powered route plans and recommendations.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { queryClient } from "./lib/queryClient";
import NavBar from "./components/layout/NavBar";
import Dashboard from "./components/dashboard/Dashboard";
import TasksView from "./components/tasks/TasksView";
import InsightsView from "./components/insights/InsightsView";
import TracksView from "./components/tracks/TracksView";

function Router() {
  return (
    <div className="flex flex-col h-screen bg-[#0e1117] text-[#e5e7eb]">
      <NavBar />
      <div className="flex-grow p-6 overflow-auto">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/tasks" component={TasksView} />
          <Route path="/insights" component={InsightsView} />
          <Route path="/tracks" component={TracksView} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

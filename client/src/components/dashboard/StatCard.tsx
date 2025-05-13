import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'warning';
    label: string;
  };
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export default function StatCard({ title, value, icon, trend, color }: StatCardProps) {
  // Map color to Tailwind classes
  const colorMap = {
    primary: 'text-primary bg-primary/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    danger: 'text-destructive bg-destructive/10',
    info: 'text-info bg-info/10'
  };
  
  const trendColorMap = {
    up: 'text-success',
    down: 'text-destructive',
    warning: 'text-warning'
  };
  
  return (
    <Card className="bg-[#181c22] shadow-2xl p-8 border-0 rounded-2xl transition-transform hover:scale-[1.03]">
      <CardContent className="p-0">
        <div className="flex justify-between items-center">
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-gray-400 text-base font-medium tracking-wide uppercase mb-2 cursor-help">{title}</p>
              </TooltipTrigger>
              <TooltipContent>{title} - Key Performance Indicator</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <h3 className="text-5xl font-extrabold text-white animate-kpi-number transition-all duration-500 cursor-help">{value}</h3>
              </TooltipTrigger>
              <TooltipContent>{title} value</TooltipContent>
            </Tooltip>
            {trend && (
              <p className={`${trendColorMap[trend.direction]} text-base mt-3 flex items-center animate-kpi-trend transition-all duration-500`}>
                <TrendIcon direction={trend.direction} />
                <span className="ml-1 font-semibold">{trend.value}</span>
                <span className="ml-2 text-gray-400 font-normal">{trend.label}</span>
              </p>
            )}
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`rounded-full p-5 ${colorMap[color]} shadow-lg flex items-center justify-center transition-all duration-300 cursor-help`}> 
                <StatIcon name={icon} />
              </div>
            </TooltipTrigger>
            <TooltipContent>{title} icon</TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
}

function TrendIcon({ direction }: { direction: 'up' | 'down' | 'warning' }) {
  switch (direction) {
    case 'up':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      );
    case 'down':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      );
    case 'warning':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      );
  }
}

function StatIcon({ name }: { name: string }) {
  switch (name) {
    case 'tasks':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"></path>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          <path d="M9 14l2 2 4-4"></path>
        </svg>
      );
    case 'drone':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
          <path d="M8 8h.01"></path>
          <path d="M16 16h.01"></path>
          <path d="M16 8h.01"></path>
          <path d="M8 16h.01"></path>
          <path d="M12 3c4.971 0 9 3.582 9 8c0 4.418 -4.029 8 -9 8c-4.97 0 -9 -3.582 -9 -8c0 -4.418 4.03 -8 9 -8z"></path>
        </svg>
      );
    case 'check-circle':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
          <path d="M22 4L12 14.01l-3-3"></path>
        </svg>
      );
    case 'heartbeat':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
          <path d="M3.5 12h6l.5-1 2 4.5 2-7 1.5 3.5h5"></path>
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      );
  }
}

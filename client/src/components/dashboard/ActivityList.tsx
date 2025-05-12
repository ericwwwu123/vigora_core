import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity } from '@shared/schema';

interface ActivityListProps {
  activities?: Activity[];
  isLoading?: boolean;
}

export default function ActivityList({ activities, isLoading = false }: ActivityListProps) {
  if (isLoading) {
    return (
      <CardContent className="p-2 overflow-auto max-h-96">
        {Array(5).fill(0).map((_, i) => (
          <ActivitySkeleton key={i} />
        ))}
      </CardContent>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <CardContent className="p-2 overflow-auto max-h-96 text-center py-8">
        <p className="text-gray-400">No recent activities</p>
      </CardContent>
    );
  }

  return (
    <CardContent className="p-2 overflow-auto max-h-96">
      {activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </CardContent>
  );
}

function ActivityItem({ activity }: { activity: Activity }) {
  // Determine icon and color based on activity type
  let icon = 'info-circle';
  let bgColorClass = 'bg-primary/20';
  let textColorClass = 'text-primary';
  let statusColorClass = 'text-info';

  switch (activity.type) {
    case 'drone_active':
      icon = 'drone';
      bgColorClass = 'bg-primary/20';
      textColorClass = 'text-primary';
      statusColorClass = 'text-success';
      break;
    case 'task_completed':
      icon = 'check-circle';
      bgColorClass = 'bg-success/20';
      textColorClass = 'text-success';
      statusColorClass = 'text-success';
      break;
    case 'drone_warning':
      icon = 'exclamation-triangle';
      bgColorClass = 'bg-warning/20';
      textColorClass = 'text-warning';
      statusColorClass = 'text-warning';
      break;
    case 'task_created':
      icon = 'plus';
      bgColorClass = 'bg-info/20';
      textColorClass = 'text-info';
      statusColorClass = 'text-info';
      break;
    case 'task_cancelled':
      icon = 'times-circle';
      bgColorClass = 'bg-destructive/20';
      textColorClass = 'text-destructive';
      statusColorClass = 'text-destructive';
      break;
  }

  return (
    <div className="p-2 hover:bg-gray-800/50 rounded-lg transition">
      <div className="flex items-start space-x-3">
        <div className={`${bgColorClass} ${textColorClass} p-2 rounded-lg`}>
          <ActivityIcon name={icon} />
        </div>
        <div className="flex-grow">
          <p className="text-sm font-medium text-white">{activity.description}</p>
          <p className="text-xs text-gray-400 mt-1">
            {formatTimestamp(activity.createdAt)}
          </p>
        </div>
        <div className={`${statusColorClass} text-sm font-medium`}>
          {formatStatus(activity.status)}
        </div>
      </div>
    </div>
  );
}

function ActivityIcon({ name }: { name: string }) {
  switch (name) {
    case 'drone':
      return <i className="fa fa-drone"></i>;
    case 'check-circle':
      return <i className="fa fa-check-circle"></i>;
    case 'exclamation-triangle':
      return <i className="fa fa-exclamation-triangle"></i>;
    case 'plus':
      return <i className="fa fa-plus"></i>;
    case 'times-circle':
      return <i className="fa fa-times-circle"></i>;
    default:
      return <i className="fa fa-info-circle"></i>;
  }
}

function ActivitySkeleton() {
  return (
    <div className="p-2">
      <div className="flex items-start space-x-3">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <div className="flex-grow">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

function formatTimestamp(timestamp: string | Date): string {
  if (!timestamp) return 'Unknown time';
  
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString();
}

function formatStatus(status: string | null): string {
  if (!status) return '';
  
  return status.charAt(0).toUpperCase() + status.slice(1);
}

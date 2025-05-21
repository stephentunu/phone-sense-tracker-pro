
import { ActivityLog } from '@/lib/api';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { PhoneCall, MessageSquare, Map, Smartphone, Globe } from 'lucide-react';

interface ActivityTimelineProps {
  activities: ActivityLog[];
  className?: string;
}

export const ActivityTimeline = ({ activities, className }: ActivityTimelineProps) => {
  const getActivityIcon = (type: ActivityLog['activityType']) => {
    switch (type) {
      case 'call': return <PhoneCall className="h-4 w-4" />;
      case 'text': return <MessageSquare className="h-4 w-4" />;
      case 'location': return <Map className="h-4 w-4" />;
      case 'app': return <Smartphone className="h-4 w-4" />;
      case 'web': return <Globe className="h-4 w-4" />;
    }
  };
  
  const getActivityColor = (type: ActivityLog['activityType']) => {
    switch (type) {
      case 'call': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'text': return 'bg-green-100 text-green-600 border-green-200';
      case 'location': return 'bg-red-100 text-red-600 border-red-200';
      case 'app': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'web': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
    }
  };
  
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="font-semibold">Recent Activity</h3>
      <div className="space-y-4">
        {activities.slice(0, 10).map((activity) => (
          <div key={activity.id} className="flex gap-3">
            <div className={cn(
              "mt-0.5 rounded-full p-1.5 flex-shrink-0 shadow-sm border",
              getActivityColor(activity.activityType)
            )}>
              {getActivityIcon(activity.activityType)}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">
                  {activity.contactName || activity.phoneNumber}
                </span>
                <span className="text-muted-foreground text-xs">
                  {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{activity.details}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

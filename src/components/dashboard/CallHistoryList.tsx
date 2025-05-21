
import { CallRecord } from '@/lib/api';
import { format } from 'date-fns';
import { PhoneCall, PhoneIncoming, PhoneOutgoing, PhoneMissed } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface CallHistoryListProps {
  calls: CallRecord[];
  className?: string;
}

export const CallHistoryList = ({ calls, className }: CallHistoryListProps) => {
  const getCallIcon = (type: CallRecord['type']) => {
    switch (type) {
      case 'incoming': return <PhoneIncoming className="h-4 w-4 text-green-500" />;
      case 'outgoing': return <PhoneOutgoing className="h-4 w-4 text-blue-500" />;
      case 'missed': return <PhoneMissed className="h-4 w-4 text-red-500" />;
    }
  };
  
  const formatDuration = (seconds: number): string => {
    if (seconds === 0) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Recent Calls</h3>
      </div>
      <div className="space-y-2">
        {calls.slice(0, 5).map((call) => (
          <div key={call.id} className="flex items-center justify-between p-2 rounded-lg border bg-background hover:bg-accent/10 transition-colors">
            <div className="flex items-center gap-2">
              {getCallIcon(call.type)}
              <div>
                <div className="font-medium">{call.contactName || 'Unknown'}</div>
                <div className="text-xs text-muted-foreground">{call.phoneNumber}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground">
                {formatDuration(call.duration)}
              </div>
              <div className="text-xs text-muted-foreground">
                {format(new Date(call.timestamp), 'MMM d, h:mm a')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

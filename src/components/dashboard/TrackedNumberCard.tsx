
import { TrackedNumber } from '@/lib/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { PhoneCall, MessageSquare, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrackedNumberCardProps {
  trackedNumber: TrackedNumber;
  onClick?: (phoneNumber: string) => void;
}

export const TrackedNumberCard = ({ trackedNumber, onClick }: TrackedNumberCardProps) => {
  const { phoneNumber, label, isActive, lastSeen, callCount, textCount } = trackedNumber;
  
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all hover:shadow-md cursor-pointer",
        isActive && "border-l-4 border-l-green-500"
      )}
      onClick={() => onClick?.(phoneNumber)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{label}</CardTitle>
            <CardDescription className="font-mono">{phoneNumber}</CardDescription>
          </div>
          <Badge variant={isActive ? "default" : "outline"} className={isActive ? "bg-green-500 hover:bg-green-600" : ""}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <PhoneCall className="h-4 w-4" />
            <span>{callCount}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            <span>{textCount}</span>
          </div>
        </div>
      </CardContent>
      {lastSeen && (
        <CardFooter className="pt-2 pb-3 text-xs text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>Last seen: {formatDistanceToNow(new Date(lastSeen), { addSuffix: true })}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

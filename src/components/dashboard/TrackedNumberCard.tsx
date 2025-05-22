
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PhoneCall, MessageSquare, MapPin } from "lucide-react";
import { TrackedNumber } from "@/lib/api";
import { detectCountry } from "@/utils/phoneUtils";
import { formatDistanceToNow } from "date-fns";

interface TrackedNumberCardProps {
  trackedNumber: TrackedNumber;
  onClick?: (phoneNumber: string) => void;
}

export const TrackedNumberCard = ({ trackedNumber, onClick }: TrackedNumberCardProps) => {
  const { phoneNumber, label, isActive, lastSeen, callCount, textCount } = trackedNumber;
  
  const country = detectCountry(phoneNumber);
  
  const handleClick = () => {
    if (onClick) onClick(phoneNumber);
  };
  
  return (
    <Card 
      className={`hover:bg-accent/50 cursor-pointer border-l-4 ${
        isActive ? "border-l-green-500" : "border-l-gray-300"
      }`}
      onClick={handleClick}
    >
      <CardContent className="py-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium truncate mr-2">{label}</h3>
            {isActive ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Active
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                Inactive
              </Badge>
            )}
          </div>
          
          <div className="text-sm text-muted-foreground truncate">
            {phoneNumber}
          </div>
          
          {country && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{country.flag}</span>
              <span>{country.country}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <PhoneCall className="h-3 w-3" />
              <span>{callCount}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>{textCount}</span>
            </div>
            
            {lastSeen && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{formatDistanceToNow(new Date(lastSeen), { addSuffix: true })}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

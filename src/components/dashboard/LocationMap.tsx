
import { LocationData } from '@/lib/api';
import { useState, useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Target } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';

interface LocationMapProps {
  locations: LocationData[];
  height?: string;
  className?: string;
  onAddCurrentLocation?: (coords: {latitude: number, longitude: number, accuracy: number}) => void;
}

export const LocationMap = ({ 
  locations, 
  height = '400px', 
  className,
  onAddCurrentLocation
}: LocationMapProps) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { latitude, longitude, accuracy, isLoading: isLoadingLocation, error } = useGeolocation();
  
  // This would normally use a real map API like Google Maps or Leaflet
  // For this demo, we'll create a simplified visual representation
  
  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => setIsMapLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);
  
  const handleAddCurrentLocation = () => {
    if (latitude && longitude && accuracy && onAddCurrentLocation) {
      onAddCurrentLocation({
        latitude,
        longitude,
        accuracy
      });
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-0 flex flex-row items-center justify-between">
        <CardTitle>Location Tracking</CardTitle>
        {onAddCurrentLocation && (
          <Button 
            size="sm" 
            variant="outline" 
            className="gap-2"
            onClick={handleAddCurrentLocation}
            disabled={isLoadingLocation || !latitude || !longitude}
          >
            <Target className="h-4 w-4" />
            {isLoadingLocation ? 'Getting Location...' : 'Add Current Location'}
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        {!isMapLoaded ? (
          <Skeleton className={`w-full rounded-md`} style={{ height }} />
        ) : (
          <div className="relative w-full rounded-md overflow-hidden" style={{ height }}>
            <div 
              ref={mapContainerRef}
              className="bg-gray-100 w-full h-full relative"
              style={{ backgroundImage: 'url("https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-95.7129,37.0902,3/1200x400?access_token=pk.placeholder")', backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              {locations.slice(0, 5).map((location, index) => (
                <div 
                  key={location.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                  style={{
                    // This is just a visual approximation, not actual geo mapping
                    left: `${25 + (index * 10)}%`,
                    top: `${30 + (index * 8)}%`,
                  }}
                >
                  <div className="relative group">
                    <div className="h-4 w-4 rounded-full bg-tracker-primary animate-pulse-soft" />
                    <div className="absolute inset-0 rounded-full bg-tracker-primary/30 animate-ping" style={{ animationDuration: '3s' }} />
                    
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-white rounded shadow-md text-xs whitespace-nowrap transition-opacity">
                      {location.contactName || 'Unknown'}: {location.address}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* User's Current Location (if available) */}
              {latitude && longitude && (
                <div 
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                >
                  <div className="relative">
                    <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping" style={{ animationDuration: '1.5s' }} />
                    
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-white rounded shadow-md text-xs whitespace-nowrap">
                      You are here (±{accuracy?.toFixed(1)}m)
                    </div>
                  </div>
                </div>
              )}
              
              {/* Legend */}
              <div className="absolute bottom-2 left-2 bg-white p-2 rounded shadow-md text-xs">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-tracker-primary" />
                    <span>Tracked Phone</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span>Your Current Location</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

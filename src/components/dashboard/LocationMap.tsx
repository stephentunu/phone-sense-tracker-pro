
import { LocationData } from '@/lib/api';
import { useState, useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LocationMapProps {
  locations: LocationData[];
  height?: string;
  className?: string;
}

export const LocationMap = ({ locations, height = '400px', className }: LocationMapProps) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // This would normally use a real map API like Google Maps or Leaflet
  // For this demo, we'll create a simplified visual representation
  
  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => setIsMapLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <Card className={className}>
      <CardHeader className="pb-0">
        <CardTitle>Location Tracking</CardTitle>
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
              
              {/* Legend */}
              <div className="absolute bottom-2 left-2 bg-white p-2 rounded shadow-md text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-tracker-primary" />
                  <span>Current Location</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

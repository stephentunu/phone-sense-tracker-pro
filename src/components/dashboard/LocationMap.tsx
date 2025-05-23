
import { LocationData } from '@/lib/api';
import { useState, useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Target, Navigation, Ruler } from 'lucide-react';
import { calculateDistance, formatDistance } from '@/utils/geoUtils';

interface CurrentLocationProps {
  latitude: number;
  longitude: number;
  accuracy: number;
  locationName?: string | null;
}

interface LocationMapProps {
  locations: LocationData[];
  height?: string;
  className?: string;
  onAddCurrentLocation?: (coords: {latitude: number, longitude: number, accuracy: number}) => void;
  currentLocation?: CurrentLocationProps; 
}

export const LocationMap = ({ 
  locations, 
  height = '400px', 
  className,
  onAddCurrentLocation,
  currentLocation
}: LocationMapProps) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // This would normally use a real map API like Google Maps or Leaflet
  // For this demo, we'll create a simplified visual representation
  
  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => setIsMapLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);
  
  const handleAddCurrentLocation = () => {
    if (currentLocation && onAddCurrentLocation) {
      onAddCurrentLocation(currentLocation);
    }
  };

  // Generate map URL centered on current location if available
  const getMapBackgroundUrl = () => {
    if (currentLocation) {
      return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${currentLocation.longitude},${currentLocation.latitude},12/1200x400?access_token=pk.placeholder`;
    }
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-95.7129,37.0902,3/1200x400?access_token=pk.placeholder`;
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-0 flex flex-row items-center justify-between">
        <CardTitle>Location Tracking</CardTitle>
        {onAddCurrentLocation && currentLocation && (
          <Button 
            size="sm" 
            variant="outline" 
            className="gap-2"
            onClick={handleAddCurrentLocation}
          >
            <Target className="h-4 w-4" />
            Add Current Location
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
              style={{ backgroundImage: `url("${getMapBackgroundUrl()}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              {/* Tracked Phone Locations */}
              {locations.slice(0, 10).map((location, index) => {
                let distance = null;
                if (currentLocation) {
                  distance = calculateDistance(
                    currentLocation.latitude,
                    currentLocation.longitude,
                    location.latitude,
                    location.longitude
                  );
                }
                
                return (
                  <div 
                    key={location.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                    style={{
                      // This is just a visual approximation, not actual geo mapping
                      left: `${25 + (index * 8) % 60}%`,
                      top: `${30 + (index * 6) % 50}%`,
                    }}
                  >
                    <div className="relative group">
                      <div className="h-4 w-4 rounded-full bg-tracker-primary animate-pulse-soft" />
                      <div className="absolute inset-0 rounded-full bg-tracker-primary/30 animate-ping" style={{ animationDuration: '3s' }} />
                      
                      <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-white rounded shadow-md text-xs whitespace-nowrap transition-opacity z-20">
                        <p>{location.contactName || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">{location.address}</p>
                        <p className="text-xs text-muted-foreground">
                          Lat: {location.latitude.toFixed(6)}, Long: {location.longitude.toFixed(6)}
                        </p>
                        {distance !== null && (
                          <p className="text-xs font-medium flex items-center gap-1 mt-1">
                            <Ruler className="h-3 w-3" />
                            Distance: {formatDistance(distance)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* User's Current Location (if available) */}
              {currentLocation && (
                <div 
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                >
                  <div className="relative group">
                    <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping" style={{ animationDuration: '1.5s' }} />
                    
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-white rounded shadow-md text-xs whitespace-nowrap transition-opacity z-20">
                      <p>Your current location</p>
                      {currentLocation.locationName && (
                        <p className="text-xs font-medium">{currentLocation.locationName}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Lat: {currentLocation.latitude.toFixed(6)}, Long: {currentLocation.longitude.toFixed(6)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Accuracy: ±{currentLocation.accuracy.toFixed(1)}m
                      </p>
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
              
              {/* Navigation Compass */}
              <div className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md">
                <Navigation className="h-5 w-5 text-blue-500" />
              </div>

              {/* Current Location Display */}
              {currentLocation && currentLocation.locationName && (
                <div className="absolute top-2 left-2 bg-white/90 py-1 px-3 rounded-full shadow-md text-sm font-medium flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-blue-500" />
                  {currentLocation.locationName}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


import { LocationData } from '@/lib/api';
import { useState, useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Target, Navigation, Ruler } from 'lucide-react';
import { calculateDistance, formatDistance } from '@/utils/geoUtils';
import { Input } from '@/components/ui/input';

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
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Check for saved token in localStorage
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setMapboxToken(savedToken);
      setShowTokenInput(false);
    }
    
    // Simulate map loading
    const timer = setTimeout(() => setIsMapLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);
  
  const handleAddCurrentLocation = () => {
    if (currentLocation && onAddCurrentLocation) {
      onAddCurrentLocation(currentLocation);
    }
  };
  
  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapboxToken) {
      localStorage.setItem('mapbox_token', mapboxToken);
      setShowTokenInput(false);
    }
  };

  // Generate map URL centered on current location if available
  const getMapBackgroundUrl = () => {
    // If we have a token, use Mapbox
    if (mapboxToken && !showTokenInput) {
      // Center on current location if available, otherwise on tracked locations or default to US
      let centerLat, centerLng, zoom;
      
      if (currentLocation) {
        centerLat = currentLocation.latitude;
        centerLng = currentLocation.longitude;
        zoom = 12;
      } else if (locations.length > 0) {
        centerLat = locations[0].latitude;
        centerLng = locations[0].longitude;
        zoom = 10;
      } else {
        centerLat = 37.7749;
        centerLng = -122.4194;
        zoom = 3;
      }
      
      // Build marker string for all locations
      let markers = '';
      
      // Add tracked locations markers
      locations.slice(0, 10).forEach(location => {
        markers += `pin-s+f43f5e(${location.longitude},${location.latitude}),`;
      });
      
      // Add current location marker if available
      if (currentLocation) {
        markers += `pin-s+0077ff(${currentLocation.longitude},${currentLocation.latitude})`;
      } else if (markers.endsWith(',')) {
        // Remove trailing comma if no current location
        markers = markers.slice(0, -1);
      }
      
      // Build Mapbox Static API URL
      return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${
        markers ? markers + '/' : ''
      }${centerLng},${centerLat},${zoom}/1200x${parseInt(height)}@2x?access_token=${mapboxToken}`;
    }
    
    // Fallback to placeholder map
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
        ) : showTokenInput ? (
          <div className="p-4 border border-dashed rounded-md flex flex-col items-center justify-center space-y-4" style={{ height }}>
            <h3 className="text-lg font-medium">Mapbox API Token Required</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              To display a live geographical map, please enter your Mapbox public API token.
              You can get one for free at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">mapbox.com</a>
            </p>
            <form onSubmit={handleTokenSubmit} className="w-full max-w-md space-y-2">
              <Input
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                placeholder="Enter Mapbox public token"
                className="w-full"
              />
              <Button type="submit" className="w-full">
                Save Token & Load Map
              </Button>
            </form>
          </div>
        ) : (
          <div className="relative w-full rounded-md overflow-hidden" style={{ height }}>
            <div 
              ref={mapContainerRef}
              className="bg-gray-100 w-full h-full relative"
            >
              {/* Map Image */}
              <img 
                src={getMapBackgroundUrl()}
                alt="Location Map" 
                className="w-full h-full object-cover"
                onLoad={() => console.log("Map image loaded successfully")}
                onError={() => console.error("Error loading map image")}
              />
              
              {/* Current Location Display */}
              {currentLocation && currentLocation.locationName && (
                <div className="absolute top-2 left-2 bg-white/90 py-1 px-3 rounded-full shadow-md text-sm font-medium flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-blue-500" />
                  {currentLocation.locationName}
                </div>
              )}
              
              {/* Location Info Tooltips */}
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
                
                // Calculate visual position - this is just for tooltips,
                // actual pins are rendered on the static map image
                const left = 25 + (index * 8) % 60;
                const top = 30 + (index * 6) % 50;
                
                return (
                  <div 
                    key={location.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                    style={{
                      left: `${left}%`,
                      top: `${top}%`,
                    }}
                  >
                    <div className="relative group">
                      <div className="h-4 w-4 rounded-full bg-tracker-primary/0" /> {/* Invisible but keeps tooltip positioning */}
                      
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
              
              {/* Navigation Compass */}
              <div className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md">
                <Navigation className="h-5 w-5 text-blue-500" />
              </div>

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

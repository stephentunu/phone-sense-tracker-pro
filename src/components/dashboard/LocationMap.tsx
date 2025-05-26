
import { LocationData } from '@/lib/api';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Target, Navigation, Ruler } from 'lucide-react';
import { calculateDistance, formatDistance } from '@/utils/geoUtils';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const trackedPhoneIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const currentLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

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

// Component to update view when locations change
const ViewUpdater = ({ locations, currentLocation }: { locations: LocationData[], currentLocation?: CurrentLocationProps }) => {
  const mapInstance = useMap();
  
  useEffect(() => {
    if (currentLocation) {
      mapInstance.setView([currentLocation.latitude, currentLocation.longitude], 12);
    } else if (locations.length > 0) {
      mapInstance.setView([locations[0].latitude, locations[0].longitude], 10);
    } else {
      mapInstance.setView([37.7749, -122.4194], 3);
    }
  }, [locations, currentLocation, mapInstance]);
  
  return null;
};

export const LocationMap = ({ 
  locations, 
  height = '400px', 
  className,
  onAddCurrentLocation,
  currentLocation
}: LocationMapProps) => {
  const [isViewLoaded, setIsViewLoaded] = useState(false);
  
  useEffect(() => {
    // Simulate geographic view loading
    const timer = setTimeout(() => setIsViewLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);
  
  const handleAddCurrentLocation = () => {
    if (currentLocation && onAddCurrentLocation) {
      onAddCurrentLocation(currentLocation);
    }
  };

  // Calculate view center and zoom
  const getViewCenter = (): [number, number] => {
    if (currentLocation) {
      return [currentLocation.latitude, currentLocation.longitude];
    } else if (locations.length > 0) {
      return [locations[0].latitude, locations[0].longitude];
    } else {
      return [37.7749, -122.4194]; // Default to San Francisco
    }
  };

  const getViewZoom = (): number => {
    if (currentLocation) {
      return 12;
    } else if (locations.length > 0) {
      return 10;
    } else {
      return 3;
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-0 flex flex-row items-center justify-between">
        <CardTitle>Geographic Location View</CardTitle>
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
        {!isViewLoaded ? (
          <Skeleton className={`w-full rounded-md`} style={{ height }} />
        ) : (
          <div className="relative w-full rounded-md overflow-hidden" style={{ height }}>
            <MapContainer
              center={getViewCenter()}
              zoom={getViewZoom()}
              style={{ height: '100%', width: '100%' }}
              className="rounded-md"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <ViewUpdater locations={locations} currentLocation={currentLocation} />
              
              {/* Tracked phone locations */}
              {locations.slice(0, 10).map((location) => {
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
                  <Marker 
                    key={location.id}
                    position={[location.latitude, location.longitude]}
                    icon={trackedPhoneIcon}
                  >
                    <Popup>
                      <div className="text-sm">
                        <p className="font-medium">{location.contactName || 'Unknown'}</p>
                        <p className="text-muted-foreground">{location.address}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Lat: {location.latitude.toFixed(6)}, Long: {location.longitude.toFixed(6)}
                        </p>
                        {distance !== null && (
                          <p className="text-xs font-medium flex items-center gap-1 mt-1 text-green-600">
                            <Ruler className="h-3 w-3" />
                            Distance: {formatDistance(distance)}
                          </p>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
              
              {/* Current location marker */}
              {currentLocation && (
                <Marker 
                  position={[currentLocation.latitude, currentLocation.longitude]}
                  icon={currentLocationIcon}
                >
                  <Popup>
                    <div className="text-sm">
                      <p className="font-medium flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-blue-500" />
                        Your Current Location
                      </p>
                      {currentLocation.locationName && (
                        <p className="text-muted-foreground">{currentLocation.locationName}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Lat: {currentLocation.latitude.toFixed(6)}, Long: {currentLocation.longitude.toFixed(6)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Accuracy: {currentLocation.accuracy.toFixed(1)}m
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
            
            {/* Current Location Display */}
            {currentLocation && currentLocation.locationName && (
              <div className="absolute top-2 left-2 bg-white/90 py-1 px-3 rounded-full shadow-md text-sm font-medium flex items-center gap-1.5 z-[1000]">
                <MapPin className="h-3 w-3 text-blue-500" />
                {currentLocation.locationName}
              </div>
            )}
            
            {/* Navigation Compass */}
            <div className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md z-[1000]">
              <Navigation className="h-5 w-5 text-blue-500" />
            </div>

            {/* Legend */}
            <div className="absolute bottom-2 left-2 bg-white p-2 rounded shadow-md text-xs z-[1000]">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span>Tracked Phone</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span>Your Current Location</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

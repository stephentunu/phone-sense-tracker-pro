
import { LocationData } from '@/lib/api';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Target, Navigation, Ruler, Phone, MessageSquare } from 'lucide-react';
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
  callCount?: number;
  textCount?: number;
  selectedPhoneNumber?: string | null;
}

export const LocationMap = ({ 
  locations, 
  height = '400px', 
  className,
  onAddCurrentLocation,
  currentLocation,
  callCount = 0,
  textCount = 0,
  selectedPhoneNumber
}: LocationMapProps) => {
  const [isViewLoaded, setIsViewLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  
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

  // Calculate view center
  const getViewCenter = () => {
    if (currentLocation) {
      return { lat: currentLocation.latitude, lng: currentLocation.longitude };
    } else if (locations.length > 0) {
      return { lat: locations[0].latitude, lng: locations[0].longitude };
    } else {
      return { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco
    }
  };

  const center = getViewCenter();
  const zoom = currentLocation ? 12 : locations.length > 0 ? 10 : 3;
  
  // Generate static map URL (using OpenStreetMap tile service)
  const mapWidth = 800;
  const mapHeight = parseInt(height) || 400;
  const tileSize = 256;
  
  // Calculate tile coordinates
  const lat = center.lat * Math.PI / 180;
  const n = Math.pow(2, zoom);
  const xtile = Math.floor((center.lng + 180) / 360 * n);
  const ytile = Math.floor((1 - Math.asinh(Math.tan(lat)) / Math.PI) / 2 * n);
  
  const staticMapUrl = `https://tile.openstreetmap.org/${zoom}/${xtile}/${ytile}.png`;
  
  // Convert lat/lng to pixel coordinates for markers
  const latLngToPixel = (lat: number, lng: number) => {
    const latRad = lat * Math.PI / 180;
    const n = Math.pow(2, zoom);
    const xPixel = (lng + 180) / 360 * n * tileSize;
    const yPixel = (1 - Math.asinh(Math.tan(latRad)) / Math.PI) / 2 * n * tileSize;
    
    // Convert to relative position within our map container
    const centerXPixel = (center.lng + 180) / 360 * n * tileSize;
    const centerYPixel = (1 - Math.asinh(Math.tan(center.lat * Math.PI / 180)) / Math.PI) / 2 * n * tileSize;
    
    const relativeX = (xPixel - centerXPixel) + mapWidth / 2;
    const relativeY = (yPixel - centerYPixel) + mapHeight / 2;
    
    return { x: relativeX, y: relativeY };
  };

  // Get the most recent location for the tracked phone
  const mostRecentLocation = locations.length > 0 ? locations[0] : null;
  
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
        {/* Location Info Panel */}
        {mostRecentLocation && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg border">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium flex items-center gap-2 text-red-600">
                  <MapPin className="h-4 w-4" />
                  Tracked Phone Location
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {mostRecentLocation.address || 'Unknown location'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Contact: {mostRecentLocation.contactName || 'Unknown'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Lat: {mostRecentLocation.latitude.toFixed(6)}, Long: {mostRecentLocation.longitude.toFixed(6)}
                </p>
                
                {/* Distance from current location */}
                {currentLocation && (
                  <p className="text-sm font-medium flex items-center gap-1 mt-2 text-green-600">
                    <Ruler className="h-3 w-3" />
                    Distance from you: {formatDistance(calculateDistance(
                      currentLocation.latitude,
                      currentLocation.longitude,
                      mostRecentLocation.latitude,
                      mostRecentLocation.longitude
                    ))}
                  </p>
                )}
              </div>
              
              {/* Activity Stats */}
              <div className="flex flex-col gap-2 ml-4">
                <div className="flex items-center gap-1 text-xs">
                  <Phone className="h-3 w-3 text-blue-500" />
                  <span className="font-medium">{callCount}</span>
                  <span className="text-muted-foreground">calls</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <MessageSquare className="h-3 w-3 text-green-500" />
                  <span className="font-medium">{textCount}</span>
                  <span className="text-muted-foreground">texts</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isViewLoaded ? (
          <Skeleton className={`w-full rounded-md`} style={{ height }} />
        ) : (
          <div className="relative w-full rounded-md overflow-hidden bg-slate-100" style={{ height }}>
            {/* Background pattern to simulate map */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Ccircle cx='6' cy='6' r='6'/%3E%3Ccircle cx='54' cy='54' r='6'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
            
            {/* Location markers */}
            {locations.slice(0, 10).map((location, index) => {
              const position = latLngToPixel(location.latitude, location.longitude);
              const isVisible = position.x >= 0 && position.x <= mapWidth && position.y >= 0 && position.y <= mapHeight;
              
              if (!isVisible) return null;
              
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
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{ left: position.x, top: position.y }}
                  onClick={() => setSelectedLocation(selectedLocation?.id === location.id ? null : location)}
                >
                  {/* Red marker for tracked phone */}
                  <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                    <MapPin className="h-3 w-3 text-white" />
                  </div>
                  
                  {/* Enhanced Tooltip */}
                  {selectedLocation?.id === location.id && (
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg border min-w-64 z-10">
                      <div className="space-y-2">
                        <p className="font-medium text-sm text-red-600 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {location.contactName || 'Unknown Contact'}
                        </p>
                        <p className="text-sm font-medium">{location.address || 'Unknown location'}</p>
                        <p className="text-xs text-muted-foreground">
                          Lat: {location.latitude.toFixed(6)}, Long: {location.longitude.toFixed(6)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Accuracy: {location.accuracy.toFixed(1)}m
                        </p>
                        {distance !== null && (
                          <p className="text-xs font-medium flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded">
                            <Ruler className="h-3 w-3" />
                            Distance from you: {formatDistance(distance)}
                          </p>
                        )}
                        
                        {/* Activity info in tooltip */}
                        <div className="flex gap-4 pt-2 border-t">
                          <div className="flex items-center gap-1 text-xs">
                            <Phone className="h-3 w-3 text-blue-500" />
                            <span className="font-medium">{callCount}</span>
                            <span className="text-muted-foreground">calls</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <MessageSquare className="h-3 w-3 text-green-500" />
                            <span className="font-medium">{textCount}</span>
                            <span className="text-muted-foreground">texts</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Current location marker */}
            {currentLocation && (() => {
              const position = latLngToPixel(currentLocation.latitude, currentLocation.longitude);
              const isVisible = position.x >= 0 && position.x <= mapWidth && position.y >= 0 && position.y <= mapHeight;
              
              if (!isVisible) return null;
              
              return (
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: position.x, top: position.y }}
                >
                  {/* Blue marker for current location */}
                  <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                    <MapPin className="h-3 w-3 text-white" />
                  </div>
                  
                  {/* Pulsing ring effect */}
                  <div className="absolute inset-0 w-6 h-6 bg-blue-500 rounded-full animate-ping opacity-20"></div>
                </div>
              );
            })()}
            
            {/* Current Location Display */}
            {currentLocation && currentLocation.locationName && (
              <div className="absolute top-2 left-2 bg-blue-500/90 text-white py-1 px-3 rounded-full shadow-md text-sm font-medium flex items-center gap-1.5 z-[1000]">
                <MapPin className="h-3 w-3" />
                Your Location: {currentLocation.locationName}
              </div>
            )}
            
            {/* Tracked Phone Location Display */}
            {mostRecentLocation && (
              <div className="absolute top-2 right-2 bg-red-500/90 text-white py-1 px-3 rounded-full shadow-md text-sm font-medium flex items-center gap-1.5 z-[1000]">
                <MapPin className="h-3 w-3" />
                Phone: {mostRecentLocation.address?.split(',')[0] || 'Unknown'}
              </div>
            )}
            
            {/* Navigation Compass */}
            <div className="absolute bottom-16 right-2 bg-white p-2 rounded-full shadow-md z-[1000]">
              <Navigation className="h-5 w-5 text-blue-500" />
            </div>

            {/* Enhanced Legend */}
            <div className="absolute bottom-2 left-2 bg-white p-3 rounded shadow-md text-xs z-[1000] min-w-48">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <span>Tracked Phone</span>
                  </div>
                  {mostRecentLocation && currentLocation && (
                    <span className="text-green-600 font-medium">
                      {formatDistance(calculateDistance(
                        currentLocation.latitude,
                        currentLocation.longitude,
                        mostRecentLocation.latitude,
                        mostRecentLocation.longitude
                      ))} away
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span>Your Current Location</span>
                </div>
                
                {selectedPhoneNumber && (
                  <div className="pt-2 border-t flex gap-4">
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-blue-500" />
                      <span>{callCount} calls</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3 text-green-500" />
                      <span>{textCount} texts</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Center crosshair */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-4 h-4 border-2 border-gray-400 rounded-full bg-white/50"></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

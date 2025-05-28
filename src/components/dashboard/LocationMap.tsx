
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

  // Calculate view center - prioritize tracked phone location
  const getViewCenter = () => {
    if (locations.length > 0) {
      return { lat: locations[0].latitude, lng: locations[0].longitude };
    } else if (currentLocation) {
      return { lat: currentLocation.latitude, lng: currentLocation.longitude };
    } else {
      return { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco
    }
  };

  const center = getViewCenter();
  const zoom = 12;
  
  // Generate static map appearance
  const mapWidth = 800;
  const mapHeight = parseInt(height) || 400;
  
  // Convert lat/lng to pixel coordinates for markers
  const latLngToPixel = (lat: number, lng: number) => {
    // Simple projection for demonstration
    const latRange = 0.01; // Adjust based on zoom level
    const lngRange = 0.01;
    
    const x = ((lng - center.lng) / lngRange) * (mapWidth / 2) + mapWidth / 2;
    const y = ((center.lat - lat) / latRange) * (mapHeight / 2) + mapHeight / 2;
    
    return { x: Math.max(0, Math.min(mapWidth, x)), y: Math.max(0, Math.min(mapHeight, y)) };
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
        {/* Enhanced Location Info Panel */}
        {mostRecentLocation && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold flex items-center gap-2 text-red-700 text-lg">
                  <MapPin className="h-5 w-5" />
                  Tracked Phone Location
                </h4>
                <div className="mt-2 space-y-1">
                  <p className="text-base font-medium text-gray-900">
                    📍 {mostRecentLocation.address || 'Unknown location'}
                  </p>
                  <p className="text-sm text-gray-600">
                    👤 Contact: {mostRecentLocation.contactName || 'Unknown Contact'}
                  </p>
                  <p className="text-sm text-gray-600">
                    📞 Phone: {selectedPhoneNumber || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-500">
                    📍 Coordinates: {mostRecentLocation.latitude.toFixed(6)}, {mostRecentLocation.longitude.toFixed(6)}
                  </p>
                  <p className="text-xs text-gray-500">
                    🎯 Accuracy: ±{mostRecentLocation.accuracy.toFixed(1)} meters
                  </p>
                  
                  {/* Distance from current location */}
                  {currentLocation && (
                    <p className="text-sm font-semibold flex items-center gap-1 mt-2 text-green-700 bg-green-100 px-2 py-1 rounded">
                      <Ruler className="h-4 w-4" />
                      Distance from your location: {formatDistance(calculateDistance(
                        currentLocation.latitude,
                        currentLocation.longitude,
                        mostRecentLocation.latitude,
                        mostRecentLocation.longitude
                      ))}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Activity Stats */}
              <div className="flex flex-col gap-3 ml-4 bg-white p-3 rounded-lg border">
                <h5 className="text-sm font-medium text-gray-700">Phone Activity</h5>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-blue-500" />
                  <span className="font-semibold text-blue-700">{callCount}</span>
                  <span className="text-gray-600">total calls</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MessageSquare className="h-4 w-4 text-green-500" />
                  <span className="font-semibold text-green-700">{textCount}</span>
                  <span className="text-gray-600">text messages</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isViewLoaded ? (
          <Skeleton className={`w-full rounded-md`} style={{ height }} />
        ) : (
          <div className="relative w-full rounded-md overflow-hidden bg-gradient-to-br from-blue-50 to-green-50 border-2 border-gray-200" style={{ height }}>
            {/* Enhanced background pattern */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234B5563' fill-opacity='0.3'%3E%3Cpath d='M40 40V20H20V0H0v40z'/%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
            
            {/* Grid lines for map feel */}
            <div className="absolute inset-0">
              {Array.from({length: 10}).map((_, i) => (
                <div key={`h-${i}`} className="absolute w-full border-t border-gray-300 opacity-30" style={{top: `${i * 10}%`}} />
              ))}
              {Array.from({length: 10}).map((_, i) => (
                <div key={`v-${i}`} className="absolute h-full border-l border-gray-300 opacity-30" style={{left: `${i * 10}%`}} />
              ))}
            </div>
            
            {/* Tracked phone location markers */}
            {locations.slice(0, 5).map((location, index) => {
              const position = latLngToPixel(location.latitude, location.longitude);
              const isVisible = position.x >= 20 && position.x <= mapWidth - 20 && position.y >= 20 && position.y <= mapHeight - 20;
              
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
                <div key={location.id}>
                  {/* Large red marker for tracked phone */}
                  <div
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                    style={{ left: position.x, top: position.y }}
                    onClick={() => setSelectedLocation(selectedLocation?.id === location.id ? null : location)}
                  >
                    <div className="w-8 h-8 bg-red-600 rounded-full border-3 border-white shadow-lg flex items-center justify-center animate-pulse">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    
                    {/* Location label */}
                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                      📱 {location.contactName || 'Tracked Phone'}
                    </div>
                    
                    {/* Enhanced Tooltip */}
                    {selectedLocation?.id === location.id && (
                      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-xl border-2 border-red-200 min-w-80 z-30">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-red-700 font-semibold border-b pb-2">
                            <MapPin className="h-4 w-4" />
                            Tracked Phone Details
                          </div>
                          
                          <div className="space-y-2">
                            <p className="font-medium text-gray-900">📍 {location.address || 'Unknown location'}</p>
                            <p className="text-sm text-gray-600">👤 {location.contactName || 'Unknown Contact'}</p>
                            <p className="text-sm text-gray-600">📞 {selectedPhoneNumber}</p>
                            <p className="text-xs text-gray-500">
                              Coordinates: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                            </p>
                            <p className="text-xs text-gray-500">
                              Accuracy: ±{location.accuracy.toFixed(1)}m
                            </p>
                          </div>
                          
                          {distance !== null && (
                            <div className="bg-green-50 p-2 rounded border border-green-200">
                              <p className="text-sm font-semibold flex items-center gap-1 text-green-700">
                                <Ruler className="h-3 w-3" />
                                Distance from you: {formatDistance(distance)}
                              </p>
                            </div>
                          )}
                          
                          {/* Activity info in tooltip */}
                          <div className="flex gap-4 pt-2 border-t bg-gray-50 p-2 rounded">
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-4 w-4 text-blue-500" />
                              <span className="font-semibold">{callCount}</span>
                              <span className="text-gray-600">calls</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <MessageSquare className="h-4 w-4 text-green-500" />
                              <span className="font-semibold">{textCount}</span>
                              <span className="text-gray-600">texts</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {/* Current location marker */}
            {currentLocation && (() => {
              const position = latLngToPixel(currentLocation.latitude, currentLocation.longitude);
              const isVisible = position.x >= 20 && position.x <= mapWidth - 20 && position.y >= 20 && position.y <= mapHeight - 20;
              
              if (!isVisible) return null;
              
              return (
                <div key="current-location">
                  <div
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                    style={{ left: position.x, top: position.y }}
                  >
                    {/* Blue marker for current location */}
                    <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                      <MapPin className="h-3 w-3 text-white" />
                    </div>
                    
                    {/* Pulsing ring effect */}
                    <div className="absolute inset-0 w-6 h-6 bg-blue-500 rounded-full animate-ping opacity-30"></div>
                    
                    {/* Your location label */}
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                      📍 Your Location
                    </div>
                  </div>
                </div>
              );
            })()}
            
            {/* Current Location Display */}
            {currentLocation && currentLocation.locationName && (
              <div className="absolute top-3 left-3 bg-blue-600 text-white py-2 px-3 rounded-lg shadow-md text-sm font-medium flex items-center gap-2 z-[1000]">
                <MapPin className="h-4 w-4" />
                <span>Your Location: {currentLocation.locationName}</span>
              </div>
            )}
            
            {/* Tracked Phone Location Display */}
            {mostRecentLocation && (
              <div className="absolute top-3 right-3 bg-red-600 text-white py-2 px-3 rounded-lg shadow-md text-sm font-medium flex items-center gap-2 z-[1000]">
                <MapPin className="h-4 w-4" />
                <span>📱 Phone: {mostRecentLocation.address?.split(',')[0] || 'Unknown'}</span>
              </div>
            )}
            
            {/* Navigation Compass */}
            <div className="absolute bottom-16 right-3 bg-white p-2 rounded-full shadow-lg border z-[1000]">
              <Navigation className="h-5 w-5 text-blue-600" />
            </div>

            {/* Enhanced Legend */}
            <div className="absolute bottom-3 left-3 bg-white/95 p-4 rounded-lg shadow-lg border text-xs z-[1000] min-w-64">
              <div className="space-y-3">
                <h6 className="font-semibold text-gray-800 border-b pb-1">Map Legend</h6>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-600 border border-white shadow" />
                    <span className="font-medium">Tracked Phone</span>
                  </div>
                  {mostRecentLocation && currentLocation && (
                    <span className="text-green-700 font-semibold bg-green-100 px-2 py-1 rounded">
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
                  <div className="h-3 w-3 rounded-full bg-blue-500 border border-white shadow" />
                  <span className="font-medium">Your Current Location</span>
                </div>
                
                {selectedPhoneNumber && (
                  <div className="pt-2 border-t bg-gray-50 p-2 rounded">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-blue-500" />
                        <span className="font-semibold">{callCount}</span>
                        <span className="text-gray-600">calls</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3 text-green-500" />
                        <span className="font-semibold">{textCount}</span>
                        <span className="text-gray-600">texts</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Center crosshair */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-4 h-4 border-2 border-gray-500 rounded-full bg-white/70 shadow"></div>
            </div>
            
            {/* No tracked phone message */}
            {!mostRecentLocation && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-yellow-100 border border-yellow-300 p-4 rounded-lg text-center">
                  <MapPin className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-yellow-800 font-medium">No tracked phone location available</p>
                  <p className="text-yellow-700 text-sm">Add a phone number to start tracking</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { supabaseApi, LocationData, TrackedNumber } from '@/lib/supabaseApi';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { LocationMap } from '@/components/dashboard/LocationMap';
import { TrackedNumberCard } from '@/components/dashboard/TrackedNumberCard';
import { AddPhoneDialog } from '@/components/dashboard/AddPhoneDialog';
import { MapPin, Clock, Ruler, Search, Target, Crosshair } from 'lucide-react';
import { detectCountry } from '@/utils/phoneUtils';
import { format } from 'date-fns';
import { useGeolocation } from '@/hooks/useGeolocation';
import { calculateDistance, formatDistance } from '@/utils/geoUtils';
import { PhoneTrackingService } from '@/services/phoneTrackingService';

const LocationTracking = () => {
  const { toast } = useToast();
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Enhanced geolocation with high accuracy settings
  const geolocation = useGeolocation({
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 0 // Always get fresh location for tracking
  });
  
  // Fetch tracked numbers
  const { 
    data: trackedNumbers, 
    isLoading: isLoadingTrackedNumbers,
    refetch: refetchTrackedNumbers,
  } = useQuery({
    queryKey: ['trackedNumbers'],
    queryFn: supabaseApi.getTrackedNumbers,
  });
  
  // Filter tracked numbers based on search query
  const filteredTrackedNumbers = trackedNumbers?.filter(number => 
    number.phoneNumber.includes(searchQuery) || 
    number.label.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Fetch locations
  const { 
    data: locations,
    isLoading: isLoadingLocations,
    refetch: refetchLocations
  } = useQuery({
    queryKey: ['locations', selectedPhoneNumber],
    queryFn: () => selectedPhoneNumber 
      ? supabaseApi.getLocationsByNumber(selectedPhoneNumber)
      : supabaseApi.getLocations(),
    enabled: !!selectedPhoneNumber || trackedNumbers?.length === 0
  });
  
  // Set the first tracked number as selected by default
  useEffect(() => {
    if (filteredTrackedNumbers?.length && !selectedPhoneNumber) {
      setSelectedPhoneNumber(filteredTrackedNumbers[0].phoneNumber);
    } else if (filteredTrackedNumbers?.length === 0) {
      // Clear selection if no phones match the search
      setSelectedPhoneNumber(null);
    }
  }, [filteredTrackedNumbers, selectedPhoneNumber]);
  
  const handleTrackedNumberClick = (phoneNumber: string) => {
    setSelectedPhoneNumber(phoneNumber);
    toast({
      title: "Phone Selected",
      description: `Showing high-accuracy location data for ${phoneNumber}`,
    });
  };
  
  const handleAddPhoneSuccess = (phoneNumber: string) => {
    refetchTrackedNumbers();
    setSelectedPhoneNumber(phoneNumber);
    toast({
      title: "Success",
      description: "Phone number added and ready for high-accuracy tracking",
    });
  };
  
  const handleTrackPhone = async () => {
    if (!selectedPhoneNumber) {
      toast({
        title: "Error",
        description: "Please select a phone number first",
        variant: "destructive"
      });
      return;
    }
    
    try {
      toast({
        title: "Tracking Phone",
        description: "Getting real-time location from tracking service...",
      });
      
      // Get actual phone location from tracking service
      const phoneLocation = await PhoneTrackingService.getPhoneLocation(selectedPhoneNumber);
      
      if (!phoneLocation) {
        toast({
          title: "Error",
          description: "Could not locate the tracked phone",
          variant: "destructive"
        });
        return;
      }
      
      console.log('Phone tracking result:', {
        phoneNumber: selectedPhoneNumber,
        coordinates: `${phoneLocation.latitude}, ${phoneLocation.longitude}`,
        accuracy: `±${phoneLocation.accuracy}m`,
        address: phoneLocation.address
      });
      
      // Save the tracked phone's actual location to database
      const newLocation = await supabaseApi.addLocation(
        selectedPhoneNumber,
        phoneLocation.latitude,
        phoneLocation.longitude,
        phoneLocation.accuracy,
        phoneLocation.address,
        {
          heading: phoneLocation.heading,
          speed: phoneLocation.speed,
          altitude: phoneLocation.altitude
        }
      );
      
      refetchLocations();
      
      const country = detectCountry(selectedPhoneNumber);
      const countryName = country ? `${country.country} (${country.flag})` : "Unknown";
      
      toast({
        title: "Phone Located Successfully",
        description: `Found ${phoneLocation.contactName} at ${phoneLocation.address} with ±${phoneLocation.accuracy.toFixed(1)}m accuracy`,
      });
    } catch (error) {
      console.error('Phone tracking error:', error);
      toast({
        title: "Tracking Failed",
        description: "Failed to get phone location from tracking service",
        variant: "destructive"
      });
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Get current location (most recent)
  const currentLocation = locations && locations.length > 0 ? locations[0] : null;
  
  // Get country information
  const countryInfo = selectedPhoneNumber ? detectCountry(selectedPhoneNumber) : null;
  
  // Get stats for the selected phone number
  const selectedNumberStats = selectedPhoneNumber && trackedNumbers ? 
    trackedNumbers.find(num => num.phoneNumber === selectedPhoneNumber) : null;
  
  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">High-Accuracy Location Tracking</h1>
        <AddPhoneDialog onSuccess={handleAddPhoneSuccess} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Tracked Numbers */}
        <div className="md:col-span-3 space-y-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">Tracked Numbers</h2>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search phone number..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          
          {isLoadingTrackedNumbers ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTrackedNumbers?.length ? (
                filteredTrackedNumbers.map((number) => (
                  <TrackedNumberCard 
                    key={number.phoneNumber} 
                    trackedNumber={number}
                    onClick={handleTrackedNumberClick}
                  />
                ))
              ) : searchQuery ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-6">
                    <p className="text-muted-foreground mb-2">No matching phones found</p>
                    <Button variant="outline" onClick={() => setSearchQuery('')}>Clear Search</Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-6">
                    <p className="text-muted-foreground mb-2">No phones tracked yet</p>
                    <AddPhoneDialog onSuccess={handleAddPhoneSuccess} />
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          
           {/* Your Current Location Card */}
          {geolocation.latitude && geolocation.longitude && (
            <Card className="mt-6 bg-blue-50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  Your Current Location
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <p className="text-base font-semibold text-blue-900">
                    📍 {geolocation.locationName || 'Getting your location...'}
                  </p>
                  <div className="text-xs text-blue-700">
                    {geolocation.latitude?.toFixed(6)}, {geolocation.longitude?.toFixed(6)}
                  </div>
                  <div className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded">
                    <Crosshair className="h-3 w-3 inline mr-1" />
                    Accuracy: ±{geolocation.accuracy?.toFixed(1) || 'N/A'}m
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

           {/* Tracked Phone Location Card */}
          {selectedPhoneNumber && currentLocation && (
            <Card className="mt-6 bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Tracked Phone Location
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {countryInfo && (
                    <div className="flex items-center gap-1.5 text-sm">
                      <span className="text-lg">{countryInfo.flag}</span>
                      <span className="font-medium">{countryInfo.country}</span>
                    </div>
                  )}
                  
                   <div className="space-y-2">
                     <p className="text-base font-semibold text-gray-900">
                       📍 {currentLocation.address || 'Unknown address'}
                     </p>
                     <p className="text-xs text-muted-foreground flex items-center gap-1">
                       <Clock className="h-3 w-3" /> 
                       {format(new Date(currentLocation.timestamp), 'MMM d, h:mm:ss a')}
                     </p>
                     <div className="text-xs text-muted-foreground">
                       {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                     </div>
                     <div className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded">
                       <Crosshair className="h-3 w-3 inline mr-1" />
                       Accuracy: ±{currentLocation.accuracy.toFixed(1)}m
                     </div>
                     
                     {/* Distance from current location */}
                     {geolocation.latitude && geolocation.longitude && (
                       <div className="text-xs flex items-center gap-1 text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded">
                         <Ruler className="h-3 w-3" />
                         Distance: {formatDistance(calculateDistance(
                           geolocation.latitude,
                           geolocation.longitude,
                           currentLocation.latitude,
                           currentLocation.longitude
                         ))}
                       </div>
                     )}
                   </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Track Phone Button */}
          <Button 
            onClick={handleTrackPhone} 
            className="w-full mt-3 gap-2"
            disabled={!selectedPhoneNumber}
          >
            <Target className="h-4 w-4" />
            Track Phone Location
          </Button>
          {geolocation.locationName && !geolocation.isLoading && geolocation.accuracy && (
            <div className="text-sm text-center mt-1 space-y-1">
              <p className="text-muted-foreground">📍 {geolocation.locationName}</p>
              <p className="text-green-600 font-medium">
                <Crosshair className="h-3 w-3 inline mr-1" />
                Accuracy: ±{geolocation.accuracy.toFixed(1)}m
              </p>
            </div>
          )}
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-9 space-y-6">
          {/* Map */}
          <div>
            {isLoadingLocations ? (
              <Skeleton className="w-full h-[500px] rounded-lg" />
            ) : (
              <LocationMap 
                locations={locations || []} 
                height="500px" 
                currentLocation={geolocation.latitude && geolocation.longitude ? {
                  latitude: geolocation.latitude,
                  longitude: geolocation.longitude,
                  accuracy: geolocation.accuracy || 10,
                  locationName: geolocation.locationName
                } : undefined}
                callCount={selectedNumberStats?.callCount || 0}
                textCount={selectedNumberStats?.textCount || 0}
                selectedPhoneNumber={selectedPhoneNumber}
              />
            )}
          </div>
          
          {/* Location History */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Location History</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingLocations ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : locations && locations.length > 0 ? (
                  <div className="space-y-4">
                    {locations.map((location) => {
                      // Calculate distance if we have user's current location
                      const distance = geolocation.latitude && geolocation.longitude ? 
                        calculateDistance(
                          geolocation.latitude,
                          geolocation.longitude,
                          location.latitude,
                          location.longitude
                        ) : null;
                      
                      return (
                        <div key={location.id} className="border rounded-lg p-4 flex justify-between items-center">
                          <div>
                            <p className="font-medium">{location.contactName || 'Unknown'}</p>
                            <p className="text-sm text-muted-foreground">{location.address || 'Unknown location'}</p>
                            {countryInfo && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                <span>{countryInfo.flag}</span>
                                <span>{countryInfo.country}</span>
                              </div>
                            )}
                            {distance !== null && (
                              <div className="flex items-center gap-1 text-xs text-green-600 font-medium mt-1">
                                <Ruler className="h-3 w-3" />
                                Distance: {formatDistance(distance)}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm">
                              {format(new Date(location.timestamp), 'MMM d, h:mm a')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Lat: {location.latitude.toFixed(6)}, Long: {location.longitude.toFixed(6)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Accuracy: {location.accuracy.toFixed(1)}m
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No location history available</p>
                    {selectedPhoneNumber && (
                      <Button 
                        onClick={handleTrackPhone} 
                        className="mt-3 gap-2"
                      >
                        <Target className="h-4 w-4" />
                        Track Phone Location
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default LocationTracking;

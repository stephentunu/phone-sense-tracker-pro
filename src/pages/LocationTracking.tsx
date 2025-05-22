
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { api, LocationData, TrackedNumber } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { LocationMap } from '@/components/dashboard/LocationMap';
import { TrackedNumberCard } from '@/components/dashboard/TrackedNumberCard';
import { AddPhoneDialog } from '@/components/dashboard/AddPhoneDialog';
import { MapPin, Clock } from 'lucide-react';
import { detectCountry } from '@/utils/phoneUtils';
import { format } from 'date-fns';

const LocationTracking = () => {
  const { toast } = useToast();
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<string | null>(null);
  
  // Fetch tracked numbers
  const { 
    data: trackedNumbers, 
    isLoading: isLoadingTrackedNumbers,
    refetch: refetchTrackedNumbers,
  } = useQuery({
    queryKey: ['trackedNumbers'],
    queryFn: api.getTrackedNumbers,
  });
  
  // Fetch locations
  const { 
    data: locations,
    isLoading: isLoadingLocations,
  } = useQuery({
    queryKey: ['locations', selectedPhoneNumber],
    queryFn: () => selectedPhoneNumber 
      ? api.getLocationsByNumber(selectedPhoneNumber)
      : api.getLocations(),
  });
  
  // Set the first tracked number as selected by default
  useEffect(() => {
    if (trackedNumbers?.length && !selectedPhoneNumber) {
      setSelectedPhoneNumber(trackedNumbers[0].phoneNumber);
    }
  }, [trackedNumbers, selectedPhoneNumber]);
  
  const handleTrackedNumberClick = (phoneNumber: string) => {
    setSelectedPhoneNumber(phoneNumber);
    toast({
      title: "Phone Selected",
      description: `Showing location data for ${phoneNumber}`,
    });
  };
  
  const handleAddPhoneSuccess = () => {
    refetchTrackedNumbers();
    toast({
      title: "Success",
      description: "Phone number added and ready for tracking",
    });
  };
  
  // Get current location (most recent)
  const currentLocation = locations && locations.length > 0 ? locations[0] : null;
  
  // Get country information
  const countryInfo = selectedPhoneNumber ? detectCountry(selectedPhoneNumber) : null;
  
  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Location Tracking</h1>
        <AddPhoneDialog onSuccess={handleAddPhoneSuccess} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Tracked Numbers */}
        <div className="md:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Tracked Numbers</h2>
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
              {trackedNumbers?.length ? (
                trackedNumbers.map((number) => (
                  <TrackedNumberCard 
                    key={number.phoneNumber} 
                    trackedNumber={number}
                    onClick={handleTrackedNumberClick}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-6">
                    <p className="text-muted-foreground mb-2">No phones tracked yet</p>
                    <Button size="sm">Add Phone Number</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          
          {/* Current Location Card */}
          {selectedPhoneNumber && currentLocation && (
            <Card className="mt-6 bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Current Location
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
                  
                  <div className="text-sm">
                    <p className="font-medium">{currentLocation.address || 'Unknown address'}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" /> 
                      {format(new Date(currentLocation.timestamp), 'MMM d, h:mm a')}
                    </p>
                    <div className="text-xs text-muted-foreground mt-1">
                      Lat: {currentLocation.latitude.toFixed(6)}, 
                      Long: {currentLocation.longitude.toFixed(6)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Accuracy: {currentLocation.accuracy.toFixed(1)}m
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-9 space-y-6">
          {/* Map */}
          <div>
            {isLoadingLocations ? (
              <Skeleton className="w-full h-[500px] rounded-lg" />
            ) : (
              <LocationMap locations={locations || []} height="500px" />
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
                ) : (
                  <div className="space-y-4">
                    {(locations || []).map((location) => (
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
                        </div>
                        <div className="text-right">
                          <p className="text-sm">
                            {format(new Date(location.timestamp), 'MMM d, h:mm a')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Accuracy: {location.accuracy.toFixed(1)}m
                          </p>
                        </div>
                      </div>
                    ))}
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

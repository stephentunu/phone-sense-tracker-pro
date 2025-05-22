
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

const LocationTracking = () => {
  const { toast } = useToast();
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<string | null>(null);
  
  // Fetch tracked numbers
  const { 
    data: trackedNumbers, 
    isLoading: isLoadingTrackedNumbers,
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
  
  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Location Tracking</h1>
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
                        </div>
                        <div className="text-right">
                          <p className="text-sm">
                            {new Date(location.timestamp).toLocaleString()}
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

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { supabaseApi, ActivityLog, CallRecord, LocationData, TrackedNumber } from '@/lib/supabaseApi';
import { Skeleton } from '@/components/ui/skeleton';
import { TrackedNumberCard } from '@/components/dashboard/TrackedNumberCard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline';
import { CallHistoryList } from '@/components/dashboard/CallHistoryList';
import { LocationMap } from '@/components/dashboard/LocationMap';
import { AddPhoneDialog } from '@/components/dashboard/AddPhoneDialog';
import { PhoneCall, MessageSquare, Map, Clock, Ruler, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { detectCountry } from '@/utils/phoneUtils';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const geolocation = useGeolocation();
  
  // Fetch tracked numbers
  const { 
    data: trackedNumbers, 
    isLoading: isLoadingTrackedNumbers,
    refetch: refetchTrackedNumbers
  } = useQuery({
    queryKey: ['trackedNumbers'],
    queryFn: supabaseApi.getTrackedNumbers,
  });
  
  // Filter tracked numbers based on search query
  const filteredTrackedNumbers = trackedNumbers?.filter(number => 
    number.phoneNumber.includes(searchQuery) || 
    number.label.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Fetch activities
  const { 
    data: activities,
    isLoading: isLoadingActivities,
    refetch: refetchActivities
  } = useQuery({
    queryKey: ['activities', selectedPhoneNumber],
    queryFn: () => selectedPhoneNumber 
      ? supabaseApi.getActivitiesByNumber(selectedPhoneNumber)
      : supabaseApi.getActivities(),
    enabled: !!selectedPhoneNumber || (trackedNumbers?.length === 0)
  });
  
  // Fetch calls
  const { 
    data: calls,
    isLoading: isLoadingCalls,
    refetch: refetchCalls
  } = useQuery({
    queryKey: ['calls', selectedPhoneNumber],
    queryFn: () => selectedPhoneNumber 
      ? supabaseApi.getCallsByNumber(selectedPhoneNumber)
      : supabaseApi.getCalls(),
    enabled: !!selectedPhoneNumber || (trackedNumbers?.length === 0)
  });
  
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
    enabled: !!selectedPhoneNumber || (trackedNumbers?.length === 0)
  });
  
  // Set the first tracked number as selected by default
  useEffect(() => {
    if (filteredTrackedNumbers?.length && !selectedPhoneNumber) {
      setSelectedPhoneNumber(filteredTrackedNumbers[0].phoneNumber);
    } else if (filteredTrackedNumbers?.length === 0) {
      setSelectedPhoneNumber(null);
    }
  }, [filteredTrackedNumbers, selectedPhoneNumber]);
  
  // Refetch all data when selected phone number changes
  useEffect(() => {
    if (selectedPhoneNumber) {
      console.log(`Selected phone number changed to: ${selectedPhoneNumber}`);
      refetchActivities();
      refetchCalls();
      refetchLocations();
    }
  }, [selectedPhoneNumber, refetchActivities, refetchCalls, refetchLocations]);
  
  const handleTrackedNumberClick = (phoneNumber: string) => {
    console.log(`Clicked on phone number: ${phoneNumber}`);
    setSelectedPhoneNumber(phoneNumber);
    toast({
      title: "Phone Selected",
      description: `Showing data for ${phoneNumber}`,
    });
  };
  
  const handleAddPhoneSuccess = async (phoneNumber: string) => {
    console.log(`Successfully added phone number: ${phoneNumber}`);
    
    await refetchTrackedNumbers();
    setSelectedPhoneNumber(phoneNumber);
    
    setTimeout(() => {
      refetchActivities();
      refetchCalls();
      refetchLocations();
    }, 200);
    
    toast({
      title: "Success",
      description: `Phone number ${phoneNumber} added and ready for tracking`,
    });
  };
  
  const handleAddCurrentLocation = async (coords: {latitude: number, longitude: number, accuracy: number}) => {
    if (!selectedPhoneNumber) {
      toast({
        title: "Error",
        description: "Please select a phone number first",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await supabaseApi.addLocation(
        selectedPhoneNumber,
        coords.latitude,
        coords.longitude,
        coords.accuracy,
        geolocation.locationName || "Current Location"
      );
      
      refetchLocations();
      
      const country = detectCountry(selectedPhoneNumber);
      const countryName = country ? `${country.country} (${country.flag})` : "Unknown";
      
      toast({
        title: "Location Added",
        description: `Current location added for ${selectedPhoneNumber} in ${countryName}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add current location",
        variant: "destructive"
      });
    }
  };
  
  const calculateStats = () => {
    if (!calls || !activities) return {
      totalCalls: 0,
      totalTexts: 0,
      totalLocations: 0,
      totalDuration: 0
    };
    
    const totalCalls = calls.length;
    const totalDuration = calls.reduce((acc, call) => acc + call.duration, 0);
    const totalTexts = activities.filter(a => a.activityType === 'text').length;
    const totalLocations = locations?.length || 0;
    
    return { totalCalls, totalTexts, totalLocations, totalDuration };
  };
  
  const stats = calculateStats();
  
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins} min`;
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Get stats for the selected phone number
  const selectedNumberStats = selectedPhoneNumber && trackedNumbers ? 
    trackedNumbers.find(num => num.phoneNumber === selectedPhoneNumber) : null;
  
  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Phone Tracking Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.email}</p>
        </div>
        <div className="flex gap-2">
          <AddPhoneDialog onSuccess={handleAddPhoneSuccess} />
          <Button variant="outline" onClick={signOut}>Sign Out</Button>
        </div>
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
          
          {/* Add Current Location Button */}
          {selectedPhoneNumber && geolocation.latitude && geolocation.longitude && (
            <Button 
              onClick={() => handleAddCurrentLocation({
                latitude: geolocation.latitude!,
                longitude: geolocation.longitude!,
                accuracy: geolocation.accuracy || 10
              })} 
              className="w-full gap-2"
            >
              <Map className="h-4 w-4" />
              Add Current Location
            </Button>
          )}
          
          {geolocation.locationName && !geolocation.isLoading && (
            <p className="text-sm text-center mt-1 text-muted-foreground">
              Current location: {geolocation.locationName}
            </p>
          )}
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-9 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Calls"
              value={stats.totalCalls}
              icon={<PhoneCall className="h-4 w-4" />}
              trend={{ value: 12, positive: true }}
            />
            <StatsCard
              title="Messages"
              value={stats.totalTexts}
              icon={<MessageSquare className="h-4 w-4" />}
              trend={{ value: 8, positive: true }}
            />
            <StatsCard
              title="Locations"
              value={stats.totalLocations}
              icon={<Map className="h-4 w-4" />}
              trend={{ value: 5, positive: true }}
            />
            <StatsCard
              title="Call Duration"
              value={formatDuration(stats.totalDuration)}
              icon={<Clock className="h-4 w-4" />}
            />
          </div>
          
          {/* Map */}
          <div>
            {isLoadingLocations ? (
              <Skeleton className="w-full h-[300px] rounded-lg" />
            ) : (
              <LocationMap 
                locations={locations || []} 
                height="300px"
                onAddCurrentLocation={handleAddCurrentLocation}
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
          
          {/* Call History and Activity Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Call History */}
            <div>
              {isLoadingCalls ? (
                <div className="space-y-3">
                  <Skeleton className="h-7 w-1/3" />
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <CallHistoryList calls={calls || []} />
              )}
            </div>
            
            {/* Activity Timeline */}
            <div>
              {isLoadingActivities ? (
                <div className="space-y-3">
                  <Skeleton className="h-7 w-1/3" />
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex gap-2">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <div className="space-y-1 flex-1">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ActivityTimeline activities={activities || []} />
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;

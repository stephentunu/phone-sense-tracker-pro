
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { api, ActivityLog, TrackedNumber } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { TrackedNumberCard } from '@/components/dashboard/TrackedNumberCard';
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PhoneCall, MessageSquare, Map, Smartphone, Globe } from 'lucide-react';

const ActivityLogPage = () => {
  const { toast } = useToast();
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<string | null>(null);
  const [activityFilter, setActivityFilter] = useState<string>('all');
  
  // Fetch tracked numbers
  const { 
    data: trackedNumbers, 
    isLoading: isLoadingTrackedNumbers,
  } = useQuery({
    queryKey: ['trackedNumbers'],
    queryFn: api.getTrackedNumbers,
  });
  
  // Fetch activities
  const { 
    data: activities,
    isLoading: isLoadingActivities,
  } = useQuery({
    queryKey: ['activities', selectedPhoneNumber],
    queryFn: () => selectedPhoneNumber 
      ? api.getActivitiesByNumber(selectedPhoneNumber)
      : api.getActivities(),
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
      description: `Showing activity for ${phoneNumber}`,
    });
  };
  
  const filteredActivities = activities?.filter(activity => {
    if (activityFilter === 'all') return true;
    return activity.activityType === activityFilter;
  });
  
  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Activity Log</h1>
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
          {/* Filters */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Activity Timeline</h2>
            <Select value={activityFilter} onValueChange={setActivityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter activities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="call">Calls</SelectItem>
                <SelectItem value="text">Messages</SelectItem>
                <SelectItem value="location">Locations</SelectItem>
                <SelectItem value="app">Apps</SelectItem>
                <SelectItem value="web">Web</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Activity Types Legend */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="bg-blue-100 text-blue-600 p-1.5 rounded-full">
                <PhoneCall className="h-4 w-4" />
              </div>
              <span>Calls</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="bg-green-100 text-green-600 p-1.5 rounded-full">
                <MessageSquare className="h-4 w-4" />
              </div>
              <span>Messages</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="bg-red-100 text-red-600 p-1.5 rounded-full">
                <Map className="h-4 w-4" />
              </div>
              <span>Locations</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="bg-purple-100 text-purple-600 p-1.5 rounded-full">
                <Smartphone className="h-4 w-4" />
              </div>
              <span>Apps</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="bg-yellow-100 text-yellow-600 p-1.5 rounded-full">
                <Globe className="h-4 w-4" />
              </div>
              <span>Web</span>
            </div>
          </div>
          
          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[600px] overflow-y-auto pr-6">
              {isLoadingActivities ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
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
                <ActivityTimeline activities={filteredActivities || []} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default ActivityLogPage;

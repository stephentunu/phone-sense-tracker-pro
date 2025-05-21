
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { api, CallRecord } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PhoneIncoming, PhoneOutgoing, PhoneMissed, Search } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CallHistory = () => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  // Fetch call records
  const { 
    data: calls,
    isLoading,
  } = useQuery({
    queryKey: ['calls'],
    queryFn: api.getCalls,
  });
  
  // Filter calls based on search query and filter type
  const filteredCalls = calls?.filter((call) => {
    const matchesSearch = searchQuery
      ? (call.contactName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
         call.phoneNumber.includes(searchQuery))
      : true;
      
    const matchesType = filterType === 'all' ? true : call.type === filterType;
    
    return matchesSearch && matchesType;
  });
  
  const formatDuration = (seconds: number): string => {
    if (seconds === 0) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getCallIcon = (type: CallRecord['type']) => {
    switch (type) {
      case 'incoming': return <PhoneIncoming className="h-4 w-4 text-green-500" />;
      case 'outgoing': return <PhoneOutgoing className="h-4 w-4 text-blue-500" />;
      case 'missed': return <PhoneMissed className="h-4 w-4 text-red-500" />;
    }
  };
  
  const handleExportCsv = () => {
    toast({
      title: "Export Started",
      description: "Your call history is being exported to CSV",
    });
    // In a real application, this would generate and download a CSV file
  };
  
  return (
    <AppLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Call History</h1>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search calls..."
              className="w-full pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Calls</SelectItem>
              <SelectItem value="incoming">Incoming</SelectItem>
              <SelectItem value="outgoing">Outgoing</SelectItem>
              <SelectItem value="missed">Missed</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleExportCsv}>Export CSV</Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Date & Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCalls?.length ? (
                  filteredCalls.map((call) => (
                    <TableRow key={call.id}>
                      <TableCell>{getCallIcon(call.type)}</TableCell>
                      <TableCell className="font-medium">{call.contactName || 'Unknown'}</TableCell>
                      <TableCell>{call.phoneNumber}</TableCell>
                      <TableCell>{formatDuration(call.duration)}</TableCell>
                      <TableCell>{format(new Date(call.timestamp), 'MMM d, yyyy h:mm a')}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No call records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </AppLayout>
  );
};

export default CallHistory;

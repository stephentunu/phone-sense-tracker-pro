import { supabase } from './supabase';
import { format } from 'date-fns';

// Types matching our API interface
export interface TrackedNumber {
  phoneNumber: string;
  label: string;
  isActive: boolean;
  lastSeen?: string;
  callCount: number;
  textCount: number;
}

export interface PhoneContact {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  notes?: string;
  isSaved: boolean;
}

export interface CallRecord {
  id: string;
  phoneNumber: string;
  contactName?: string;
  duration: number;
  timestamp: string;
  type: 'incoming' | 'outgoing' | 'missed';
}

export interface LocationData {
  id: string;
  phoneNumber: string;
  contactName?: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
  address?: string;
}

export interface ActivityLog {
  id: string;
  phoneNumber: string;
  contactName?: string;
  activityType: 'call' | 'text' | 'location' | 'app' | 'web';
  details: string;
  timestamp: string;
}

const getCurrentUser = async () => {
  // Check if we're in demo mode
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
    return { id: 'demo-user', email: 'demo@example.com' };
  }
  
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('User not authenticated');
  return user;
};

// Demo data for development
const demoTrackedNumbers: TrackedNumber[] = [
  {
    phoneNumber: '+1234567890',
    label: 'John\'s iPhone',
    isActive: true,
    lastSeen: format(new Date(Date.now() - 1000 * 60 * 30), "yyyy-MM-dd'T'HH:mm:ss"),
    callCount: 15,
    textCount: 8,
  },
  {
    phoneNumber: '+0987654321',
    label: 'Sarah\'s Android',
    isActive: true,
    lastSeen: format(new Date(Date.now() - 1000 * 60 * 60 * 2), "yyyy-MM-dd'T'HH:mm:ss"),
    callCount: 7,
    textCount: 12,
  },
];

const demoContacts: PhoneContact[] = [
  {
    id: '1',
    name: 'John Doe',
    phoneNumber: '+1234567890',
    email: 'john@example.com',
    isSaved: true,
  },
  {
    id: '2',
    name: 'Sarah Smith',
    phoneNumber: '+0987654321',
    email: 'sarah@example.com',
    isSaved: true,
  },
];

const demoCalls: CallRecord[] = [
  {
    id: '1',
    phoneNumber: '+1234567890',
    contactName: 'John Doe',
    duration: 180,
    timestamp: format(new Date(Date.now() - 1000 * 60 * 60), "yyyy-MM-dd'T'HH:mm:ss"),
    type: 'incoming',
  },
  {
    id: '2',
    phoneNumber: '+0987654321',
    contactName: 'Sarah Smith',
    duration: 95,
    timestamp: format(new Date(Date.now() - 1000 * 60 * 60 * 3), "yyyy-MM-dd'T'HH:mm:ss"),
    type: 'outgoing',
  },
];

const demoLocations: LocationData[] = [
  {
    id: '1',
    phoneNumber: '+1234567890',
    contactName: 'John Doe',
    latitude: 40.7128,
    longitude: -74.0060,
    accuracy: 10,
    timestamp: format(new Date(Date.now() - 1000 * 60 * 30), "yyyy-MM-dd'T'HH:mm:ss"),
    address: 'New York, NY',
  },
  {
    id: '2',
    phoneNumber: '+0987654321',
    contactName: 'Sarah Smith',
    latitude: 34.0522,
    longitude: -118.2437,
    accuracy: 15,
    timestamp: format(new Date(Date.now() - 1000 * 60 * 60 * 2), "yyyy-MM-dd'T'HH:mm:ss"),
    address: 'Los Angeles, CA',
  },
];

const demoActivities: ActivityLog[] = [
  {
    id: '1',
    phoneNumber: '+1234567890',
    contactName: 'John Doe',
    activityType: 'call',
    details: 'Incoming call - 3 minutes',
    timestamp: format(new Date(Date.now() - 1000 * 60 * 60), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: '2',
    phoneNumber: '+0987654321',
    contactName: 'Sarah Smith',
    activityType: 'text',
    details: 'New text message received',
    timestamp: format(new Date(Date.now() - 1000 * 60 * 60 * 2), "yyyy-MM-dd'T'HH:mm:ss"),
  },
];

const isDemo = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  return !supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co';
};

export const supabaseApi = {
  // Tracked numbers
  getTrackedNumbers: async (): Promise<TrackedNumber[]> => {
    if (isDemo()) {
      return Promise.resolve(demoTrackedNumbers);
    }
    
    const user = await getCurrentUser();
    
    const { data, error } = await supabase
      .from('tracked_numbers')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(item => ({
      phoneNumber: item.phone_number,
      label: item.label,
      isActive: item.is_active,
      lastSeen: item.last_seen,
      callCount: item.call_count,
      textCount: item.text_count,
    }));
  },
  
  addTrackedNumber: async (phoneNumber: string, label: string): Promise<TrackedNumber> => {
    if (isDemo()) {
      const newNumber: TrackedNumber = {
        phoneNumber,
        label,
        isActive: true,
        lastSeen: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
        callCount: 0,
        textCount: 0,
      };
      demoTrackedNumbers.unshift(newNumber);
      return Promise.resolve(newNumber);
    }
    
    const user = await getCurrentUser();
    
    const { data, error } = await supabase
      .from('tracked_numbers')
      .insert({
        user_id: user.id,
        phone_number: phoneNumber,
        label,
        is_active: true,
        last_seen: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
        call_count: 0,
        text_count: 0,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      phoneNumber: data.phone_number,
      label: data.label,
      isActive: data.is_active,
      lastSeen: data.last_seen,
      callCount: data.call_count,
      textCount: data.text_count,
    };
  },
  
  // Contacts
  getContacts: async (): Promise<PhoneContact[]> => {
    if (isDemo()) {
      return Promise.resolve(demoContacts);
    }
    
    const user = await getCurrentUser();
    
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      phoneNumber: item.phone_number,
      email: item.email,
      address: item.address,
      notes: item.notes,
      isSaved: item.is_saved,
    }));
  },
  
  addContact: async (contact: Omit<PhoneContact, 'id'>): Promise<PhoneContact> => {
    if (isDemo()) {
      const newContact: PhoneContact = {
        ...contact,
        id: Date.now().toString(),
      };
      demoContacts.push(newContact);
      return Promise.resolve(newContact);
    }
    
    const user = await getCurrentUser();
    
    const { data, error } = await supabase
      .from('contacts')
      .insert({
        user_id: user.id,
        phone_number: contact.phoneNumber,
        name: contact.name,
        email: contact.email,
        address: contact.address,
        notes: contact.notes,
        is_saved: contact.isSaved,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      phoneNumber: data.phone_number,
      email: data.email,
      address: data.address,
      notes: data.notes,
      isSaved: data.is_saved,
    };
  },
  
  // Call records
  getCalls: async (): Promise<CallRecord[]> => {
    if (isDemo()) {
      return Promise.resolve(demoCalls);
    }
    
    const user = await getCurrentUser();
    
    const { data, error } = await supabase
      .from('call_records')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      phoneNumber: item.phone_number,
      contactName: item.contact_name,
      duration: item.duration,
      timestamp: item.timestamp,
      type: item.type,
    }));
  },
  
  getCallsByNumber: async (phoneNumber: string): Promise<CallRecord[]> => {
    if (isDemo()) {
      return Promise.resolve(demoCalls.filter(call => call.phoneNumber === phoneNumber));
    }
    
    const user = await getCurrentUser();
    
    const { data, error } = await supabase
      .from('call_records')
      .select('*')
      .eq('user_id', user.id)
      .eq('phone_number', phoneNumber)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      phoneNumber: item.phone_number,
      contactName: item.contact_name,
      duration: item.duration,
      timestamp: item.timestamp,
      type: item.type,
    }));
  },
  
  // Location data with enhanced accuracy
  getLocations: async (): Promise<LocationData[]> => {
    if (isDemo()) {
      return Promise.resolve(demoLocations);
    }
    
    const user = await getCurrentUser();
    
    const { data, error } = await supabase
      .from('location_data')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      phoneNumber: item.phone_number,
      contactName: item.contact_name,
      latitude: parseFloat(item.latitude.toString()),
      longitude: parseFloat(item.longitude.toString()),
      accuracy: parseFloat(item.accuracy.toString()),
      timestamp: item.timestamp,
      address: item.address,
    }));
  },
  
  getLocationsByNumber: async (phoneNumber: string): Promise<LocationData[]> => {
    if (isDemo()) {
      return Promise.resolve(demoLocations.filter(loc => loc.phoneNumber === phoneNumber));
    }
    
    const user = await getCurrentUser();
    
    const { data, error } = await supabase
      .from('location_data')
      .select('*')
      .eq('user_id', user.id)
      .eq('phone_number', phoneNumber)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      phoneNumber: item.phone_number,
      contactName: item.contact_name,
      latitude: parseFloat(item.latitude.toString()),
      longitude: parseFloat(item.longitude.toString()),
      accuracy: parseFloat(item.accuracy.toString()),
      timestamp: item.timestamp,
      address: item.address,
    }));
  },
  
  addLocation: async (
    phoneNumber: string, 
    latitude: number, 
    longitude: number, 
    accuracy: number, 
    locationName?: string,
    additionalData?: {
      heading?: number | null;
      speed?: number | null;
      altitude?: number | null;
      altitudeAccuracy?: number | null;
    }
  ): Promise<LocationData> => {
    if (isDemo()) {
      const newLocation: LocationData = {
        id: Date.now().toString(),
        phoneNumber,
        latitude,
        longitude,
        accuracy,
        timestamp: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
        address: locationName || "Current Location",
      };
      demoLocations.unshift(newLocation);
      
      // Log high-accuracy demo data
      console.log('Added high-accuracy demo location:', {
        phoneNumber,
        latitude: latitude.toFixed(8),
        longitude: longitude.toFixed(8),
        accuracy: `±${accuracy.toFixed(1)}m`,
        locationName,
        ...additionalData
      });
      
      return Promise.resolve(newLocation);
    }
    
    const user = await getCurrentUser();
    
    // Create enhanced location record with high precision
    const locationRecord = {
      user_id: user.id,
      phone_number: phoneNumber,
      latitude: parseFloat(latitude.toFixed(8)), // 8 decimal places for ~1cm accuracy
      longitude: parseFloat(longitude.toFixed(8)),
      accuracy: parseFloat(accuracy.toFixed(2)),
      timestamp: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      address: locationName || "Current Location",
    };
    
    console.log('Storing high-accuracy location:', {
      ...locationRecord,
      additionalData
    });
    
    const { data, error } = await supabase
      .from('location_data')
      .insert(locationRecord)
      .select()
      .single();
    
    if (error) throw error;
    
    // Update last_seen for tracked number with high accuracy timestamp
    await supabase
      .from('tracked_numbers')
      .update({ 
        last_seen: data.timestamp,
        updated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")
      })
      .eq('user_id', user.id)
      .eq('phone_number', phoneNumber);
    
    // Log successful high-accuracy location storage
    console.log('Successfully stored accurate location for', phoneNumber, {
      accuracy: `±${data.accuracy}m`,
      coordinates: `${data.latitude}, ${data.longitude}`
    });
    
    return {
      id: data.id,
      phoneNumber: data.phone_number,
      contactName: data.contact_name,
      latitude: parseFloat(data.latitude.toString()),
      longitude: parseFloat(data.longitude.toString()),
      accuracy: parseFloat(data.accuracy.toString()),
      timestamp: data.timestamp,
      address: data.address,
    };
  },
  
  // Activity logs
  getActivities: async (): Promise<ActivityLog[]> => {
    if (isDemo()) {
      return Promise.resolve(demoActivities);
    }
    
    const user = await getCurrentUser();
    
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      phoneNumber: item.phone_number,
      contactName: item.contact_name,
      activityType: item.activity_type,
      details: item.details,
      timestamp: item.timestamp,
    }));
  },
  
  getActivitiesByNumber: async (phoneNumber: string): Promise<ActivityLog[]> => {
    if (isDemo()) {
      return Promise.resolve(demoActivities.filter(activity => activity.phoneNumber === phoneNumber));
    }
    
    const user = await getCurrentUser();
    
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('phone_number', phoneNumber)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      phoneNumber: item.phone_number,
      contactName: item.contact_name,
      activityType: item.activity_type,
      details: item.details,
      timestamp: item.timestamp,
    }));
  },
  
  // Real-time subscriptions
  subscribeToLocationUpdates: (phoneNumber: string, callback: (payload: any) => void) => {
    if (isDemo()) {
      // Return a mock subscription for demo mode
      return { unsubscribe: () => {} };
    }
    
    return supabase
      .channel('location-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'location_data',
          filter: `phone_number=eq.${phoneNumber}`,
        },
        callback
      )
      .subscribe();
  },
  
  subscribeToCallUpdates: (phoneNumber: string, callback: (payload: any) => void) => {
    if (isDemo()) {
      // Return a mock subscription for demo mode
      return { unsubscribe: () => {} };
    }
    
    return supabase
      .channel('call-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'call_records',
          filter: `phone_number=eq.${phoneNumber}`,
        },
        callback
      )
      .subscribe();
  },
};

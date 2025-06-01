
import { supabase } from '@/integrations/supabase/client';
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
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('User not authenticated');
  return user;
};

export const supabaseApi = {
  // Tracked numbers
  getTrackedNumbers: async (): Promise<TrackedNumber[]> => {
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
      type: item.type as 'incoming' | 'outgoing' | 'missed',
    }));
  },
  
  getCallsByNumber: async (phoneNumber: string): Promise<CallRecord[]> => {
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
      type: item.type as 'incoming' | 'outgoing' | 'missed',
    }));
  },
  
  // Location data with enhanced accuracy
  getLocations: async (): Promise<LocationData[]> => {
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
      activityType: item.activity_type as 'call' | 'text' | 'location' | 'app' | 'web',
      details: item.details,
      timestamp: item.timestamp,
    }));
  },
  
  getActivitiesByNumber: async (phoneNumber: string): Promise<ActivityLog[]> => {
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
      activityType: item.activity_type as 'call' | 'text' | 'location' | 'app' | 'web',
      details: item.details,
      timestamp: item.timestamp,
    }));
  },
  
  // Real-time subscriptions
  subscribeToLocationUpdates: (phoneNumber: string, callback: (payload: any) => void) => {
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

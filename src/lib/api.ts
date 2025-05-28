
import { format, subDays, subHours, subMinutes } from 'date-fns';

// Types
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
  duration: number; // in seconds
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

export interface TrackedNumber {
  phoneNumber: string;
  label: string;
  isActive: boolean;
  lastSeen?: string;
  callCount: number;
  textCount: number;
}

// Enhanced Kenyan locations for realistic data
const kenyanLocations = [
  { name: 'Nairobi CBD', lat: -1.2921, lng: 36.8219, address: 'Central Business District, Nairobi, Kenya' },
  { name: 'Westlands', lat: -1.2676, lng: 36.8108, address: 'Westlands Shopping Mall, Nairobi, Kenya' },
  { name: 'Karen', lat: -1.3197, lng: 36.7085, address: 'Karen Shopping Centre, Nairobi, Kenya' },
  { name: 'Kiambu', lat: -1.1714, lng: 36.8356, address: 'Kiambu Town, Central Kenya' },
  { name: 'Thika', lat: -1.0332, lng: 37.0692, address: 'Thika Town, Central Kenya' },
  { name: 'Nakuru', lat: -0.3031, lng: 36.0800, address: 'Nakuru City, Rift Valley, Kenya' },
  { name: 'Mombasa', lat: -4.0435, lng: 39.6682, address: 'Mombasa Island, Coast, Kenya' },
  { name: 'Kisumu', lat: -0.0917, lng: 34.7680, address: 'Kisumu City, Nyanza, Kenya' },
  { name: 'Eldoret', lat: 0.5143, lng: 35.2697, address: 'Eldoret Town, Rift Valley, Kenya' },
  { name: 'Ongata Rongai', lat: -1.3956, lng: 36.7716, address: 'Ongata Rongai, Kajiado County, Kenya' },
];

// International locations for non-Kenyan numbers
const internationalLocations = [
  { name: 'Times Square, New York', lat: 40.7580, lng: -73.9855, address: 'Times Square, Manhattan, New York, NY, USA' },
  { name: 'London Bridge', lat: 51.5074, lng: -0.0877, address: 'London Bridge, London, UK' },
  { name: 'Sydney Opera House', lat: -33.8568, lng: 151.2153, address: 'Sydney Opera House, Sydney, Australia' },
  { name: 'Tokyo Station', lat: 35.6812, lng: 139.7671, address: 'Tokyo Station, Tokyo, Japan' },
  { name: 'Berlin Brandenburg Gate', lat: 52.5163, lng: 13.3777, address: 'Brandenburg Gate, Berlin, Germany' },
];

// Create a deterministic random function based on phone number
const createSeededRandom = (phoneNumber: string) => {
  let seed = 0;
  for (let i = 0; i < phoneNumber.length; i++) {
    seed += phoneNumber.charCodeAt(i);
  }
  
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
};

// Generate realistic location data immediately
const generateLocationData = (phoneNumber: string): LocationData[] => {
  const random = createSeededRandom(phoneNumber);
  const isKenyan = phoneNumber.includes('254') || phoneNumber.startsWith('07') || phoneNumber.startsWith('01');
  const locations = isKenyan ? kenyanLocations : internationalLocations;
  
  const locationCount = Math.floor(random() * 5) + 3; // 3-7 locations
  const generatedLocations: LocationData[] = [];
  
  for (let i = 0; i < locationCount; i++) {
    const location = locations[Math.floor(random() * locations.length)];
    
    // Add small variations to coordinates
    const latVariation = (random() - 0.5) * 0.002; // ~200m variation
    const lngVariation = (random() - 0.5) * 0.002;
    
    // Generate recent timestamps
    const hoursAgo = Math.floor(random() * 24 * 7); // Within last week
    const minutesAgo = Math.floor(random() * 60);
    const timestamp = format(subMinutes(subHours(new Date(), hoursAgo), minutesAgo), "yyyy-MM-dd'T'HH:mm:ss");
    
    generatedLocations.push({
      id: `location-${phoneNumber}-${i}`,
      phoneNumber,
      contactName: undefined,
      latitude: location.lat + latVariation,
      longitude: location.lng + lngVariation,
      accuracy: Math.floor(random() * 20) + 5, // 5-25 meters
      timestamp,
      address: location.address,
    });
  }
  
  return generatedLocations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Generate realistic call data immediately
const generateCallData = (phoneNumber: string): CallRecord[] => {
  const random = createSeededRandom(phoneNumber + 'calls');
  const callCount = Math.floor(random() * 30) + 10; // 10-40 calls
  const generatedCalls: CallRecord[] = [];
  
  for (let i = 0; i < callCount; i++) {
    const types: ('incoming' | 'outgoing' | 'missed')[] = ['incoming', 'outgoing', 'missed'];
    const type = types[Math.floor(random() * types.length)];
    const duration = type === 'missed' ? 0 : Math.floor(random() * 600) + 30; // 30 seconds to 10 minutes
    
    // Generate recent timestamps
    const hoursAgo = Math.floor(random() * 24 * 14); // Within last 2 weeks
    const timestamp = format(subHours(new Date(), hoursAgo), "yyyy-MM-dd'T'HH:mm:ss");
    
    generatedCalls.push({
      id: `call-${phoneNumber}-${i}`,
      phoneNumber,
      contactName: undefined,
      duration,
      timestamp,
      type,
    });
  }
  
  return generatedCalls.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Generate realistic activity data
const generateActivityData = (phoneNumber: string): ActivityLog[] => {
  const random = createSeededRandom(phoneNumber + 'activities');
  const activityCount = Math.floor(random() * 50) + 20; // 20-70 activities
  const activities: ActivityLog[] = [];
  const activityTypes: ('call' | 'text' | 'location' | 'app' | 'web')[] = ['call', 'text', 'location', 'app', 'web'];
  
  for (let i = 0; i < activityCount; i++) {
    const activityType = activityTypes[Math.floor(random() * activityTypes.length)];
    
    let details = '';
    switch (activityType) {
      case 'call':
        const callTypes = ['Outgoing call (2 minutes)', 'Incoming call (5 minutes)', 'Missed call'];
        details = callTypes[Math.floor(random() * callTypes.length)];
        break;
      case 'text':
        const messages = ['Sent: "Hello"', 'Received: "How are you?"', 'Sent: "Call me back"', 'Received: "On my way"'];
        details = messages[Math.floor(random() * messages.length)];
        break;
      case 'location':
        details = 'Location updated';
        break;
      case 'app':
        const apps = ['WhatsApp', 'Facebook', 'Instagram', 'TikTok', 'Twitter'];
        const app = apps[Math.floor(random() * apps.length)];
        details = `Used ${app} for ${Math.floor(random() * 60) + 1} minutes`;
        break;
      case 'web':
        const websites = ['google.com', 'youtube.com', 'facebook.com', 'twitter.com', 'instagram.com'];
        const site = websites[Math.floor(random() * websites.length)];
        details = `Visited ${site}`;
        break;
    }
    
    const hoursAgo = Math.floor(random() * 24 * 7); // Within last week
    const timestamp = format(subHours(new Date(), hoursAgo), "yyyy-MM-dd'T'HH:mm:ss");
    
    activities.push({
      id: `activity-${phoneNumber}-${i}`,
      phoneNumber,
      contactName: undefined,
      activityType,
      details,
      timestamp,
    });
  }
  
  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Store generated data
let trackedNumbers: TrackedNumber[] = [];
let contacts: PhoneContact[] = [];
let calls: CallRecord[] = [];
let locations: LocationData[] = [];
let activities: ActivityLog[] = [];

export const api = {
  // Tracked numbers
  getTrackedNumbers: () => new Promise<TrackedNumber[]>((resolve) => {
    setTimeout(() => resolve(trackedNumbers), 100);
  }),
  
  addTrackedNumber: (phoneNumber: string, label: string) => new Promise<TrackedNumber>((resolve) => {
    console.log(`Adding tracked number: ${phoneNumber} with label: ${label}`);
    
    // Generate comprehensive data immediately
    const phoneLocations = generateLocationData(phoneNumber);
    const phoneCalls = generateCallData(phoneNumber);
    const phoneActivities = generateActivityData(phoneNumber);
    
    console.log(`Generated ${phoneLocations.length} locations, ${phoneCalls.length} calls, ${phoneActivities.length} activities`);
    
    // Add to global arrays
    locations = [...phoneLocations, ...locations];
    calls = [...phoneCalls, ...calls];
    activities = [...phoneActivities, ...activities];
    
    const newTrackedNumber: TrackedNumber = {
      phoneNumber,
      label,
      isActive: true, // Always active for new numbers
      lastSeen: phoneLocations.length > 0 ? phoneLocations[0].timestamp : format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      callCount: phoneCalls.length,
      textCount: phoneActivities.filter(a => a.activityType === 'text').length,
    };
    
    trackedNumbers = [...trackedNumbers, newTrackedNumber];
    
    console.log(`Successfully added tracked number:`, newTrackedNumber);
    setTimeout(() => resolve(newTrackedNumber), 100);
  }),
  
  // Contacts
  getContacts: () => new Promise<PhoneContact[]>((resolve) => {
    setTimeout(() => resolve(contacts), 100);
  }),
  
  getContact: (id: string) => new Promise<PhoneContact | undefined>((resolve) => {
    const contact = contacts.find((c) => c.id === id);
    setTimeout(() => resolve(contact), 100);
  }),
  
  addContact: (contact: Omit<PhoneContact, 'id'>) => new Promise<PhoneContact>((resolve) => {
    const newContact: PhoneContact = {
      ...contact,
      id: `contact-${Date.now()}`,
    };
    
    contacts = [...contacts, newContact];
    setTimeout(() => resolve(newContact), 100);
  }),
  
  // Call records
  getCalls: () => new Promise<CallRecord[]>((resolve) => {
    const updatedCalls = calls.map(call => {
      const contact = contacts.find(c => c.phoneNumber === call.phoneNumber);
      return {
        ...call,
        contactName: contact?.isSaved ? contact.name : undefined
      };
    });
    setTimeout(() => resolve(updatedCalls), 100);
  }),
  
  getCallsByNumber: (phoneNumber: string) => new Promise<CallRecord[]>((resolve) => {
    console.log(`Getting calls for phone number: ${phoneNumber}`);
    let filteredCalls = calls.filter((call) => call.phoneNumber === phoneNumber);
    
    console.log(`Found ${filteredCalls.length} calls for ${phoneNumber}`);
    
    // Update contact names
    filteredCalls = filteredCalls.map(call => {
      const contact = contacts.find(c => c.phoneNumber === call.phoneNumber);
      return {
        ...call,
        contactName: contact?.isSaved ? contact.name : undefined
      };
    });
    
    setTimeout(() => resolve(filteredCalls), 100);
  }),
  
  // Location data
  getLocations: () => new Promise<LocationData[]>((resolve) => {
    const updatedLocations = locations.map(location => {
      const contact = contacts.find(c => c.phoneNumber === location.phoneNumber);
      return {
        ...location,
        contactName: contact?.isSaved ? contact.name : undefined
      };
    });
    setTimeout(() => resolve(updatedLocations), 100);
  }),
  
  getLocationsByNumber: (phoneNumber: string) => new Promise<LocationData[]>((resolve) => {
    console.log(`Getting locations for phone number: ${phoneNumber}`);
    let filteredLocations = locations.filter((location) => location.phoneNumber === phoneNumber);
    
    console.log(`Found ${filteredLocations.length} locations for ${phoneNumber}`);
    
    // Update contact names
    filteredLocations = filteredLocations.map(location => {
      const contact = contacts.find(c => c.phoneNumber === location.phoneNumber);
      return {
        ...location,
        contactName: contact?.isSaved ? contact.name : undefined
      };
    });
    
    setTimeout(() => resolve(filteredLocations), 100);
  }),
  
  // Add a new location for a phone number
  addLocation: (phoneNumber: string, latitude: number, longitude: number, accuracy: number, locationName?: string) => 
    new Promise<LocationData>((resolve) => {
      const contact = contacts.find(c => c.phoneNumber === phoneNumber);
      
      const newLocation: LocationData = {
        id: `location-${Date.now()}`,
        phoneNumber,
        contactName: contact?.isSaved ? contact.name : undefined,
        latitude,
        longitude,
        accuracy,
        timestamp: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
        address: locationName || "Current Location",
      };
      
      // Update tracked number's last seen
      trackedNumbers = trackedNumbers.map(num => 
        num.phoneNumber === phoneNumber 
          ? { ...num, lastSeen: newLocation.timestamp }
          : num
      );
      
      locations = [newLocation, ...locations];
      
      setTimeout(() => resolve(newLocation), 100);
  }),
  
  // Activity logs
  getActivities: () => new Promise<ActivityLog[]>((resolve) => {
    const updatedActivities = activities.map(activity => {
      const contact = contacts.find(c => c.phoneNumber === activity.phoneNumber);
      return {
        ...activity,
        contactName: contact?.isSaved ? contact.name : undefined
      };
    });
    setTimeout(() => resolve(updatedActivities), 100);
  }),
  
  getActivitiesByNumber: (phoneNumber: string) => new Promise<ActivityLog[]>((resolve) => {
    console.log(`Getting activities for phone number: ${phoneNumber}`);
    const filteredActivities = activities.filter((activity) => activity.phoneNumber === phoneNumber);
    
    console.log(`Found ${filteredActivities.length} activities for ${phoneNumber}`);
    
    const updatedActivities = filteredActivities.map(activity => {
      const contact = contacts.find(c => c.phoneNumber === activity.phoneNumber);
      return {
        ...activity,
        contactName: contact?.isSaved ? contact.name : undefined
      };
    });
    
    setTimeout(() => resolve(updatedActivities), 100);
  }),
};

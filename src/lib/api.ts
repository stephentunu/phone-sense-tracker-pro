
import { format, subDays, subHours } from 'date-fns';

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

// Mock data
const generateMockContacts = (): PhoneContact[] => [
  { id: '1', name: 'John Doe', phoneNumber: '+1-202-555-0123', email: 'john.doe@example.com', address: '123 Main St, Springfield', isSaved: true },
  { id: '2', name: 'Jane Smith', phoneNumber: '+1-202-555-0187', email: 'jane.smith@example.com', address: '456 Oak St, Springfield', isSaved: true },
  { id: '3', name: 'Bob Johnson', phoneNumber: '+1-202-555-0456', isSaved: true },
  { id: '4', name: 'Alice Williams', phoneNumber: '+1-202-555-0789', email: 'alice.williams@example.com', isSaved: true },
  { id: '5', name: 'Unknown', phoneNumber: '+1-202-555-1111', isSaved: false },
  { id: '6', name: 'Sarah Parker', phoneNumber: '+1-202-555-2222', email: 'sarah.parker@example.com', isSaved: true },
  { id: '7', name: 'Mike Thompson', phoneNumber: '+1-202-555-3333', isSaved: true },
  { id: '8', name: 'Unknown', phoneNumber: '+1-202-555-4444', isSaved: false },
];

const generateMockCalls = (): CallRecord[] => {
  const calls: CallRecord[] = [];
  const contacts = generateMockContacts();
  
  for (let i = 0; i < 50; i++) {
    const contact = contacts[Math.floor(Math.random() * contacts.length)];
    const type = ['incoming', 'outgoing', 'missed'][Math.floor(Math.random() * 3)] as 'incoming' | 'outgoing' | 'missed';
    const duration = type === 'missed' ? 0 : Math.floor(Math.random() * 600);
    const daysAgo = Math.floor(Math.random() * 14);
    const hoursAgo = Math.floor(Math.random() * 24);
    const timestamp = format(subHours(subDays(new Date(), daysAgo), hoursAgo), "yyyy-MM-dd'T'HH:mm:ss");
    
    calls.push({
      id: `call-${i}`,
      phoneNumber: contact.phoneNumber,
      contactName: contact.isSaved ? contact.name : undefined,
      duration,
      timestamp,
      type,
    });
  }
  
  // Sort by timestamp (newest first)
  return calls.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const generateMockLocations = (): LocationData[] => {
  const locations: LocationData[] = [];
  const contacts = generateMockContacts();
  
  // US cities with coordinates
  const cities = [
    { name: 'New York', lat: 40.7128, lng: -74.0060 },
    { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
    { name: 'Chicago', lat: 41.8781, lng: -87.6298 },
    { name: 'Houston', lat: 29.7604, lng: -95.3698 },
    { name: 'Phoenix', lat: 33.4484, lng: -112.0740 },
    { name: 'Philadelphia', lat: 39.9526, lng: -75.1652 },
    { name: 'San Antonio', lat: 29.4241, lng: -98.4936 },
    { name: 'San Diego', lat: 32.7157, lng: -117.1611 },
    { name: 'Dallas', lat: 32.7767, lng: -96.7970 },
    { name: 'San Jose', lat: 37.3382, lng: -121.8863 },
  ];
  
  for (let i = 0; i < 30; i++) {
    const contact = contacts[Math.floor(Math.random() * 4)]; // Use only the first 4 contacts
    const city = cities[Math.floor(Math.random() * cities.length)];
    
    // Add small random variations to the city coordinates
    const latVariation = (Math.random() - 0.5) * 0.1;
    const lngVariation = (Math.random() - 0.5) * 0.1;
    
    const daysAgo = Math.floor(Math.random() * 7);
    const hoursAgo = Math.floor(Math.random() * 24);
    const timestamp = format(subHours(subDays(new Date(), daysAgo), hoursAgo), "yyyy-MM-dd'T'HH:mm:ss");
    
    locations.push({
      id: `location-${i}`,
      phoneNumber: contact.phoneNumber,
      contactName: contact.isSaved ? contact.name : undefined,
      latitude: city.lat + latVariation,
      longitude: city.lng + lngVariation,
      accuracy: Math.random() * 50 + 10, // 10-60 meters accuracy
      timestamp,
      address: `${Math.floor(Math.random() * 1000) + 1} ${['Main', 'Oak', 'Maple', 'Pine', 'Cedar'][Math.floor(Math.random() * 5)]} ${['St', 'Ave', 'Blvd', 'Dr'][Math.floor(Math.random() * 4)]}, ${city.name}`,
    });
  }
  
  // Sort by timestamp (newest first)
  return locations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const generateMockActivities = (): ActivityLog[] => {
  const activities: ActivityLog[] = [];
  const contacts = generateMockContacts();
  const activityTypes: ('call' | 'text' | 'location' | 'app' | 'web')[] = ['call', 'text', 'location', 'app', 'web'];
  
  for (let i = 0; i < 100; i++) {
    const contact = contacts[Math.floor(Math.random() * contacts.length)];
    const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    
    let details = '';
    switch (activityType) {
      case 'call':
        details = ['Outgoing call (${Math.floor(Math.random() * 10) + 1} minutes)', 
                   'Incoming call (${Math.floor(Math.random() * 10) + 1} minutes)', 
                   'Missed call'][Math.floor(Math.random() * 3)];
        break;
      case 'text':
        details = ['Sent message: "${["Hey", "Hello", "Hi", "What\'s up", "Call me back"][Math.floor(Math.random() * 5)]}"', 
                   'Received message: "${["Ok", "Sure", "See you soon", "I\'ll call you later", "Where are you?"][Math.floor(Math.random() * 5)]}"'][Math.floor(Math.random() * 2)];
        break;
      case 'location':
        details = 'Location updated: ${["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][Math.floor(Math.random() * 5)]}';
        break;
      case 'app':
        details = 'Used app: ${["Facebook", "Instagram", "WhatsApp", "TikTok", "Snapchat"][Math.floor(Math.random() * 5)]} for ${Math.floor(Math.random() * 60) + 1} minutes';
        break;
      case 'web':
        details = 'Visited website: ${["google.com", "youtube.com", "facebook.com", "amazon.com", "twitter.com"][Math.floor(Math.random() * 5)]}';
        break;
    }
    
    const daysAgo = Math.floor(Math.random() * 7);
    const hoursAgo = Math.floor(Math.random() * 24);
    const timestamp = format(subHours(subDays(new Date(), daysAgo), hoursAgo), "yyyy-MM-dd'T'HH:mm:ss");
    
    activities.push({
      id: `activity-${i}`,
      phoneNumber: contact.phoneNumber,
      contactName: contact.isSaved ? contact.name : undefined,
      activityType,
      details,
      timestamp,
    });
  }
  
  // Sort by timestamp (newest first)
  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const generateTrackedNumbers = (): TrackedNumber[] => {
  const contacts = generateMockContacts();
  return contacts.slice(0, 5).map((contact) => ({
    phoneNumber: contact.phoneNumber,
    label: contact.isSaved ? contact.name : 'Unknown',
    isActive: Math.random() > 0.3,
    lastSeen: format(subHours(new Date(), Math.floor(Math.random() * 24)), "yyyy-MM-dd'T'HH:mm:ss"),
    callCount: Math.floor(Math.random() * 50),
    textCount: Math.floor(Math.random() * 100),
  }));
};

// API mock functions
let contacts = generateMockContacts();
let calls = generateMockCalls();
let locations = generateMockLocations();
let activities = generateMockActivities();
let trackedNumbers = generateTrackedNumbers();

export const api = {
  // Tracked numbers
  getTrackedNumbers: () => new Promise<TrackedNumber[]>((resolve) => {
    setTimeout(() => resolve(trackedNumbers), 500);
  }),
  
  addTrackedNumber: (phoneNumber: string, label: string) => new Promise<TrackedNumber>((resolve) => {
    const newTrackedNumber: TrackedNumber = {
      phoneNumber,
      label,
      isActive: true,
      lastSeen: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      callCount: 0,
      textCount: 0,
    };
    
    trackedNumbers = [...trackedNumbers, newTrackedNumber];
    
    setTimeout(() => resolve(newTrackedNumber), 500);
  }),
  
  // Contacts
  getContacts: () => new Promise<PhoneContact[]>((resolve) => {
    setTimeout(() => resolve(contacts), 500);
  }),
  
  getContact: (id: string) => new Promise<PhoneContact | undefined>((resolve) => {
    const contact = contacts.find((c) => c.id === id);
    setTimeout(() => resolve(contact), 300);
  }),
  
  addContact: (contact: Omit<PhoneContact, 'id'>) => new Promise<PhoneContact>((resolve) => {
    const newContact: PhoneContact = {
      ...contact,
      id: `contact-${Date.now()}`,
    };
    
    contacts = [...contacts, newContact];
    
    setTimeout(() => resolve(newContact), 500);
  }),
  
  // Call records
  getCalls: () => new Promise<CallRecord[]>((resolve) => {
    setTimeout(() => resolve(calls), 500);
  }),
  
  getCallsByNumber: (phoneNumber: string) => new Promise<CallRecord[]>((resolve) => {
    const filteredCalls = calls.filter((call) => call.phoneNumber === phoneNumber);
    setTimeout(() => resolve(filteredCalls), 300);
  }),
  
  // Location data
  getLocations: () => new Promise<LocationData[]>((resolve) => {
    setTimeout(() => resolve(locations), 500);
  }),
  
  getLocationsByNumber: (phoneNumber: string) => new Promise<LocationData[]>((resolve) => {
    const filteredLocations = locations.filter((location) => location.phoneNumber === phoneNumber);
    setTimeout(() => resolve(filteredLocations), 300);
  }),
  
  // Add a new location for a phone number
  addLocation: (phoneNumber: string, latitude: number, longitude: number, accuracy: number) => 
    new Promise<LocationData>((resolve) => {
      // Find contact info
      const contact = contacts.find(c => c.phoneNumber === phoneNumber);
      
      const newLocation: LocationData = {
        id: `location-${Date.now()}`,
        phoneNumber,
        contactName: contact?.isSaved ? contact.name : undefined,
        latitude,
        longitude,
        accuracy,
        timestamp: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
        address: "Current Location", // In a real app, would use reverse geocoding
      };
      
      // Update tracked number's last seen
      trackedNumbers = trackedNumbers.map(num => 
        num.phoneNumber === phoneNumber 
          ? { ...num, lastSeen: newLocation.timestamp }
          : num
      );
      
      // Add to locations
      locations = [newLocation, ...locations];
      
      setTimeout(() => resolve(newLocation), 300);
  }),
  
  // Activity logs
  getActivities: () => new Promise<ActivityLog[]>((resolve) => {
    setTimeout(() => resolve(activities), 500);
  }),
  
  getActivitiesByNumber: (phoneNumber: string) => new Promise<ActivityLog[]>((resolve) => {
    const filteredActivities = activities.filter((activity) => activity.phoneNumber === phoneNumber);
    setTimeout(() => resolve(filteredActivities), 300);
  }),
};

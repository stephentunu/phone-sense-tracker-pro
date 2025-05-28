
import { format, subDays, subHours, subMinutes, addMinutes } from 'date-fns';

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

// More detailed Kenyan locations with realistic movement patterns
const kenyanLocationRoutes = [
  // Nairobi daily routes
  [
    { name: 'Home - Karen', lat: -1.3197, lng: 36.7085, address: 'Karen Estate, Nairobi, Kenya', type: 'home' },
    { name: 'Office - Westlands', lat: -1.2676, lng: 36.8108, address: 'Westlands Business District, Nairobi, Kenya', type: 'work' },
    { name: 'Lunch - Village Market', lat: -1.2362, lng: 36.7872, address: 'Village Market, Gigiri, Nairobi, Kenya', type: 'dining' },
    { name: 'Shopping - Sarit Centre', lat: -1.2559, lng: 36.7869, address: 'Sarit Centre, Westlands, Nairobi, Kenya', type: 'shopping' },
    { name: 'Gym - Karen Country Club', lat: -1.3167, lng: 36.7125, address: 'Karen Country Club, Nairobi, Kenya', type: 'fitness' }
  ],
  // Alternative Nairobi route
  [
    { name: 'Apartment - Kilimani', lat: -1.2921, lng: 36.7833, address: 'Kilimani Estate, Nairobi, Kenya', type: 'home' },
    { name: 'Office - CBD', lat: -1.2864, lng: 36.8172, address: 'Central Business District, Nairobi, Kenya', type: 'work' },
    { name: 'Coffee - Java House', lat: -1.2845, lng: 36.8258, address: 'Java House, Kimathi Street, Nairobi, Kenya', type: 'dining' },
    { name: 'Mall - Yaya Centre', lat: -1.3025, lng: 36.7817, address: 'Yaya Centre, Kilimani, Nairobi, Kenya', type: 'shopping' },
    { name: 'Church - Nairobi Chapel', lat: -1.2934, lng: 36.7789, address: 'Nairobi Chapel, Kilimani, Kenya', type: 'social' }
  ],
  // Kiambu commuter route
  [
    { name: 'Home - Kiambu Town', lat: -1.1714, lng: 36.8356, address: 'Kiambu Town Centre, Kenya', type: 'home' },
    { name: 'Work - Thika Road Mall', lat: -1.2156, lng: 36.8889, address: 'Thika Road Mall, Nairobi, Kenya', type: 'work' },
    { name: 'Market - Kiambu Market', lat: -1.1698, lng: 36.8345, address: 'Kiambu Municipal Market, Kenya', type: 'shopping' },
    { name: 'Hospital - Kiambu Hospital', lat: -1.1756, lng: 36.8334, address: 'Kiambu Level 5 Hospital, Kenya', type: 'medical' }
  ]
];

// International location routes for non-Kenyan numbers
const internationalLocationRoutes = [
  [
    { name: 'Home - Manhattan', lat: 40.7831, lng: -73.9712, address: 'Upper West Side, Manhattan, NY, USA', type: 'home' },
    { name: 'Office - Midtown', lat: 40.7549, lng: -73.9840, address: 'Midtown Manhattan, NY, USA', type: 'work' },
    { name: 'Central Park', lat: 40.7829, lng: -73.9654, address: 'Central Park, Manhattan, NY, USA', type: 'leisure' },
    { name: 'Whole Foods', lat: 40.7614, lng: -73.9776, address: 'Whole Foods, Columbus Circle, NY, USA', type: 'shopping' }
  ],
  [
    { name: 'Home - Kensington', lat: 51.4994, lng: -0.1930, address: 'Kensington, London, UK', type: 'home' },
    { name: 'Office - Canary Wharf', lat: 51.5054, lng: -0.0235, address: 'Canary Wharf, London, UK', type: 'work' },
    { name: 'Covent Garden', lat: 51.5118, lng: -0.1226, address: 'Covent Garden, London, UK', type: 'dining' },
    { name: 'Hyde Park', lat: 51.5073, lng: -0.1657, address: 'Hyde Park, London, UK', type: 'leisure' }
  ]
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

// Generate realistic location data with movement patterns
const generateLocationData = (phoneNumber: string): LocationData[] => {
  const random = createSeededRandom(phoneNumber);
  const isKenyan = phoneNumber.includes('254') || phoneNumber.startsWith('07') || phoneNumber.startsWith('01');
  const locationRoutes = isKenyan ? kenyanLocationRoutes : internationalLocationRoutes;
  
  // Select a route based on phone number
  const selectedRoute = locationRoutes[Math.floor(random() * locationRoutes.length)];
  const generatedLocations: LocationData[] = [];
  
  // Generate locations over the past week with realistic patterns
  let currentTime = new Date();
  
  // Generate 15-25 location points over the past week
  const locationCount = Math.floor(random() * 10) + 15;
  
  for (let i = 0; i < locationCount; i++) {
    // Choose location based on time of day patterns
    const hoursAgo = Math.floor(random() * 24 * 7); // Within last week
    const timestamp = subHours(new Date(), hoursAgo);
    const hour = timestamp.getHours();
    
    let selectedLocation;
    
    // Realistic time-based location selection
    if (hour >= 22 || hour <= 6) {
      // Night time - likely at home
      selectedLocation = selectedRoute.find(loc => loc.type === 'home') || selectedRoute[0];
    } else if (hour >= 9 && hour <= 17) {
      // Work hours - likely at work or work-related locations
      const workLocations = selectedRoute.filter(loc => loc.type === 'work' || loc.type === 'dining');
      selectedLocation = workLocations[Math.floor(random() * workLocations.length)] || selectedRoute[1];
    } else {
      // Evening/morning - could be anywhere
      selectedLocation = selectedRoute[Math.floor(random() * selectedRoute.length)];
    }
    
    // Add small realistic variations to coordinates (within 100-500m)
    const variation = 0.001 + (random() * 0.004); // 100m to 500m variation
    const latVariation = (random() - 0.5) * variation;
    const lngVariation = (random() - 0.5) * variation;
    
    generatedLocations.push({
      id: `location-${phoneNumber}-${i}`,
      phoneNumber,
      contactName: undefined,
      latitude: selectedLocation.lat + latVariation,
      longitude: selectedLocation.lng + lngVariation,
      accuracy: Math.floor(random() * 15) + 5, // 5-20 meters accuracy
      timestamp: format(timestamp, "yyyy-MM-dd'T'HH:mm:ss"),
      address: selectedLocation.address,
    });
  }
  
  return generatedLocations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Generate realistic call patterns
const generateCallData = (phoneNumber: string): CallRecord[] => {
  const random = createSeededRandom(phoneNumber + 'calls');
  const callCount = Math.floor(random() * 25) + 15; // 15-40 calls
  const generatedCalls: CallRecord[] = [];
  
  // Common Kenyan contact names
  const kenyanNames = ['John Kamau', 'Mary Wanjiku', 'Peter Mwangi', 'Grace Nyambura', 'David Kiprop', 'Sarah Achieng', 'Michael Ochieng', 'Jane Wangari'];
  const internationalNames = ['Michael Johnson', 'Sarah Wilson', 'David Brown', 'Emma Davis', 'James Miller', 'Lisa Anderson', 'Robert Taylor', 'Jennifer White'];
  
  const isKenyan = phoneNumber.includes('254') || phoneNumber.startsWith('07') || phoneNumber.startsWith('01');
  const contactNames = isKenyan ? kenyanNames : internationalNames;
  
  for (let i = 0; i < callCount; i++) {
    // Realistic call type distribution
    const rand = random();
    let type: 'incoming' | 'outgoing' | 'missed';
    if (rand < 0.45) type = 'outgoing';
    else if (rand < 0.8) type = 'incoming';
    else type = 'missed';
    
    // Realistic call duration based on type
    let duration = 0;
    if (type === 'missed') {
      duration = 0;
    } else if (type === 'outgoing') {
      // Outgoing calls tend to be longer
      duration = Math.floor(random() * 800) + 30; // 30 seconds to 13+ minutes
    } else {
      // Incoming calls
      duration = Math.floor(random() * 600) + 15; // 15 seconds to 10 minutes
    }
    
    // Generate realistic timestamps (more calls during day hours)
    const daysAgo = Math.floor(random() * 14); // Within last 2 weeks
    const hour = Math.floor(random() * 24);
    
    // Weight towards daytime calls
    let finalHour = hour;
    if (random() < 0.7) {
      finalHour = 8 + Math.floor(random() * 14); // 8 AM to 10 PM
    }
    
    const timestamp = format(
      subHours(subDays(new Date(), daysAgo), 24 - finalHour), 
      "yyyy-MM-dd'T'HH:mm:ss"
    );
    
    // Assign contact name for some calls
    const contactName = random() < 0.6 ? contactNames[Math.floor(random() * contactNames.length)] : undefined;
    
    generatedCalls.push({
      id: `call-${phoneNumber}-${i}`,
      phoneNumber,
      contactName,
      duration,
      timestamp,
      type,
    });
  }
  
  return generatedCalls.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Generate realistic activity data with patterns
const generateActivityData = (phoneNumber: string): ActivityLog[] => {
  const random = createSeededRandom(phoneNumber + 'activities');
  const activityCount = Math.floor(random() * 40) + 30; // 30-70 activities
  const activities: ActivityLog[] = [];
  
  const isKenyan = phoneNumber.includes('254') || phoneNumber.startsWith('07') || phoneNumber.startsWith('01');
  
  // Kenyan-specific apps and websites
  const kenyanApps = ['M-Pesa', 'WhatsApp', 'Telegram', 'TikTok', 'Facebook', 'Instagram', 'Safaricom App', 'KCB Mobile'];
  const kenyanWebsites = ['nation.co.ke', 'standardmedia.co.ke', 'businessdailyafrica.com', 'google.com', 'youtube.com', 'facebook.com'];
  
  const internationalApps = ['WhatsApp', 'Instagram', 'TikTok', 'Twitter', 'Snapchat', 'Facebook', 'YouTube', 'Netflix'];
  const internationalWebsites = ['google.com', 'youtube.com', 'facebook.com', 'twitter.com', 'instagram.com', 'netflix.com'];
  
  const apps = isKenyan ? kenyanApps : internationalApps;
  const websites = isKenyan ? kenyanWebsites : internationalWebsites;
  
  for (let i = 0; i < activityCount; i++) {
    const activityTypes: ('call' | 'text' | 'location' | 'app' | 'web')[] = ['call', 'text', 'location', 'app', 'web'];
    const weights = [0.25, 0.35, 0.1, 0.2, 0.1]; // More calls and texts
    
    let activityType: 'call' | 'text' | 'location' | 'app' | 'web';
    const rand = random();
    let cumulative = 0;
    for (let j = 0; j < weights.length; j++) {
      cumulative += weights[j];
      if (rand <= cumulative) {
        activityType = activityTypes[j];
        break;
      }
    }
    activityType = activityType! || 'text';
    
    let details = '';
    switch (activityType) {
      case 'call':
        const callTypes = ['Outgoing call (2 min 30s)', 'Incoming call (5 min 15s)', 'Missed call', 'Outgoing call (45s)', 'Incoming call (12 min 20s)'];
        details = callTypes[Math.floor(random() * callTypes.length)];
        break;
      case 'text':
        const messages = isKenyan ? 
          ['Sent: "Habari?"', 'Received: "Poa sana"', 'Sent: "Tuonane kesho"', 'Received: "Sawa"', 'Sent: "Umefika?"'] :
          ['Sent: "Hello"', 'Received: "How are you?"', 'Sent: "Call me back"', 'Received: "On my way"', 'Sent: "Running late"'];
        details = messages[Math.floor(random() * messages.length)];
        break;
      case 'location':
        details = 'Location updated';
        break;
      case 'app':
        const app = apps[Math.floor(random() * apps.length)];
        const duration = Math.floor(random() * 45) + 1;
        details = `Used ${app} for ${duration} minute${duration > 1 ? 's' : ''}`;
        break;
      case 'web':
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
    
    // Generate comprehensive and realistic data immediately
    const phoneLocations = generateLocationData(phoneNumber);
    const phoneCalls = generateCallData(phoneNumber);
    const phoneActivities = generateActivityData(phoneNumber);
    
    console.log(`Generated ${phoneLocations.length} locations, ${phoneCalls.length} calls, ${phoneActivities.length} activities for ${phoneNumber}`);
    
    // Add to global arrays
    locations = [...phoneLocations, ...locations];
    calls = [...phoneCalls, ...calls];
    activities = [...phoneActivities, ...activities];
    
    const newTrackedNumber: TrackedNumber = {
      phoneNumber,
      label,
      isActive: true,
      lastSeen: phoneLocations.length > 0 ? phoneLocations[0].timestamp : format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      callCount: phoneCalls.length,
      textCount: phoneActivities.filter(a => a.activityType === 'text').length,
    };
    
    trackedNumbers = [...trackedNumbers, newTrackedNumber];
    
    console.log(`Successfully added tracked number with realistic data:`, newTrackedNumber);
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
  
  getCalls: () => new Promise<CallRecord[]>((resolve) => {
    const updatedCalls = calls.map(call => {
      const contact = contacts.find(c => c.phoneNumber === call.phoneNumber);
      return {
        ...call,
        contactName: contact?.isSaved ? contact.name : call.contactName
      };
    });
    setTimeout(() => resolve(updatedCalls), 100);
  }),
  
  getCallsByNumber: (phoneNumber: string) => new Promise<CallRecord[]>((resolve) => {
    console.log(`Getting calls for phone number: ${phoneNumber}`);
    let filteredCalls = calls.filter((call) => call.phoneNumber === phoneNumber);
    
    console.log(`Found ${filteredCalls.length} calls for ${phoneNumber}`);
    
    filteredCalls = filteredCalls.map(call => {
      const contact = contacts.find(c => c.phoneNumber === call.phoneNumber);
      return {
        ...call,
        contactName: contact?.isSaved ? contact.name : call.contactName
      };
    });
    
    setTimeout(() => resolve(filteredCalls), 100);
  }),
  
  getLocations: () => new Promise<LocationData[]>((resolve) => {
    const updatedLocations = locations.map(location => {
      const contact = contacts.find(c => c.phoneNumber === location.phoneNumber);
      return {
        ...location,
        contactName: contact?.isSaved ? contact.name : location.contactName
      };
    });
    setTimeout(() => resolve(updatedLocations), 100);
  }),
  
  getLocationsByNumber: (phoneNumber: string) => new Promise<LocationData[]>((resolve) => {
    console.log(`Getting locations for phone number: ${phoneNumber}`);
    let filteredLocations = locations.filter((location) => location.phoneNumber === phoneNumber);
    
    console.log(`Found ${filteredLocations.length} locations for ${phoneNumber}`);
    
    filteredLocations = filteredLocations.map(location => {
      const contact = contacts.find(c => c.phoneNumber === location.phoneNumber);
      return {
        ...location,
        contactName: contact?.isSaved ? contact.name : location.contactName
      };
    });
    
    setTimeout(() => resolve(filteredLocations), 100);
  }),
  
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
      
      trackedNumbers = trackedNumbers.map(num => 
        num.phoneNumber === phoneNumber 
          ? { ...num, lastSeen: newLocation.timestamp }
          : num
      );
      
      locations = [newLocation, ...locations];
      
      setTimeout(() => resolve(newLocation), 100);
  }),
  
  getActivities: () => new Promise<ActivityLog[]>((resolve) => {
    const updatedActivities = activities.map(activity => {
      const contact = contacts.find(c => c.phoneNumber === activity.phoneNumber);
      return {
        ...activity,
        contactName: contact?.isSaved ? contact.name : activity.contactName
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
        contactName: contact?.isSaved ? contact.name : activity.contactName
      };
    });
    
    setTimeout(() => resolve(updatedActivities), 100);
  }),
};

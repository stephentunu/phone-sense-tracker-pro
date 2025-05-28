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

// Real Kenyan locations with accurate coordinates and addresses
const kenyanRealPlaces = [
  // Nairobi specific locations
  { name: 'KICC, Nairobi', lat: -1.2921, lng: 36.8219, address: 'Kenyatta International Conference Centre, City Square, Nairobi', type: 'landmark' },
  { name: 'Westgate Mall', lat: -1.2676, lng: 36.8062, address: 'Westgate Shopping Mall, Westlands, Nairobi', type: 'shopping' },
  { name: 'Sarit Centre', lat: -1.2559, lng: 36.7869, address: 'Sarit Centre, Westlands, Nairobi', type: 'shopping' },
  { name: 'Village Market', lat: -1.2362, lng: 36.7872, address: 'Village Market, Gigiri, Nairobi', type: 'shopping' },
  { name: 'Karen Hospital', lat: -1.3197, lng: 36.7085, address: 'Karen Hospital, Karen, Nairobi', type: 'medical' },
  { name: 'Nairobi Hospital', lat: -1.3031, lng: 36.8089, address: 'The Nairobi Hospital, Upper Hill, Nairobi', type: 'medical' },
  { name: 'JKIA', lat: -1.3192, lng: 36.9278, address: 'Jomo Kenyatta International Airport, Nairobi', type: 'transport' },
  { name: 'University of Nairobi', lat: -1.2840, lng: 36.8155, address: 'University of Nairobi, Harry Thuku Road, Nairobi', type: 'education' },
  { name: 'Carnivore Restaurant', lat: -1.3667, lng: 36.8833, address: 'Carnivore Restaurant, Lang\'ata Road, Nairobi', type: 'dining' },
  { name: 'Two Rivers Mall', lat: -1.2081, lng: 36.8889, address: 'Two Rivers Mall, Limuru Road, Nairobi', type: 'shopping' },
  { name: 'Garden City Mall', lat: -1.2439, lng: 36.8758, address: 'Garden City Mall, Thika Road, Nairobi', type: 'shopping' },
  { name: 'Nyayo Stadium', lat: -1.3139, lng: 36.8250, address: 'Nyayo National Stadium, Langata Road, Nairobi', type: 'sports' },
  { name: 'Kencom House', lat: -1.2869, lng: 36.8244, address: 'Kencom House, Moi Avenue, Nairobi CBD', type: 'business' },
  { name: 'Yaya Centre', lat: -1.3025, lng: 36.7817, address: 'Yaya Centre, Argwings Kodhek Road, Kilimani', type: 'shopping' },
  
  // Residential areas
  { name: 'Karen Estate', lat: -1.3225, lng: 36.7050, address: 'Karen Estate, Nairobi', type: 'residential' },
  { name: 'Westlands', lat: -1.2676, lng: 36.8108, address: 'Westlands, Nairobi', type: 'residential' },
  { name: 'Kilimani', lat: -1.2921, lng: 36.7833, address: 'Kilimani Estate, Nairobi', type: 'residential' },
  { name: 'Lavington', lat: -1.2833, lng: 36.7667, address: 'Lavington Estate, Nairobi', type: 'residential' },
  { name: 'Kileleshwa', lat: -1.2833, lng: 36.7833, address: 'Kileleshwa Estate, Nairobi', type: 'residential' },
  { name: 'Parklands', lat: -1.2500, lng: 36.8333, address: 'Parklands Estate, Nairobi', type: 'residential' },
  
  // Other major Kenyan cities
  { name: 'Mombasa CBD', lat: -4.0435, lng: 39.6682, address: 'Mombasa Central Business District, Mombasa', type: 'business' },
  { name: 'Nakuru Town', lat: -0.3031, lng: 36.0800, address: 'Nakuru Town Centre, Nakuru', type: 'business' },
  { name: 'Kisumu City', lat: -0.0917, lng: 34.7680, address: 'Kisumu City Centre, Kisumu', type: 'business' },
  { name: 'Eldoret Town', lat: 0.5143, lng: 35.2698, address: 'Eldoret Town Centre, Eldoret', type: 'business' },
];

// Real Kenyan contact names and phone patterns
const kenyanContactNames = [
  'John Kamau', 'Mary Wanjiku', 'Peter Mwangi', 'Grace Nyambura', 'David Kiprop',
  'Sarah Achieng', 'Michael Ochieng', 'Jane Wangari', 'Samuel Kiprotich', 'Faith Njeri',
  'Joseph Mutua', 'Elizabeth Wanjiru', 'Daniel Kimani', 'Rebecca Moraa', 'Francis Otieno',
  'Catherine Wairimu', 'Paul Karanja', 'Rose Chebet', 'James Maina', 'Lydia Nyokabi'
];

// Real Kenyan mobile apps and websites
const kenyanDigitalBehavior = {
  apps: ['M-Pesa', 'WhatsApp', 'Telegram', 'TikTok', 'Facebook', 'Instagram', 'Safaricom App', 
        'KCB Mobile', 'Equity Mobile', 'Uber', 'Bolt', 'Jumia', 'Glovo', 'YouTube'],
  websites: ['nation.co.ke', 'standardmedia.co.ke', 'businessdailyafrica.com', 'tuko.co.ke',
           'google.com', 'youtube.com', 'facebook.com', 'jumia.co.ke', 'pigiame.co.ke']
};

// Create deterministic but realistic random function
const createRealisticRandom = (phoneNumber: string, type: string) => {
  let seed = 0;
  const input = phoneNumber + type;
  for (let i = 0; i < input.length; i++) {
    seed += input.charCodeAt(i) * (i + 1);
  }
  
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
};

// Generate realistic daily movement patterns
const generateRealisticLocations = (phoneNumber: string): LocationData[] => {
  const random = createRealisticRandom(phoneNumber, 'location');
  const isKenyan = phoneNumber.includes('254') || phoneNumber.startsWith('07') || phoneNumber.startsWith('01');
  
  if (!isKenyan) {
    // For non-Kenyan numbers, generate minimal international data
    return [{
      id: `location-${phoneNumber}-1`,
      phoneNumber,
      contactName: undefined,
      latitude: 40.7128 + (random() - 0.5) * 0.1,
      longitude: -74.0060 + (random() - 0.5) * 0.1,
      accuracy: 15,
      timestamp: format(subHours(new Date(), 2), "yyyy-MM-dd'T'HH:mm:ss"),
      address: "New York, NY, USA",
    }];
  }

  const locations: LocationData[] = [];
  const currentTime = new Date();
  
  // Select a home base (residential area)
  const homeBase = kenyanRealPlaces.filter(p => p.type === 'residential')[
    Math.floor(random() * kenyanRealPlaces.filter(p => p.type === 'residential').length)
  ];
  
  // Generate realistic daily pattern over last 7 days
  for (let day = 0; day < 7; day++) {
    const dayStart = subDays(currentTime, day);
    
    // Morning at home (6-8 AM)
    locations.push({
      id: `location-${phoneNumber}-${day}-morning`,
      phoneNumber,
      contactName: undefined,
      latitude: homeBase.lat + (random() - 0.5) * 0.002, // 200m variation
      longitude: homeBase.lng + (random() - 0.5) * 0.002,
      accuracy: 8 + random() * 7, // 8-15m accuracy
      timestamp: format(subHours(dayStart, 24 - (6 + random() * 2)), "yyyy-MM-dd'T'HH:mm:ss"),
      address: homeBase.address,
    });
    
    // Work/business hours (9 AM - 5 PM) - select business locations
    const workPlaces = kenyanRealPlaces.filter(p => 
      p.type === 'business' || p.type === 'shopping' || p.type === 'education'
    );
    const workPlace = workPlaces[Math.floor(random() * workPlaces.length)];
    
    locations.push({
      id: `location-${phoneNumber}-${day}-work`,
      phoneNumber,
      contactName: undefined,
      latitude: workPlace.lat + (random() - 0.5) * 0.001,
      longitude: workPlace.lng + (random() - 0.5) * 0.001,
      accuracy: 12 + random() * 8,
      timestamp: format(subHours(dayStart, 24 - (9 + random() * 8)), "yyyy-MM-dd'T'HH:mm:ss"),
      address: workPlace.address,
    });
    
    // Evening activities (6-9 PM) - shopping, dining, social
    if (random() > 0.3) { // 70% chance of evening activity
      const eveningPlaces = kenyanRealPlaces.filter(p => 
        p.type === 'shopping' || p.type === 'dining' || p.type === 'medical'
      );
      const eveningPlace = eveningPlaces[Math.floor(random() * eveningPlaces.length)];
      
      locations.push({
        id: `location-${phoneNumber}-${day}-evening`,
        phoneNumber,
        contactName: undefined,
        latitude: eveningPlace.lat + (random() - 0.5) * 0.001,
        longitude: eveningPlace.lng + (random() - 0.5) * 0.001,
        accuracy: 10 + random() * 10,
        timestamp: format(subHours(dayStart, 24 - (18 + random() * 3)), "yyyy-MM-dd'T'HH:mm:ss"),
        address: eveningPlace.address,
      });
    }
    
    // Night at home (10 PM - 6 AM)
    locations.push({
      id: `location-${phoneNumber}-${day}-night`,
      phoneNumber,
      contactName: undefined,
      latitude: homeBase.lat + (random() - 0.5) * 0.001,
      longitude: homeBase.lng + (random() - 0.5) * 0.001,
      accuracy: 5 + random() * 5,
      timestamp: format(subHours(dayStart, 24 - (22 + random() * 2)), "yyyy-MM-dd'T'HH:mm:ss"),
      address: homeBase.address,
    });
  }
  
  // Add some current/recent locations
  const recentPlace = kenyanRealPlaces[Math.floor(random() * kenyanRealPlaces.length)];
  locations.push({
    id: `location-${phoneNumber}-current`,
    phoneNumber,
    contactName: undefined,
    latitude: recentPlace.lat + (random() - 0.5) * 0.0005,
    longitude: recentPlace.lng + (random() - 0.5) * 0.0005,
    accuracy: 5 + random() * 5,
    timestamp: format(subMinutes(currentTime, random() * 120), "yyyy-MM-dd'T'HH:mm:ss"),
    address: recentPlace.address,
  });
  
  return locations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Generate realistic call patterns based on Kenyan behavior
const generateRealisticCalls = (phoneNumber: string): CallRecord[] => {
  const random = createRealisticRandom(phoneNumber, 'calls');
  const isKenyan = phoneNumber.includes('254') || phoneNumber.startsWith('07') || phoneNumber.startsWith('01');
  
  const calls: CallRecord[] = [];
  const currentTime = new Date();
  
  // Generate calls over the past 2 weeks with realistic patterns
  for (let day = 0; day < 14; day++) {
    const dayStart = subDays(currentTime, day);
    const isWeekend = dayStart.getDay() === 0 || dayStart.getDay() === 6;
    
    // Determine number of calls per day (more on weekdays)
    const dailyCallCount = isWeekend ? 
      Math.floor(random() * 3) + 1 : // 1-3 calls on weekends
      Math.floor(random() * 5) + 2;  // 2-6 calls on weekdays
    
    for (let i = 0; i < dailyCallCount; i++) {
      // Realistic call time distribution (peak hours: 9-11 AM, 2-4 PM, 7-9 PM)
      let hour: number;
      const timeSlot = random();
      if (timeSlot < 0.3) {
        hour = 9 + random() * 2; // Morning peak
      } else if (timeSlot < 0.6) {
        hour = 14 + random() * 2; // Afternoon peak
      } else if (timeSlot < 0.8) {
        hour = 19 + random() * 2; // Evening peak
      } else {
        hour = 8 + random() * 13; // Rest of day
      }
      
      const minutes = Math.floor(random() * 60);
      const callTime = new Date(dayStart);
      callTime.setHours(Math.floor(hour), minutes, 0, 0);
      
      // Realistic call type distribution
      let type: 'incoming' | 'outgoing' | 'missed';
      const typeRand = random();
      if (typeRand < 0.45) {
        type = 'outgoing';
      } else if (typeRand < 0.80) {
        type = 'incoming';
      } else {
        type = 'missed';
      }
      
      // Realistic duration based on type and time
      let duration: number;
      if (type === 'missed') {
        duration = 0;
      } else {
        // Business hours calls tend to be shorter
        const isBusinessHours = hour >= 9 && hour <= 17;
        if (isBusinessHours) {
          duration = Math.floor(random() * 300) + 30; // 30 seconds to 5 minutes
        } else {
          duration = Math.floor(random() * 900) + 60; // 1 to 15 minutes
        }
      }
      
      // Assign realistic contact name (60% chance)
      const contactName = random() < 0.6 ? 
        kenyanContactNames[Math.floor(random() * kenyanContactNames.length)] : 
        undefined;
      
      calls.push({
        id: `call-${phoneNumber}-${day}-${i}`,
        phoneNumber,
        contactName,
        duration,
        timestamp: format(callTime, "yyyy-MM-dd'T'HH:mm:ss"),
        type,
      });
    }
  }
  
  return calls.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Generate realistic activity patterns
const generateRealisticActivities = (phoneNumber: string): ActivityLog[] => {
  const random = createRealisticRandom(phoneNumber, 'activity');
  const isKenyan = phoneNumber.includes('254') || phoneNumber.startsWith('07') || phoneNumber.startsWith('01');
  
  const activities: ActivityLog[] = [];
  const currentTime = new Date();
  
  // Generate activities over the past week
  for (let day = 0; day < 7; day++) {
    const dayStart = subDays(currentTime, day);
    
    // Generate 8-15 activities per day
    const dailyActivityCount = Math.floor(random() * 8) + 8;
    
    for (let i = 0; i < dailyActivityCount; i++) {
      const hour = 6 + random() * 18; // Active hours 6 AM - 12 AM
      const activityTime = new Date(dayStart);
      activityTime.setHours(Math.floor(hour), Math.floor(random() * 60), 0, 0);
      
      // Realistic activity type distribution
      let activityType: 'call' | 'text' | 'location' | 'app' | 'web';
      const typeRand = random();
      if (typeRand < 0.35) {
        activityType = 'text';
      } else if (typeRand < 0.55) {
        activityType = 'app';
      } else if (typeRand < 0.70) {
        activityType = 'call';
      } else if (typeRand < 0.85) {
        activityType = 'web';
      } else {
        activityType = 'location';
      }
      
      let details: string;
      const contactName = random() < 0.4 ? 
        kenyanContactNames[Math.floor(random() * kenyanContactNames.length)] : 
        undefined;
      
      switch (activityType) {
        case 'call':
          const callDuration = Math.floor(random() * 600) + 30;
          const callTypes = ['Outgoing call', 'Incoming call', 'Missed call'];
          const callType = callTypes[Math.floor(random() * callTypes.length)];
          details = `${callType} (${Math.floor(callDuration / 60)}:${(callDuration % 60).toString().padStart(2, '0')})`;
          break;
          
        case 'text':
          const kenyanTexts = [
            'Sent: "Mambo vipi?"', 'Received: "Poa sana"', 'Sent: "Tuonane kesho"', 
            'Received: "Sawa"', 'Sent: "Umefika?"', 'Received: "Niko njiani"',
            'Sent: "Call me"', 'Received: "Asante sana"', 'Sent: "Habari za kazi?"'
          ];
          details = kenyanTexts[Math.floor(random() * kenyanTexts.length)];
          break;
          
        case 'location':
          details = 'Location updated';
          break;
          
        case 'app':
          const app = kenyanDigitalBehavior.apps[Math.floor(random() * kenyanDigitalBehavior.apps.length)];
          const duration = Math.floor(random() * 45) + 1;
          details = `Used ${app} for ${duration} minute${duration > 1 ? 's' : ''}`;
          break;
          
        case 'web':
          const site = kenyanDigitalBehavior.websites[Math.floor(random() * kenyanDigitalBehavior.websites.length)];
          details = `Visited ${site}`;
          break;
      }
      
      activities.push({
        id: `activity-${phoneNumber}-${day}-${i}`,
        phoneNumber,
        contactName,
        activityType,
        details,
        timestamp: format(activityTime, "yyyy-MM-dd'T'HH:mm:ss"),
      });
    }
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
    
    // Generate comprehensive realistic data
    const phoneLocations = generateRealisticLocations(phoneNumber);
    const phoneCalls = generateRealisticCalls(phoneNumber);
    const phoneActivities = generateRealisticActivities(phoneNumber);
    
    console.log(`Generated realistic data: ${phoneLocations.length} locations, ${phoneCalls.length} calls, ${phoneActivities.length} activities for ${phoneNumber}`);
    
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

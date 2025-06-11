// Mock phone tracking service for real-world simulation
// In production, this would connect to actual phone tracking APIs

interface TrackedPhoneLocation {
  phoneNumber: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  address: string;
  contactName: string;
  timestamp: Date;
  heading?: number;
  speed?: number;
  altitude?: number;
}

// Mock locations around the world for testing
const MOCK_PHONE_LOCATIONS: Record<string, TrackedPhoneLocation[]> = {
  // Default mock locations for different phones
  '+1555123456': [
    {
      phoneNumber: '+1555123456',
      latitude: 40.7589, // Times Square, NYC
      longitude: -73.9851,
      accuracy: 8,
      address: '1560 Broadway, New York, NY 10036, USA',
      contactName: 'John\'s iPhone',
      timestamp: new Date(),
      heading: 45,
      speed: 0
    }
  ],
  '+1555987654': [
    {
      phoneNumber: '+1555987654',
      latitude: 51.5074, // London, UK
      longitude: -0.1278,
      accuracy: 12,
      address: 'Westminster, London SW1A 0AA, UK',
      contactName: 'Sarah\'s Samsung',
      timestamp: new Date(),
      heading: 180,
      speed: 15
    }
  ]
};

export class PhoneTrackingService {
  // Simulate getting live location from a tracked phone
  static async getPhoneLocation(phoneNumber: string): Promise<TrackedPhoneLocation | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Get existing or create new mock location
    let locations = MOCK_PHONE_LOCATIONS[phoneNumber];
    
    if (!locations || locations.length === 0) {
      // Generate a realistic location for this phone number
      const mockLocation = this.generateRealisticLocation(phoneNumber);
      MOCK_PHONE_LOCATIONS[phoneNumber] = [mockLocation];
      locations = [mockLocation];
    }
    
    // Simulate slight movement (realistic tracking)
    const lastLocation = locations[0];
    const newLocation = this.simulateMovement(lastLocation);
    
    // Add to history
    MOCK_PHONE_LOCATIONS[phoneNumber].unshift(newLocation);
    
    // Keep only last 50 locations
    if (MOCK_PHONE_LOCATIONS[phoneNumber].length > 50) {
      MOCK_PHONE_LOCATIONS[phoneNumber] = MOCK_PHONE_LOCATIONS[phoneNumber].slice(0, 50);
    }
    
    return newLocation;
  }
  
  // Get location history for a phone
  static getPhoneLocationHistory(phoneNumber: string, limit: number = 10): TrackedPhoneLocation[] {
    const locations = MOCK_PHONE_LOCATIONS[phoneNumber] || [];
    return locations.slice(0, limit);
  }
  
  // Generate a realistic location based on phone number
  private static generateRealisticLocation(phoneNumber: string): TrackedPhoneLocation {
    const cities = [
      { lat: 40.7128, lng: -74.0060, name: 'New York, NY, USA' },
      { lat: 34.0522, lng: -118.2437, name: 'Los Angeles, CA, USA' },
      { lat: 51.5074, lng: -0.1278, name: 'London, UK' },
      { lat: 48.8566, lng: 2.3522, name: 'Paris, France' },
      { lat: 35.6762, lng: 139.6503, name: 'Tokyo, Japan' },
      { lat: -33.8688, lng: 151.2093, name: 'Sydney, Australia' },
      { lat: 55.7558, lng: 37.6176, name: 'Moscow, Russia' },
      { lat: 39.9042, lng: 116.4074, name: 'Beijing, China' },
      { lat: 28.6139, lng: 77.2090, name: 'New Delhi, India' },
      { lat: -23.5505, lng: -46.6333, name: 'São Paulo, Brazil' }
    ];
    
    // Use phone number to deterministically pick a city
    const hash = phoneNumber.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const cityIndex = Math.abs(hash) % cities.length;
    const city = cities[cityIndex];
    
    // Add some random offset to make it more realistic (within ~2km radius)
    const offsetRange = 0.02; // roughly 2km
    const latOffset = (Math.random() - 0.5) * offsetRange;
    const lngOffset = (Math.random() - 0.5) * offsetRange;
    
    return {
      phoneNumber,
      latitude: city.lat + latOffset,
      longitude: city.lng + lngOffset,
      accuracy: 5 + Math.random() * 15, // 5-20m accuracy
      address: city.name,
      contactName: this.generateContactName(phoneNumber),
      timestamp: new Date(),
      heading: Math.random() * 360,
      speed: Math.random() * 30 // 0-30 km/h
    };
  }
  
  // Simulate realistic movement
  private static simulateMovement(lastLocation: TrackedPhoneLocation): TrackedPhoneLocation {
    // Small random movement (realistic for phone tracking)
    const movementRange = 0.001; // roughly 100m
    const latChange = (Math.random() - 0.5) * movementRange;
    const lngChange = (Math.random() - 0.5) * movementRange;
    
    return {
      ...lastLocation,
      latitude: lastLocation.latitude + latChange,
      longitude: lastLocation.longitude + lngChange,
      accuracy: 5 + Math.random() * 15,
      timestamp: new Date(),
      heading: (lastLocation.heading || 0) + (Math.random() - 0.5) * 30,
      speed: Math.max(0, (lastLocation.speed || 0) + (Math.random() - 0.5) * 10)
    };
  }
  
  // Generate contact name based on phone number
  private static generateContactName(phoneNumber: string): string {
    const names = [
      'John\'s iPhone', 'Sarah\'s Samsung', 'Mike\'s Pixel', 'Lisa\'s OnePlus',
      'David\'s iPhone', 'Emma\'s Galaxy', 'Alex\'s Huawei', 'Sophie\'s Xiaomi',
      'Ryan\'s iPhone', 'Maya\'s Nokia', 'Chris\'s LG', 'Zoe\'s Oppo'
    ];
    
    const hash = phoneNumber.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return names[Math.abs(hash) % names.length];
  }
}

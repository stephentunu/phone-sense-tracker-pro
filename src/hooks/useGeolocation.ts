
import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  isLoading: boolean;
  timestamp: number | null;
  locationName: string | null;
  heading: number | null;
  speed: number | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
}

export function useGeolocation(options?: PositionOptions) {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    isLoading: true,
    timestamp: null,
    locationName: null,
    heading: null,
    speed: null,
    altitude: null,
    altitudeAccuracy: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({ 
        ...prev, 
        error: 'Geolocation is not supported by your browser',
        isLoading: false
      }));
      return;
    }

  const successHandler = async (position: GeolocationPosition) => {
    const coords = position.coords;
    
    // Log actual coordinate data for debugging
    console.log('Geolocation success - Raw coordinates:', {
      latitude: coords.latitude,
      longitude: coords.longitude,
      accuracy: coords.accuracy,
      heading: coords.heading,
      speed: coords.speed,
      altitude: coords.altitude,
      timestamp: position.timestamp
    });
    
    // Validate coordinates are real numbers
    if (!coords.latitude || !coords.longitude || 
        typeof coords.latitude !== 'number' || 
        typeof coords.longitude !== 'number') {
      console.error('Invalid coordinates received:', coords);
      setState(prev => ({ 
        ...prev, 
        error: 'Invalid location coordinates received',
        isLoading: false
      }));
      return;
    }
    
    // Check if accuracy is reasonable for phone tracking (should be under 100m for good tracking)
    if (coords.accuracy > 100) {
      console.warn(`Low accuracy warning: ±${coords.accuracy.toFixed(1)}m - continuing but may be inaccurate`);
    }
    
    // Set initial state with coordinates
    setState({
      latitude: coords.latitude,
      longitude: coords.longitude,
      accuracy: coords.accuracy,
      error: null,
      isLoading: false,
      timestamp: position.timestamp,
      locationName: `Location ${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`,
      heading: coords.heading,
      speed: coords.speed,
      altitude: coords.altitude,
      altitudeAccuracy: coords.altitudeAccuracy,
    });
    
    // Get actual location name using reverse geocoding (async)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json&addressdetails=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.address) {
          const address = data.address;
          
          // Build a readable location name
          const parts = [];
          if (address.house_number) {
            parts.push(address.house_number);
          }
          if (address.road) {
            parts.push(address.road);
          }
          if (address.neighbourhood || address.suburb || address.city_district) {
            parts.push(address.neighbourhood || address.suburb || address.city_district);
          }
          if (address.city || address.town || address.village) {
            parts.push(address.city || address.town || address.village);
          }
          if (address.country) {
            parts.push(address.country);
          }
          
          if (parts.length > 0) {
            const locationName = parts.slice(0, 3).join(', '); // Take first 3 most relevant parts
            setState(prev => ({
              ...prev,
              locationName: locationName
            }));
          }
        }
      }
    } catch (error) {
      console.log('Reverse geocoding failed, using coordinates:', error);
    }
  };

    const errorHandler = (error: GeolocationPositionError) => {
      console.error('Geolocation error:', error);
      let errorMessage = 'Location access denied';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied. Please enable location permissions.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information unavailable. Please check your GPS.';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out. Please try again.';
          break;
        default:
          errorMessage = 'Unknown location error occurred.';
      }
      
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        isLoading: false
      }));
    };

    // Optimized options for real-world phone tracking accuracy
    const geoOptions: PositionOptions = {
      enableHighAccuracy: true,      // Use GPS when available
      timeout: 15000,                // Longer timeout for better accuracy
      maximumAge: 0,                 // Always get fresh location
      ...options
    };

    // Get initial position
    setState(prev => ({ ...prev, isLoading: true }));
    
    navigator.geolocation.getCurrentPosition(
      successHandler,
      errorHandler,
      geoOptions
    );

    // Set up continuous tracking optimized for phone tracking
    const watchId = navigator.geolocation.watchPosition(
      successHandler,
      errorHandler,
      {
        enableHighAccuracy: true,      // Use GPS when available  
        timeout: 15000,                // Allow time for GPS lock
        maximumAge: 0,                 // Always get fresh location for tracking
        ...options
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []); // Empty dependency array to prevent infinite loops

  return state;
}

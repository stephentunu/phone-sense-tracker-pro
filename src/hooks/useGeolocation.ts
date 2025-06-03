
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

    const successHandler = (position: GeolocationPosition) => {
      console.log('Geolocation success:', position.coords);
      
      // Simple location name based on coordinates
      const locationName = `Location ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;

      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        error: null,
        isLoading: false,
        timestamp: position.timestamp,
        locationName: locationName,
        heading: position.coords.heading,
        speed: position.coords.speed,
        altitude: position.coords.altitude,
        altitudeAccuracy: position.coords.altitudeAccuracy,
      });
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

    // High accuracy options for real-time tracking
    const geoOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000,
      ...options
    };

    // Get initial position
    setState(prev => ({ ...prev, isLoading: true }));
    
    navigator.geolocation.getCurrentPosition(
      successHandler,
      errorHandler,
      geoOptions
    );

    // Set up continuous tracking for real-time updates
    const watchId = navigator.geolocation.watchPosition(
      successHandler,
      errorHandler,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
        ...options
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []); // Empty dependency array to prevent infinite loops

  return state;
}

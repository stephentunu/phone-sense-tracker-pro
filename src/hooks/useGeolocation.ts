
import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  isLoading: boolean;
  timestamp: number | null;
}

export function useGeolocation(options?: PositionOptions) {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    isLoading: true,
    timestamp: null
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
      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        error: null,
        isLoading: false,
        timestamp: position.timestamp
      });
    };

    const errorHandler = (error: GeolocationPositionError) => {
      console.error('Geolocation error:', error);
      setState(prev => ({ 
        ...prev, 
        error: error.message,
        isLoading: false
      }));
    };

    // Get position immediately
    setState(prev => ({ ...prev, isLoading: true }));
    
    navigator.geolocation.getCurrentPosition(
      successHandler,
      errorHandler,
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
        ...options
      }
    );

    // Then set up continuous watching
    const watchId = navigator.geolocation.watchPosition(
      successHandler,
      errorHandler,
      { 
        enableHighAccuracy: true,
        ...options
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [options]);

  return state;
}


import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  isLoading: boolean;
  timestamp: number | null;
  locationName: string | null;
}

export function useGeolocation(options?: PositionOptions) {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    isLoading: true,
    timestamp: null,
    locationName: null
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
      console.log('Geolocation success:', position.coords);
      
      // Get location name using reverse geocoding
      let locationName = null;
      try {
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=6d0e711d72d74daeb2b0bfd2a5cdfdba`
        );
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          const components = result.components;
          
          // Build location name from components
          const city = components.city || components.town || components.village || components.county;
          const state = components.state;
          const country = components.country;
          
          const parts = [];
          if (city) parts.push(city);
          if (state && (!city || city !== state)) parts.push(state);
          if (country) parts.push(country);
          
          locationName = parts.join(', ');
        }
      } catch (error) {
        console.error('Error fetching location name:', error);
      }

      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        error: null,
        isLoading: false,
        timestamp: position.timestamp,
        locationName: locationName
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


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
      
      // Get location name using reverse geocoding with higher accuracy
      let locationName = null;
      try {
        // Using a more reliable reverse geocoding service with better global coverage
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=18&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'PhoneTracker/1.0' // Required by Nominatim ToS
            }
          }
        );
        
        const data = await response.json();
        if (data && data.display_name) {
          // Extract city, state, country from OpenStreetMap response
          const address = data.address;
          
          // Build location name from components with priority for African locations
          const city = address.city || address.town || address.village || address.hamlet || address.suburb;
          const state = address.state || address.county;
          const country = address.country;
          
          const parts = [];
          if (city) parts.push(city);
          if (state && (!city || city !== state)) parts.push(state);
          if (country) parts.push(country);
          
          locationName = parts.join(', ');
          console.log('Location determined:', locationName, 'Full data:', data);
        }
      } catch (error) {
        console.error('Error fetching location name:', error);
        // Fallback to browser-provided location info if available
        try {
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=6d0e711d72d74daeb2b0bfd2a5cdfdba`
          );
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            const result = data.results[0];
            locationName = result.formatted;
            console.log('Fallback location:', locationName);
          }
        } catch (fallbackError) {
          console.error('Fallback location error:', fallbackError);
        }
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

    // Get position immediately with high accuracy
    setState(prev => ({ ...prev, isLoading: true }));
    
    navigator.geolocation.getCurrentPosition(
      successHandler,
      errorHandler,
      { 
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
        ...options
      }
    );

    // Then set up continuous watching with high accuracy
    const watchId = navigator.geolocation.watchPosition(
      successHandler,
      errorHandler,
      { 
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
        ...options
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [options]);

  return state;
}

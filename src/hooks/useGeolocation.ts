
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
      console.log('High-accuracy geolocation success:', position.coords);
      
      // Get location name using multiple reverse geocoding services for better accuracy
      let locationName = null;
      try {
        // Primary service - OpenStreetMap Nominatim (more detailed for global locations)
        const nominatimResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=18&addressdetails=1&extratags=1`,
          {
            headers: {
              'User-Agent': 'PhoneTracker/1.0'
            }
          }
        );
        
        if (nominatimResponse.ok) {
          const data = await nominatimResponse.json();
          if (data && data.display_name) {
            const address = data.address;
            
            // Build more accurate location name with house number, street, area
            const parts = [];
            
            // Add house number and street for precise location
            if (address.house_number && address.road) {
              parts.push(`${address.house_number} ${address.road}`);
            } else if (address.road) {
              parts.push(address.road);
            }
            
            // Add area/suburb for context
            if (address.suburb || address.neighbourhood) {
              parts.push(address.suburb || address.neighbourhood);
            }
            
            // Add city/town
            const city = address.city || address.town || address.village || address.hamlet;
            if (city) parts.push(city);
            
            // Add state/county and country
            const state = address.state || address.county;
            if (state) parts.push(state);
            if (address.country) parts.push(address.country);
            
            locationName = parts.join(', ');
            console.log('Accurate location determined:', locationName);
          }
        }
        
        // Fallback to OpenCage for additional accuracy if primary fails
        if (!locationName) {
          try {
            const opencageResponse = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=6d0e711d72d74daeb2b0bfd2a5cdfdba&language=en&pretty=1`
            );
            const opencageData = await opencageResponse.json();
            if (opencageData.results && opencageData.results.length > 0) {
              locationName = opencageData.results[0].formatted;
              console.log('Fallback location determined:', locationName);
            }
          } catch (fallbackError) {
            console.error('Fallback geocoding failed:', fallbackError);
          }
        }
        
      } catch (error) {
        console.error('Error fetching accurate location name:', error);
      }

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
      console.error('High-accuracy geolocation error:', error);
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

    // Enhanced geolocation options for maximum accuracy
    const highAccuracyOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 20000, // Increased timeout for better accuracy
      maximumAge: 0, // Always get fresh location
      ...options
    };

    // Get initial high-accuracy position
    setState(prev => ({ ...prev, isLoading: true }));
    
    navigator.geolocation.getCurrentPosition(
      successHandler,
      errorHandler,
      highAccuracyOptions
    );

    // Set up continuous high-accuracy tracking for real-time updates
    const watchId = navigator.geolocation.watchPosition(
      successHandler,
      errorHandler,
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000, // Update every 5 seconds max
        ...options
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [options]);

  return state;
}

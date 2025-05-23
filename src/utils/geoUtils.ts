
/**
 * Utility functions for geolocation calculations
 */

/**
 * Calculate the distance between two coordinates in kilometers using the Haversine formula
 */
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
}

/**
 * Convert degrees to radians
 */
function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

/**
 * Format distance in a human-readable format
 */
export function formatDistance(distance: number): string {
  if (distance < 1) {
    // If less than 1 km, show in meters
    return `${Math.round(distance * 1000)} m`;
  } else {
    // Show in kilometers with one decimal place
    return `${distance.toFixed(1)} km`;
  }
}

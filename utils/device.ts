
/**
 * Generates or retrieves a persistent unique identifier for this device.
 * Used for anonymous rate-limiting and cost controls.
 */
export const getDeviceId = (): string => {
  if (typeof window === 'undefined') return 'server';
  
  let deviceId = localStorage.getItem('nmp_device_id');
  
  if (!deviceId) {
    // Basic UUID-like generator for browser compatibility
    deviceId = 'nmp_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('nmp_device_id', deviceId);
  }
  
  return deviceId;
};

import { useState, useEffect, useCallback } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const checkStatus = useCallback(async () => {
    // If the browser natively thinks we are offline, trust it.
    if (!navigator.onLine) {
      setIsOnline(false);
      return;
    }
    
    try {
      // Fetch a public resource to verify actual internet access (especially when testing on localhost)
      await fetch('https://www.google.com/favicon.ico?rand=' + Date.now(), { 
        method: 'HEAD', 
        mode: 'no-cors',
        cache: 'no-store',
      });
      // If fetch completes without throwing, we have internet access
      setIsOnline(true);
    } catch (error) {
      // If fetch fails (e.g. network error, no route to host, DNS failure)
      setIsOnline(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('online', checkStatus);
    window.addEventListener('offline', () => setIsOnline(false));

    // Periodically check every 10 seconds to catch silent disconnections
    const interval = setInterval(checkStatus, 10000);
    
    // Check once on mount
    checkStatus();

    return () => {
      window.removeEventListener('online', checkStatus);
      window.removeEventListener('offline', () => setIsOnline(false));
      clearInterval(interval);
    };
  }, [checkStatus]);

  return isOnline;
}

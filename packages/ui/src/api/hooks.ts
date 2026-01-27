import { useState, useEffect } from 'react';
import { fetchActivities, type Activity } from './strava';
import { APIError } from './client';

export interface UseActivitiesResult {
  activities: Activity[] | null;
  loading: boolean;
  error: string | null;
  isUnauthorized: boolean;
  refetch: () => void;
}

/**
 * Hook to fetch and manage Strava activities.
 */
export function useActivities(): UseActivitiesResult {
  const [activities, setActivities] = useState<Activity[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [refetchCount, setRefetchCount] = useState(0);

  useEffect(() => {
    // Check if we're in logout state - skip API call
    const logoutFlag = sessionStorage.getItem('logout');
    const urlParams = new URLSearchParams(window.location.search);
    const hasLogoutParam = urlParams.has('logout');
    
    if (logoutFlag || hasLogoutParam) {
      // Don't fetch activities - show unauthorized state
      setLoading(false);
      setError(null);
      setIsUnauthorized(true);
      setActivities(null);
      return;
    }

    let mounted = true;

    const loadActivities = async () => {
      setLoading(true);
      setError(null);
      setIsUnauthorized(false);
      
      try {
        const data = await fetchActivities();
        if (mounted) {
          setActivities(data);
          setIsUnauthorized(false);
        }
      } catch (err) {
        if (mounted) {
          // For any error (including 401), treat as unauthorized - don't show error UI
          setError(null);
          setIsUnauthorized(true);
          setActivities(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadActivities();

    return () => {
      mounted = false;
    };
  }, [refetchCount]);

  const refetch = () => setRefetchCount((c) => c + 1);

  return { activities, loading, error, isUnauthorized, refetch };
}

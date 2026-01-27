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
          if (err instanceof APIError) {
            // For 401 Unauthorized, treat as "not logged in" not an error
            if (err.status === 401) {
              setError(null);
              setIsUnauthorized(true);
              setActivities(null);
            } else {
              setError(err.message);
              setIsUnauthorized(false);
            }
          } else {
            setError('Failed to fetch activities');
            setIsUnauthorized(false);
          }
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

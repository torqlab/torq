import { useState, useEffect } from 'react';
import { fetchActivities, type Activity } from './strava';
import { APIError } from './client';

export interface UseActivitiesResult {
  activities: Activity[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch and manage Strava activities.
 */
export function useActivities(): UseActivitiesResult {
  const [activities, setActivities] = useState<Activity[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchCount, setRefetchCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    const loadActivities = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchActivities();
        if (mounted) {
          setActivities(data);
        }
      } catch (err) {
        if (mounted) {
          if (err instanceof APIError) {
            setError(err.message);
          } else {
            setError('Failed to fetch activities');
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

  return { activities, loading, error, refetch };
}

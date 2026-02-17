import { apiRequest } from '../client';
import { Input, Response } from './types';

/**
 * Fetch specific activity image generation prompt by activity ID.
 * @param {Input} input - Input parameters.
 * @param {string} input.activityId - Activity ID.
 * @param {StravaActivitySignals} input.activitySignals - Activity signals.
 * @returns {Promise<string | null>} Activity image generation prompt.
 */
const fetchActivityImageGenerationPrompt = async ({
  activityId,
  activitySignals,
}: Input): Promise<string | null> => {
  const signalsBase64 = btoa(JSON.stringify(activitySignals));
  const response = await apiRequest<Response>(
    `/strava/activities/${activityId}/image-generator/prompt?signals=${signalsBase64}`,
  );

  return response.prompt || null;
};

export default fetchActivityImageGenerationPrompt;

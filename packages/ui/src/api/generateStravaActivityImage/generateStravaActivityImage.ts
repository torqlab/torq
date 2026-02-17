import { apiRequest } from '../client';
import { Response, ResponseImage } from './types';

/**
 * Generates a Strava activity image.
 * @param {string} activityId - The ID of the activity.
 * @returns {Promise<ResponseImage | null>} The generated image data or null if not available.
 */
const generateStravaActivityImage = async (
  activityId: string,
): Promise<ResponseImage | null> => {
  const { image } = await apiRequest<Response>(
    `/activity-image-generator/${activityId}`,
  );

  return image ?? null;
}

export default generateStravaActivityImage;

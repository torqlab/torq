import { Status } from '../../../types';
import { EMOJIS } from '../constants';

/**
 * Gets the corresponding emoji for a given status. 
 * @param {Status} status - The current status of the content.
 * @returns {string} The emoji representing the status.
 */
const getStatusEmoji = (status: Status) => {
  switch (status) {
    case 'loading': {
      return {
        emoji: EMOJIS.LOADING,
        animation: 'spin 1s linear infinite',
      };
    }
    case 'loaded': {
      return {
        emoji: EMOJIS.DONE,
      };
    }
    case 'error': {
      return {
        emoji: EMOJIS.PENDING,
      };
    }
    case 'pending': {
      return {
        emoji: EMOJIS.PENDING,
        animation: 'flip 2s ease-in-out infinite',
      };
    }
    default: {
      return {
        emoji: EMOJIS.PENDING,
      };
    }
  }
};

export default getStatusEmoji;

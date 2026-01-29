/**
 * DIAL API response structure for image generation.
 */
export type DialImageResponse = {
  /** Error information if request failed. */
  error?: {
    /** Error message. */
    message?: string;
  };
  /** Array of completion choices. */
  choices?: Array<{
    /** Message content. */
    message?: {
      /** Custom content with attachments. */
      custom_content?: {
        /** Array of image attachments. */
        attachments?: Array<{
          /** Attachment type. */
          type?: string;
          /** Attachment title. */
          title?: string;
          /** URL to the image in DIAL storage. */
          url?: string;
          /** Base64-encoded image data. */
          data?: string;
        }>;
      };
    };
  }>;
};

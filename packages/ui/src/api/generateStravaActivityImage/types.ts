export interface Input {
  activityId: string;
  prompt: string;
}

export interface ResponseImage {
  imageData?: string;
  usedFallback?: boolean;
  retriesPerformed?: number;
}

export interface Response {
  image?: ResponseImage;
}

import { StravaActivitySignalsElevation, StravaActivitySignalsIntensity } from '../types';

export interface Input {
  activityType?: string;
  tags?: string[];
  elevation?: StravaActivitySignalsElevation;
  intensity?: StravaActivitySignalsIntensity;
}

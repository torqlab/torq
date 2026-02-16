import {
  CLASSIFICATION_SUBJECT_DEFAULT,
  ACTIVITY_TYPES_TO_CLASSIFICATION_SUBJECTS,
} from '../constants';
import { StravaActivitySignalsSubject } from '../types';

/**
 * Classifies the activity subjest.
 * @param {string} activityType - Strava activity type.
 * @returns {StravaActivitySignalsSubject} Activity subjest classifications.
 */
const classifySubject = (activityType: string): StravaActivitySignalsSubject =>
  ACTIVITY_TYPES_TO_CLASSIFICATION_SUBJECTS[activityType ?? 'Run'] ??
  CLASSIFICATION_SUBJECT_DEFAULT;

export default classifySubject;

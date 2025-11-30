export type FeedingType = 'left' | 'right' | 'bottle';

export interface Feeding {
  id: string;
  type: FeedingType;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  quantityMl?: number;
}

export interface ActiveSession {
  type: FeedingType;
  startTime: string;
}

export interface Settings {
  intervalMinutes: number;
  nightNotificationsEnabled: boolean;
  babyName: string;
  babyBirthDate: string;
}

export interface BabyAge {
  months: number;
  days: number;
}

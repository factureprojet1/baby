import { BabyAge, Feeding } from '@/types/feeding';

export function calculateBabyAge(birthDate: string): BabyAge {
  const birth = new Date(birthDate);
  const now = new Date();

  let months = (now.getFullYear() - birth.getFullYear()) * 12;
  months -= birth.getMonth();
  months += now.getMonth();

  const dayDiff = now.getDate() - birth.getDate();
  let days = dayDiff;

  if (dayDiff < 0) {
    months--;
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days = lastMonth.getDate() + dayDiff;
  }

  if (months < 0) {
    months = 0;
    days = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
  }

  return { months, days };
}

export function formatBabyAge(age: BabyAge): string {
  if (age.months === 0) {
    return `${age.days} day${age.days !== 1 ? 's' : ''}`;
  }
  return `${age.months} month${age.months !== 1 ? 's' : ''} ${age.days} day${age.days !== 1 ? 's' : ''}`;
}

export function calculateDuration(startTime: string, endTime: string): number {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  return Math.round((end - start) / (1000 * 60));
}

export function calculateNextFeedingTime(lastFeedingTime: string, intervalMinutes: number): Date {
  const lastTime = new Date(lastFeedingTime);
  return new Date(lastTime.getTime() + intervalMinutes * 60 * 1000);
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

export function formatDateTime(date: Date): string {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}min`;
}

export function getNextSuggestedSide(lastSide: 'left' | 'right'): 'left' | 'right' {
  return lastSide === 'left' ? 'right' : 'left';
}

export function calculateTotalFeedingTime(feedings: Feeding[]): number {
  return feedings.reduce((total, feeding) => total + feeding.durationMinutes, 0);
}

export function filterFeedingsByDate(feedings: Feeding[], filter: 'today' | 'yesterday' | 'week'): Feeding[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  return feedings.filter(feeding => {
    const feedingDate = new Date(feeding.endTime);

    if (filter === 'today') {
      return feedingDate >= today;
    } else if (filter === 'yesterday') {
      return feedingDate >= yesterday && feedingDate < today;
    } else {
      return feedingDate >= weekAgo;
    }
  });
}

export function shouldScheduleNotification(
  nextFeedingTime: Date,
  nightNotificationsEnabled: boolean
): boolean {
  if (nightNotificationsEnabled) {
    return true;
  }

  const hours = nextFeedingTime.getHours();
  return hours >= 7 && hours < 23;
}

export function adjustForNightMode(
  nextFeedingTime: Date,
  nightNotificationsEnabled: boolean
): Date {
  if (nightNotificationsEnabled) {
    return nextFeedingTime;
  }

  const hours = nextFeedingTime.getHours();

  if (hours >= 23 || hours < 7) {
    const adjusted = new Date(nextFeedingTime);
    adjusted.setHours(7, 0, 0, 0);
    if (hours >= 23) {
      adjusted.setDate(adjusted.getDate() + 1);
    }
    return adjusted;
  }

  return nextFeedingTime;
}

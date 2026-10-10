import type { Forecast, Hour } from './contracts';
import { localTime } from './weather';

export type CommunityHour = { start: number; end: number; forecast: Hour | null };

/** Keep the current partial hour and expose missing coverage through local midnight. */
export function remainingCommunityHours(forecast: Forecast, now = Date.now()): CommunityHour[] {
  const local = localTime(new Date(now).toISOString());
  if (forecast.date !== local.date) return [];
  const firstHour = Math.floor(local.minute / 60) * 60;
  return Array.from({ length: (1440 - firstHour) / 60 }, (_, index) => {
    const start = firstHour + index * 60;
    return {
      start,
      end: start + 60,
      forecast:
        forecast.hours.find((hour) => hour.start === start && hour.end === start + 60) || null,
    };
  });
}

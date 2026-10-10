import { z } from 'zod';
import { apiError, readBody } from '@/lib/http';
import { getForecast } from '@/lib/weather';
import { miamiDate } from '@/lib/contracts';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const { date } = z
      .object({
        date: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .refine(
            (value) => value >= miamiDate() && value <= miamiDate(6),
            'Choose today or a date in the next six days.',
          ),
      })
      .parse(await readBody(request));
    return Response.json(await getForecast(date));
  } catch (error) {
    return apiError(error);
  }
}

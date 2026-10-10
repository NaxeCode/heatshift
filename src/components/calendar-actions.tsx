'use client';
import { useMemo } from 'react';
import { CalendarPlus, Download, ArrowUpRight } from 'lucide-react';
import { type Briefing, type Comparison } from '@/lib/contracts';
import { createCalendarEvent, googleCalendarUrl, toICalendar } from '@/lib/calendar';

export default function CalendarActions({
  result,
  briefing,
  language,
}: {
  result: Comparison;
  briefing: Briefing;
  language: 'english' | 'spanish';
}) {
  const calendar = useMemo(() => {
    try {
      return { event: createCalendarEvent(result, briefing, language), error: '' };
    } catch (error) {
      return {
        event: null,
        error: error instanceof Error ? error.message : 'Check the schedule before exporting.',
      };
    }
  }, [result, briefing, language]);
  function download() {
    if (!calendar.event) return;
    const url = URL.createObjectURL(
      new Blob([toICalendar(calendar.event)], { type: 'text/calendar;charset=utf-8' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = `kruu-shift-${result.plan.date}-${language}.ics`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <section className="calendar-share" aria-label="Add shift to calendar">
      <div>
        <h4>
          <CalendarPlus size={19} /> Take the plan with you.
        </h4>
        <p>
          One event for the paid shift, with tasks, breaks, and your{' '}
          {language === 'spanish' ? 'Spanish' : 'English'} briefing. Times follow Miami.
        </p>
      </div>
      {calendar.event ? (
        <div className="calendar-actions">
          <button className="secondary" onClick={download}>
            <Download size={17} /> Download calendar (.ics)
          </button>
          <a
            className="primary"
            href={googleCalendarUrl(calendar.event)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <CalendarPlus size={17} /> Add to Google Calendar <ArrowUpRight size={15} />
          </a>
        </div>
      ) : (
        <p role="alert">{calendar.error}</p>
      )}
      <p className="calendar-note">
        Review and save in your calendar. This is a snapshot; later plan changes won’t sync
        automatically.
      </p>
    </section>
  );
}

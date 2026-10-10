'use client';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Github,
  LoaderCircle,
  MapPin,
  ShieldCheck,
  Sparkles,
  Sunrise,
  ThermometerSun,
  Clock3,
  CalendarDays,
  ClipboardList,
} from 'lucide-react';
import {
  Briefing,
  DraftTask,
  Extraction,
  SAMPLE,
  extractionSchema,
  miamiDate,
  planSchema,
} from '@/lib/contracts';
import TimeField from './time-field';
import WeatherPanel from './weather-panel';
import Brand from './brand';
import { crewBriefText } from '@/lib/presentation';
import TaskEditor from './task-editor';
import ComparisonView, { type Envelope } from './comparison-view';
const initialShift = {
  shiftStart: '08:00',
  shiftEnd: '16:00',
  breakStart: '12:00',
  breakEnd: '12:30',
};
async function post<T>(path: string, payload: unknown): Promise<T> {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(65000),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
  return data;
}
export default function Planner() {
  const [workOrder, setWorkOrder] = useState(SAMPLE),
    [date, setDate] = useState(''),
    [shift, setShift] = useState(initialShift);
  const [tasks, setTasks] = useState<DraftTask[]>([]),
    [questions, setQuestions] = useState<string[]>([]),
    [confirmed, setConfirmed] = useState(false);
  const [reviewExpanded, setReviewExpanded] = useState(false);
  const [inputExpanded, setInputExpanded] = useState(true);
  const [envelope, setEnvelope] = useState<Envelope | null>(null),
    [briefing, setBriefing] = useState<Briefing | null>(null),
    [language, setLanguage] = useState<'english' | 'spanish'>('english');
  const [busy, setBusy] = useState<string | null>(null),
    [error, setError] = useState(''),
    [copied, setCopied] = useState(false),
    [loaded, setLoaded] = useState(false),
    [draftSaved, setDraftSaved] = useState(false);
  const reviewRef = useRef<HTMLElement>(null),
    resultRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);
  function scrollTo(element: HTMLElement | null) {
    element?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
      block: 'start',
    });
  }
  useEffect(() => {
    setDate(miamiDate(1));
    try {
      const saved = JSON.parse(localStorage.getItem('heatshift-draft-v1') || 'null');
      if (saved && typeof saved.workOrder === 'string' && saved.workOrder.length <= 6000)
        setWorkOrder(saved.workOrder);
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem('heatshift-draft-v1', JSON.stringify({ workOrder }));
      setDraftSaved(true);
    } catch {
      setDraftSaved(false);
    }
  }, [workOrder, loaded]);
  function invalidate() {
    setEnvelope(null);
    setBriefing(null);
    setConfirmed(false);
    setError('');
  }
  async function run(action: string, fn: () => Promise<void>) {
    setBusy(action);
    setError('');
    try {
      await fn();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.name === 'TimeoutError'
            ? 'The request took too long. Please try again.'
            : e.message
          : 'Please try again.',
      );
    } finally {
      setBusy(null);
    }
  }
  function extract() {
    void run('extract', async () => {
      const data = await post<Extraction & { model: string }>('/api/extract', {
        workOrder,
        ...shift,
      });
      const parsed = extractionSchema.parse(data);
      setTasks(parsed.tasks);
      setQuestions(parsed.questions);
      invalidate();
      setInputExpanded(false);
      setTimeout(() => scrollTo(reviewRef.current), 100);
    });
  }
  function compare() {
    void run('plan', async () => {
      const parsed = planSchema.safeParse({ date, ...shift, tasks });
      if (!parsed.success)
        throw new Error(
          'Confirm every task’s duration, environment, original start, and all shift times before comparing.',
        );
      const data = await post<Envelope>('/api/plan', parsed.data);
      setEnvelope(data);
      setBriefing(null);
      setReviewExpanded(false);
      setTimeout(() => scrollTo(resultRef.current), 100);
    });
  }
  function prepareBrief() {
    void run('brief', async () => {
      const data = await post<{ briefing: Briefing }>('/api/brief', envelope);
      setBriefing(data.briefing);
    });
  }
  async function copyBrief() {
    if (!briefing || !envelope) return;
    try {
      await navigator.clipboard.writeText(
        crewBriefText(envelope.result.plan.date, language, briefing[language]),
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Copy is unavailable in this browser. Select the briefing text or download it.');
    }
  }
  function downloadBrief() {
    if (!briefing || !envelope) return;
    const url = URL.createObjectURL(
      new Blob([crewBriefText(envelope.result.plan.date, language, briefing[language])], {
        type: 'text/plain;charset=utf-8',
      }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = `kruu-briefing-${date}-${language}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }
  const stage = envelope ? 3 : tasks.length ? 2 : 1;
  return (
    <>
      <a className="skip-link" href="#workspace">
        Skip to planner
      </a>
      <header className="topbar">
        <Brand />
        <div className="header-right">
          <a href="/community">Miami heat guide</a>
          <a
            href="https://github.com/NaxeCode/heatshift"
            target="_blank"
            rel="noreferrer"
            aria-label="View open-source project on GitHub"
          >
            <Github size={20} />
            <span>Open source</span>
            <ArrowUpRight size={14} />
          </a>
        </div>
      </header>
      <main id="workspace" className={tasks.length ? 'has-plan' : undefined}>
        <section className="page-intro">
          <div>
            <div className="eyebrow">THE CREW PLANNER</div>
            <h1>
              Plan the work.
              <br />
              <span>Work around the heat.</span>
            </h1>
            <p>
              A little planning. A better-timed day.
              <br className="desktop-break" /> Same crew, same work, with the forecast in view.
            </p>
          </div>
          <div className="day-label">
            <CalendarDays size={18} />
            <span>
              YOUR NEXT WORKDAY
              <strong>
                {date
                  ? new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'Plan ahead'}
              </strong>
            </span>
          </div>
        </section>
        <nav className="steps" aria-label="Planner progress">
          {[
            ['01', 'Add your work'],
            ['02', 'Confirm the details'],
            ['03', 'Compare & brief'],
          ].map(([n, title], i) => (
            <button
              type="button"
              className={stage === i + 1 ? 'active' : stage > i + 1 ? 'done' : ''}
              key={n}
              aria-current={stage === i + 1 ? 'step' : undefined}
              disabled={!!busy || i + 1 > stage}
              onClick={() => {
                if (i === 0) {
                  setInputExpanded(true);
                  scrollTo(inputRef.current);
                } else if (i === 1) {
                  setReviewExpanded(true);
                  setTimeout(() => scrollTo(reviewRef.current), 0);
                } else scrollTo(resultRef.current);
              }}
            >
              <span>{stage > i + 1 ? <Check size={15} /> : n}</span>
              {title}
              {i < 2 && <ArrowRight size={16} />}
            </button>
          ))}
        </nav>
        {error && (
          <div role="alert" className="error-box" ref={errorRef} tabIndex={-1}>
            <strong>Let’s resolve this before continuing.</strong>
            <p>{error}</p>
          </div>
        )}
        <div className="workspace-grid">
          <section className="input-panel" ref={inputRef} aria-label="Work order and shift">
            <div className="panel-heading work-ahead-heading">
              <div className="work-ahead-kicker">
                <span>YOUR CREW'S DAY</span>
                <span className="work-ahead-limit">UP TO 4 TASKS</span>
              </div>
              <div className="work-ahead-heading-main">
                <span className="mini-icon" aria-hidden="true">
                  <ClipboardList size={21} />
                </span>
                <div>
                  <h2>The work ahead.</h2>
                  <p>
                    Set the hours, then describe the work. You will confirm each task before
                    comparing plans.
                  </p>
                </div>
              </div>
            </div>
            {tasks.length > 0 && (
              <button
                className="input-toggle secondary"
                aria-expanded={inputExpanded}
                aria-controls="input-fields"
                onClick={() => setInputExpanded((value) => !value)}
              >
                {inputExpanded ? 'Collapse work order' : 'Edit work order & shift'}
                <ChevronDown size={16} />
              </button>
            )}
            {!inputExpanded && (
              <div className="order-summary">
                <span>
                  <Clock3 size={17} />
                  {shift.shiftStart}–{shift.shiftEnd}
                </span>
                <span>
                  {tasks.length} {confirmed ? 'confirmed tasks' : 'tasks to review'}
                </span>
                <p>Your work order and shift are saved here. Editing them resets the comparison.</p>
              </div>
            )}
            <fieldset
              disabled={!!busy}
              className="input-fieldset"
              id="input-fields"
              hidden={!inputExpanded}
            >
              <section className="work-ahead-section shift-card" aria-labelledby="shift-card-title">
                <div className="work-ahead-section-heading">
                  <div>
                    <span className="work-ahead-eyebrow">SHIFT DETAILS</span>
                    <h3 id="shift-card-title">When is the crew working?</h3>
                  </div>
                  <Clock3 size={20} aria-hidden="true" />
                </div>
                <div className="shift-settings">
                  <label className="field date-field">
                    <span>Work date</span>
                    <input
                      type="date"
                      value={date}
                      min={loaded ? miamiDate() : undefined}
                      max={loaded ? miamiDate(6) : undefined}
                      onChange={(e) => {
                        setDate(e.target.value);
                        invalidate();
                      }}
                    />
                  </label>
                  <div className="shift-grid">
                    <TimeField
                      label="Paid shift starts"
                      value={shift.shiftStart}
                      onChange={(v) => {
                        setShift((s) => ({ ...s, shiftStart: v! }));
                        invalidate();
                      }}
                    />
                    <TimeField
                      label="Paid shift ends"
                      value={shift.shiftEnd}
                      onChange={(v) => {
                        setShift((s) => ({ ...s, shiftEnd: v! }));
                        invalidate();
                      }}
                    />
                    <TimeField
                      label="Fixed break starts"
                      value={shift.breakStart}
                      onChange={(v) => {
                        setShift((s) => ({ ...s, breakStart: v! }));
                        invalidate();
                      }}
                    />
                    <TimeField
                      label="Fixed break ends"
                      value={shift.breakEnd}
                      onChange={(v) => {
                        setShift((s) => ({ ...s, breakEnd: v! }));
                        invalidate();
                      }}
                    />
                  </div>
                </div>
              </section>
              <section
                className="work-ahead-section work-order-card"
                aria-labelledby="work-order-title"
              >
                <div className="work-ahead-section-heading">
                  <div>
                    <span className="work-ahead-eyebrow">WORK ORDER</span>
                    <h3 id="work-order-title">What needs to get done?</h3>
                  </div>
                  <ClipboardList size={20} aria-hidden="true" />
                </div>
                <p className="work-order-intro">
                  Paste the work order or edit the fictional example. Keep the details your crew
                  must work around.
                </p>
                <div className="work-order-guide" aria-label="Useful details to include">
                  <span>
                    <Check size={15} aria-hidden="true" />
                    Task and time
                  </span>
                  <span>
                    <Check size={15} aria-hidden="true" />
                    Inside or outside
                  </span>
                  <span>
                    <Check size={15} aria-hidden="true" />
                    Fixed commitments
                  </span>
                </div>
                <div className="work-order-label">
                  <label htmlFor="work-order">Describe the work</label>
                  <button
                    className="text-button"
                    onClick={() => {
                      setWorkOrder(SAMPLE);
                      setTasks([]);
                      setQuestions([]);
                      invalidate();
                    }}
                  >
                    Use example
                  </button>
                </div>
                <textarea
                  id="work-order"
                  aria-describedby="work-order-help work-order-kind"
                  value={workOrder}
                  maxLength={6000}
                  rows={8}
                  onChange={(e) => {
                    setWorkOrder(e.target.value);
                    setTasks([]);
                    setQuestions([]);
                    invalidate();
                  }}
                />
                <div className="work-order-meta" id="work-order-kind">
                  <span>
                    {workOrder === SAMPLE ? 'Editable fictional example' : 'Your work order'}
                  </span>
                  <span>{workOrder.length.toLocaleString()} / 6,000</span>
                </div>
                <p className="input-help" id="work-order-help">
                  Include each task’s duration, original start, indoor/outdoor setting, and any
                  constraints. Leave out personal details.
                </p>
                <button
                  className="primary extract-button"
                  onClick={extract}
                  disabled={!!busy || workOrder.trim().length < 20 || !date}
                >
                  {busy === 'extract' ? (
                    <LoaderCircle className="spin" size={18} />
                  ) : (
                    <Sparkles size={18} />
                  )}{' '}
                  {busy === 'extract'
                    ? 'Gemma is reading your work order…'
                    : tasks.length
                      ? 'Extract tasks again'
                      : 'Review tasks'}
                  {busy !== 'extract' && <ArrowRight size={17} />}
                </button>
                <div className="model-credit">
                  Powered by Gemma 4 <span>·</span>{' '}
                  {draftSaved ? 'Draft saved on this device' : 'Private server connection'}
                </div>
              </section>
            </fieldset>
            <div className="promise">
              <ShieldCheck size={18} />
              <p>Your crew’s work, break, and paid shift stay intact.</p>
            </div>
          </section>
          <aside className="weather-column-wrap">
            <WeatherPanel
              date={date}
              shiftStart={shift.shiftStart}
              shiftEnd={shift.shiftEnd}
              verifiedForecast={envelope?.result.forecast}
            />
            <div className="planning-note">
              <ShieldCheck size={21} />
              <div>
                <h3>A shift that stays yours.</h3>
                <p>
                  Tasks, appointments, breaks, and paid hours stay in place. You decide which plan
                  works for your crew.
                </p>
              </div>
            </div>
          </aside>
        </div>
        <div className="main-panel">
          {busy && (
            <div role="status" className="busy-status">
              <LoaderCircle className="spin" size={17} />
              {busy === 'extract'
                ? 'Reading the work order with Gemma 4…'
                : busy === 'plan'
                  ? 'Fetching the NWS forecast and checking feasible schedules…'
                  : 'Preparing both crew briefings with Gemma 4…'}
            </div>
          )}
          {!tasks.length && !busy && (
            <section className="workflow-note" aria-label="How planning works">
              <div>
                <span>01</span>
                <h3>Start with the work</h3>
                <p>Add your work order and the hours you need to keep.</p>
              </div>
              <div>
                <span>02</span>
                <h3>Make it your plan</h3>
                <p>Review the extracted tasks, timing, and constraints.</p>
              </div>
              <div>
                <span>03</span>
                <h3>Bring the crew along</h3>
                <p>Compare schedules and prepare a bilingual briefing.</p>
              </div>
              <p className="sample-note">
                The prefilled work order is a fictional example. Forecast values come from NWS.
              </p>
            </section>
          )}
          {envelope && (
            <button
              className="review-toggle"
              aria-expanded={reviewExpanded}
              aria-controls="task-review"
              onClick={() => setReviewExpanded((v) => !v)}
            >
              <CheckCircle2 size={17} />
              {tasks.length} confirmed tasks · {reviewExpanded ? 'Hide details' : 'Review details'}
              <ChevronDown size={15} />
            </button>
          )}
          {tasks.length > 0 && (!envelope || reviewExpanded) && (
            <section ref={reviewRef} className="review-section" id="task-review">
              <div className="section-eyebrow">
                <Sparkles size={13} /> GEMMA 4 · EXTRACTED FROM YOUR WORK ORDER
              </div>
              <div className="review-heading">
                <div>
                  <h2>Make sure we got it right.</h2>
                  <p>Confirm the extracted details before comparing schedules.</p>
                </div>
                <span className="count-badge">{tasks.length} tasks</span>
              </div>
              {questions.length > 0 && (
                <div className="questions-box">
                  <strong>Details to confirm</strong>
                  <ul>
                    {questions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
              <fieldset disabled={!!busy} className="review-fieldset">
                <div className="task-list">
                  {tasks.map((t, i) => (
                    <TaskEditor
                      key={t.id}
                      task={t}
                      index={i}
                      tasks={tasks}
                      onChange={(next) => {
                        setTasks((ts) => ts.map((t) => (t.id === next.id ? next : t)));
                        invalidate();
                      }}
                    />
                  ))}
                </div>
                <label className="confirmation">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                  />
                  <span>
                    I’ve checked every task and resolved any questions. These details reflect the
                    original work plan.
                  </span>
                </label>
                <button
                  className="primary compare-button"
                  onClick={compare}
                  disabled={!confirmed || !!busy}
                >
                  {busy === 'plan' ? (
                    <LoaderCircle className="spin" size={18} />
                  ) : (
                    <ThermometerSun size={18} />
                  )}
                  Compare schedules
                  <ArrowRight size={17} />
                </button>
              </fieldset>
            </section>
          )}
          <div ref={resultRef}>
            {envelope && (
              <ComparisonView
                envelope={envelope}
                onBrief={prepareBrief}
                busy={busy}
                briefing={briefing}
                language={language}
                setLanguage={setLanguage}
                copied={copied}
                onCopy={() => void copyBrief()}
                onDownload={downloadBrief}
              />
            )}
          </div>
        </div>
        <footer className="footer">
          <span>
            <Sunrise size={17} /> Built for the people doing the work.
          </span>
          <span>Forecast planning support · Supervisor approval required</span>
          <a
            href="https://github.com/NaxeCode/heatshift#ai-inside-the-application"
            target="_blank"
            rel="noreferrer"
          >
            How it works <ArrowUpRight size={13} />
          </a>
        </footer>
      </main>
    </>
  );
}

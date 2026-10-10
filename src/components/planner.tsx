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
  Sun,
  Sunrise,
  ThermometerSun,
  Trees,
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
import TaskEditor from './task-editor';
import ComparisonView, { type Envelope } from './comparison-view';
import { crewBriefText } from '@/lib/presentation';
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
      setTimeout(
        () => reviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        100,
      );
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
      setTimeout(
        () => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        100,
      );
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
    link.download = `heatshift-briefing-${date}-${language}.txt`;
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
        <a href="/" className="brand">
          <span className="brand-symbol">
            <Sunrise size={25} />
          </span>
          heatshift<span className="prototype">PROTOTYPE</span>
        </a>
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
      <main id="workspace">
        <section className="page-intro">
          <div>
            <div className="eyebrow">A BETTER TIME FOR OUTDOOR WORK</div>
            <h1>
              Plan the work.
              <br />
              <span>Work around the heat.</span>
            </h1>
            <p>
              Give your crew a better-timed day. Same work, same paid shift,
              <br className="desktop-break" /> with the weather taken into account.
            </p>
          </div>
          <div className="intro-art" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="intro-sun">
              <Sun size={48} strokeWidth={1.3} />
            </div>
            <div className="intro-leaf">
              <Trees size={55} strokeWidth={1.2} />
            </div>
            <div className="art-caption">
              <span /> PEOPLE FIRST. WEATHER AWARE.
            </div>
          </div>
        </section>
        <nav className="steps" aria-label="Planner progress">
          {[
            ['01', 'Add your work'],
            ['02', 'Confirm the details'],
            ['03', 'Compare & brief'],
          ].map(([n, title], i) => (
            <div className={stage === i + 1 ? 'active' : stage > i + 1 ? 'done' : ''} key={n}>
              <span>{stage > i + 1 ? <Check size={15} /> : n}</span>
              {title}
              {i < 2 && <ArrowRight size={16} />}
            </div>
          ))}
        </nav>
        <div className="workspace-grid">
          <aside className="input-panel">
            <div className="panel-heading">
              <span className="mini-icon">
                <Trees size={21} />
              </span>
              <div>
                <h2>The work ahead</h2>
                <p>One crew. One day. Up to four tasks.</p>
              </div>
            </div>
            <fieldset disabled={!!busy} className="input-fieldset">
              <div className="location-box">
                <MapPin size={17} />
                <div>
                  <strong>Miami, Florida</strong>
                  <span>National Weather Service forecast</span>
                </div>
                <span className="live-dot" />
              </div>
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
              <div className="work-order-label">
                <label htmlFor="work-order">Work order</label>
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
                value={workOrder}
                maxLength={6000}
                rows={11}
                onChange={(e) => {
                  setWorkOrder(e.target.value);
                  setTasks([]);
                  setQuestions([]);
                  invalidate();
                }}
              />
              <p className="input-help">
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
            </fieldset>
            <div className="promise">
              <ShieldCheck size={18} />
              <p>Your crew’s work, break, and paid shift stay intact.</p>
            </div>
          </aside>
          <div className="main-panel">
            {error && (
              <div role="alert" className="error-box">
                <strong>Let’s resolve this before continuing.</strong>
                <p>{error}</p>
              </div>
            )}
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
              <section className="empty-state">
                <div className="empty-icon">
                  <Sunrise size={39} strokeWidth={1.3} />
                </div>
                <div className="section-eyebrow">SMALL SHIFTS. A MORE THOUGHTFUL DAY.</div>
                <h2>
                  The right work,
                  <br />
                  at a better time.
                </h2>
                <p>
                  Start with a work order. We’ll help you find room
                  <br className="desktop-break" /> to move outdoor tasks around the hottest hours.
                </p>
                <div className="how-it-works">
                  <div>
                    <span>1</span>
                    <div>
                      <strong>You set the boundaries</strong>
                      <p>Confirm the tasks, appointments, and break.</p>
                    </div>
                  </div>
                  <div>
                    <span>2</span>
                    <div>
                      <strong>The forecast informs the plan</strong>
                      <p>Compare arrangements using live NWS data.</p>
                    </div>
                  </div>
                  <div>
                    <span>3</span>
                    <div>
                      <strong>Your crew gets a clear briefing</strong>
                      <p>Review and share in English or Spanish.</p>
                    </div>
                  </div>
                </div>
                <div className="example-note">
                  The prefilled work order is a fictional example.
                  <br />
                  Your comparison will use real forecast data.
                </div>
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
                {tasks.length} confirmed tasks ·{' '}
                {reviewExpanded ? 'Hide details' : 'Review details'}
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
                    <p>Review each task before the weather enters the picture.</p>
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

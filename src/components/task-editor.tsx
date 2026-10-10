import { Sun, Leaf, ChevronDown } from 'lucide-react';
import { useId } from 'react';
import type { DraftTask } from '@/lib/contracts';
import { displayTime, minutes } from '@/lib/contracts';
import TimeField from './time-field';
export default function TaskEditor({
  task,
  index,
  tasks,
  onChange,
}: {
  task: DraftTask;
  index: number;
  tasks: DraftTask[];
  onChange: (task: DraftTask) => void;
}) {
  const update = (value: Partial<DraftTask>) => onChange({ ...task, ...value });
  const fieldId = useId();
  const invalidDuration = !task.duration || task.duration % 30 !== 0 || task.duration > 480;
  return (
    <article className="task-card">
      <div className="task-top">
        <span className={`task-number ${task.environment}`}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <label className="task-name">
          <span className="sr-only">Task {index + 1} name</span>
          <input
            value={task.title}
            maxLength={100}
            onChange={(e) => update({ title: e.target.value })}
          />
        </label>
        {task.environment === 'outdoor' ? <Sun size={19} /> : <Leaf size={19} />}
      </div>
      <div className="task-fields">
        <label className="field">
          <span>Work environment</span>
          <select
            value={task.environment}
            aria-invalid={task.environment === 'unknown'}
            aria-describedby={task.environment === 'unknown' ? `${fieldId}-environment` : undefined}
            onChange={(e) => update({ environment: e.target.value as DraftTask['environment'] })}
          >
            <option value="unknown">Confirm environment</option>
            <option value="outdoor">Outdoors</option>
            <option value="indoor">Indoors</option>
          </select>
          {task.environment === 'unknown' && (
            <small className="field-error" id={`${fieldId}-environment`}>
              Confirm indoors or outdoors.
            </small>
          )}
        </label>
        <label className="field">
          <span>Duration</span>
          <select
            value={task.duration || ''}
            aria-invalid={invalidDuration}
            aria-describedby={invalidDuration ? `${fieldId}-duration` : undefined}
            onChange={(e) => update({ duration: Number(e.target.value) || null })}
          >
            <option value="">Confirm duration</option>
            {task.duration && (task.duration % 30 !== 0 || task.duration > 480) ? (
              <option value={task.duration}>{task.duration} min — revise</option>
            ) : null}
            {Array.from({ length: 16 }, (_, i) => (i + 1) * 30).map((n) => (
              <option value={n} key={n}>
                {n} min
              </option>
            ))}
          </select>
          {invalidDuration && (
            <small className="field-error" id={`${fieldId}-duration`}>
              Confirm 30–480 minutes in 30-minute steps.
            </small>
          )}
        </label>
        <TimeField
          label="Original start"
          value={task.originalStart}
          onChange={(v) => update({ originalStart: v })}
        />
      </div>
      {(task.fixedStart || task.dependencies.length > 0) && (
        <div className="constraint-summary">
          {task.fixedStart && <p>Fixed appointment: {displayTime(minutes(task.fixedStart))}</p>}
          {task.dependencies.length > 0 && (
            <p>
              Must follow:{' '}
              {task.dependencies
                .map((id) => tasks.find((item) => item.id === id)?.title ?? id)
                .join(', ')}
            </p>
          )}
        </div>
      )}
      {task.sourceText && (
        <details className="source-excerpt">
          <summary>View work-order source</summary>
          <p>{task.sourceText}</p>
        </details>
      )}
      <details className="constraints">
        <summary>
          Timing & dependencies <ChevronDown size={14} />
        </summary>
        <div className="constraint-fields">
          <TimeField
            label="Earliest start"
            value={task.earliestStart}
            onChange={(v) => update({ earliestStart: v })}
            optional
          />
          <TimeField
            label="Latest finish"
            value={task.latestFinish}
            onChange={(v) => update({ latestFinish: v })}
            optional
          />
          <TimeField
            label="Fixed appointment"
            value={task.fixedStart}
            onChange={(v) => update({ fixedStart: v })}
            optional
          />
          <fieldset className="dependencies">
            <legend>Must follow</legend>
            {tasks
              .filter((t) => t.id !== task.id)
              .map((t) => (
                <label key={t.id}>
                  <input
                    type="checkbox"
                    checked={task.dependencies.includes(t.id)}
                    onChange={(e) =>
                      update({
                        dependencies: e.target.checked
                          ? [...task.dependencies, t.id]
                          : task.dependencies.filter((id) => id !== t.id),
                      })
                    }
                  />
                  {t.title}
                </label>
              ))}
          </fieldset>
        </div>
      </details>
    </article>
  );
}

import { clockTime, displayTime, minutes } from '@/lib/contracts';
import { useId } from 'react';
const timeOptions = Array.from({ length: 48 }, (_, i) => clockTime(i * 30));
export default function TimeField({
  label,
  value,
  onChange,
  optional = false,
}: {
  label: string;
  value: string | null;
  onChange: (v: string | null) => void;
  optional?: boolean;
}) {
  const errorId = useId();
  const invalid = value ? !timeOptions.includes(value) : !optional;
  return (
    <label className="field">
      <span>{label}</span>
      <select
        value={value || ''}
        aria-invalid={invalid}
        aria-describedby={invalid ? errorId : undefined}
        onChange={(e) => onChange(e.target.value || null)}
      >
        {optional && <option value="">No restriction</option>}
        {!optional && !value && <option value="">Confirm time</option>}
        {value && !timeOptions.includes(value) ? (
          <option value={value}>{displayTime(minutes(value))} — revise</option>
        ) : null}
        {timeOptions.map((t) => (
          <option key={t} value={t}>
            {displayTime(minutes(t))}
          </option>
        ))}
      </select>
      {invalid && (
        <small className="field-error" id={errorId}>
          Confirm a time in 30-minute steps.
        </small>
      )}
    </label>
  );
}

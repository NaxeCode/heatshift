/** Geometric implementation of Faye's approved Kruu ripple-sun direction. */
export default function Brand() {
  return (
    <a href="/" className="brand" aria-label="Kruu crew planner">
      <span className="brand-lockup" aria-hidden="true">
        <svg className="brand-symbol" viewBox="0 0 64 64" focusable="false">
          <defs>
            <linearGradient id="kruu-brand-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop className="brand-coral" />
              <stop className="brand-orange" offset="1" />
            </linearGradient>
          </defs>
          <g fill="url(#kruu-brand-gradient)">
            <path d="M8 31a24 24 0 0 1 48 0Z" />
            <rect x="4" y="34" width="56" height="7" rx="3.5" />
            <rect x="11" y="44" width="42" height="7" rx="3.5" />
            <rect x="18" y="54" width="28" height="7" rx="3.5" />
          </g>
        </svg>
        <span className="brand-wordmark">kruu</span>
      </span>
      <span className="prototype">PROTOTYPE</span>
    </a>
  );
}

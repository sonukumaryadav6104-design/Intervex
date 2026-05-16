// IntervexIcon.jsx
export function IntervexIcon({ size = 40 }) { // smaller default
  const r = 56; // fixed radius for 256 box

  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
      
      {/* Background */}
      <rect width="256" height="256" rx={r} fill="url(#ix-g)" />

      <defs>
        <linearGradient id="ix-g" x1="0" y1="0" x2="256" y2="256">
          <stop offset="0%" stopColor="#8B7AF5" />
          <stop offset="100%" stopColor="#4A3BB5" />
        </linearGradient>
      </defs>

      {/* 🔑 Scale down entire icon */}
      <g transform="translate(40,40) scale(0.7)">
        
        {/* Speech arc */}
        <path
          d="M72 100 Q60 128 72 156"
          stroke="white"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
          opacity="0.35"
        />
        <path
          d="M56 88 Q36 128 56 168"
          stroke="white"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          opacity="0.18"
        />

        {/* I-beam */}
        <rect x="112" y="72" width="12" height="112" rx="6" fill="white" />
        <rect x="90" y="72" width="56" height="12" rx="6" fill="white" />
        <rect x="90" y="172" width="56" height="12" rx="6" fill="white" />

        {/* Dot */}
        <circle cx="176" cy="92" r="10" fill="#1DCFAA" />

      </g>
    </svg>
  );
}
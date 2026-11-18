/**
 * Editorial artwork per project (SVG, no image requests). Uploaded thumbnails from Django Admin take precedence.
 * Shapes echo the reference cards: chrome tooth, architecture, phone + bag, plus technical motifs for APIs.
 */
const Defs = ({ id }) => (
  <defs>
    <linearGradient id={`${id}-chrome`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#ffffff" />
      <stop offset="0.35" stopColor="#dfe0ea" />
      <stop offset="0.7" stopColor="#8b8ea0" />
      <stop offset="1" stopColor="#3b3d48" />
    </linearGradient>
    <linearGradient id={`${id}-dark`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#262a35" />
      <stop offset="1" stopColor="#0b0c10" />
    </linearGradient>
    <radialGradient id={`${id}-glow`} cx="0.5" cy="0.4" r="0.6">
      <stop offset="0" stopColor="#aaa9f5" stopOpacity="0.35" />
      <stop offset="1" stopColor="#aaa9f5" stopOpacity="0" />
    </radialGradient>
    <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#ffffff" stopOpacity="0.12" />
      <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
    </linearGradient>
  </defs>
);

function Tooth({ id }) {
  return (
    <>
      <ellipse cx="200" cy="140" rx="170" ry="130" fill={`url(#${id}-glow)`} />
      <path
        d="M140 70c-28 0-46 24-44 58 2 30 14 52 20 82 6 34 10 72 30 72 18 0 18-46 26-66 6-14 16-20 28-20s22 6 28 20c8 20 8 66 26 66 20 0 24-38 30-72 6-30 18-52 20-82 2-34-16-58-44-58-26 0-36 14-60 14s-34-14-60-14z"
        fill={`url(#${id}-chrome)`}
      />
      <path d="M128 92c-12 6-16 22-12 40" stroke="#fff" strokeOpacity="0.8" strokeWidth="5" strokeLinecap="round" fill="none" />
      <ellipse cx="200" cy="290" rx="120" ry="10" fill="#000" opacity="0.5" />
    </>
  );
}

function Villa({ id }) {
  const win = (x, y, w, h, o = 0.85) => <rect x={x} y={y} width={w} height={h} fill="#f3e9d6" opacity={o} />;
  return (
    <>
      <rect width="400" height="300" fill={`url(#${id}-dark)`} />
      <ellipse cx="260" cy="40" rx="200" ry="90" fill="#aaa9f5" opacity="0.08" />
      <g stroke="#cfd1dc" strokeOpacity="0.65" strokeWidth="1.5" fill="#15171e">
        <rect x="70" y="150" width="270" height="110" />
        <rect x="120" y="92" width="200" height="58" />
        <rect x="100" y="86" width="240" height="8" fill="#d9dbe4" />
        <rect x="56" y="144" width="296" height="8" fill="#d9dbe4" />
      </g>
      {win(135, 102, 70, 40)}
      {win(215, 102, 90, 40, 0.6)}
      {win(85, 168, 60, 80, 0.7)}
      {win(155, 168, 110, 80)}
      {win(275, 168, 52, 80, 0.55)}
      <g stroke="#15171e" strokeWidth="2">
        <line x1="175" y1="102" x2="175" y2="142" />
        <line x1="210" y1="168" x2="210" y2="248" />
      </g>
      <rect x="40" y="260" width="330" height="40" fill={`url(#${id}-floor)`} />
      <rect x="150" y="262" width="120" height="16" fill="#9fb4d8" opacity="0.25" />
    </>
  );
}

function Commerce({ id }) {
  return (
    <>
      <ellipse cx="200" cy="150" rx="170" ry="120" fill={`url(#${id}-glow)`} opacity="0.7" />
      <g transform="rotate(-8 170 160)">
        <rect x="112" y="44" width="122" height="236" rx="22" fill={`url(#${id}-chrome)`} />
        <rect x="117" y="49" width="112" height="226" rx="18" fill="#0a0b0f" />
        <rect x="150" y="56" width="46" height="10" rx="5" fill="#000" />
        <rect x="128" y="86" width="90" height="56" rx="8" fill="#1d2029" />
        <rect x="128" y="152" width="40" height="40" rx="6" fill="#1d2029" />
        <rect x="178" y="152" width="40" height="40" rx="6" fill="#1d2029" />
        <rect x="128" y="236" width="90" height="16" rx="8" fill="#aaa9f5" opacity="0.8" />
      </g>
      <path d="M232 130h96l10 150H222z" fill="#101116" stroke="#3a3d48" />
      <path d="M232 130h96l10 150H222z" fill={`url(#${id}-floor)`} />
      <path d="M258 132c0-30 44-30 44 0" stroke="#d9dbe4" strokeWidth="4" fill="none" />
    </>
  );
}

function Tickets({ id }) {
  return (
    <>
      <ellipse cx="200" cy="150" rx="180" ry="120" fill={`url(#${id}-glow)`} opacity="0.7" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${70 + i * 18} ${70 + i * 26}) rotate(${-6 + i * 4})`} opacity={0.5 + i * 0.25}>
          <path d="M0 0h230v40a14 14 0 0 0 0 28v40H0V68a14 14 0 0 0 0-28z" fill={i === 2 ? `url(#${id}-chrome)` : "#1b1e27"} stroke="#3a3d48" />
          {i === 2 && (
            <>
              <line x1="160" y1="8" x2="160" y2="100" stroke="#0b0c10" strokeDasharray="4 5" strokeWidth="2" />
              <rect x="20" y="24" width="90" height="10" rx="5" fill="#0b0c10" opacity="0.7" />
              <rect x="20" y="44" width="60" height="8" rx="4" fill="#0b0c10" opacity="0.45" />
              <rect x="178" y="38" width="30" height="26" rx="5" fill="#0b0c10" />
              <path d="M184 38v-8a9 9 0 0 1 18 0v8" stroke="#0b0c10" strokeWidth="4" fill="none" />
            </>
          )}
        </g>
      ))}
    </>
  );
}

function Blueprint() {
  return (
    <>
      <g stroke="#aaa9f5" strokeOpacity="0.12">
        {Array.from({ length: 21 }, (_, i) => <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="300" />)}
        {Array.from({ length: 16 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 20} x2="400" y2={i * 20} />)}
      </g>
      <g stroke="#d9dbe4" strokeOpacity="0.8" strokeWidth="2.5" fill="none">
        <path d="M80 60h240v180H80z" />
        <path d="M80 140h110v100M190 60v50M250 140h70M250 140v100" />
        <path d="M190 190a30 30 0 0 1 30-30" strokeDasharray="4 4" />
      </g>
      <text x="92" y="84" fill="#a7aab5" fontSize="11" fontFamily="ui-monospace,monospace">User</text>
      <text x="202" y="84" fill="#a7aab5" fontSize="11" fontFamily="ui-monospace,monospace">AgentProfile</text>
      <text x="92" y="164" fill="#a7aab5" fontSize="11" fontFamily="ui-monospace,monospace">Listing</text>
    </>
  );
}

const ART = { "jokar-dental": Tooth, jokarco: Villa, sinshop: Commerce, nexusticket: Tickets };

export default function ProjectVisual({ slug, thumbnail, className = "" }) {
  if (thumbnail) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={thumbnail} alt="" loading="lazy" className={`size-full object-cover ${className}`} />;
  }
  const Art = ART[slug] || Blueprint;
  const id = `pv-${slug}`;
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className={`size-full ${className}`} aria-hidden="true">
      <Defs id={id} />
      <rect width="400" height="300" fill="#0d0e13" />
      <Art id={id} />
    </svg>
  );
}

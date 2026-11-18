import { siGithub, siWhatsapp } from "simple-icons";

function Brand({ path, title, className = "size-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden={title ? undefined : true} role={title ? "img" : undefined}>
      {title && <title>{title}</title>}
      <path d={path} />
    </svg>
  );
}

export const GithubIcon = (p) => <Brand path={siGithub.path} {...p} />;
export const WhatsappIcon = (p) => <Brand path={siWhatsapp.path} {...p} />;
// LinkedIn is not distributed by simple-icons; this is the plain "in" mark.
export const LinkedinIcon = (p) => (
  <Brand
    path="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"
    {...p}
  />
);

/** The SJ monogram — a chrome "S" drawn as two offset arcs, echoing the reference logo. */
export function Monogram({ className = "size-7" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="mono-chrome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#d6d7e2" />
          <stop offset="1" stopColor="#8d90a2" />
        </linearGradient>
      </defs>
      <path
        d="M24 6.5H12.5a6 6 0 0 0 0 12h7a3.5 3.5 0 0 1 0 7H8"
        fill="none"
        stroke="url(#mono-chrome)"
        strokeWidth="4.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

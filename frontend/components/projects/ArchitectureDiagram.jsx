import { ArrowDown, ArrowRight } from "lucide-react";

/** Layered system diagram + critical transaction flow, rendered as accessible HTML (not an image). */
export function ArchitectureDiagram({ diagram }) {
  return (
    <div dir="ltr" className="card-dark overflow-hidden p-6 md:p-8">
      <ol className="flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
        {diagram.layers.map((node, i) => (
          <li key={node.title} className="flex flex-col items-center gap-3 lg:flex-1 lg:flex-row">
            <div
              className={`w-full rounded-2xl border px-4 py-4 text-center ${
                node.accent ? "border-accent/50 bg-accent/[0.08] shadow-[0_0_40px_-12px_rgb(170_169_245/0.6)]" : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <p className="text-sm font-medium text-white">{node.title}</p>
              <p className="mt-1 font-mono text-[0.7rem] leading-snug text-mist">{node.detail}</p>
            </div>
            {i < diagram.layers.length - 1 && (
              <>
                <ArrowDown className="size-4 shrink-0 text-white/30 lg:hidden" aria-hidden="true" />
                <ArrowRight className="hidden size-4 shrink-0 text-white/30 lg:block" aria-hidden="true" />
              </>
            )}
          </li>
        ))}
      </ol>
      {diagram.aside?.length > 0 && (
        <div className="mt-6 grid gap-3 border-t border-dashed border-white/12 pt-6 sm:grid-cols-2">
          {diagram.aside.map((node) => (
            <div key={node.title} className="rounded-2xl border border-dashed border-white/15 px-4 py-3">
              <p className="text-sm text-white/90">{node.title}</p>
              <p className="mt-1 font-mono text-[0.7rem] text-mist">{node.detail}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function FlowDiagram({ diagram }) {
  return (
    <ol dir="ltr" className="card-dark relative space-y-1 p-6 md:p-8">
      {diagram.flow.map((step, i) => (
        <li key={step} className="relative flex items-start gap-4 ps-1">
          <span className="flex flex-col items-center self-stretch">
            <span className={`mt-1.5 size-2.5 shrink-0 rounded-full ${i === diagram.lock ? "bg-accent shadow-[0_0_14px_#aaa9f5]" : "bg-white/40"}`} />
            {i < diagram.flow.length - 1 && <span className="w-px flex-1 bg-white/12" />}
          </span>
          <code className={`pb-4 font-mono text-[0.82rem] leading-relaxed ${i === diagram.lock ? "text-accent-soft" : "text-white/80"}`}>{step}</code>
        </li>
      ))}
    </ol>
  );
}

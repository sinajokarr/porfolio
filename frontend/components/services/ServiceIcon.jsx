import { Activity, ChartNoAxesColumn, CodeXml, Gauge, LayoutTemplate, Monitor, Plug, ShoppingCart, Target } from "lucide-react";

const ICONS = { monitor: Monitor, code: CodeXml, chart: ChartNoAxesColumn, layout: LayoutTemplate, target: Target, activity: Activity, gauge: Gauge, cart: ShoppingCart, plug: Plug };

export default function ServiceIcon({ name, className = "size-7" }) {
  const Icon = ICONS[name] || CodeXml;
  return <Icon className={className} strokeWidth={1.4} aria-hidden="true" />;
}

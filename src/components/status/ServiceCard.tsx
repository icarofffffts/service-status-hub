import type { ServiceState } from "@/types/status";
import { StatusBadge } from "./StatusBadge";
import { UptimeBar } from "./UptimeBar";

export function ServiceCard({ service }: { service: ServiceState }) {
  const { data } = service;
  return (
    <article className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-card-foreground">{service.name}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{service.description}</p>
        </div>
        <StatusBadge status={data.status} />
      </header>

      <div className="mt-5">
        <UptimeBar history={data.history} />
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>90 dias atrás</span>
          <span>
            {data.uptime90d.toFixed(2)}% uptime
            <span className="mx-2 text-border">•</span>
            {data.latencyMs} ms
          </span>
          <span>Hoje</span>
        </div>
      </div>
    </article>
  );
}

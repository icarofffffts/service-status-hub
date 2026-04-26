import type { Incident, IncidentStatus } from "@/types/status";

interface Props {
  incidents: Array<Incident & { serviceName: string }>;
}

const STATUS_LABELS: Record<IncidentStatus, string> = {
  investigating: "Investigando",
  identified: "Identificado",
  monitoring: "Monitorando",
  resolved: "Resolvido",
};

const STATUS_STYLE: Record<IncidentStatus, string> = {
  investigating: "bg-status-down-soft text-status-down",
  identified: "bg-status-degraded-soft text-status-degraded",
  monitoring: "bg-status-degraded-soft text-status-degraded",
  resolved: "bg-status-operational-soft text-status-operational",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function IncidentList({ incidents }: Props) {
  if (incidents.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Nenhum incidente registrado nos últimos 90 dias.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {incidents.map((incident) => (
        <li
          key={incident.id}
          className="rounded-xl border border-border bg-card p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h4 className="text-sm font-semibold text-card-foreground">{incident.title}</h4>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {incident.serviceName} • {formatDate(incident.startedAt)}
              </p>
            </div>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[incident.status]}`}
            >
              {STATUS_LABELS[incident.status]}
            </span>
          </div>
          {incident.description && (
            <p className="mt-3 text-sm text-muted-foreground">{incident.description}</p>
          )}
          {incident.resolvedAt && (
            <p className="mt-2 text-xs text-muted-foreground">
              Resolvido em {formatDate(incident.resolvedAt)}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}

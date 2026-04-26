import type { HistoryDay, ServiceStatus } from "@/types/status";
import { cn } from "@/lib/utils";

const BAR_COLOR: Record<ServiceStatus, string> = {
  operational: "bg-status-operational",
  degraded: "bg-status-degraded",
  down: "bg-status-down",
  unknown: "bg-status-unknown",
};

const LABELS: Record<ServiceStatus, string> = {
  operational: "Operacional",
  degraded: "Degradado",
  down: "Fora do ar",
  unknown: "Sem dados",
};

function pad(history: HistoryDay[]): HistoryDay[] {
  if (history.length >= 90) return history.slice(-90);
  const missing = 90 - history.length;
  const filler: HistoryDay[] = Array.from({ length: missing }, () => ({
    date: "",
    status: "unknown" as ServiceStatus,
  }));
  return [...filler, ...history];
}

function formatDate(d: string) {
  if (!d) return "Sem dados";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

export function UptimeBar({ history }: { history: HistoryDay[] }) {
  const days = pad(history);
  return (
    <div className="flex items-end gap-[2px]" aria-label="Histórico de 90 dias">
      {days.map((day, i) => (
        <div
          key={i}
          className={cn(
            "h-8 flex-1 min-w-[3px] rounded-[2px] transition-transform hover:scale-y-110",
            BAR_COLOR[day.status],
          )}
          title={`${formatDate(day.date)} — ${LABELS[day.status]}`}
        />
      ))}
    </div>
  );
}

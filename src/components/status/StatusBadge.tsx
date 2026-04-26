import type { ServiceStatus } from "@/types/status";
import { cn } from "@/lib/utils";

const LABELS: Record<ServiceStatus, string> = {
  operational: "Operacional",
  degraded: "Degradado",
  down: "Fora do ar",
  unknown: "Verificando",
};

const STYLES: Record<ServiceStatus, string> = {
  operational: "bg-status-operational-soft text-status-operational",
  degraded: "bg-status-degraded-soft text-status-degraded",
  down: "bg-status-down-soft text-status-down",
  unknown: "bg-status-unknown-soft text-status-unknown",
};

const DOT: Record<ServiceStatus, string> = {
  operational: "bg-status-operational",
  degraded: "bg-status-degraded",
  down: "bg-status-down",
  unknown: "bg-status-unknown",
};

export function StatusBadge({ status, className }: { status: ServiceStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        STYLES[status],
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", DOT[status])} />
      {LABELS[status]}
    </span>
  );
}

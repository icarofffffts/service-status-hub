import type { ServiceStatus } from "@/types/status";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  overall: ServiceStatus;
  updatedAt: Date | null;
  isRefreshing: boolean;
  isLive?: boolean;
  onRefresh: () => void;
}

const HEADLINE: Record<ServiceStatus, string> = {
  operational: "Todos os sistemas operacionais",
  degraded: "Alguns sistemas com degradação",
  down: "Há sistemas fora do ar",
  unknown: "Verificando sistemas…",
};

const STYLES: Record<ServiceStatus, string> = {
  operational: "bg-status-operational-soft border-status-operational/20",
  degraded: "bg-status-degraded-soft border-status-degraded/20",
  down: "bg-status-down-soft border-status-down/20",
  unknown: "bg-status-unknown-soft border-status-unknown/20",
};

const DOT: Record<ServiceStatus, string> = {
  operational: "bg-status-operational",
  degraded: "bg-status-degraded",
  down: "bg-status-down",
  unknown: "bg-status-unknown",
};

function formatTime(d: Date | null) {
  if (!d) return "—";
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function OverallStatusBanner({ overall, updatedAt, isRefreshing, onRefresh }: Props) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 rounded-xl border p-5 sm:p-6",
        STYLES[overall],
      )}
    >
      <div className="flex items-center gap-3">
        <span className="relative flex h-3 w-3">
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
              DOT[overall],
            )}
          />
          <span className={cn("relative inline-flex h-3 w-3 rounded-full", DOT[overall])} />
        </span>
        <div className="flex flex-col gap-0.5">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">{HEADLINE[overall]}</h2>
          <span className="text-[10px] text-muted-foreground uppercase font-medium">Atualizado às {formatTime(updatedAt)}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-60"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
          Atualizar
        </button>
      </div>
    </div>
  );
}

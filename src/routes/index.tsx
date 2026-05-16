import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Shield, Activity, Server, Bot, Key } from "lucide-react";

import { SERVICES, REFRESH_INTERVAL_MS } from "@/config/services";
import { fetchAllServices } from "@/lib/status-api";
import type { Incident, ServiceState, ServiceStatus } from "@/types/status";
import { OverallStatusBanner } from "@/components/status/OverallStatusBanner";
import { ServiceCard } from "@/components/status/ServiceCard";
import { IncidentList } from "@/components/status/IncidentList";

const CATEGORY_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  site: Server,
  bot: Bot,
  auth: Key,
  default: Activity,
};

function getCategory(id: string): string {
  if (id.includes("bot")) return "bot";
  if (id.includes("auth")) return "auth";
  return "site";
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ARX Ecosystem Status" },
      {
        name: "description",
        content: "Status em tempo real de todos os servicos do ecossistema ARX.",
      },
      { property: "og:title", content: "ARX Ecosystem Status" },
      {
        property: "og:description",
        content: "Status em tempo real de todos os servicos do ecossistema ARX.",
      },
    ],
  }),
  component: StatusPage,
});

function computeOverall(services: ServiceState[] | undefined): ServiceStatus {
  if (!services || services.length === 0) return "unknown";
  if (services.some((s) => s.data.status === "down")) return "down";
  if (services.some((s) => s.data.status === "degraded")) return "degraded";
  if (services.every((s) => s.data.status === "operational")) return "operational";
  return "unknown";
}

function StatusPage() {
  const query = useQuery({
    queryKey: ["status", "all"],
    queryFn: () => fetchAllServices(SERVICES),
    refetchInterval: REFRESH_INTERVAL_MS,
    refetchOnWindowFocus: true,
  });

  const services = query.data;
  const overall = computeOverall(services);
  const updatedAt = query.dataUpdatedAt ? new Date(query.dataUpdatedAt) : null;
  const isAllLive = services ? services.every((s) => !s.isFallback) : true;

  const allIncidents = useMemo(() => {
    if (!services) return [];
    const merged: Array<Incident & { serviceName: string }> = [];
    for (const s of services) {
      for (const inc of s.data.incidents) {
        merged.push({ ...inc, serviceName: s.name });
      }
    }
    return merged.sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
    );
  }, [services]);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              AX
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground">
                ARX Ecosystem
              </h1>
              <p className="text-xs text-muted-foreground">Status em tempo real</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2">
              <span className={`absolute inline-flex h-2 w-2 animate-ping rounded-full opacity-40 ${overall === "operational" ? "bg-status-operational" : overall === "down" ? "bg-status-down" : "bg-status-degraded"}`} />
              <span className={`relative inline-flex h-2 w-2 rounded-full ${overall === "operational" ? "bg-status-operational" : overall === "down" ? "bg-status-down" : "bg-status-degraded"}`} />
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              {updatedAt
                ? `Atualizado ${updatedAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
                : "Carregando..."}
            </span>
          </div>
        </header>

        {/* Overall Status */}
        <OverallStatusBanner
          overall={overall}
          updatedAt={updatedAt}
          isRefreshing={query.isFetching}
          isLive={isAllLive}
          onRefresh={() => query.refetch()}
        />

        {/* Services Grid */}
        <section className="mt-8">
          <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Activity className="h-3 w-3" />
            Servicos monitorados
            <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
              {SERVICES.length} ativos
            </span>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {(services ?? SERVICES.map(() => null)).map((service, i) =>
              service ? (
                <ServiceCard key={service.id} service={service} />
              ) : (
                <div
                  key={i}
                  className="h-36 animate-pulse rounded-xl border border-border bg-card"
                />
              ),
            )}
          </div>
        </section>

        {/* Incidents */}
        <section className="mt-10">
          <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Shield className="h-3 w-3" />
            Incidentes recentes
          </h2>
          <IncidentList incidents={allIncidents} />
        </section>

        {/* Footer */}
        <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5 text-xs text-muted-foreground">
          <span>Atualizacao automatica a cada 60 segundos</span>
          <span>ARX DEVS &copy; {new Date().getFullYear()}</span>
        </footer>
      </div>
    </main>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { SERVICES, REFRESH_INTERVAL_MS } from "@/config/services";
import { fetchAllServices } from "@/lib/status-api";
import type { Incident, ServiceState, ServiceStatus } from "@/types/status";
import { OverallStatusBanner } from "@/components/status/OverallStatusBanner";
import { ServiceCard } from "@/components/status/ServiceCard";
import { IncidentList } from "@/components/status/IncidentList";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ArxDevs Service Status" },
      {
        name: "description",
        content: "Acompanhe em tempo real a disponibilidade dos serviços ArxDevs.",
      },
      { property: "og:title", content: "ArxDevs Service Status" },
      {
        property: "og:description",
        content: "Acompanhe em tempo real a disponibilidade dos serviços ArxDevs.",
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

  const usingMocks = services?.some((s) => s.isFallback);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://shield.arxdevs.xyz/logo.png" 
              alt="ArxDevs Logo" 
              className="h-8 w-8 object-contain"
            />
            <span className="text-xl font-bold tracking-tight text-foreground">ArxDevs <span className="text-muted-foreground font-normal">Status</span></span>
          </div>
          <a
            href="https://arxdevs.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            ArxDevs Oficial →
          </a>
        </header>

        <div className="mb-8 overflow-hidden rounded-2xl border border-border bg-muted/50 shadow-sm">
          <img 
            src="https://shield.arxdevs.xyz/banner-hero-new.png" 
            alt="ArxDevs Banner" 
            className="aspect-[3/1] w-full object-cover opacity-90 transition-opacity hover:opacity-100"
          />
        </div>

        <OverallStatusBanner
          overall={overall}
          updatedAt={updatedAt}
          isRefreshing={query.isFetching}
          isLive={isAllLive}
          onRefresh={() => query.refetch()}
        />


        <section className="mt-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Serviços
          </h2>
          <div className="space-y-4">
            {(services ?? SERVICES.map((s) => null)).map((service, i) =>
              service ? (
                <ServiceCard key={service.id} service={service} />
              ) : (
                <div
                  key={i}
                  className="h-40 animate-pulse rounded-xl border border-border bg-card"
                />
              ),
            )}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Incidentes recentes
          </h2>
          <IncidentList incidents={allIncidents} />
        </section>

        {/* Projetos ARX */}
        <section className="mt-12">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Projetos ARX
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Auth Portal", desc: "Login centralizado com JWT, Discord OAuth e dashboard", url: "https://github.com/icarofffffts/arx-auth-portal", tag: "auth" },
              { name: "Shield Security", desc: "Protecao contra golpes no Discord — denuncias e blacklist", url: "https://github.com/icarofffffts/Site-Lotters", tag: "security" },
              { name: "Aegis Dashboard", desc: "Governanca, blacklist colaborativa e inteligencia", url: "https://github.com/icarofffffts/site-aegis", tag: "dashboard" },
              { name: "AegisBot", desc: "Bot Discord — tolerancia zero, OCR, scan de links e raids", url: "https://github.com/icarofffffts/AegisBot", tag: "bot" },
              { name: "Site Institucional", desc: "Landing page oficial da ARX DEVS", url: "https://github.com/icarofffffts/sitearx", tag: "site" },
              { name: "Status Hub", desc: "Monitoramento em tempo real do ecossistema", url: "https://github.com/icarofffffts/service-status-hub", tag: "monitor" },
              { name: "Hybrid CRM", desc: "CRM dashboard multi-tenant", url: "https://github.com/icarofffffts/hybrid-crm-dashboard", tag: "crm" },
              { name: "Plataforma Stack", desc: "Treinamentos multi-tenant com trilhas e badges", url: "https://github.com/icarofffffts/plataforma-stack-arx", tag: "lms" },
              { name: "Superfoods", desc: "Plataforma de treinamentos — single tenant", url: "https://github.com/icarofffffts/superfoods-platform", tag: "lms" },
            ].map((p) => (
              <a
                key={p.url}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-card-foreground group-hover:text-primary transition-colors">{p.name}</h3>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{p.tag}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
              </a>
            ))}
          </div>
        </section>

        <footer className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground">
          <span>Atualizacao automatica a cada 60 segundos</span>
          <a href="#" className="transition-colors hover:text-foreground">
            Inscrever-se em atualizacoes
          </a>
        </footer>
      </div>
    </main>
  );
}

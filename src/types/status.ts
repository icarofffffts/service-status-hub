export type ServiceStatus = "operational" | "degraded" | "down" | "unknown";

export type IncidentStatus = "investigating" | "identified" | "monitoring" | "resolved";

export interface HistoryDay {
  date: string; // YYYY-MM-DD
  status: ServiceStatus;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  startedAt: string; // ISO
  resolvedAt: string | null;
  status: IncidentStatus;
}

export interface HealthCheckResponse {
  status: ServiceStatus;
  latencyMs: number;
  uptime90d: number; // 0..100
  history: HistoryDay[]; // up to 90 entries, oldest first
  incidents: Incident[];
}

export interface ServiceConfig {
  id: string;
  name: string;
  description: string;
  healthCheckUrl: string;
}

export interface ServiceState extends ServiceConfig {
  data: HealthCheckResponse;
  isFallback: boolean;
}

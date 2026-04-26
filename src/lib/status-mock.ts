import type { HealthCheckResponse, HistoryDay, ServiceStatus } from "@/types/status";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function hashString(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function buildMockHealth(serviceId: string): HealthCheckResponse {
  const rand = seededRandom(hashString(serviceId));
  const today = new Date();

  const history: HistoryDay[] = [];
  let okDays = 0;
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const r = rand();
    let status: ServiceStatus = "operational";
    if (r > 0.985) status = "down";
    else if (r > 0.96) status = "degraded";
    if (status === "operational") okDays++;
    history.push({ date: formatDate(d), status });
  }

  const uptime90d = Number(((okDays / 90) * 100).toFixed(2));
  const todayStatus = history[history.length - 1].status;

  return {
    status: todayStatus,
    latencyMs: Math.round(40 + rand() * 180),
    uptime90d,
    history,
    incidents: [],
  };
}

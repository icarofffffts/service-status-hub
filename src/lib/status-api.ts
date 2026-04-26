import type { HealthCheckResponse, ServiceConfig, ServiceState } from "@/types/status";
import { buildMockHealth } from "./status-mock";

function isPlaceholderUrl(url: string) {
  return !url || url.startsWith("REPLACE_ME");
}

export async function fetchServiceHealth(service: ServiceConfig): Promise<ServiceState> {
  if (isPlaceholderUrl(service.healthCheckUrl)) {
    return { ...service, data: buildMockHealth(service.id), isFallback: true };
  }

  try {
    const res = await fetch(service.healthCheckUrl, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as HealthCheckResponse;
    return { ...service, data, isFallback: false };
  } catch {
    // Fallback to mock so UI never breaks; mark as unknown for current status.
    const mock = buildMockHealth(service.id);
    return {
      ...service,
      data: { ...mock, status: "unknown" },
      isFallback: true,
    };
  }
}

export async function fetchAllServices(services: ServiceConfig[]): Promise<ServiceState[]> {
  return Promise.all(services.map(fetchServiceHealth));
}

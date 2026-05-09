import type { ServiceConfig } from "@/types/status";

/**
 * Configure here the services to display on the status page.
 */
export const SERVICES: ServiceConfig[] = [
  {
    id: "arxdevs-site",
    name: "ArxDevs Institutional",
    description: "Site principal — Nexus da ArxDevs",
    healthCheckUrl: "https://arxdevs.xyz/api/health-check",
  },
  {
    id: "shield-site",
    name: "Shield Security",
    description: "Sistema de proteção e dashboard",
    healthCheckUrl: "https://shield.arxdevs.xyz/api/health-check",
  },
  {
    id: "shield-bot",
    name: "Shield Bot",
    description: "Monitoramento em tempo real",
    healthCheckUrl: "https://shield.arxdevs.xyz/api/bot-status",
  },
  {
    id: "aegis-site",
    name: "Aegis Ecosystem",
    description: "Status operacional do ecossistema Aegis",
    healthCheckUrl: "https://aegis.arxdevs.xyz/api/health-check",
  },
  {
    id: "aegis-bot",
    name: "Aegis Bot",
    description: "Status específico do AegisBot",
    healthCheckUrl: "https://aegis.arxdevs.xyz/api/bot-status",
  },
];

/** Auto-refresh interval (1 minute) */
export const REFRESH_INTERVAL_MS = 60_000;

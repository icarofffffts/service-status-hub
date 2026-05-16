import type { ServiceConfig } from "@/types/status";

/**
 * ARX Ecosystem — todos os servicos monitorados pelo status hub.
 */
export const SERVICES: ServiceConfig[] = [
  {
    id: "arxdevs-site",
    name: "Site Institucional",
    description: "arxdevs.xyz — Landing page e portal principal",
    healthCheckUrl: "https://arxdevs.xyz/api/health-check",
  },
  {
    id: "auth-portal",
    name: "Auth Portal",
    description: "Autenticacao centralizada — login unico para todo ecossistema",
    healthCheckUrl: "https://auth.arxdevs.xyz/api/health-check",
  },
  {
    id: "shield-site",
    name: "Shield Security",
    description: "Protecao contra golpes — dashboard e denuncias",
    healthCheckUrl: "https://shield.arxdevs.xyz/api/health-check",
  },
  {
    id: "shield-bot",
    name: "Shield Bot",
    description: "Bot Discord — monitoramento e notificacoes",
    healthCheckUrl: "https://shield.arxdevs.xyz/api/bot-status",
  },
  {
    id: "aegis-site",
    name: "Aegis Dashboard",
    description: "Painel de governanca — blacklist e moderação",
    healthCheckUrl: "https://aegis.arxdevs.xyz/api/health-check",
  },
  {
    id: "aegis-bot",
    name: "Aegis Bot",
    description: "Bot Discord — tolerancia zero e scan em tempo real",
    healthCheckUrl: "https://aegis.arxdevs.xyz/api/bot-status",
  },
];

/** Auto-refresh interval (60 segundos) */
export const REFRESH_INTERVAL_MS = 60_000;

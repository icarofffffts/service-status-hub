import type { ServiceConfig } from "@/types/status";

/**
 * Configure here the 5 services to display on the status page.
 * Replace `healthCheckUrl` with your real endpoints. Each endpoint must return
 * a JSON body matching `HealthCheckResponse` (see src/types/status.ts).
 *
 * While URLs start with "REPLACE_ME", the page will render with mocked data
 * so you can preview the layout in development.
 */
export const SERVICES: ServiceConfig[] = [
  {
    id: "company-site",
    name: "Site Institucional",
    description: "Site principal da empresa",
    healthCheckUrl: "REPLACE_ME_COMPANY_SITE",
  },
  {
    id: "product-a-site",
    name: "Site — Produto A",
    description: "Site público do Produto A",
    healthCheckUrl: "REPLACE_ME_PRODUCT_A_SITE",
  },
  {
    id: "product-a-bot",
    name: "Bot Discord — Produto A",
    description: "Bot do Discord do Produto A",
    healthCheckUrl: "REPLACE_ME_PRODUCT_A_BOT",
  },
  {
    id: "product-b-site",
    name: "Site — Produto B",
    description: "Site público do Produto B",
    healthCheckUrl: "REPLACE_ME_PRODUCT_B_SITE",
  },
  {
    id: "product-b-bot",
    name: "Bot Discord — Produto B",
    description: "Bot do Discord do Produto B",
    healthCheckUrl: "REPLACE_ME_PRODUCT_B_BOT",
  },
];

/** Auto-refresh interval in milliseconds. */
export const REFRESH_INTERVAL_MS = 60_000;

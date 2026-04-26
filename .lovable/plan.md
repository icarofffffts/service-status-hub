## Status Page — Visão Geral

Criar uma status page light mode, clean e corporativa, que centraliza o estado de 5 serviços listados de forma plana. A página apenas exibe os dados — toda a integração real (health checks, persistência) será feita por você depois. O frontend já estará pronto para consumir um endpoint de health check por serviço.

## Estrutura de páginas

- `/` — Status page principal (única página)

## Layout da página

Topo (header):
- Nome da empresa / logo placeholder
- Indicador global: "Todos os sistemas operacionais" / "Degradação parcial" / "Interrupção" — calculado a partir do estado dos 5 serviços
- Timestamp da última atualização + botão de refresh manual

Lista de serviços (5 itens planos, sem agrupamento):
1. Site da Empresa (institucional)
2. Site — Produto A
3. Bot Discord — Produto A
4. Site — Produto B
5. Bot Discord — Produto B

Cada card mostra:
- Nome do serviço + descrição curta
- Badge de status atual (Operacional / Degradado / Fora do ar / Verificando)
- Uptime % (últimos 90 dias)
- Latência atual em ms
- Barra de histórico de 90 dias (90 quadradinhos coloridos, estilo Statuspage; verde = ok, amarelo = degradado, vermelho = down, cinza = sem dado). Hover em cada quadradinho mostra a data e o status daquele dia.

Seção "Incidentes recentes":
- Lista cronológica dos últimos incidentes (data, serviço afetado, título, descrição, status: investigando/identificado/resolvido)
- Estado vazio amigável ("Nenhum incidente nos últimos 90 dias")

Rodapé:
- Link "Inscrever-se em atualizações" (placeholder, sem funcionalidade)
- Link para o site institucional

## Como o frontend consome os dados

Cada serviço tem sua própria URL de health check (você fornece depois). A página fará fetch paralelo para cada uma e espera uma resposta JSON no formato:

```json
{
  "status": "operational" | "degraded" | "down",
  "latencyMs": 123,
  "uptime90d": 99.95,
  "history": [{ "date": "2025-01-30", "status": "operational" }, ...],
  "incidents": [{ "id": "...", "title": "...", "startedAt": "...", "resolvedAt": "...", "status": "resolved", "description": "..." }]
}
```

A configuração dos 5 serviços (nome, descrição, URL do health check) ficará num único arquivo de config fácil de editar. Enquanto suas URLs reais não estiverem prontas, o arquivo já vem com URLs placeholder e mocks de fallback para que a página renderize bem em dev. Os incidentes recentes serão agregados das respostas dos 5 endpoints.

A página revalida automaticamente a cada 60 segundos e quando o usuário clica em "Atualizar".

## Estilo visual

- Light mode, paleta neutra (branco/cinza), tipografia sans-serif clean
- Cores semânticas: verde (operacional), amarelo (degradado), vermelho (fora do ar), cinza (sem dado)
- Espaçamento generoso, cantos suavemente arredondados, sem sombras pesadas
- Responsivo (mobile-first)

## Detalhes técnicos

- Rota única em `src/routes/index.tsx` substituindo o placeholder
- Arquivo `src/config/services.ts` exportando o array dos 5 serviços (nome, descrição, healthCheckUrl)
- Tipos compartilhados em `src/types/status.ts`
- Componentes: `OverallStatusBanner`, `ServiceCard`, `UptimeBar` (90 dias), `IncidentList`, `StatusBadge`
- TanStack Query (`useQuery`) para fetch dos 5 health checks em paralelo, `refetchInterval: 60_000`
- QueryClientProvider configurado no `__root.tsx` (ainda não existe no projeto) seguindo o padrão SSR-safe com `getRouter`
- Mock de fallback caso `fetch` falhe ou URL seja placeholder, para a UI nunca quebrar em dev
- `head()` com title/description próprios para a rota

## O que NÃO está incluído (você fará)

- Implementação dos endpoints de health check
- Persistência do histórico de 90 dias e incidentes
- Inscrição em notificações
- Autenticação ou painel admin
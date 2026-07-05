# ADR 0001 — Stack e Arquitetura do MES (Modular Monolith)

- **Status:** Aceito
- **Data:** 2026-07-04
- **Decisores:** Gustavo de Melo (matrícula 1220) + Claude Code
- **Supersede:** as referências a "Node + Express" e "index.html single-file" em `PRD.md` e `CLAUDE.md` (a serem reconciliadas na Fase 0 pelo agente `release-docs`).

## Contexto

O protótipo ([index.html](../../index.html) single-file, ~1.076 linhas) validou a UX do painel do operador, mas o escopo real cresceu muito além do MVP de 5 módulos: agora são **7 painéis** (Operador, Engenharia, Qualidade, Preset, Dispositivos, Manutenção, Gerência) sobre **~22 máquinas**, com **fluxo de operações dinâmico**, comunicação intersetorial e atualização em tempo real. O single-file não sustenta isso. Precisamos de uma arquitetura escalável, com type-safety ponta a ponta e fronteiras explícitas.

## Decisão

Refatorar para um **modular monolith** em TypeScript ponta a ponta, via **migração greenfield** (novo sistema do zero; o protótipo vira referência de UX descartável).

| Camada | Escolha | Motivo |
|---|---|---|
| Monorepo | **Nx** | Generators NestJS/React + enforce automático de fronteiras de módulo via lint tags — blinda o modular monolith contra acoplamento. |
| Backend | **NestJS** (sobre Express) + **Prisma** + **PostgreSQL** | Cada módulo = bounded context; DI, WebSocket gateway nativo, testabilidade. Evolui a decisão Node+Express do PRD sem contradizê-la. |
| Frontend | **Vite + React SPA** | App interno em LAN, sem SEO, kiosk por máquina. Servido como estático pelo NestJS. Mantém a stack simples. |
| Contrato front↔back | **REST + Zod** em `packages/shared` + **TanStack Query** | Um único contrato valida no back e tipa o front. Future-proof para TOTVS/MTConnect/mobile (sem acoplar a um cliente TS, como faria tRPC). |
| Real-time | **Socket.IO** (gateway NestJS) | Status de máquina, chat operador↔programador, badges de chamado. |
| Estado no front | **TanStack Query** (servidor) + **Zustand** (UI local) | Simples e suficiente. |

## Módulos (bounded contexts)

**A máquina é o aggregate root** — "tudo gira em torno da máquina". Cada PC é um kiosk vinculado permanentemente a uma máquina.

- **Core (shared kernel):** `auth` · `machines` · `orders` (fluxo de operações **DINÂMICO**, nunca fixo) · `people` · `realtime` · `notifications`
- **Domínio:** `production` (apontamento setup/ciclo/parada, tempo real de usinagem) · `tooling`(preset) · `inspection` · `engineering` · `quality` · `devices` · `maintenance` · `analytics`(oee)

**Regra inviolável:** módulos se comunicam **apenas por service público**. Proibido importar repositório/entidade/entranha de outro módulo.

## Estrutura alvo

```
apps/
  api/   NestJS + Prisma (modules/core + modules/<domínio>)
  web/   Vite + React (features/<painel>)
packages/
  shared/  contratos Zod, enums (15 motivos de parada), tipos de domínio
docs/adr/  decisões de arquitetura (este arquivo)
```

## Consequências

- **(+)** Type-safety ponta a ponta; fronteiras explícitas e verificáveis; caminho aberto para extrair um microserviço se algum dia a escala exigir.
- **(+)** Real-time nativo para o chão de fábrica.
- **(+)** Um contrato só (Zod) elimina divergência de tipos entre front e back.
- **(−)** Curva de aprendizado de Nx/NestJS maior que Express puro — mitigada pelos agentes especializados e pelas skills da metodologia.
- **Riscos herdados a resolver antes do go-live:** permissão de leitura em `\\servidor\NC\`, identidade de máquina por PC (binding do kiosk), seed de dados reais (23 ferramentas, 11 cotas, 15 motivos).

## Roadmap (strangler-fig sobre o greenfield)

`Fase 0` Fundação (monorepo + core + Prisma + tracer bullet) → `Fase 1` Operador (5 módulos do MVP) → `Fase 2` Suporte (Engenharia/Qualidade/Preset + chat real-time) → `Fase 3` Ativos (Dispositivos/Manutenção) → `Fase 4` Gerência (OEE/dashboard/mapa da fábrica).

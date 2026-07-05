# Fase 0 — Setup do ambiente de desenvolvimento

> **Bloqueio detectado (2026-07-04):** esta máquina só tem **git** instalado.
> Node.js, npm, pnpm e Docker estão **ausentes**. Sem eles não é possível
> scaffoldar nem rodar o monorepo Nx (NestJS + Vite/React + Prisma + Postgres).
> Este runbook leva de "máquina crua" até o **tracer bullet** rodando.

## Decisões travadas (sabatina Fase 0)
- **Estrutura:** Nx na raiz do repo; protótipo (`index.html`) vai para `/prototype`.
- **Banco dev:** Docker Postgres local.
- **Schema do tracer:** mínimo — `operadores`, `maquinas`, `ordens_producao`.
- **Binding de máquina por PC:** adiado para a Fase 1 (o tracer não precisa).

## 1. Pré-requisitos a instalar (ação do Gustavo)

| Ferramenta | Como | Por quê |
|---|---|---|
| **Node.js 22 LTS** | https://nodejs.org — instalador Windows `.msi` | Runtime de tudo (NestJS, Vite, Nx). Já traz `npm` + `corepack`. |
| **pnpm** | após o Node, no terminal: `corepack enable pnpm` | Gerenciador do monorepo (ADR-0001). |
| **Docker Desktop** | https://www.docker.com/products/docker-desktop | Sobe o Postgres local isolado. |
| *(opcional)* Nx Console | Extensão do VS Code | Generators do Nx com UI. |

> **Alternativa sem Docker:** instalar **PostgreSQL 16** nativo (https://www.postgresql.org/download/windows/) e ajustar a connection string. Docker é o recomendado por isolar o dev e não sujar nada.

Depois de instalar, **feche e reabra o VS Code / terminal** para o PATH atualizar. Confirme:

```
node -v     # v22.x
pnpm -v     # 9.x+
docker ps   # não pode dar erro
```

## 2. O que o Claude faz assim que o toolchain existir
1. Scaffold do workspace Nx na raiz (preservando git, docs, PRD/ISSUES).
2. `apps/api` (NestJS + Prisma) · `apps/web` (Vite + React) · `packages/shared` (Zod).
3. `docker-compose.yml` com Postgres; `prisma migrate` + seed (operador 1220, máquina MQ0281, OP 108339).
4. Endpoint REST `GET /api/operadores/:matricula` + tela React que consome.
5. Mover o protótipo para `/prototype`.
6. Rodar e **verificar o tracer ponta a ponta**.

## 3. Definition of Done da Fase 0 (tracer bullet)
- [ ] `pnpm install` + `nx serve api` / `nx serve web` sobem sem erro.
- [ ] Postgres no ar via `docker compose up -d`.
- [ ] Digitar `1220` na tela retorna "Gustavo de Melo" **vindo do banco** (não hardcoded).
- [ ] Header mostra matrícula + nome + OP 108339, todos via API.
- [ ] Contrato Zod compartilhado entre `apps/api` e `apps/web` (uma definição só).
- [ ] Teste (Jest) do endpoint passando.

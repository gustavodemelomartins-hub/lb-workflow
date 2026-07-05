# Documentação — Lima & Bonfá WorkFlow MES

Índice central da documentação do projeto. Mantido em sincronia com o código pelo agente `release-docs`.

## Documentos vivos (raiz do repo)
- [../PRD.md](../PRD.md) — Product Requirements: problema, solução, escopo, decisões.
- [../ISSUES.md](../ISSUES.md) — Fatias verticais de implementação (tracer bullet primeiro).
- [../CLAUDE.md](../CLAUDE.md) — Memória/instruções do projeto (carregada pelo Claude Code).
- [../v1-LB-Workflow.md](../v1-LB-Workflow.md) — Documento da 1ª versão (referência histórica).

## Arquitetura
- [adr/0001-stack-e-arquitetura.md](adr/0001-stack-e-arquitetura.md) — Decisão de stack e do *modular monolith*. **Fonte de verdade** — prevalece sobre referências antigas a "Node + Express / single-file".

## Setup e operação
- [fase-0-setup.md](fase-0-setup.md) — Runbook do ambiente de desenvolvimento (Node, Docker, monorepo Nx).

## Apresentação
- [apresentacao/planejamento-mes.html](apresentacao/planejamento-mes.html) — Relatório visual + organograma do esqueleto, para aprovação do dono. Abre direto no navegador (offline).
  - Versão publicada (privada, claude.ai): https://claude.ai/code/artifact/11c56e24-d1e5-4744-90aa-547ef1cfe263

## Time de agentes e metodologia
- Agentes em [../.claude/agents/](../.claude/agents/): `arquiteto-mes`, `backend-nestjs`, `frontend-react`, `qa-verificador`, `release-docs`.
- Skills (metodologia) em [../.claude/skills/](../.claude/skills/): `sabatina` → `to-prd` → `to-issues` → `tdd` → `ui-review`.

## Código
- [../apps/web/](../apps/web/) — Protótipo de aprovação (Vite + React). Reaproveitado como frontend de produção na Fase 0.

## Convenções
- ADRs numeradas em `adr/NNNN-titulo.md` (Contexto → Decisão → Consequências).
- Toda mudança de código acompanha a atualização da doc correspondente (responsabilidade do `release-docs`).

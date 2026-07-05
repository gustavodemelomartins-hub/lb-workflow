---
name: to-issues
description: Quebra o PRD em fatias VERTICAIS (tracer bullet primeiro) em ISSUES.md. Cada issue entrega valor de ponta a ponta — da tela ao banco. Use depois do to-prd.
---

# to-issues

Fatie o PRD em issues **verticais**. Nunca horizontais.

## Certo × Errado
- ❌ Horizontal: "criar todas as tabelas", "todo o CSS", "todos os endpoints".
- ✅ Vertical: "operador loga e vê uma OP de verdade" (tela → API → Prisma → banco → tela).

## Regras
- **Tracer bullet primeiro:** a fatia mais fina que prova a arquitetura ponta a ponta.
- Cada issue tem: **What to build**, **Acceptance criteria** (checkboxes verificáveis) e **Blocked by**.
- Uma issue = um valor entregável independentemente, respeitando os bloqueios.
- Desenhe o grafo de dependências ao final (quais issues rodam em paralelo).
- Respeite as fronteiras de módulo — uma issue que cruza módulos passa por service público.

Ao terminar, cada issue está pronta para o ciclo `tdd`.

---
name: sabatina
description: Entrevista o Gustavo uma pergunta por vez (com recomendação em cada) para resolver dependências de design ANTES de codar qualquer feature nova. Metodologia Matt Pocock (grill-me). Use no início de toda feature.
---

# Sabatina (grill-me)

Resolver toda ambiguidade de design **antes** de escrever código. Errar aqui custa retrabalho caro depois.

## Regras
- **Uma pergunta por vez.** Use a ferramenta AskUserQuestion. Nunca despeje várias de uma vez.
- Toda pergunta traz uma **recomendação explícita** (opção 1, marcada como recomendada) e o porquê.
- Ordene por dependência: decisões que travam outras vêm primeiro.
- **Pare** quando não restar nenhuma decisão que mude o que será construído. Não pergunte o que dá para inferir do código ou das ADRs.
- Ao final, resuma as decisões travadas e ofereça rodar a skill `to-prd`.

## Roteiro base (adapte à feature)
1. **Dor real** — que problema do operador/setor isso resolve? Qual o custo de não resolver?
2. **Fronteira** — que módulo(s) toca? Fere alguma fronteira do modular monolith?
3. **Dados** — entidades novas? Toca o schema Prisma? Precisa de migration?
4. **Contrato** — novo endpoint REST e/ou evento Socket.IO? Onde entra o schema Zod em `packages/shared`?
5. **UX** — cabe num painel existente? Respeita a identidade visual e contraste 4.5:1?
6. **Escopo** — qual a fatia vertical mais fina que prova a ideia ponta a ponta (tracer bullet)?
7. **Riscos** — rede interna, permissão de pasta, dados reais, auditoria Embraer?

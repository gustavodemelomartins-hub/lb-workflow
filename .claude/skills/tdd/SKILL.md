---
name: tdd
description: Implementa uma issue escrevendo o TESTE PRIMEIRO — vê falhar pelo motivo certo, implementa o mínimo para passar, refatora, commit atômico. Use ao implementar qualquer issue do ISSUES.md.
---

# TDD (test-first)

Um comportamento por vez. O teste é a especificação executável.

## Ciclo (por comportamento)
1. **Red** — escreva um teste que descreve UM comportamento do critério de aceite. Rode. Confirme que falha **pelo motivo certo** (não por erro de setup).
2. **Green** — implemente o **mínimo** para passar. Sem generalizar cedo.
3. **Refactor** — limpe mantendo o verde.
4. **Commit atômico** — via `release-docs`, conventional commit, um comportamento.

## Ferramentas
- Backend: Jest (`nx test api`). Frontend: Vitest + Testing Library (`nx test web`).
- Use dados reais nos testes: OP 108339 · PN S50-09057-009 · MQ0281 · T01–T30 · 11 cotas · 15 motivos de parada.

## Regras
- Nada de código de produção sem um teste falhando antes.
- Teste comportamento, não implementação (o teste sobrevive a refactor).
- Ao fechar todos os critérios de aceite da issue, chame `qa-verificador` para revisão independente em contexto limpo.

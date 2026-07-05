---
name: to-prd
description: Formaliza as decisões da sabatina em PRD.md — problema, solução, user stories, decisões técnicas, escopo e riscos. Use depois da sabatina, antes de fatiar em issues.
---

# to-prd

Transforme as decisões travadas na `sabatina` em uma seção clara e verificável do `PRD.md`.

## Estrutura
1. **Problem Statement** — a dor real + custo de não resolver (concreto, com dados).
2. **Solution** — como o MES resolve, em um parágrafo.
3. **User Stories** — "Como <persona>, quero <ação> para <valor>." Cubra o operador + o setor afetado.
4. **Implementation Decisions** — tabela Decisão | Escolha | Razão. Aponte para a ADR quando houver.
5. **Escopo (dentro / fora)** — seja explícito no que **não** entra.
6. **Testing** — como validar com dados reais (OP 108339 e afins).
7. **Riscos / Open questions.**

## Regras
- Escreva em pt-BR. Nada de decisão nova aqui — o PRD só formaliza o que a sabatina travou.
- Toda decisão de arquitetura relevante vira também uma ADR (peça ao `arquiteto-mes`).
- Ao terminar, ofereça rodar a skill `to-issues`.

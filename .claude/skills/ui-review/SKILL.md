---
name: ui-review
description: Revisa a UI antes de entregar — identidade visual Lima & Bonfá, acessibilidade de chão de fábrica, status com cor+forma, contraste e alvos de toque. Metodologia ui-ux-pro-max. Use antes de dar uma tela por concluída.
---

# ui-review (ui-ux-pro-max)

Revisão de UI para ambiente de chão de fábrica — iluminação variável, operador de luvas, tela vista a distância.

## Checklist
- [ ] **Paleta LB:** azul `#1565C0`, teal `#00B4C8`, grafite `#4A4A4A` aplicados consistentemente.
- [ ] **Status com cor + forma/ícone** (nunca só cor): verde OK / amarelo atenção / vermelho parada.
- [ ] **Contraste ≥ 4.5:1** em todo texto. Verifique nos piores casos (texto sobre cor de status).
- [ ] **Logo LB** presente no header do painel.
- [ ] **Alvos de toque** grandes; espaçamento suficiente para dedos/luvas.
- [ ] **Legibilidade a distância:** fontes grandes, hierarquia clara.
- [ ] **Ícones SVG inline** — sem emoji.
- [ ] **Estados:** loading / erro / vazio tratados (rede interna pode cair).
- [ ] **Dashboard travado** (cinza) até a OP carregar.

## Saída
Liste violações com `arquivo:linha` e a correção sugerida. Veredito: **PRONTO** ou **AJUSTAR** + lista.

# Lima & Bonfá WorkFlow MES

Sistema MES (Manufacturing Execution System) para o chão de fábrica da Lima & Bonfá.
Foco inicial: Mazak MQ0280/MQ0281 (Centros de Usinagem 5 Eixos Variaxis).

## Identidade visual (obrigatória)

Cores corporativas reais da Lima & Bonfá — usar em todo o sistema:
- Azul primário: `#1565C0`
- Teal/ciano (gradiente do logo): `#00B4C8`
- Grafite (texto do logo): `#4A4A4A`
- Status: verde `#22C55E` (OK), amarelo `#F59E0B` (atenção), vermelho `#EF4444` (parada)

Logo: "LB" + "Lima & Bonfá". Tipografia limpa, contraste mínimo 4.5:1 (ambiente de fábrica).

## Decisões de arquitetura (travadas na sabatina)

| Tema | Decisão |
|---|---|
| Cliente | Browser (Chrome/Edge) no PC existente do posto — sem hardware novo |
| Backend | Node.js + Express, rede interna `192.168.0.X` |
| Banco | PostgreSQL central no servidor interno da empresa |
| Login | Tela própria. Matrícula numérica, sem senha (Gustavo = 1220) |
| Logo | Logo oficial Lima & Bonfá (LB gradiente teal→azul + wordmark grafite) — OBRIGATÓRIA |
| Carregar trabalho | Operador digita o número da **OP** (ex: 108339) |
| Estado inicial | Dashboard CINZA TRAVADO até a OP ser carregada; campo de OP em destaque |
| TOTVS | SEM integração no MVP — operador digita a OP manualmente |
| Pasta de processo | Busca automática em `\\servidor\NC\[MÁQUINA]\[OP]\` |
| Magazine | Drag-and-drop sem offset; integração Zoller fica pra v2 |
| Tempo produtivo | "Iniciar Setup" / "Peça Concluída" |
| Tempo de parada | Botão "Parar Máquina" + escolha de MOTIVO. Acumula downtime por causa (relatório p/ PCP) |
| Manutenção do código | Gustavo (matrícula 1220) + Claude Code — manter stack SIMPLES |

## Escopo do MVP (v1)

A — Visualizador de processo (busca PDF automático)
B — Magazine virtual drag-and-drop
C — Inspeção volante digital (frequência automática + histórico)
D — Botões de suporte (Engenharia/Inspeção/Manutenção/Preset)
E — Apontamento de tempo (setup + ciclo)

Fora do MVP: fila de produção (F), integração TOTVS, integração Zoller, app mobile, dashboard gerencial.

## Fluxo de trabalho deste projeto (SEMPRE seguir nesta ordem)

Metodologia Matt Pocock. Antes de escrever código novo, seguir o roteiro:

1. **Sabatina (grill-me):** antes de qualquer feature nova, entrevistar o Gustavo uma pergunta por vez, com recomendação em cada. Resolver dependências de design antes de codar.
2. **PRD (to-prd):** formalizar decisões em `PRD.md` (problema, solução, user stories, decisões técnicas, escopo, riscos).
3. **Issues (to-issues):** quebrar o PRD em fatias VERTICAIS (tracer bullet primeiro) em `ISSUES.md`. Nunca fatiar horizontalmente (ex: "todas as tabelas" é errado; "operador loga e vê uma OP" é certo).
4. **TDD (tdd):** implementar cada issue escrevendo o TESTE PRIMEIRO. Confirmar que falha pelo motivo certo, então implementar o mínimo para passar. Commit atômico por comportamento.
5. **Revisão de UI (ui-ux-pro-max):** revisar design antes de entregar — acessibilidade, status com cor+forma, contraste, alvos de toque.

Artefatos vivos: `PRD.md` e `ISSUES.md` já existem neste diretório. Atualizá-los quando o escopo mudar.

## Dados reais para teste

- OP 108339 · PN S50-09057-009 · SUPORTE PONTA 009 · Cliente Embraer · Máquina MQ0281
- Biblioteca de ferramentas Alumínio: T01–T30 (23 ferramentas ativas)
- Inspeção volante: 11 cotas com tolerâncias reais (ver `PRD.md`)
- Tabela de frequência: lote 2-10→cada 2; 11-30→cada 5; 31-64→cada 8; 65+→cada 10

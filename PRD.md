# PRD: Lima & Bonfá WorkFlow MES

> **Evolução de escopo — 04/07/2026.** O que começou como um MVP de 5 telas para as Mazak
> evoluiu para o **centro operacional digital da fábrica**: 7 painéis sobre ~22 máquinas, em
> arquitetura *modular monolith*. As decisões técnicas desta seção são governadas pela
> [ADR-0001](docs/adr/0001-stack-e-arquitetura.md) (fonte de verdade). Índice de docs em
> [docs/README.md](docs/README.md).

## Problem Statement

Hoje praticamente todos os processos da Lima & Bonfá (usinagem aeronáutica para a Embraer) são manuais. Operadores CNC perdem tempo produtivo buscando programas em pastas de rede; preenchem inspeção volante em papel (risco de perda e falta de rastreabilidade para auditoria Embraer); e não têm canal digital para acionar Engenharia/Preset/Manutenção/Qualidade. O tempo real de setup e ciclo não é capturado — o PCP só tem o tempo padrão do TOTVS, nunca o real. Não há histórico, rastreabilidade, monitoramento das máquinas nem indicadores; e os setores (engenharia, qualidade, preset, dispositivos, manutenção) operam isolados, sem comunicação digital.

Custo de não resolver: retrabalho por setup incorreto, não conformidades em auditorias Embraer por falta de registros, e invisibilidade total da eficiência real do chão de fábrica.

## Solution

Sistema MES (Manufacturing Execution System) web, rodando na rede interna (`192.168.0.X`), acessado pelo browser do PC já existente em cada posto. **Todo o sistema gira em torno da máquina**: cada PC é um kiosk vinculado permanentemente a uma máquina, e toda informação (operador, OS, status, tempos, ferramentas, dispositivos, histórico, comunicação, indicadores) parte dela. O operador se identifica pela matrícula, informa a OP, e o sistema entrega o processo correto, inspeção volante digital, magazine virtual rastreável, apontamento de tempo real de cada peça e comunicação direta com os setores de suporte — enquanto Engenharia, Qualidade, Preset, Dispositivos, Manutenção e Gerência ganham painéis próprios integrados em tempo real.

## Escopo & Arquitetura

Arquitetura **modular monolith** (um único app para instalar e manter, dividido em módulos por domínio). Ver [ADR-0001](docs/adr/0001-stack-e-arquitetura.md). A máquina é o *aggregate root*; o fluxo de operações de cada OP é **dinâmico** (ex.: 10 Serra → 15 Torno → … → 45 Inspeção varia por peça) — jamais fixo.

### Os 7 painéis (bounded contexts)

| Painel | Papel | Fase |
| --- | --- | --- |
| **Operador** | Login por chapa, OP, processo, magazine, inspeção volante, apontamento de tempo real | 1 |
| **Engenharia** | Solicitações das máquinas, atribuição a programadores, chat + histórico por peça | 2 |
| **Qualidade** | Solicitações de inspeção, montagem de instrumentos, histórico de medições | 2 |
| **Preset** | Mapa da fábrica, magazine virtual, fila de preparação, vida útil, rastreio de trocas (quebra/desgaste/ajuste) | 2 |
| **Dispositivos** | Dispositivo por máquina, próximos necessários, disponibilidade, manutenção | 3 |
| **Manutenção** | Chamados, preventivas, corretivas, calendário, prioridades, máquinas indisponíveis | 3 |
| **Gerência** | Dashboard executivo: mapa da fábrica, OEE, disponibilidade, performance, qualidade, tempo parado, KPIs | 4 |

Módulos de núcleo (shared kernel): `auth`, `machines`, `orders`, `people`, `realtime`, `notifications`. Regra inviolável: módulos se comunicam **apenas por service público**.

## User Stories

- Como **operador**, quero digitar minha matrícula e a OP para o sistema me mostrar o processo correto sem navegar em pastas de rede.
- Como **operador**, quero montar o magazine virtual para registrar quem montou quais ferramentas e em que posição.
- Como **operador**, quero ser alertado na frequência correta de medição e registrar as medidas direto na tela.
- Como **operador**, quero controlar produção/setup/parada para o sistema registrar meu tempo real e os motivos de parada.
- Como **operador**, quero acionar Engenharia, Preset, Manutenção ou Qualidade com um botão, sem sair do posto.
- Como **programador (Engenharia)**, quero receber e atender solicitações das máquinas com chat registrado para reaproveitar em futuras produções da mesma peça.
- Como **gestor de Qualidade**, quero o histórico de inspeções por OP/máquina/operador para rastreabilidade nas auditorias Embraer.
- Como **Preset**, quero ver a fila de preparação e rastrear cada troca de ferramenta por motivo (quebra/desgaste/ajuste).
- Como **Manutenção**, quero gerir chamados, preventivas e corretivas com prioridade e calendário.
- Como **Gerência/PCP**, quero OEE e tempo parado por motivo em tempo real para atacar os maiores gargalos.

## Implementation Decisions

| Decisão | Escolha | Razão |
| --- | --- | --- |
| Plataforma cliente | Browser (Chrome/Edge) no PC existente — kiosk por máquina | Zero custo de hardware |
| Arquitetura | Modular monolith ([ADR-0001](docs/adr/0001-stack-e-arquitetura.md)) | Um app para instalar/manter, módulos por domínio, escalável |
| Monorepo | Nx (pnpm) | Fronteiras de módulo garantidas + generators NestJS/React |
| Backend | NestJS + Prisma + PostgreSQL | Modular nativo, real-time, banco central rastreável |
| Frontend | Vite + React (TypeScript) | App interno LAN, rápido; servido como estático pelo NestJS |
| Contrato front↔back | REST + Zod (`packages/shared`) + TanStack Query | Um contrato validado nas duas pontas, sem divergência de tipos |
| Tempo real | Socket.IO | Status de máquina, chat, badges de chamado ao vivo |
| Migração | Greenfield — protótipo vira referência de UX | ADR-0001 |
| Autenticação | Matrícula numérica sem senha | Troca de turno rápida, sem atrito |
| Integração TOTVS | Nenhuma agora — operador digita a OP | Evita burocracia de TI; integra depois |
| Arquivos de processo | Busca automática em `\\servidor\NC\[MAQUINA]\[OP]\` | Estrutura de pasta já existe |
| Design/Identidade | Azul `#1565C0` + teal `#00B4C8` + grafite `#4A4A4A`, contraste ≥ 4.5:1 | Identidade corporativa real |
| Manutenção | Gustavo de Melo (1220) + time de agentes Claude Code | Dev interno com assistência de IA |

## Estratégia de entrega (faseada)

| Fase | Entrega | Status |
| --- | --- | --- |
| **P** | Protótipo de aprovação — `apps/web` navegável, visão completa (Operador funcional + prévia dos 7 painéis), dados mock | **Concluída** |
| **0** | Fundação — monorepo Nx + NestJS + PostgreSQL + tracer bullet (login → API → banco → tela) | Após aprovação |
| **1** | Painel do Operador — os 5 módulos abaixo (A–E), com API e banco reais | Planejada |
| **2** | Suporte — Engenharia, Qualidade, Preset + chat/solicitações em tempo real | Planejada |
| **3** | Ativos — Dispositivos e Manutenção | Planejada |
| **4** | Gerência — OEE, dashboard executivo, mapa da fábrica | Planejada |

O protótipo da Fase P **não é descartável**: os componentes React viram o `apps/web` de produção, trocando os dados mock pela API.

## Fase 1 — Painel do Operador (detalhe)

### A — Visualizador de Processo

Operador informa a OP → sistema busca o PDF em `\\servidor\NC\[MAQUINA]\[OP]\` e renderiza inline com navegação de páginas. Exibe PN, revisão e orçamento.

### B — Magazine Virtual

Biblioteca padrão (Alumínio: T01–T30) → 30 slots do magazine físico. Montagem visual grava operador, data/hora e ferramenta por slot.

### C — Inspeção Volante Digital

Cotas e tolerâncias por OP. Frequência automática pelo tamanho do lote. Alerta visual + sonoro no gatilho. Validação em tempo real (verde OK / vermelho NOK). Histórico por operador/turno/OP.

### D — Suporte Intersetorial

Botões Engenharia / Qualidade / Manutenção / Preset → modal → chamado gravado (setor, operador, máquina, OP, mensagem, timestamp, status). Badge de pendentes por setor.

### E — Apontamento de Tempo

Estados Produção / Setup / Parada com cronômetro ao vivo colorido. Parada exige **motivo** (15 opções, acumula downtime por causa para o PCP). "Peça Concluída" incrementa o contador; o tempo produtivo só reinicia quando a peça é apontada — objetivo: tempo real de usinagem por peça. Compara real vs. padrão.

## Testing Decisions

- Cada funcionalidade validada com dados reais: OP 108339 (Suporte Ponta — Embraer), máquina MQ0281.
- Inspeção: validar as 11 cotas do PN S50-09057-009 com tolerâncias reais.
- Magazine: montar/desmontar as 23 ferramentas da biblioteca Alumínio.
- Apontamento: validar deltas de setup/ciclo e acúmulo de downtime por motivo.
- Conectividade: acesso ao PDF em `\\servidor\NC\MQ0281\108339\`.
- TDD (skill `tdd`): teste primeiro; `qa-verificador` revisa em contexto limpo antes do merge.

## Out of Scope (agora)

- Integração TOTVS (fila de produção automática) — operador digita a OP.
- Integração Zoller (offsets de ferramenta no magazine) — prioridade após MVP.
- Integração MTConnect com o CNC Mazak.
- App mobile/tablet nativo (foco em browser desktop; layout responsivo já previsto).
- Alertas por WhatsApp/email.
- Multi-idioma.

## Riscos & Open Questions

- **Permissão de leitura** em `\\servidor\NC\` pelo processo NestJS no servidor — validar antes da Fase 1.
- **Identidade de máquina por PC** (binding do kiosk) — mecanismo a definir na Fase 1.
- **Biblioteca de ferramentas** para outros materiais (Inox, Titânio) além do Alumínio — cadastrar antes do go-live.
- **Nomenclatura do PDF** dentro da pasta da OP (sempre `processo.pdf`?) — confirmar.
- **`.gitignore`** ignora `package.json` de forma recursiva — corrigir na Fase 0 para versionar `apps/web/package.json`.
- **Escalabilidade:** arquitetura deve suportar as ~22 máquinas do parque, não só as 2 Mazak iniciais.

## Time & Metodologia

Desenvolvimento por Gustavo (1220) + time de agentes Claude Code (`arquiteto-mes`, `backend-nestjs`, `frontend-react`, `qa-verificador`, `release-docs`), seguindo a metodologia **sabatina → to-prd → to-issues → tdd → ui-review** (skills em [.claude/skills/](.claude/skills/)).

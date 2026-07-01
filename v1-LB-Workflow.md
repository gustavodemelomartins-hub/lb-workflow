# Lima & Bonfá WorkFlow MES — Primeira Versão

> Documento de referência gerado na sessão inaugural do projeto (30/06/2026).
> Captura todas as decisões, escopo, arquitetura e dados reais acordados.

---

## 1. O Projeto

**Nome:** Lima & Bonfá WorkFlow MES
**Tipo:** Manufacturing Execution System (MES) web para chão de fábrica
**Foco inicial:** Mazak MQ0280 / MQ0281 — Centros de Usinagem 5 Eixos Variaxis
**Futuro:** ~20 máquinas no total
**Desenvolvedor:** Gustavo de Melo (matrícula 1220) + Claude Code

---

## 2. Identidade Visual (obrigatória)

| Elemento | Valor |
|---|---|
| Azul primário | `#1565C0` |
| Teal/ciano (gradiente logo) | `#00B4C8` |
| Grafite (texto) | `#4A4A4A` |
| Status OK | `#22C55E` (verde) |
| Status atenção | `#F59E0B` (amarelo) |
| Status parada | `#EF4444` (vermelho) |
| Logo | `logo.png` — LB gradiente teal→azul + wordmark grafite |
| Contraste mínimo | 4.5:1 (ambiente de fábrica) |

**Regra:** Logo é indiscutível em todas as telas. Sem emoji — apenas ícones SVG inline.

---

## 3. Arquitetura Técnica

| Tema | Decisão |
|---|---|
| Cliente | Browser (Chrome/Edge) no PC existente do posto |
| Backend | Node.js + Express, rede interna `192.168.0.X` |
| Banco | PostgreSQL no servidor interno da empresa |
| Login | Matrícula numérica sem senha |
| Carregar trabalho | Operador digita número da OP manualmente |
| Estado inicial | Dashboard CINZA TRAVADO até OP ser carregada |
| TOTVS | SEM integração no MVP — v2 integra |
| Pasta de processo | `\\servidor\NC\[MÁQUINA]\[OP]\` |
| Magazine | Drag-and-drop (HTML5 API); integração Zoller fica pra v2 |
| Manutenção do código | Gustavo + Claude Code — stack simples |

---

## 4. Escopo do MVP v1

### Dentro do MVP

| Módulo | Descrição |
|---|---|
| **A — Visualizador de Processo** | Busca PDF automático em `\\servidor\NC\[MÁQUINA]\[OP]\`, renderiza inline |
| **B — Magazine Virtual** | Drag-and-drop visual de T01–T30, grava no banco |
| **C — Inspeção Volante Digital** | Cotas + frequência automática + alerta + histórico |
| **D — Suporte Intersetorial** | Botões Engenharia / Inspeção / Manutenção / Preset → modal → banco |
| **E — Apontamento de Tempo** | Setup + ciclo com cronômetro, contador de peças |

### Fora do MVP (v2+)

- F — Fila de produção (integração TOTVS)
- Integração Zoller (offsets de ferramenta)
- App mobile / tablet
- Dashboard gerencial para PCP/Qualidade
- MTConnect com CNC Mazak
- Alertas WhatsApp/email

---

## 5. Fluxo de Login e Estados da Máquina

```
[Tela de Login]
  └─ campo matrícula → doLogin()
       └─ dashboard aparece (CINZA TRAVADO, body.locked)
            └─ campo OP → loadOP()
                 └─ dashboard DESBLOQUEADO
                      └─ machineState = 'stopped' (padrão)
                           ├─ "Rodar Máquina" → 'producing' (timer verde)
                           ├─ "Iniciar Setup" → 'setup' (timer amarelo)
                           ├─ "Parar Máquina" → selecionar motivo → 'stopped'
                           └─ "Peça Concluída" → incrementa contador → checa inspeção
```

**CSS de bloqueio:**
```css
body.locked .main-nav,
body.locked .content {
  filter: grayscale(1);
  opacity: .45;
  pointer-events: none;
}
```

---

## 6. Motivos de Parada (15 opções)

1. Aguardando inspeção/liberação
2. Troca ou quebra de ferramenta
3. Manutenção/quebra de máquina
4. Falta de matéria-prima
5. Falta de programa NC/processo
6. Falta de dispositivo de fixação
7. Aguardando preset de ferramenta
8. Ajuste dimensional
9. Limpeza/remoção de cavaco
10. Refeição/intervalo
11. Necessidade fisiológica
12. Reunião/treinamento
13. Falta de energia
14. Troca de turno
15. Outro motivo

---

## 7. Dados Reais de Teste

| Campo | Valor |
|---|---|
| OP de teste | 108339 |
| Part Number | S50-09057-009 |
| Descrição | SUPORTE PONTA 009 |
| Cliente | Embraer |
| Máquina | MQ0281 |
| Operador | Gustavo de Melo (matrícula 1220) |

---

## 8. Biblioteca de Ferramentas — Alumínio (T01–T30)

23 ferramentas ativas (T01–T17 + T25–T30):

| Pos | Descrição |
|---|---|
| T01 | Fresa de topo Ø20 Z4 Metal Duro |
| T02 | Fresa esférica Ø16 R8 Metal Duro |
| T03 | Fresa de topo Ø12 Z4 Metal Duro |
| T04 | Fresa esférica Ø12 R6 Metal Duro |
| T05 | Fresa esférica Ø10 R5 Metal Duro |
| T06 | Fresa de topo Ø8 Z4 Metal Duro |
| T07 | Broca helicoidal Ø5.1 DIN6537 |
| T08 | Broca helicoidal Ø4.2 DIN6537 |
| T09 | Broca helicoidal Ø3.3 DIN6537 |
| T10 | Broca helicoidal Ø2.55 DIN6537 |
| T11 | Macho M6x1.0 Espiral |
| T12 | Macho M5x0.8 Espiral |
| T13 | Macho M4x0.7 Espiral |
| T14 | Fresa de chanfrar 90° Ø16 |
| T15 | Fresa de topo Ø6 Z4 Metal Duro |
| T16 | Broca helicoidal Ø6.8 DIN6537 |
| T17 | Broca de centro Ø3 |
| T25 | Cabeçote de fresamento Ø50 |
| T26 | Pastilha APKT 11 03 PDSR |
| T27 | Fresa de topo Ø4 Z4 Metal Duro |
| T28 | Broca helicoidal Ø8.5 DIN6537 |
| T29 | Macho M10x1.5 Espiral |
| T30 | Fresa de topo Ø25 Z4 Metal Duro |

---

## 9. Inspeção Volante — 11 Cotas (PN S50-09057-009)

| # | Descrição | Nominal | Tol. + | Tol. − |
|---|---|---|---|---|
| 1 | Comprimento total | 120.00 mm | +0.05 | −0.05 |
| 2 | Largura principal | 45.00 mm | +0.03 | −0.03 |
| 3 | Altura do suporte | 32.50 mm | +0.02 | −0.02 |
| 4 | Diâmetro furo Ø1 | 12.00 mm | +0.018 | 0 |
| 5 | Diâmetro furo Ø2 | 8.00 mm | +0.015 | 0 |
| 6 | Distância entre furos | 85.00 mm | +0.05 | −0.05 |
| 7 | Profundidade rebaixo | 5.00 mm | +0.03 | −0.03 |
| 8 | Raio de concordância | 2.00 mm | +0.1 | −0.1 |
| 9 | Angulação chanfro | 45.00° | +0.5° | −0.5° |
| 10 | Espessura parede | 8.50 mm | +0.05 | −0.05 |
| 11 | Posição centro Ø1 | 22.50 mm | +0.03 | −0.03 |

---

## 10. Frequência de Inspeção Volante

| Tamanho do lote | Inspecionar a cada |
|---|---|
| 2 – 10 peças | cada 2 |
| 11 – 30 peças | cada 5 |
| 31 – 64 peças | cada 8 |
| 65+ peças | cada 10 |

---

## 11. Estrutura de Arquivos do Projeto

```
C:\Users\User\Desktop\Lima e Bonfa Workflow\
├── index.html          ← aplicação completa (single-file HTML/CSS/JS)
├── logo.png            ← logo oficial Lima & Bonfá (102 KB)
├── login-bg.webp       ← foto CNC/usinagem fundo tela login (77 KB)
├── CLAUDE.md           ← memória do projeto (carregada automaticamente)
├── PRD.md              ← Product Requirements Document
├── ISSUES.md           ← 9 issues verticais com dependências
└── v1-LB-Workflow.md   ← este documento
```

---

## 12. Arquitetura do index.html (Demo)

### Sistema de ícones SVG
```html
<!-- símbolos definidos no topo, invisíveis -->
<svg style="display:none">
  <symbol id="i-play" viewBox="0 0 24 24">...</symbol>
  <!-- i-file, i-tool, i-ruler, i-pause, i-check, i-x, i-folder,
       i-message, i-device, i-search, i-gear, i-alert, i-arrow,
       i-power, i-photo, i-chart, i-server, i-bit -->
</svg>

<!-- uso em qualquer lugar -->
<svg class="ic"><use href="#i-play"/></svg>
```

### Funções JS principais

| Função | O que faz |
|---|---|
| `doLogin()` | Valida matrícula, esconde tela de login |
| `loadOP()` | Remove `body.locked`, define `machineState = 'stopped'` |
| `runMachine()` | Estado → 'producing', inicia timer verde |
| `toggleSetup()` | Alterna estado setup com timer amarelo |
| `onStopBtn()` | Abre modal de motivo de parada |
| `selectStopReason(reason)` | Registra motivo, inicia timer de parada |
| `resumeMachine()` | Retoma produção após parada |
| `completePiece()` | Incrementa contador, checa frequência de inspeção |
| `renderLibrary()` | Renderiza biblioteca de ferramentas |
| `renderMagazine()` | Renderiza 30 slots do magazine |
| `validateMeasure(input)` | Validação em tempo real (verde/vermelho) |
| `fmtTime(ms)` | Formata ms → HH:MM:SS |
| `fmtMin(ms)` | Formata ms → Hh Mm |

### Dados hardcoded (MVP demo)
```js
const OPERATORS = { '1220': 'Gustavo de Melo' };
// 23 ferramentas em TOOLS[]
// 11 itens em INSP_ITEMS[]
```

---

## 13. Issues — Ordem de Implementação (Sistema Real)

```
#0 Tracer Bullet ──> #1 Schema BD ──> #2 Login ──> #3 Processo PDF
                                                 ├──> #4 Magazine
                                                 ├──> #5 Inspeção
                                                 ├──> #6 Suporte
                                                 └──> #7 Apontamento
                                         └──────────────> #8 Identidade visual
```

**#0** prova a arquitetura ponta a ponta: browser → Express → PostgreSQL → browser.
**#3–#7** são independentes entre si; podem rodar em paralelo após #2.

---

## 14. Agentes Claude Code

### Pesquisador Nato
- **Arquivo:** `.claude/agents/pesquisador-nato.md`
- **Missão:** pesquisar e baixar imagens de ferramentas de usinagem de sites de fornecedores
- **Fontes:** Sandvik, Iscar, Mitsubishi, Kennametal, Walter, Seco, OSG, Dormer Pramet
- **Pasta de saída:** `C:\Users\User\Desktop\pesquisas do nato\`
- **Nomenclatura:** `T05_fresa-esferica-D12-R6.jpg`
- **Status inicial:** agente criado; pesquisa de fotos para o magazine pendente

---

## 15. Metodologia de Desenvolvimento

Ordem obrigatória para qualquer feature nova:

1. **Sabatina (grill-me)** — uma pergunta por vez, resolver design antes de codar
2. **PRD (to-prd)** — formalizar em `PRD.md`
3. **Issues (to-issues)** — fatias VERTICAIS em `ISSUES.md` (tracer bullet primeiro)
4. **TDD (tdd)** — teste falha → implementação mínima → passa → commit atômico
5. **Revisão de UI (ui-ux-pro-max)** — acessibilidade, contraste, alvos de toque

---

## 16. Próximos Passos

### Imediato (demo)
- [ ] Abrir `index.html` no Chrome e verificar tela de login (logo + background)
- [ ] Pesquisador Nato buscar imagens reais das ferramentas para o magazine
- [ ] Integrar fotos nas cards do magazine virtual

### Após aprovação do chefe
- [ ] Instalar Node.js no servidor interno
- [ ] Criar banco PostgreSQL com `schema.sql` + `seed.sql`
- [ ] Implementar tracer bullet (#0): Express → PostgreSQL → browser
- [ ] Seguir issues #1 → #2 → #3–#7 em paralelo → #8

### Riscos a resolver antes do go-live
- Permissão de leitura do processo Node.js na pasta `\\servidor\NC\`
- Padrão de nomenclatura do PDF dentro da pasta da OP
- Biblioteca de ferramentas para outros materiais (Inox, Titânio)

---

*Gerado por Claude Code em 30/06/2026.*

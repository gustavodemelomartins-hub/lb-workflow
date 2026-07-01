# ISSUES — Lima & Bonfá WorkFlow MES (MVP v1)

> Fatias verticais (tracer bullet). Cada issue entrega valor de ponta a ponta — da tela ao banco — e pode ser pega independentemente, respeitando os bloqueios listados.

---

## #0 — Tracer Bullet: "Operador loga e vê uma OP de verdade"

**Parent:** Fundação

**What to build:**
A fatia mais fina possível que prova a arquitetura inteira de ponta a ponta. Servidor Node.js + Express rodando no servidor interno, conectado ao PostgreSQL, servindo uma página HTML. O operador digita matrícula `1220` → o sistema valida no banco → mostra a tela com header "1220 · Gustavo de Melo" e um número de OP fixo (108339) lido do banco. Nada de PDF, nada de magazine ainda. Só provar: browser → Express → PostgreSQL → browser.

**Acceptance criteria:**
- [ ] `npm start` sobe o Express na porta definida, acessível via `192.168.0.X` de outro PC da rede
- [ ] Tabela `operadores` existe no PostgreSQL com a matrícula 1220 cadastrada
- [ ] Tabela `ordens_producao` existe com a OP 108339 cadastrada (PN, descrição, máquina)
- [ ] Digitar 1220 na tela retorna o nome do operador vindo do banco (não hardcoded no front)
- [ ] O header exibe matrícula, nome e OP, todos lidos via API do backend

**Blocked by:** none

---

## #1 — Schema completo do banco de dados

**Parent:** Fundação

**What to build:**
Script SQL de modelagem com todas as tabelas do MVP: `operadores`, `maquinas`, `ordens_producao`, `ferramentas`, `magazine_virtual` (FK para máquina e OP), `inspecoes_volantes`, `cotas_inspecao`, `historico_tempos`, `chamados_suporte`. Incluir seed inicial: operador 1220, máquinas MQ0280/MQ0281, OP 108339, biblioteca de ferramentas Alumínio (T01–T30), e as 11 cotas do PN S50-09057-009.

**Acceptance criteria:**
- [ ] Script `schema.sql` cria todas as tabelas com chaves estrangeiras corretas
- [ ] Script `seed.sql` popula dados reais (operador, máquinas, OP, ferramentas, cotas)
- [ ] Constraints garantem integridade (ex: um slot de magazine não pode ter duas ferramentas)
- [ ] Roda limpo num PostgreSQL vazio sem erros

**Blocked by:** none (pode rodar em paralelo com #0; #0 usa um subconjunto)

---

## #2 — Login por matrícula

**Parent:** A — Identificação

**What to build:**
Tela de login simples: campo de matrícula numérica, sem senha. Valida contra a tabela `operadores`. Mantém a sessão do operador ativa. Botão de "Trocar Operador" para troca de turno rápida.

**Acceptance criteria:**
- [ ] Campo aceita apenas números, foco automático ao carregar
- [ ] Matrícula válida → entra no sistema; inválida → mensagem clara
- [ ] Sessão persiste até troca explícita de operador
- [ ] Troca de turno leva menos de 10 segundos

**Blocked by:** #0

---

## #3 — Visualizador de Processo com busca automática do PDF

**Parent:** A — Visualizador de Processo

**What to build:**
Operador informa a OP → backend monta o caminho `\\servidor\NC\[MAQUINA]\[OP]\` → localiza o PDF → serve para o front renderizar inline com navegação de páginas. Header mostra PN, revisão e orçamento vindos da tabela `ordens_producao`.

**Acceptance criteria:**
- [ ] Backend lê a pasta de rede e encontra o PDF da OP automaticamente
- [ ] PDF renderiza inline no browser com botões Anterior/Próxima e indicador de página
- [ ] Se o arquivo não existe, mensagem clara ("Processo não encontrado na pasta de rede")
- [ ] Permissões de leitura da pasta de rede validadas no servidor

**Blocked by:** #1, #2

---

## #4 — Magazine Virtual drag-and-drop

**Parent:** B — Magazine Virtual

**What to build:**
Biblioteca de ferramentas (T01–T30 Alumínio) lida do banco à esquerda; 30 slots do magazine à direita. Drag-and-drop com HTML5 Drag and Drop API. Cada montagem grava em `magazine_virtual`: operador, máquina, OP, slot, ferramenta, timestamp. Remover ferramenta de um slot também é registrado.

**Acceptance criteria:**
- [ ] Ferramentas carregadas do banco (não hardcoded)
- [ ] Arrastar ferramenta para slot grava no banco; remover atualiza o banco
- [ ] Ferramenta já no magazine fica indisponível na biblioteca
- [ ] Estado do magazine persiste ao recarregar a página
- [ ] Contador "Ocupados: X / 30" correto

**Blocked by:** #1, #2

---

## #5 — Inspeção Volante Digital com frequência automática

**Parent:** C — Inspeção Volante

**What to build:**
Carrega cotas e tolerâncias da OP do banco. Tabela de frequência calcula automaticamente o gatilho de medição pelo tamanho do lote (2-10→cada 2; 11-30→cada 5; 31-64→cada 8; 65+→cada 10). Quando o contador de peças atinge o gatilho, alerta visual + sonoro. Inputs validam em tempo real (verde/vermelho). "Registrar Medições" grava em `inspecoes_volantes` com operador, turno, peça nº, valores.

**Acceptance criteria:**
- [ ] Cotas e tolerâncias vêm do banco por OP
- [ ] Frequência correta calculada pelo tamanho do lote
- [ ] Alerta dispara exatamente no múltiplo correto da frequência
- [ ] Validação em tempo real marca dentro/fora da tolerância
- [ ] Medições gravam no banco e aparecem no histórico
- [ ] Histórico consultável por OP/turno/operador

**Blocked by:** #1, #2

---

## #6 — Botões de Suporte Intersetorial

**Parent:** D — Suporte

**What to build:**
Quatro botões (Engenharia, Inspeção, Manutenção, Preset). Cada clique abre modal com campo de texto. Envio grava em `chamados_suporte`: setor, operador, máquina, OP, mensagem, timestamp, status (pendente). Badge mostra contagem de chamados pendentes por setor.

**Acceptance criteria:**
- [ ] Modal abre com auto-foco no campo de texto
- [ ] Chamado grava no banco com todos os campos
- [ ] Badge de pendentes reflete o banco em tempo real
- [ ] Confirmação visual (toast) ao enviar

**Blocked by:** #1, #2

---

## #7 — Apontamento de Tempo (Setup + Ciclo)

**Parent:** E — Apontamento de Tempo

**What to build:**
Botão "Iniciar Setup" grava timestamp de início. Botão "Peça Concluída" grava fim, calcula delta, incrementa contador de peças. Cronômetro ao vivo na tela. Cada evento grava em `historico_tempos`: operador, OP, tipo (setup/ciclo), início, fim, duração. Compara com tempo padrão (campo manual no MVP).

**Acceptance criteria:**
- [ ] "Iniciar Setup" registra início; cronômetro corre ao vivo
- [ ] "Peça Concluída" calcula e grava o delta correto
- [ ] Contador de peças e saldo da OP atualizam
- [ ] Tempo real vs. padrão exibido lado a lado
- [ ] Todos os eventos persistidos em `historico_tempos`

**Blocked by:** #1, #2

---

## #8 — Identidade visual Lima & Bonfá

**Parent:** Polimento

**What to build:**
Aplicar a paleta corporativa real em todo o sistema: azul `#1565C0`, teal `#00B4C8`, grafite `#4A4A4A`. Logo LB no header. Tipografia consistente. Estados de status (verde/amarelo/vermelho) padronizados. Garantir contraste e legibilidade para ambiente de chão de fábrica.

**Acceptance criteria:**
- [ ] Paleta aplicada de forma consistente em todas as telas
- [ ] Logo LB no header
- [ ] Status semânticos consistentes em todo o app
- [ ] Contraste mínimo 4.5:1 para texto

**Blocked by:** #3, #4, #5, #6, #7 (aplica-se depois que as telas existem)

---

## Ordem de execução sugerida

```
#0 (tracer bullet) ─┬─> #1 (schema) ─┬─> #2 (login) ─┬─> #3 (processo)
                    │                 │               ├─> #4 (magazine)
                    │                 │               ├─> #5 (inspeção)
                    │                 │               ├─> #6 (suporte)
                    │                 │               └─> #7 (tempo)
                    │                 │
                    └─────────────────┴───────────────────> #8 (identidade visual)
```

#3 a #7 são independentes entre si — podem ser feitas em qualquer ordem após #2.

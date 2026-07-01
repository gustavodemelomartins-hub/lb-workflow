# PRD: Lima & Bonfá WorkFlow MES — MVP v1

## Problem Statement

Operadores CNC da Lima & Bonfá (foco inicial: Mazak MQ0280/MQ0281 Variaxis 5 Eixos) perdem tempo produtivo buscando arquivos de processo em pastas de rede, preenchem folhas de inspeção volante em papel (risco de perda e falta de rastreabilidade para o cliente Embraer), e não têm canal digital para acionar suporte de Engenharia/Preset/Manutenção/Qualidade. O tempo real de setup e ciclo não é capturado — o PCP só tem o tempo padrão do TOTVS, nunca o real.

Custo de não resolver: retrabalho por setup incorreto, não conformidades em auditorias Embraer por falta de registros de inspeção, e invisibilidade total da eficiência real do chão de fábrica.

## Solution

Sistema MES (Manufacturing Execution System) web, rodando na rede interna da Lima & Bonfá (`192.168.0.X`), acessado pelo browser do PC já existente em cada posto de máquina. O operador se identifica pela matrícula, informa a OP, e o sistema entrega: o processo de usinagem correto automaticamente, controle digital da inspeção volante, magazine virtual com rastreabilidade de montagem, apontamento de tempo de setup/ciclo, e comunicação direta com setores de suporte.

## User Stories

- Como **operador**, quero digitar minha matrícula e número da OP para que o sistema me mostre o PDF de processo correto sem precisar navegar em pastas de rede.
- Como **operador**, quero arrastar as ferramentas para os slots do magazine virtual para que fique registrado digitalmente quem montou quais ferramentas e em que posição.
- Como **operador**, quero ser alertado pelo sistema na frequência correta de medição para que eu não esqueça de preencher a inspeção volante e registre as medidas direto na tela.
- Como **operador**, quero clicar em "Iniciar Setup" e "Peça Concluída" para que o sistema registre automaticamente meu tempo real de setup e ciclo.
- Como **operador**, quero acionar Engenharia, Preset, Manutenção ou Qualidade com um botão para receber suporte sem sair do posto da máquina.
- Como **gestor de Qualidade**, quero consultar o histórico de inspeções volantes digitais por OP/máquina/operador para ter rastreabilidade completa nas auditorias Embraer.
- Como **PCP**, quero ver o tempo real de setup e ciclo por OP para comparar com o tempo padrão do TOTVS e identificar gargalos.

## Implementation Decisions

| Decisão | Escolha | Razão |
|---|---|---|
| Plataforma cliente | Browser (Chrome/Edge) no PC existente | Zero custo de hardware adicional |
| Backend | Node.js + Express | JavaScript full-stack, fácil manutenção pelo próprio operador-desenvolvedor |
| Banco de dados | PostgreSQL no servidor interno existente | Centralizado, histórico de todas as máquinas, PCP e Qualidade acessam em tempo real |
| Autenticação | Matrícula numérica sem senha | Troca de turno rápida, sem atrito no chão de fábrica |
| Integração TOTVS | Nenhuma no MVP — operador digita OP manualmente | Evita burocracia de TI; v2 integra com banco TOTVS |
| Arquivos de processo | Busca automática em `\\servidor\NC\[MAQUINA]\[OP]\` | Estrutura de pasta já existe nesse formato |
| Magazine virtual | Drag-and-drop visual sem dados de medição (offset) | Zoller integra na v2; MVP foca em rastreabilidade de montagem |
| Apontamento de tempo | Dois botões: "Iniciar Setup" / "Peça Concluída" | Simples, captura os dois KPIs mais importantes para o PCP |
| Design/Identidade | Cores Lima & Bonfá: azul `#1565C0` + teal `#00B4C8` + grafite `#4A4A4A` | Identidade corporativa real da empresa |
| Manutenção | Gustavo de Melo (matrícula 1220) + Claude Code | Desenvolvedor interno com assistência de IA |

## Funcionalidades do MVP (v1)

### A — Visualizador de Processo
- Operador digita matrícula + número da OP
- Sistema busca automaticamente o PDF em `\\servidor\NC\[MAQUINA]\[OP]\`
- PDF renderizado inline com navegação de páginas
- Exibe PN, revisão e número do orçamento no cabeçalho

### B — Magazine Virtual
- Lista de ferramentas da biblioteca padrão (Alumínio: T01–T30)
- 30 slots visuais representando o magazine físico da máquina
- Drag-and-drop para montar o magazine digitalmente
- Registro em banco: operador, data/hora, ferramentas por slot

### C — Inspeção Volante Digital
- Cotas e tolerâncias carregadas por OP/cliente
- Tabela de frequência automática baseada no tamanho do lote
- Alerta visual + sonoro quando o contador de peças atinge o gatilho
- Inputs com validação em tempo real (verde = OK, vermelho = NOK)
- Histórico salvo no banco por operador/turno/OP

### D — Suporte Intersetorial
- Botões: Engenharia, Inspeção/Qualidade, Manutenção, Preset
- Modal com campo de texto para descrever o problema
- Chamado registrado no banco com timestamp e operador
- Badge de notificações pendentes (ex: "Preset — 3 pendentes")

### E — Apontamento de Tempo
- Botão "Iniciar Setup" — registra início com timestamp
- Botão "Peça Concluída" — registra fim, calcula delta
- Exibe tempo decorrido em tempo real (cronômetro)
- Compara com tempo padrão (digitado manualmente no MVP; v2 busca do TOTVS)
- Contador de peças com saldo da OP

## Testing Decisions

- Cada funcionalidade testada com dados reais da OP 108339 (Suporte Ponta — Embraer) na máquina MQ0281
- Inspeção volante: validar as 11 cotas do PN S50-09057-009 com tolerâncias reais
- Magazine: testar montagem e desmontagem das 23 ferramentas da biblioteca Alumínio
- Apontamento: validar cálculo de delta entre "Iniciar Setup" e "Peça Concluída"
- Conectividade: testar acesso ao PDF na pasta de rede `\\servidor\NC\MQ0281\108339\`

## Out of Scope (v1)

- **F — Fila de produção**: integração com TOTVS para exibir fila de OPs da máquina
- Integração com Zoller (offsets de ferramenta no magazine)
- App mobile / tablet (foco em PC desktop)
- Módulo de gestão para PCP/Qualidade (dashboard gerencial)
- Integração MTConnect com o CNC Mazak
- Alertas por WhatsApp/email para setores de suporte
- Multi-idioma

## Further Notes

- **Risco principal:** Acesso à pasta de rede `\\servidor\NC\` pelo processo Node.js no servidor. Verificar permissões de leitura antes de iniciar desenvolvimento.
- **Dependência:** Biblioteca de ferramentas (T01–T30 Alumínio) precisa ser cadastrada no banco antes do go-live. Confirmar se existem bibliotecas para outros materiais (Inox, Titânio).
- **Open question:** Existe padrão de nomenclatura do PDF dentro da pasta da OP? (ex: sempre `processo.pdf` ou varia?)
- **Zoller v2:** A integração com Zoller pode eliminar erros de preset — prioridade alta para v2 após MVP validado.
- **Escalabilidade:** Arquitetura deve suportar as ~20 máquinas do parque futuro, não apenas as 2 Mazak iniciais.

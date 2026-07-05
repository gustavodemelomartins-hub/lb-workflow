// ─────────────────────────────────────────────────────────────
// Dados reais da fábrica (mock para o protótipo de aprovação).
// Na Fase 0 estes viram os contratos Zod de packages/shared + API.
// ─────────────────────────────────────────────────────────────

export type MachineState = 'idle' | 'stopped' | 'producing' | 'setup'

export const OPERATORS: Record<string, string> = {
  '1220': 'Gustavo de Melo',
  '1187': 'Anderson Reis',
  '1342': 'Márcia Toledo',
}

export const MACHINE = {
  code: 'MQ0281',
  name: 'Mazak Variaxis i-700',
  type: 'Centro de Usinagem · 5 Eixos',
}

export const OP = {
  numero: '108339',
  pn: 'S50-09057-009',
  desc: 'SUPORTE PONTA 009',
  cliente: 'Embraer',
  maquina: 'MQ0281',
  revisao: 'C',
  orcamento: 'ORC-24-4471',
  qtd: 48,
  tempoPadraoSetupMin: 90,
  tempoPadraoCicloMin: 22,
}

export type Tool = { pos: string; desc: string }
export const TOOLS: Tool[] = [
  { pos: 'T01', desc: 'Fresa de topo Ø20 Z4 Metal Duro' },
  { pos: 'T02', desc: 'Fresa esférica Ø16 R8 Metal Duro' },
  { pos: 'T03', desc: 'Fresa de topo Ø12 Z4 Metal Duro' },
  { pos: 'T04', desc: 'Fresa esférica Ø12 R6 Metal Duro' },
  { pos: 'T05', desc: 'Fresa esférica Ø10 R5 Metal Duro' },
  { pos: 'T06', desc: 'Fresa de topo Ø8 Z4 Metal Duro' },
  { pos: 'T07', desc: 'Broca helicoidal Ø5.1 DIN6537' },
  { pos: 'T08', desc: 'Broca helicoidal Ø4.2 DIN6537' },
  { pos: 'T09', desc: 'Broca helicoidal Ø3.3 DIN6537' },
  { pos: 'T10', desc: 'Broca helicoidal Ø2.55 DIN6537' },
  { pos: 'T11', desc: 'Macho M6x1.0 Espiral' },
  { pos: 'T12', desc: 'Macho M5x0.8 Espiral' },
  { pos: 'T13', desc: 'Macho M4x0.7 Espiral' },
  { pos: 'T14', desc: 'Fresa de chanfrar 90° Ø16' },
  { pos: 'T15', desc: 'Fresa de topo Ø6 Z4 Metal Duro' },
  { pos: 'T16', desc: 'Broca helicoidal Ø6.8 DIN6537' },
  { pos: 'T17', desc: 'Broca de centro Ø3' },
  { pos: 'T25', desc: 'Cabeçote de fresamento Ø50' },
  { pos: 'T26', desc: 'Pastilha APKT 11 03 PDSR' },
  { pos: 'T27', desc: 'Fresa de topo Ø4 Z4 Metal Duro' },
  { pos: 'T28', desc: 'Broca helicoidal Ø8.5 DIN6537' },
  { pos: 'T29', desc: 'Macho M10x1.5 Espiral' },
  { pos: 'T30', desc: 'Fresa de topo Ø25 Z4 Metal Duro' },
]

export type Cota = {
  n: number; desc: string; nominal: number; tolMais: number; tolMenos: number; unid: string
}
export const COTAS: Cota[] = [
  { n: 1, desc: 'Comprimento total', nominal: 120.0, tolMais: 0.05, tolMenos: 0.05, unid: 'mm' },
  { n: 2, desc: 'Largura principal', nominal: 45.0, tolMais: 0.03, tolMenos: 0.03, unid: 'mm' },
  { n: 3, desc: 'Altura do suporte', nominal: 32.5, tolMais: 0.02, tolMenos: 0.02, unid: 'mm' },
  { n: 4, desc: 'Diâmetro furo Ø1', nominal: 12.0, tolMais: 0.018, tolMenos: 0, unid: 'mm' },
  { n: 5, desc: 'Diâmetro furo Ø2', nominal: 8.0, tolMais: 0.015, tolMenos: 0, unid: 'mm' },
  { n: 6, desc: 'Distância entre furos', nominal: 85.0, tolMais: 0.05, tolMenos: 0.05, unid: 'mm' },
  { n: 7, desc: 'Profundidade rebaixo', nominal: 5.0, tolMais: 0.03, tolMenos: 0.03, unid: 'mm' },
  { n: 8, desc: 'Raio de concordância', nominal: 2.0, tolMais: 0.1, tolMenos: 0.1, unid: 'mm' },
  { n: 9, desc: 'Angulação chanfro', nominal: 45.0, tolMais: 0.5, tolMenos: 0.5, unid: '°' },
  { n: 10, desc: 'Espessura parede', nominal: 8.5, tolMais: 0.05, tolMenos: 0.05, unid: 'mm' },
  { n: 11, desc: 'Posição centro Ø1', nominal: 22.5, tolMais: 0.03, tolMenos: 0.03, unid: 'mm' },
]

export const MOTIVOS_PARADA: string[] = [
  'Aguardando inspeção/liberação',
  'Troca ou quebra de ferramenta',
  'Manutenção/quebra de máquina',
  'Falta de matéria-prima',
  'Falta de programa NC/processo',
  'Falta de dispositivo de fixação',
  'Aguardando preset de ferramenta',
  'Ajuste dimensional',
  'Limpeza/remoção de cavaco',
  'Refeição/intervalo',
  'Necessidade fisiológica',
  'Reunião/treinamento',
  'Falta de energia',
  'Troca de turno',
  'Outro motivo',
]

/** Tabela de frequência da inspeção volante pelo tamanho do lote. */
export function frequenciaInspecao(lote: number): number {
  if (lote <= 10) return 2
  if (lote <= 30) return 5
  if (lote <= 64) return 8
  return 10
}

export const PROGRAMADORES = ['Rodrigo', 'Diego', 'Bruno', 'Lucas', 'Lucas Soria']

// ── Dados de prévia dos outros painéis ───────────────────────

export const SOLIC_ENGENHARIA = [
  { id: 'E-2041', maquina: 'MQ0281', op: '108339', assunto: 'Dúvida no Z de segurança da OP 3', prog: 'Rodrigo', status: 'Em atendimento', min: 12 },
  { id: 'E-2040', maquina: 'MC0177', op: '107884', assunto: 'Revisar avanço na cavidade', prog: 'Diego', status: 'Em atendimento', min: 34 },
  { id: 'E-2039', maquina: 'MC0079', op: '107765', assunto: 'Colisão simulada — validar fixação', prog: '—', status: 'Fila', min: 5 },
  { id: 'E-2038', maquina: 'TN0062', op: '106920', assunto: 'Novo processo de rosca M6', prog: 'Lucas', status: 'Concluído', min: 0 },
]

export const SOLIC_QUALIDADE = [
  { id: 'Q-884', maquina: 'MQ0281', op: '108339', assunto: 'Liberar 1ª peça — 11 cotas', resp: 'Márcia', status: 'Fila', min: 3 },
  { id: 'Q-883', maquina: 'MC0276', op: '108102', assunto: 'Montar calibrador de furo Ø8H7', resp: 'Paulo', status: 'Em atendimento', min: 18 },
  { id: 'Q-882', maquina: 'MC0173', op: '107540', assunto: 'Rugosidade Ra 0.8 fora', resp: 'Márcia', status: 'Em atendimento', min: 41 },
]

export const PRESET_FILA = [
  { pos: 'T02', desc: 'Fresa esférica Ø16 R8', maquina: 'MQ0281', motivo: 'Desgaste', vida: 18 },
  { pos: 'T07', desc: 'Broca Ø5.1', maquina: 'MQ0281', motivo: 'Quebra', vida: 0 },
  { pos: 'T25', desc: 'Cabeçote Ø50', maquina: 'MC0276', motivo: 'Ajuste', vida: 62 },
]

export const DISPOSITIVOS = [
  { id: 'LBD02340', det: 'DET01', maquina: 'MQ0281', op: '108339', status: 'Em uso' },
  { id: 'LBD02525', det: 'DET05', maquina: 'MC0177', op: '107884', status: 'Em uso' },
  { id: 'LBD03598', det: 'DET01', maquina: '—', op: '—', status: 'Disponível' },
  { id: 'LBD01102', det: 'DET02', maquina: '—', op: '—', status: 'Manutenção' },
]

export const MANUTENCAO = [
  { id: 'M-512', maquina: 'MC0079', tipo: 'Corretiva', assunto: 'Eixo Z com ruído', prioridade: 'Alta', status: 'Aberto' },
  { id: 'M-511', maquina: 'TN0063', tipo: 'Preventiva', assunto: 'Lubrificação 500h', prioridade: 'Média', status: 'Agendado' },
  { id: 'M-510', maquina: 'MC0275', tipo: 'Corretiva', assunto: 'Troca de correia', prioridade: 'Baixa', status: 'Concluído' },
]

export type FabMachine = { code: string; grupo: 'Torno' | '3-4 Eixos' | '5 Eixos'; state: MachineState | 'maint'; oee: number }
export const FABRICA: FabMachine[] = [
  { code: '61', grupo: 'Torno', state: 'producing', oee: 82 },
  { code: '62', grupo: 'Torno', state: 'producing', oee: 77 },
  { code: '63', grupo: 'Torno', state: 'stopped', oee: 41 },
  { code: '74', grupo: '3-4 Eixos', state: 'producing', oee: 88 },
  { code: '76', grupo: '3-4 Eixos', state: 'setup', oee: 63 },
  { code: '77', grupo: '3-4 Eixos', state: 'producing', oee: 91 },
  { code: '78', grupo: '3-4 Eixos', state: 'producing', oee: 74 },
  { code: '79', grupo: '3-4 Eixos', state: 'maint', oee: 0 },
  { code: '171', grupo: '3-4 Eixos', state: 'producing', oee: 85 },
  { code: '173', grupo: '3-4 Eixos', state: 'producing', oee: 79 },
  { code: '176', grupo: '3-4 Eixos', state: 'stopped', oee: 52 },
  { code: '177', grupo: '3-4 Eixos', state: 'producing', oee: 90 },
  { code: '271', grupo: '3-4 Eixos', state: 'producing', oee: 83 },
  { code: '273', grupo: '3-4 Eixos', state: 'setup', oee: 58 },
  { code: '275', grupo: '3-4 Eixos', state: 'producing', oee: 87 },
  { code: '276', grupo: '3-4 Eixos', state: 'producing', oee: 80 },
  { code: '278', grupo: '3-4 Eixos', state: 'producing', oee: 76 },
  { code: '272', grupo: '5 Eixos', state: 'producing', oee: 89 },
  { code: '274', grupo: '5 Eixos', state: 'setup', oee: 61 },
  { code: '280', grupo: '5 Eixos', state: 'producing', oee: 84 },
  { code: '281', grupo: '5 Eixos', state: 'producing', oee: 93 },
]

export const DOWNTIME_MOTIVOS = [
  { motivo: 'Aguardando preset', min: 214 },
  { motivo: 'Troca de ferramenta', min: 187 },
  { motivo: 'Aguardando inspeção', min: 132 },
  { motivo: 'Manutenção corretiva', min: 96 },
  { motivo: 'Falta de matéria-prima', min: 68 },
]

export const OEE_KPI = { oee: 78, disponibilidade: 86, performance: 91, qualidade: 99 }

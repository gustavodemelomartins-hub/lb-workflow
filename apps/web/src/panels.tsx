import { Icon } from './icons'
import { cx, initials } from './util'
import {
  SOLIC_ENGENHARIA, SOLIC_QUALIDADE, PRESET_FILA, DISPOSITIVOS, MANUTENCAO,
  FABRICA, DOWNTIME_MOTIVOS, OEE_KPI, PROGRAMADORES,
} from './data'

const STATUS_CLS: Record<string, string> = {
  'Em atendimento': 'b-warn', 'Fila': 'b-mut', 'Concluído': 'b-ok', 'Aberto': 'b-stop',
  'Agendado': 'b-blue', 'Disponível': 'b-ok', 'Em uso': 'b-blue', 'Manutenção': 'b-warn',
}
const MOTIVO_CLS: Record<string, string> = { Quebra: 'b-stop', Desgaste: 'b-warn', Ajuste: 'b-blue' }
const PRIOR_CLS: Record<string, string> = { Alta: 'b-stop', Média: 'b-warn', Baixa: 'b-mut' }

function Head({ title, desc, fase = 'Fase 2+' }: { title: string; desc: string; fase?: string }) {
  return (
    <div className="page-head">
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <h1>{title}</h1>
          <span className="preview-tag">Prévia · {fase}</span>
        </div>
        <p>{desc}</p>
      </div>
    </div>
  )
}
function S({ s }: { s: string }) { return <span className={cx('badge', STATUS_CLS[s] ?? 'b-mut')}>{s}</span> }
function Bubble({ who, text, mine }: { who: string; text: string; mine?: boolean }) {
  return (
    <div style={{ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
      <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', marginBottom: 2, textAlign: mine ? 'right' : 'left' }}>{who}</div>
      <div style={{ background: mine ? 'var(--blue)' : 'var(--panel-2)', color: mine ? '#fff' : 'var(--ink)', border: mine ? 'none' : '1px solid var(--line)', padding: '8px 12px', borderRadius: 10, fontSize: 13 }}>{text}</div>
    </div>
  )
}

export function Engenharia() {
  return (
    <div>
      <Head title="Engenharia" desc="Solicitações das máquinas, atribuição a programadores e chat com histórico — tudo fica registrado para futuras produções da mesma peça." />
      <div className="mag-wrap">
        <div className="card">
          <div className="card-h"><Icon name="engenharia" /><h3>Solicitações</h3><span className="badge b-warn" style={{ marginLeft: 'auto' }}>2 em atendimento</span></div>
          <div className="rowlist">
            {SOLIC_ENGENHARIA.map((s) => (
              <div className="lrow" key={s.id}>
                <span className="id">{s.id}</span>
                <div className="as"><div>{s.assunto}</div><div className="mn">{s.maquina} · OP {s.op}</div></div>
                {s.prog !== '—' && <span className="badge b-blue">{s.prog}</span>}
                <S s={s.status} />
                {s.min > 0 && <span className="mono muted sm tnum">{s.min}min</span>}
              </div>
            ))}
          </div>
        </div>
        <div className="grid" style={{ gap: 16 }}>
          <div className="card card-p">
            <div className="eyebrow">Programadores</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
              {PROGRAMADORES.map((p) => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="avatar-sm">{initials(p)}</span><span className="sm">{p}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card card-p">
            <div className="eyebrow">Chat · E-2041</div>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Bubble who="MQ0281 · Gustavo" text="Z de segurança colidindo na 3ª operação." mine />
              <Bubble who="Rodrigo" text="Ajustei o Z pra 25mm. Reenvia que já subo o programa." />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Qualidade() {
  return (
    <div>
      <Head title="Qualidade" desc="Solicitações de inspeção e liberação, montagem de instrumentos específicos e histórico completo das medições para auditoria Embraer." />
      <div className="card">
        <div className="card-h"><Icon name="qualidade" /><h3>Solicitações de inspeção</h3><span className="badge b-mut" style={{ marginLeft: 'auto' }}>1 na fila</span></div>
        <div className="rowlist">
          {SOLIC_QUALIDADE.map((s) => (
            <div className="lrow" key={s.id}>
              <span className="id">{s.id}</span>
              <div className="as"><div>{s.assunto}</div><div className="mn">{s.maquina} · OP {s.op}</div></div>
              <span className="badge b-blue">{s.resp}</span>
              <S s={s.status} />
              {s.min > 0 && <span className="mono muted sm tnum">{s.min}min</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Preset() {
  return (
    <div>
      <Head title="Preset de Ferramentas" desc="Mapa da fábrica, magazine virtual, fila de preparação e rastreio de toda troca por quebra, desgaste ou ajuste — com vida útil da ferramenta." />
      <div className="grid g2" style={{ alignItems: 'start' }}>
        <div className="card">
          <div className="card-h"><Icon name="preset" /><h3>Fila de preparação</h3></div>
          <div className="rowlist">
            {PRESET_FILA.map((f) => (
              <div className="lrow" key={f.pos + f.maquina}>
                <span className="id">{f.pos}</span>
                <div className="as"><div>{f.desc}</div><div className="mn">{f.maquina}</div></div>
                <span className={cx('badge', MOTIVO_CLS[f.motivo])}>{f.motivo}</span>
                <span className="mono muted sm tnum">vida {f.vida}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card card-p">
          <div className="eyebrow" style={{ marginBottom: 12 }}>Ocupação das máquinas</div>
          <div className="map">
            {FABRICA.slice(0, 12).map((mc) => (
              <div key={mc.code} className={cx('mtile', mc.state)}>
                <span className="st" /><div className="code">{mc.code}</div>
                <div className="oee">{mc.state === 'maint' ? 'manut.' : mc.state === 'setup' ? 'setup' : 'produzindo'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Dispositivos() {
  return (
    <div>
      <Head title="Dispositivos" desc="Dispositivo de fixação em cada máquina, próximos necessários, itens em manutenção e disponibilidade em tempo real." fase="Fase 3" />
      <div className="card">
        <div className="card-h"><Icon name="dispositivos" /><h3>Dispositivos de fixação</h3></div>
        <div className="table-wrap" style={{ border: 'none', borderRadius: 0 }}>
          <table>
            <thead><tr><th>Código</th><th>Detalhe</th><th>Máquina</th><th>OP</th><th>Status</th></tr></thead>
            <tbody>
              {DISPOSITIVOS.map((d) => (
                <tr key={d.id}>
                  <td className="mono" style={{ fontWeight: 700, color: 'var(--blue)' }}>{d.id}</td>
                  <td className="mono muted">{d.det}</td>
                  <td>{d.maquina}</td>
                  <td className="mono">{d.op}</td>
                  <td><S s={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export function Manutencao() {
  return (
    <div>
      <Head title="Manutenção" desc="Chamados, preventivas e corretivas, calendário, prioridades e máquinas indisponíveis." fase="Fase 3" />
      <div className="card">
        <div className="card-h"><Icon name="manutencao" /><h3>Chamados</h3><span className="badge b-stop" style={{ marginLeft: 'auto' }}>1 aberto</span></div>
        <div className="rowlist">
          {MANUTENCAO.map((m) => (
            <div className="lrow" key={m.id}>
              <span className="id">{m.id}</span>
              <div className="as"><div>{m.assunto}</div><div className="mn">{m.maquina}</div></div>
              <span className="badge b-mut">{m.tipo}</span>
              <span className={cx('badge', PRIOR_CLS[m.prioridade])}>{m.prioridade}</span>
              <S s={m.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Gerencia() {
  const maxDt = Math.max(...DOWNTIME_MOTIVOS.map((d) => d.min))
  return (
    <div>
      <Head title="Gerência" desc="Dashboard executivo: visão de toda a fábrica em tempo real — OEE, disponibilidade, performance, qualidade e tempo parado por motivo." fase="Fase 4" />
      <div className="grid g4" style={{ marginBottom: 16 }}>
        <Kpi k="OEE Global" v={OEE_KPI.oee} cls="blue" />
        <Kpi k="Disponibilidade" v={OEE_KPI.disponibilidade} cls="good" />
        <Kpi k="Performance" v={OEE_KPI.performance} cls="good" />
        <Kpi k="Qualidade" v={OEE_KPI.qualidade} cls="good" />
      </div>
      <div className="grid g2" style={{ alignItems: 'start' }}>
        <div className="card card-p">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <div className="eyebrow">Mapa da fábrica · {FABRICA.length} máquinas</div>
          </div>
          <div className="map">
            {FABRICA.map((mc) => (
              <div key={mc.code} className={cx('mtile', mc.state)} title={`Máquina ${mc.code}`}>
                <span className="st" /><div className="code">{mc.code}</div>
                <div className="oee tnum">{mc.state === 'maint' ? 'manut.' : `OEE ${mc.oee}%`}</div>
              </div>
            ))}
          </div>
          <div className="legend" style={{ marginTop: 14 }}>
            <span><i style={{ background: 'var(--ok)' }} />Produção</span>
            <span><i style={{ background: 'var(--warn)' }} />Setup</span>
            <span><i style={{ background: 'var(--stop)' }} />Parada</span>
            <span><i style={{ background: 'var(--graphite)' }} />Manutenção</span>
          </div>
        </div>
        <div className="card card-p">
          <div className="eyebrow" style={{ marginBottom: 14 }}>Tempo parado por motivo · hoje</div>
          {DOWNTIME_MOTIVOS.map((d) => (
            <div className="hbar" key={d.motivo}>
              <span className="lb">{d.motivo}</span>
              <div className="track"><div className="fill" style={{ width: `${(d.min / maxDt) * 100}%` }} /></div>
              <span className="val tnum">{d.min}min</span>
            </div>
          ))}
          <div className="muted sm" style={{ marginTop: 12 }}>Dados consolidados para o PCP — base para atacar os maiores gargalos.</div>
        </div>
      </div>
    </div>
  )
}

function Kpi({ k, v, cls }: { k: string; v: number; cls: string }) {
  return (
    <div className={cx('kpi', cls)}>
      <div className="k">{k}</div>
      <div className="v tnum">{v}<small>%</small></div>
      <div className="bar"><span style={{ width: `${v}%` }} /></div>
    </div>
  )
}

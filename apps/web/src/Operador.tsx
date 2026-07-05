import { useEffect, useState } from 'react'
import { Icon } from './icons'
import type { Machine } from './machine'
import { OP, TOOLS, COTAS, MOTIVOS_PARADA, frequenciaInspecao } from './data'
import { fmtDur, cx } from './util'

type Tab = 'producao' | 'processo' | 'magazine' | 'inspecao' | 'suporte'
type Modal = { type: 'stop' } | { type: 'support'; setor: string } | null

const SETORES = [
  { id: 'Engenharia', icon: 'engenharia', color: 'var(--blue)' },
  { id: 'Qualidade', icon: 'qualidade', color: 'var(--teal)' },
  { id: 'Manutenção', icon: 'manutencao', color: 'var(--warn)' },
  { id: 'Preset', icon: 'preset', color: 'var(--graphite)' },
]
const STATE_LABEL: Record<string, string> = { stopped: 'Máquina parada', producing: 'Em produção', setup: 'Em setup' }
const FREQ = frequenciaInspecao(OP.qtd)

export function Operador({ m, operator }: { m: Machine; operator: string }) {
  const [tab, setTab] = useState<Tab>('producao')
  const [opInput, setOpInput] = useState('')
  const [opErr, setOpErr] = useState(false)
  const [slots, setSlots] = useState<(string | null)[]>(() => Array(30).fill(null))
  const [selTool, setSelTool] = useState<string | null>(null)
  const [measures, setMeasures] = useState<Record<number, string>>({})
  const [inspDue, setInspDue] = useState(false)
  const [modal, setModal] = useState<Modal>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(id)
  }, [toast])

  // ── OP não carregada: dashboard travado ──────────────────
  if (!m.opLoaded) {
    return (
      <div className="op-load card card-p">
        <div className="eyebrow">Passo 1</div>
        <h1 style={{ fontSize: 22, marginTop: 8 }}>Carregar Ordem de Produção</h1>
        <p className="muted sm" style={{ marginTop: 6 }}>O painel fica travado até você informar a OP. Digite o número para carregar processo, ferramentas e inspeção automaticamente.</p>
        <input
          className="big-input" inputMode="numeric" autoFocus placeholder="OP" maxLength={6}
          value={opInput}
          onChange={(e) => { setOpInput(e.target.value.replace(/\D/g, '')); setOpErr(false) }}
          onKeyDown={(e) => { if (e.key === 'Enter') tryLoad() }}
        />
        {opErr && <div style={{ color: 'var(--stop-ink)', fontSize: 13 }}>OP não encontrada na rede. (demo: use 108339)</div>}
        <button className="btn btn-primary" style={{ width: '100%', padding: 14, marginTop: 10, fontSize: 16 }} onClick={tryLoad}>Carregar OP</button>
        <div className="login-hint" style={{ marginTop: 16 }}>Demonstração — use a OP <b>{OP.numero}</b></div>
      </div>
    )
  }

  function tryLoad() {
    if (opInput.trim() === OP.numero) { m.loadOp(); setToast('OP ' + OP.numero + ' carregada') }
    else setOpErr(true)
  }
  function completePiece() {
    const next = m.pieces + 1
    m.completePiece()
    setToast('Peça ' + next + ' apontada')
    if (next % FREQ === 0) setInspDue(true)
  }
  function placeOrRemove(i: number) {
    setSlots((prev) => {
      const copy = [...prev]
      if (copy[i]) { copy[i] = null; return copy }
      if (selTool && !copy.includes(selTool)) { copy[i] = selTool; setSelTool(null) }
      return copy
    })
  }
  const occupied = slots.filter(Boolean).length

  const TABS: { id: Tab; label: string; icon: string; badge?: boolean }[] = [
    { id: 'producao', label: 'Produção', icon: 'operador' },
    { id: 'processo', label: 'Processo', icon: 'file' },
    { id: 'magazine', label: 'Magazine', icon: 'preset' },
    { id: 'inspecao', label: 'Inspeção', icon: 'qualidade', badge: inspDue },
    { id: 'suporte', label: 'Suporte', icon: 'message' },
  ]

  return (
    <div>
      <div className="ophead">
        <div className="op-n">OP {OP.numero}</div>
        <div className="fld"><span className="k">Part Number</span><span className="v">{OP.pn}</span></div>
        <div className="fld"><span className="k">Descrição</span><span className="v">{OP.desc}</span></div>
        <div className="fld"><span className="k">Revisão</span><span className="v">{OP.revisao}</span></div>
        <div className="cli">{OP.cliente}</div>
      </div>

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={cx('tab', tab === t.id && 'active')} onClick={() => setTab(t.id)}>
            <Icon name={t.icon} size={17} />{t.label}
            {t.badge ? <span className="nav-badge">!</span> : null}
          </button>
        ))}
      </div>

      {tab === 'producao' && (
        <div className="grid g2" style={{ alignItems: 'start' }}>
          <div className="grid" style={{ gap: 16 }}>
            <div className="controls">
              <button className="cbtn run" disabled={m.state === 'producing'} onClick={() => m.go('producing')}><Icon name="play" />Rodar</button>
              <button className="cbtn setup" disabled={m.state === 'setup'} onClick={() => m.go('setup')}><Icon name="power" />Setup</button>
              <button className="cbtn stop" disabled={m.state === 'stopped'} onClick={() => setModal({ type: 'stop' })}><Icon name="stop" />Parar</button>
              <button className="cbtn piece" disabled={m.state !== 'producing'} onClick={completePiece}><Icon name="check" />Peça OK</button>
            </div>
            <div className={cx('timer-box', m.state)}>
              <div className="lbl">{STATE_LABEL[m.state] ?? 'Máquina'}</div>
              <div className="t tnum">{fmtDur(m.elapsed)}</div>
              {m.state === 'stopped' && m.stopReason && <div className="rs">Motivo: {m.stopReason}</div>}
              {m.state === 'producing' && <div className="rs">Cronômetro reinicia a cada peça apontada</div>}
            </div>
          </div>
          <div className="grid g2">
            <div className="stat">
              <div className="k">Peças concluídas</div>
              <div className="v tnum">{m.pieces}<small> / {OP.qtd}</small></div>
              <div className="progress"><span style={{ width: `${(m.pieces / OP.qtd) * 100}%` }} /></div>
            </div>
            <div className="stat">
              <div className="k">Saldo da OP</div>
              <div className="v tnum">{OP.qtd - m.pieces}</div>
              <div className="muted sm" style={{ marginTop: 8 }}>peças restantes</div>
            </div>
            <div className="stat">
              <div className="k">Setup · real vs padrão</div>
              <div className="v tnum">78<small> / {OP.tempoPadraoSetupMin} min</small></div>
              <div className="badge b-ok" style={{ marginTop: 8 }}>13% mais rápido</div>
            </div>
            <div className="stat">
              <div className="k">Ciclo médio · real vs padrão</div>
              <div className="v tnum">21<small> / {OP.tempoPadraoCicloMin} min</small></div>
              <div className="badge b-ok" style={{ marginTop: 8 }}>dentro do padrão</div>
            </div>
          </div>
        </div>
      )}

      {tab === 'processo' && (
        <div className="card">
          <div className="card-h"><Icon name="folder" /><h3>Processo de usinagem</h3>
            <span className="mono sm muted" style={{ marginLeft: 'auto' }}>\\servidor\NC\{OP.maquina}\{OP.numero}\processo.pdf</span>
          </div>
          <div className="card-p">
            <div style={{ display: 'grid', placeItems: 'center', minHeight: 320, background: 'var(--panel-2)', border: '1px solid var(--line)', borderRadius: 10, textAlign: 'center', padding: 24 }}>
              <div>
                <Icon name="file" size={44} />
                <div style={{ fontWeight: 700, marginTop: 10 }}>{OP.pn} — {OP.desc}</div>
                <div className="muted sm" style={{ marginTop: 4 }}>PDF do processo encontrado automaticamente na pasta de rede</div>
                <div className="muted sm mono" style={{ marginTop: 14 }}>Página 1 / 8 &nbsp;·&nbsp; Rev. {OP.revisao} &nbsp;·&nbsp; {OP.orcamento}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'magazine' && (
        <div className="mag-wrap">
          <div>
            <div className="hintbar">Selecione uma ferramenta na biblioteca e clique num slot para montar. Clique num slot ocupado para remover. <b>Ocupados: {occupied}/30</b></div>
            <div className="mag-grid">
              {slots.map((s, i) => (
                <button key={i} className={cx('slot', s && 'filled', selTool && !s && 'target')} onClick={() => placeOrRemove(i)}>
                  <span className="n">{i + 1}</span>
                  {s ? <span className="tpos">{s}</span> : <Icon name={selTool ? 'plus' : 'preset'} size={18} />}
                </button>
              ))}
            </div>
          </div>
          <div className="tool-list">
            <div className="th"><span>Biblioteca · Alumínio</span><span className="muted">{TOOLS.length} ferr.</span></div>
            <div className="tool-scroll">
              {TOOLS.map((t) => {
                const placed = slots.includes(t.pos)
                return (
                  <button key={t.pos} className={cx('tool', selTool === t.pos && 'sel')} disabled={placed} onClick={() => setSelTool(selTool === t.pos ? null : t.pos)}>
                    <span className="pos">{t.pos}</span>
                    <span style={{ flex: 1 }}>{t.desc}</span>
                    {placed && <span className="badge b-blue">no magazine</span>}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {tab === 'inspecao' && (
        <div>
          {inspDue
            ? <div className="insp-alert"><Icon name="alert" /> Inspeção volante devida — peça nº {m.pieces} (a cada {FREQ} peças). Registre as medições.</div>
            : <div className="hintbar">Lote {OP.qtd} peças → inspecionar a cada <b>{FREQ}</b> peças. Próxima inspeção na peça {(Math.floor(m.pieces / FREQ) + 1) * FREQ}.</div>}
          <div className="table-wrap">
            <table>
              <thead><tr><th>#</th><th>Cota</th><th>Nominal</th><th>Tolerância</th><th>Medida</th><th>Resultado</th></tr></thead>
              <tbody>
                {COTAS.map((c) => {
                  const raw = measures[c.n]
                  const val = raw !== undefined && raw !== '' ? Number(raw.replace(',', '.')) : null
                  const min = c.nominal - c.tolMenos, max = c.nominal + c.tolMais
                  const ok = val !== null && !Number.isNaN(val) && val >= min && val <= max
                  const filled = val !== null && !Number.isNaN(val)
                  return (
                    <tr key={c.n}>
                      <td className="mono muted">{c.n}</td>
                      <td>{c.desc}</td>
                      <td className="nom">{c.nominal.toFixed(2)} {c.unid}</td>
                      <td className="tol">+{c.tolMais} / −{c.tolMenos}</td>
                      <td><input className={cx('measure', filled && (ok ? 'ok' : 'nok'))} inputMode="decimal" placeholder="—" value={raw ?? ''} onChange={(e) => setMeasures((p) => ({ ...p, [c.n]: e.target.value }))} /></td>
                      <td>{filled ? <span className={cx('verdict', ok ? 'ok' : 'nok')}>{ok ? 'OK' : 'FORA'}</span> : <span className="muted sm">—</span>}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" onClick={() => { setToast('Medições registradas no histórico'); setInspDue(false); setMeasures({}) }}>Registrar medições</button>
            <button className="btn btn-ghost" onClick={() => setMeasures({})}>Limpar</button>
          </div>
        </div>
      )}

      {tab === 'suporte' && (
        <div>
          <div className="hintbar">Acione um setor sem sair do posto. Cada chamado gera notificação, histórico e tempo de atendimento.</div>
          <div className="support-grid">
            {SETORES.map((s) => (
              <button key={s.id} className="sbtn" onClick={() => setModal({ type: 'support', setor: s.id })}>
                <span className="ic" style={{ background: s.color }}><Icon name={s.icon} size={24} /></span>
                {s.id}
              </button>
            ))}
          </div>
        </div>
      )}

      {modal?.type === 'stop' && (
        <Overlay title="Motivo da parada" onClose={() => setModal(null)}>
          <div className="reason-list">
            {MOTIVOS_PARADA.map((r) => (
              <button key={r} className="reason" onClick={() => { m.go('stopped', r); setModal(null); setToast('Máquina parada: ' + r) }}>{r}</button>
            ))}
          </div>
        </Overlay>
      )}
      {modal?.type === 'support' && (
        <Overlay title={'Chamar ' + modal.setor} onClose={() => setModal(null)} footer={
          <>
            <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
            <button className="btn btn-primary" onClick={() => { setToast('Chamado enviado para ' + modal.setor); setModal(null) }}>Enviar chamado</button>
          </>
        }>
          <p className="muted sm" style={{ marginBottom: 10 }}>Descreva o que precisa. O chamado vai com OP, máquina e operador ({operator}).</p>
          <textarea className="ta" autoFocus placeholder={'Ex.: ' + (modal.setor === 'Preset' ? 'T02 com desgaste, preciso de reposição' : 'descreva o problema...')} />
        </Overlay>
      )}

      {toast && <div className="toast"><Icon name="check" size={18} />{toast}</div>}
    </div>
  )
}

function Overlay({ title, children, footer, onClose }: { title: string; children: React.ReactNode; footer?: React.ReactNode; onClose: () => void }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-h"><h3>{title}</h3><button onClick={onClose} aria-label="Fechar"><Icon name="x" /></button></div>
        <div className="modal-b">{children}</div>
        {footer && <div className="modal-f">{footer}</div>}
      </div>
    </div>
  )
}

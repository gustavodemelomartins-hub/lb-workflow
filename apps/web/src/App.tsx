import { useEffect, useState } from 'react'
import { Icon } from './icons'
import { OPERATORS, MACHINE, OP } from './data'
import { useMachine } from './machine'
import { fmtDur, initials, cx } from './util'
import { Operador } from './Operador'
import { Engenharia, Qualidade, Preset, Dispositivos, Manutencao, Gerencia } from './panels'

type NavItem = { id: string; label: string; icon: string; group: string; badge?: number }
const NAV: NavItem[] = [
  { id: 'operador', label: 'Operador', icon: 'operador', group: 'Chão de fábrica' },
  { id: 'engenharia', label: 'Engenharia', icon: 'engenharia', group: 'Suporte', badge: 2 },
  { id: 'qualidade', label: 'Qualidade', icon: 'qualidade', group: 'Suporte', badge: 1 },
  { id: 'preset', label: 'Preset', icon: 'preset', group: 'Suporte', badge: 3 },
  { id: 'dispositivos', label: 'Dispositivos', icon: 'dispositivos', group: 'Ativos' },
  { id: 'manutencao', label: 'Manutenção', icon: 'manutencao', group: 'Ativos', badge: 1 },
  { id: 'gerencia', label: 'Gerência', icon: 'gerencia', group: 'Gestão' },
]
const TITLES: Record<string, string> = {
  operador: 'Painel do Operador', engenharia: 'Engenharia', qualidade: 'Qualidade',
  preset: 'Preset de Ferramentas', dispositivos: 'Dispositivos', manutencao: 'Manutenção', gerencia: 'Gerência',
}
const STATE_LABEL: Record<string, string> = { idle: 'Aguardando OP', stopped: 'Parada', producing: 'Produção', setup: 'Setup' }

export default function App() {
  const [operatorId, setOperatorId] = useState<string | null>(null)
  const [panel, setPanel] = useState('operador')
  const m = useMachine()

  if (!operatorId) return <Login onLogin={setOperatorId} />
  const operatorName = OPERATORS[operatorId]
  const groups = [...new Set(NAV.map((n) => n.group))]
  const current = NAV.find((n) => n.id === panel)!

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo" style={{ padding: '4px 6px' }}>
          <div className="logo-mark">LB</div>
          <div className="logo-word"><b>Lima &amp; Bonfá</b><span>WorkFlow MES</span></div>
        </div>
        <div className="side-machine">
          <div className="k">Posto · Kiosk</div>
          <div className="v">{MACHINE.code}</div>
          <div className="t">{MACHINE.name}</div>
        </div>
        {groups.map((g) => (
          <div key={g}>
            <div className="nav-label">{g}</div>
            {NAV.filter((n) => n.group === g).map((n) => (
              <button key={n.id} className={cx('nav-item', panel === n.id && 'active')} onClick={() => setPanel(n.id)}>
                <Icon name={n.icon} size={19} />
                {n.label}
                {n.badge ? <span className="nav-badge">{n.badge}</span> : null}
              </button>
            ))}
          </div>
        ))}
        <div className="side-foot">
          <div className="side-user">
            <div className="av">{initials(operatorName)}</div>
            <div>
              <div className="nm">{operatorName}</div>
              <div className="rl">Matrícula {operatorId}</div>
            </div>
          </div>
          <button className="btn-logout" onClick={() => { m.reset(); setOperatorId(null) }}>
            <Icon name="logout" size={15} /> Trocar operador
          </button>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div>
            <div className="crumb">{current.group}</div>
            <h2>{TITLES[panel]}</h2>
          </div>
          <div className="topbar-right">
            {panel === 'operador' && m.opLoaded && (
              <span className={cx('pill', m.state)}>
                <span className={cx('d', m.state === 'stopped' && 'blink')} />
                {STATE_LABEL[m.state]} · <span className="mono tnum">{fmtDur(m.elapsed)}</span>
              </span>
            )}
            {m.opLoaded && <span className="op-badge">OP <b>{OP.numero}</b></span>}
            <Clock />
          </div>
        </header>
        <div className="content">
          <div className="content-inner">
            {panel === 'operador' && <Operador m={m} operator={operatorName} />}
            {panel === 'engenharia' && <Engenharia />}
            {panel === 'qualidade' && <Qualidade />}
            {panel === 'preset' && <Preset />}
            {panel === 'dispositivos' && <Dispositivos />}
            {panel === 'manutencao' && <Manutencao />}
            {panel === 'gerencia' && <Gerencia />}
          </div>
        </div>
      </div>
    </div>
  )
}

function Login({ onLogin }: { onLogin: (id: string) => void }) {
  const [val, setVal] = useState('')
  const [err, setErr] = useState(false)
  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (OPERATORS[val.trim()]) onLogin(val.trim())
    else setErr(true)
  }
  return (
    <div className="login">
      <form className="login-card" onSubmit={submit}>
        <div className="logo">
          <div className="logo-mark">LB</div>
          <div className="logo-word"><b>Lima &amp; Bonfá</b><span>WorkFlow MES</span></div>
        </div>
        <div className="login-machine">Posto · {MACHINE.code}</div>
        <h1>Identifique-se</h1>
        <p className="sub">Digite sua matrícula para iniciar o turno</p>
        <input
          className="login-input" inputMode="numeric" autoFocus maxLength={6} placeholder="0000"
          value={val}
          onChange={(e) => { setVal(e.target.value.replace(/\D/g, '')); setErr(false) }}
        />
        {err && <div style={{ color: 'var(--stop-ink)', fontSize: 13, marginBottom: 10 }}>Matrícula não encontrada.</div>}
        <button className="btn btn-primary" style={{ width: '100%', padding: 14, fontSize: 16 }} type="submit">Entrar</button>
        <div className="login-hint">Demonstração — use a matrícula <b>1220</b></div>
      </form>
    </div>
  )
}

function Clock() {
  const [t, setT] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="clock">
      <Icon name="clock" size={16} />
      <span className="tnum">{t.toLocaleTimeString('pt-BR')}</span>
    </span>
  )
}

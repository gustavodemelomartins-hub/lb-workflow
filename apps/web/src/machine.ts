import { useEffect, useState } from 'react'
import type { MachineState } from './data'

// Estado da máquina + cronômetro. Vive no topo (App) para alimentar
// tanto a topbar (pill de estado) quanto o painel do Operador.
export type Machine = {
  opLoaded: boolean
  state: MachineState
  elapsed: number
  pieces: number
  stopReason: string | null
  loadOp: () => void
  go: (s: MachineState, reason?: string | null) => void
  completePiece: () => void
  reset: () => void
}

export function useMachine(): Machine {
  const [opLoaded, setOpLoaded] = useState(false)
  const [state, setState] = useState<MachineState>('idle')
  const [since, setSince] = useState(() => Date.now())
  const [now, setNow] = useState(() => Date.now())
  const [pieces, setPieces] = useState(0)
  const [stopReason, setStopReason] = useState<string | null>(null)

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  return {
    opLoaded,
    state,
    elapsed: now - since,
    pieces,
    stopReason,
    loadOp() { setOpLoaded(true); setState('stopped'); setSince(Date.now()); setStopReason(null) },
    go(s, reason = null) { setState(s); setSince(Date.now()); setStopReason(reason) },
    completePiece() { setPieces((p) => p + 1) },
    reset() { setOpLoaded(false); setState('idle'); setPieces(0); setStopReason(null); setSince(Date.now()) },
  }
}

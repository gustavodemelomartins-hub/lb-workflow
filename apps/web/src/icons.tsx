// Ícones SVG inline (stroke = currentColor). Sem emoji — regra de marca LB.
import type { JSX } from 'react'

const P: Record<string, JSX.Element> = {
  operador: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  engenharia: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 3v3h6V3" /><path d="M8 11h8M8 15h5" /></>,
  qualidade: <><rect x="2.5" y="8" width="19" height="8" rx="1" /><path d="M7 8v3M11 8v4M15 8v3M19 8v4" /></>,
  preset: <><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2-2 2.5-2.5Z" /></>,
  dispositivos: <><path d="M12 2 3 7v10l9 5 9-5V7l-9-5Z" /><path d="M3 7l9 5 9-5M12 12v10" /></>,
  manutencao: <><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2-2 2.5-2.5Z" /></>,
  gerencia: <><path d="M4 20V4M20 20H4" /><rect x="7" y="12" width="3" height="5" /><rect x="12" y="8" width="3" height="9" /><rect x="17" y="5" width="3" height="12" /></>,
  play: <><path d="M7 4v16l13-8z" /></>,
  stop: <><rect x="5" y="5" width="14" height="14" rx="2" /></>,
  pause: <><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></>,
  check: <><path d="M20 6 9 17l-5-5" /></>,
  power: <><path d="M12 3v9" /><path d="M6.3 7.3a8 8 0 1 0 11.4 0" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  folder: <><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /></>,
  file: <><path d="M14 3v5h5" /><path d="M6 3h8l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /></>,
  message: <><path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12Z" /></>,
  alert: <><path d="M12 3 2 20h20L12 3Z" /><path d="M12 10v4M12 17h.01" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  x: <><path d="M6 6l12 12M18 6 6 18" /></>,
  arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  logout: <><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><path d="M10 17l5-5-5-5M15 12H3" /></>,
  wrench: <><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2-2 2.5-2.5Z" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>,
}

export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      className="icon" aria-hidden="true"
    >
      {P[name] ?? P.file}
    </svg>
  )
}

export function fmtDur(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000))
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(Math.floor(s / 3600))}:${p(Math.floor((s % 3600) / 60))}:${p(s % 60)}`
}

export function initials(name: string): string {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

export function cx(...c: Array<string | false | null | undefined>): string {
  return c.filter(Boolean).join(' ')
}

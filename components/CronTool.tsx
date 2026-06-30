'use client'

import { useState, useEffect, useCallback } from 'react'
import ToolHeader from './ToolHeader'

// ── Cron parser ──────────────────────────────────────────────────────────────

function parseField(field: string, min: number, max: number): number[] | null {
  if (field === '*') return null
  const values = new Set<number>()
  for (const part of field.split(',')) {
    if (part.includes('/')) {
      const [rangeStr, stepStr] = part.split('/')
      const step = parseInt(stepStr, 10)
      if (!step || step <= 0) throw new Error(`invalid step "${stepStr}"`)
      let lo = min, hi = max
      if (rangeStr !== '*') {
        if (rangeStr.includes('-')) {
          const [a, b] = rangeStr.split('-').map(Number)
          lo = a; hi = b
        } else {
          lo = parseInt(rangeStr, 10)
        }
      }
      for (let i = lo; i <= hi; i += step) values.add(i)
    } else if (part.includes('-')) {
      const [a, b] = part.split('-').map(Number)
      if (isNaN(a) || isNaN(b)) throw new Error(`invalid range "${part}"`)
      for (let i = a; i <= b; i++) values.add(i)
    } else {
      const n = parseInt(part, 10)
      if (isNaN(n)) throw new Error(`invalid value "${part}"`)
      values.add(n)
    }
  }
  const result = [...values].sort((a, b) => a - b)
  for (const v of result) {
    if (v < min || v > max) throw new Error(`value ${v} out of range [${min}–${max}]`)
  }
  return result
}

function parseCron(expr: string): [number[] | null, number[] | null, number[] | null, number[] | null, number[] | null] | Error {
  const parts = expr.trim().split(/\s+/)
  if (parts.length !== 5) return new Error('Cron expression must have exactly 5 fields: minute hour day month weekday')
  try {
    return [
      parseField(parts[0], 0, 59),
      parseField(parts[1], 0, 23),
      parseField(parts[2], 1, 31),
      parseField(parts[3], 1, 12),
      parseField(parts[4], 0, 6),
    ]
  } catch (e) {
    return e instanceof Error ? e : new Error(String(e))
  }
}

function getNextExecutions(expr: string, count: number): Date[] | Error {
  const parsed = parseCron(expr)
  if (parsed instanceof Error) return parsed
  const [mins, hrs, doms, mons, dows] = parsed

  const results: Date[] = []
  const d = new Date()
  d.setSeconds(0, 0)
  d.setMinutes(d.getMinutes() + 1)

  const limit = new Date()
  limit.setFullYear(limit.getFullYear() + 1)

  while (results.length < count && d < limit) {
    if (
      (!mins || mins.includes(d.getMinutes())) &&
      (!hrs || hrs.includes(d.getHours())) &&
      (!doms || doms.includes(d.getDate())) &&
      (!mons || mons.includes(d.getMonth() + 1)) &&
      (!dows || dows.includes(d.getDay()))
    ) {
      results.push(new Date(d))
    }
    d.setMinutes(d.getMinutes() + 1)
  }
  return results
}

// ── English description ───────────────────────────────────────────────────────

const DOW_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MON_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

function fmt12(h: number, m: number): string {
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hr = h % 12 === 0 ? 12 : h % 12
  return `${hr}:${String(m).padStart(2, '0')} ${ampm}`
}

function describeCron(expr: string): string {
  const parts = expr.trim().split(/\s+/)
  if (parts.length !== 5) return 'Invalid: must have 5 fields'
  const [mF, hF, domF, monF, dowF] = parts

  let mins: number[] | null, hrs: number[] | null, doms: number[] | null, mons: number[] | null, dows: number[] | null
  try {
    mins = parseField(mF, 0, 59)
    hrs = parseField(hF, 0, 23)
    doms = parseField(domF, 1, 31)
    mons = parseField(monF, 1, 12)
    dows = parseField(dowF, 0, 6)
  } catch (e) {
    return `Invalid: ${e instanceof Error ? e.message : String(e)}`
  }

  const pieces: string[] = []

  // Time description
  if (!mins && !hrs) {
    pieces.push('every minute')
  } else if (mF.startsWith('*/') && !hrs) {
    const step = parseInt(mF.split('/')[1])
    pieces.push(`every ${step} minute${step !== 1 ? 's' : ''}`)
  } else if (mF.startsWith('*/') && hrs) {
    const step = parseInt(mF.split('/')[1])
    if (hrs.length === 1) {
      pieces.push(`every ${step} minute${step !== 1 ? 's' : ''} during ${fmt12(hrs[0], 0).replace(':00', '')}`)
    } else {
      pieces.push(`every ${step} minute${step !== 1 ? 's' : ''}`)
    }
  } else if (mins?.length === 1 && hrs?.length === 1) {
    pieces.push(`at ${fmt12(hrs[0], mins[0])}`)
  } else if (mins?.length === 1 && !hrs) {
    pieces.push(`at minute :${String(mins[0]).padStart(2, '0')} of every hour`)
  } else if (!mins && hrs?.length === 1) {
    pieces.push(`every minute of the ${fmt12(hrs[0], 0).replace(':00', '')} hour`)
  } else if (mins && hrs) {
    const timeStrs = hrs.flatMap(h => mins!.map(m => fmt12(h, m)))
    if (timeStrs.length <= 4) pieces.push(`at ${timeStrs.join(', ')}`)
    else pieces.push(`at ${timeStrs.length} specific times`)
  } else {
    pieces.push('at specific times')
  }

  // Day of week / day of month
  if (dows) {
    const isWeekdays = dows.length === 5 && !dows.includes(0) && !dows.includes(6)
    const isWeekends = dows.length === 2 && dows.includes(0) && dows.includes(6)
    if (isWeekdays) pieces.push('on weekdays')
    else if (isWeekends) pieces.push('on weekends')
    else if (dows.length === 1) pieces.push(`on ${DOW_NAMES[dows[0]]}`)
    else pieces.push(`on ${dows.map(d => DOW_NAMES[d]).join(', ')}`)
  } else if (doms) {
    if (doms.length === 1) pieces.push(`on the ${ordinal(doms[0])} of the month`)
    else pieces.push(`on days ${doms.join(', ')} of the month`)
  }

  // Month
  if (mons) {
    if (mons.length === 1) pieces.push(`in ${MON_NAMES[mons[0] - 1]}`)
    else if (mons.length <= 4) pieces.push(`in ${mons.map(m => MON_NAMES[m - 1]).join(', ')}`)
    else pieces.push(`in ${mons.length} months`)
  }

  return pieces.join(', ')
}

// ── Presets ───────────────────────────────────────────────────────────────────

const PRESETS = [
  { label: 'Every minute', expr: '* * * * *' },
  { label: 'Every hour', expr: '0 * * * *' },
  { label: 'Daily at midnight', expr: '0 0 * * *' },
  { label: 'Every Monday 9am', expr: '0 9 * * 1' },
  { label: 'Every 15 minutes', expr: '*/15 * * * *' },
  { label: '1st of every month', expr: '0 0 1 * *' },
]

// ── Component ─────────────────────────────────────────────────────────────────

function ExprDisplay({ expr }: { expr: string }) {
  const parts = expr.trim().split(/\s+/)
  const labels = ['MIN', 'HOUR', 'DOM', 'MON', 'DOW']
  if (parts.length !== 5) return <span className="font-mono text-lg text-gray-900 dark:text-[#e2e8f0]">{expr}</span>
  return (
    <div className="text-center">
      <div className="inline-flex items-end gap-3">
        {parts.map((p, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <span className="text-xl font-bold font-mono text-gray-900 dark:text-[#e2e8f0] tracking-wide">{p}</span>
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{labels[i]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function NextTimes({ times }: { times: Date[] }) {
  return (
    <div className="rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="px-4 py-2 bg-gray-50 dark:bg-[#1e293b] border-b border-gray-100 dark:border-gray-700">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Next 5 Executions</span>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-gray-800">
        {times.map((t, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-2.5">
            <span className="text-xs text-gray-400 shrink-0 w-4">{i + 1}</span>
            <span className="text-sm font-mono text-gray-900 dark:text-[#e2e8f0]">
              {t.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
            <span className="text-sm font-mono text-blue-600 dark:text-blue-400 ml-auto">
              {t.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })
  }
  return (
    <button
      onClick={copy}
      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white transition"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

export default function CronTool() {
  const [mode, setMode] = useState<'build' | 'decode'>('build')

  // Build mode state: 5 individual fields
  const [minField, setMinField] = useState('0')
  const [hrField, setHrField] = useState('9')
  const [domField, setDomField] = useState('*')
  const [monField, setMonField] = useState('*')
  const [dowField, setDowField] = useState('1')

  // Decode mode
  const [decodeInput, setDecodeInput] = useState('')

  // Results
  const [description, setDescription] = useState('')
  const [nextTimes, setNextTimes] = useState<Date[]>([])
  const [parseError, setParseError] = useState('')

  const buildExpr = `${minField} ${hrField} ${domField} ${monField} ${dowField}`

  const runExpr = useCallback((expr: string) => {
    const desc = describeCron(expr)
    setDescription(desc)
    const times = getNextExecutions(expr, 5)
    if (times instanceof Error) {
      setParseError(times.message)
      setNextTimes([])
    } else {
      setParseError('')
      setNextTimes(times)
    }
  }, [])

  useEffect(() => { runExpr(buildExpr) }, [buildExpr, runExpr])

  useEffect(() => {
    if (!decodeInput.trim()) { setDescription(''); setNextTimes([]); setParseError(''); return }
    runExpr(decodeInput.trim())
  }, [decodeInput, runExpr])

  const applyPreset = (expr: string) => {
    const parts = expr.split(' ')
    if (parts.length === 5) {
      setMinField(parts[0]); setHrField(parts[1]); setDomField(parts[2])
      setMonField(parts[3]); setDowField(parts[4])
    }
  }

  const FIELDS = [
    { label: 'Minute', hint: '0–59, *, */5', value: minField, setter: setMinField },
    { label: 'Hour', hint: '0–23, *, 9', value: hrField, setter: setHrField },
    { label: 'Day of Month', hint: '1–31, *, 1', value: domField, setter: setDomField },
    { label: 'Month', hint: '1–12, *', value: monField, setter: setMonField },
    { label: 'Day of Week', hint: '0–6, * (0=Sun)', value: dowField, setter: setDowField },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a]">
      <ToolHeader />
      <main className="max-w-[800px] mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* Mode tabs */}
        <div className="flex gap-0.5 rounded-xl bg-gray-100 dark:bg-[#1e293b] p-1 w-fit">
          {(['build', 'decode'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-5 py-1.5 rounded-lg text-sm font-medium transition capitalize ${
                mode === m
                  ? 'bg-white dark:bg-[#0f172a] text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {m === 'build' ? 'Build' : 'Decode'}
            </button>
          ))}
        </div>

        {mode === 'build' ? (
          <>
            {/* Field inputs */}
            <div className="grid grid-cols-5 gap-3">
              {FIELDS.map(({ label, hint, value, setter }) => (
                <div key={label}>
                  <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1 truncate">{label}</label>
                  <input
                    type="text"
                    value={value}
                    onChange={e => setter(e.target.value)}
                    spellCheck={false}
                    autoComplete="off"
                    className="w-full font-mono text-sm px-2.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b] text-gray-900 dark:text-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                  />
                  <p className="text-[10px] text-gray-400 mt-1 text-center leading-tight">{hint}</p>
                </div>
              ))}
            </div>

            {/* Presets */}
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Presets</p>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map(({ label, expr }) => (
                  <button
                    key={label}
                    onClick={() => applyPreset(expr)}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generated expression */}
            <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#1e293b] px-6 py-5">
              <ExprDisplay expr={buildExpr} />
              {description && !parseError && (
                <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-3">{description}</p>
              )}
              {parseError && (
                <p className="text-center text-xs text-red-500 dark:text-red-400 font-mono mt-2">{parseError}</p>
              )}
              <div className="flex justify-center mt-4">
                <CopyButton text={buildExpr} />
              </div>
            </div>

            {nextTimes.length > 0 && <NextTimes times={nextTimes} />}
          </>
        ) : (
          <>
            {/* Decode mode */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                Cron Expression
              </label>
              <input
                type="text"
                value={decodeInput}
                onChange={e => setDecodeInput(e.target.value)}
                placeholder="Paste cron expression, e.g. 0 9 * * 1"
                spellCheck={false}
                autoComplete="off"
                className="w-full font-mono text-sm px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b] text-gray-900 dark:text-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {decodeInput.trim() && (
              <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#1e293b] px-6 py-5">
                {parseError ? (
                  <p className="text-sm text-red-600 dark:text-red-400 font-mono text-center">{parseError}</p>
                ) : (
                  <>
                    <ExprDisplay expr={decodeInput.trim()} />
                    {description && <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-3">{description}</p>}
                    <div className="flex justify-center mt-4">
                      <CopyButton text={decodeInput.trim()} />
                    </div>
                  </>
                )}
              </div>
            )}

            {nextTimes.length > 0 && <NextTimes times={nextTimes} />}
          </>
        )}
      </main>
    </div>
  )
}

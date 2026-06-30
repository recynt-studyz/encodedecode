'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import ToolHeader from './ToolHeader'

const COMMON_PATTERNS = [
  { label: 'Email', pattern: String.raw`^[\w.-]+@[\w.-]+\.\w+$`, flags: '' },
  { label: 'URL', pattern: String.raw`https?:\/\/[^\s]+`, flags: 'g' },
  { label: 'Phone (US)', pattern: String.raw`\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}`, flags: 'g' },
  { label: 'IP Address', pattern: String.raw`\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b`, flags: 'g' },
  { label: 'Date (YYYY-MM-DD)', pattern: String.raw`\d{4}-\d{2}-\d{2}`, flags: 'g' },
]

interface MatchResult {
  value: string
  start: number
  end: number
  groups: Record<string, string> | null
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const SHARED_STYLE: React.CSSProperties = {
  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
  fontSize: '13px',
  lineHeight: '1.625',
  padding: '8px 12px',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
  minHeight: '180px',
}

export default function RegexTool() {
  const [pattern, setPattern] = useState('')
  const [testString, setTestString] = useState('')
  const [flagG, setFlagG] = useState(true)
  const [flagI, setFlagI] = useState(false)
  const [flagM, setFlagM] = useState(false)
  const [flagS, setFlagS] = useState(false)
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [error, setError] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const backdropRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const flags = [flagG && 'g', flagI && 'i', flagM && 'm', flagS && 's'].filter(Boolean).join('')

  const compute = useCallback(() => {
    setError('')
    if (!pattern.trim()) { setMatches([]); return }
    try {
      const regexFlags = flags.includes('g') ? flags : flags + 'g'
      const regex = new RegExp(pattern, regexFlags)
      const found: MatchResult[] = []
      for (const m of testString.matchAll(regex)) {
        found.push({ value: m[0], start: m.index!, end: m.index! + m[0].length, groups: m.groups ?? null })
      }
      setMatches(found)
    } catch (e) {
      setError(`Invalid regex: ${e instanceof Error ? e.message : String(e)}`)
      setMatches([])
    }
  }, [pattern, testString, flags])

  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(compute, 300)
    return () => clearTimeout(debounceRef.current)
  }, [compute])

  const hasMatches = matches.length > 0 && !error

  const highlightedHtml = useMemo(() => {
    if (!testString || !hasMatches) return escapeHtml(testString)
    let result = ''
    let pos = 0
    for (const m of matches) {
      result += escapeHtml(testString.slice(pos, m.start))
      result += `<mark class="rx-mark">${escapeHtml(testString.slice(m.start, m.end))}</mark>`
      pos = m.end
    }
    result += escapeHtml(testString.slice(pos))
    return result
  }, [testString, matches, hasMatches])

  const syncScroll = () => {
    if (backdropRef.current && textareaRef.current) {
      backdropRef.current.scrollTop = textareaRef.current.scrollTop
      backdropRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
  }

  const loadPattern = (p: string, f: string) => {
    setPattern(p)
    setFlagG(f.includes('g'))
    setFlagI(f.includes('i'))
    setFlagM(f.includes('m'))
    setFlagS(f.includes('s'))
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a]">
      <style>{`.rx-mark{background:rgba(253,224,71,.55);border-radius:2px}.dark .rx-mark{background:rgba(251,191,36,.38);outline:1px solid rgba(217,119,6,.5)}`}</style>
      <ToolHeader />
      <main className="max-w-[900px] mx-auto px-4 sm:px-6 py-6 space-y-4">

        {/* Pattern input */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
            Regular Expression
          </label>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xl text-gray-300 dark:text-gray-600 select-none leading-none">/</span>
            <input
              type="text"
              value={pattern}
              onChange={e => setPattern(e.target.value)}
              placeholder="pattern"
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              className={`flex-1 font-mono text-sm px-3 py-2 rounded-lg border bg-white dark:bg-[#1e293b] text-gray-900 dark:text-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                error ? 'border-red-400 dark:border-red-500' : 'border-gray-200 dark:border-gray-700'
              }`}
            />
            <span className="font-mono text-xl text-gray-300 dark:text-gray-600 select-none leading-none">/</span>
            <span className="font-mono text-sm text-blue-600 dark:text-blue-400 w-12 pl-0.5 select-none">
              {flags || <span className="text-gray-300 dark:text-gray-700">∅</span>}
            </span>
          </div>
          {error && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-mono">{error}</p>}
        </div>

        {/* Flags */}
        <div className="flex flex-wrap gap-5">
          {([
            [flagG, setFlagG, 'g', 'global — find all matches'],
            [flagI, setFlagI, 'i', 'case insensitive'],
            [flagM, setFlagM, 'm', 'multiline (^ and $ match line boundaries)'],
            [flagS, setFlagS, 's', 'dotAll (. matches newlines)'],
          ] as [boolean, (v: boolean) => void, string, string][]).map(([val, setter, letter, desc]) => (
            <label key={letter} className="flex items-center gap-1.5 cursor-pointer select-none">
              <input type="checkbox" checked={val} onChange={e => setter(e.target.checked)} className="w-3.5 h-3.5 accent-blue-600" />
              <code className="text-sm font-mono text-blue-600 dark:text-blue-400">{letter}</code>
              <span className="text-xs text-gray-500 dark:text-gray-400">{desc}</span>
            </label>
          ))}
        </div>

        {/* Test string with highlight overlay */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Test String</label>
            {pattern && testString && !error && (
              <span className={`text-xs font-medium ${hasMatches ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                {hasMatches ? `${matches.length} match${matches.length !== 1 ? 'es' : ''} found` : 'no matches'}
              </span>
            )}
          </div>
          <div className="relative rounded-lg border border-gray-200 dark:border-gray-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 bg-white dark:bg-[#1e293b] overflow-hidden">
            {/* Backdrop */}
            <div
              ref={backdropRef}
              aria-hidden="true"
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ ...SHARED_STYLE, color: 'transparent' }}
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={testString}
              onChange={e => setTestString(e.target.value)}
              onScroll={syncScroll}
              placeholder="Paste your test string here..."
              rows={9}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              className="caret-gray-700 dark:caret-gray-300 placeholder:text-gray-300 dark:placeholder:text-gray-600 w-full block resize-y focus:outline-none"
              style={{
                ...SHARED_STYLE,
                color: hasMatches ? 'transparent' : undefined,
                background: 'transparent',
                border: 'none',
              }}
            />
          </div>
        </div>

        {/* Match list */}
        {hasMatches && (
          <div>
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Matches</h3>
            <div className="space-y-1 max-h-52 overflow-y-auto rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#1e293b] p-2">
              {matches.map((m, i) => (
                <div key={i} className="flex items-start gap-3 rounded px-2 py-1.5 bg-white dark:bg-[#0f172a] text-xs font-mono">
                  <span className="text-gray-300 dark:text-gray-600 shrink-0 w-5 text-right">{i + 1}</span>
                  <span className="text-yellow-700 dark:text-yellow-300 font-semibold flex-1 break-all">&quot;{m.value}&quot;</span>
                  <span className="text-gray-400 shrink-0">[{m.start}–{m.end}]</span>
                  {m.groups && Object.keys(m.groups).length > 0 && (
                    <span className="text-blue-500 dark:text-blue-400 shrink-0 break-all">{JSON.stringify(m.groups)}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Common patterns reference */}
        <div className="rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#1e293b]">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Common Patterns — click to load</h3>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {COMMON_PATTERNS.map(({ label, pattern: p, flags: f }) => (
              <button
                key={label}
                onClick={() => loadPattern(p, f)}
                className="w-full flex items-center gap-4 px-4 py-2.5 text-left hover:bg-blue-50 dark:hover:bg-blue-950/20 transition group"
              >
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 shrink-0 w-32">{label}</span>
                <code className="text-xs text-blue-600 dark:text-blue-400 break-all group-hover:text-blue-700 dark:group-hover:text-blue-300">{p}</code>
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-center text-gray-400 dark:text-gray-500 pb-4">
          🔒 Your regex and test data never leave your browser
        </p>
      </main>
    </div>
  )
}

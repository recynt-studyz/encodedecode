'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import ToolHeader from './ToolHeader'

type Mode = 'encode' | 'decode'
type UrlMode = 'component' | 'full'

function encodeUrl(str: string, urlMode: UrlMode): string {
  if (urlMode === 'full') {
    // Encode only the query string and fragment portion, preserve scheme+host
    try {
      const url = new URL(str)
      // Re-encode query params
      const params = new URLSearchParams()
      url.searchParams.forEach((v, k) => params.set(k, v))
      url.search = params.toString()
      return url.toString()
    } catch {
      // Not a valid URL, fall through to component encode
    }
  }
  return encodeURIComponent(str)
}

function decodeUrl(str: string): string {
  return decodeURIComponent(str.replace(/\+/g, ' '))
}

function countEncodedChars(encoded: string, original: string): number {
  const matches = encoded.match(/%[0-9A-Fa-f]{2}/g)
  return matches ? matches.length : 0
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  return `${(n / 1024).toFixed(1)} KB`
}

export default function UrlTool() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<Mode>('encode')
  const [urlMode, setUrlMode] = useState<UrlMode>('component')
  const [debouncedInput, setDebouncedInput] = useState('')
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setDebouncedInput(input), 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [input])

  let output = ''
  let error: string | null = null

  if (debouncedInput.trim()) {
    try {
      if (mode === 'encode') {
        output = encodeUrl(debouncedInput, urlMode)
      } else {
        output = decodeUrl(debouncedInput)
      }
    } catch (e) {
      error = e instanceof Error ? e.message : 'Processing failed'
    }
  }

  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.max(300, el.scrollHeight) + 'px'
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    requestAnimationFrame(resizeTextarea)
  }

  const handleClear = () => {
    setInput('')
    setDebouncedInput('')
    if (textareaRef.current) textareaRef.current.style.height = '300px'
  }

  const handleCopy = async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }

  const handleDownload = () => {
    if (!output) return
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'url-encoded.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const inputLines = input ? input.split('\n') : ['']
  const outputLines = output ? output.split('\n') : []
  const encodedCount = mode === 'encode' && output ? countEncodedChars(output, input) : 0

  return (
    <div className="w-full">
      <ToolHeader />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        {/* Mode toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div
            className="inline-flex items-center gap-1 rounded-2xl bg-gray-100 dark:bg-gray-800 p-1.5"
            style={{ boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }}
          >
            {(['encode', 'decode'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); handleClear() }}
                className={`rounded-xl px-5 py-2.5 text-sm transition-all duration-150 ${
                  mode === m
                    ? 'font-semibold text-white'
                    : 'font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
                style={mode === m ? { background: '#2563EB', boxShadow: '0 4px 14px rgba(37,99,235,0.4)', transform: 'scale(1.05)' } : undefined}
              >
                {m === 'encode' ? 'Encode ▶' : 'Decode ◀'}
              </button>
            ))}
          </div>

          {mode === 'encode' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Mode:</span>
              {([
                { value: 'component' as UrlMode, label: 'Component' },
                { value: 'full' as UrlMode, label: 'Full URL' },
              ]).map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setUrlMode(value)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    urlMode === value
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Two-panel layout */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left panel */}
          <div className="flex-1 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b]">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {mode === 'encode' ? 'Plain Text / URL' : 'Percent-Encoded'}
              </span>
              {input && (
                <button onClick={handleClear} className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition" aria-label="Clear">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>
            <div className="flex bg-white dark:bg-[#1e293b] overflow-auto">
              <div className="select-none text-right font-mono text-xs leading-6 pt-3 pb-3 pr-2 pl-2 shrink-0 bg-gray-50 dark:bg-[#162032] border-r border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 sticky left-0" style={{ minWidth: '3rem' }}>
                {inputLines.map((_, i) => <div key={i}>{i + 1}</div>)}
              </div>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                className="flex-1 p-3 font-mono text-sm bg-transparent outline-none resize-none leading-6 text-gray-900 dark:text-[#e2e8f0] placeholder-gray-400 dark:placeholder-gray-600 min-w-0"
                placeholder={mode === 'encode' ? 'Paste text or URL to encode...' : 'Paste percent-encoded string to decode...'}
                style={{ minHeight: 300, overflow: 'hidden' }}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>
          </div>

          {/* Right panel */}
          <div className="flex-1 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b]">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {mode === 'encode' ? 'URL Encoded' : 'Plain Text'}
              </span>
              {output && (
                <div className="flex items-center gap-3">
                  <button onClick={handleDownload} className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium transition flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download
                  </button>
                  <button onClick={handleCopy} className={`text-xs font-medium transition flex items-center gap-1 ${copied ? 'text-green-600 dark:text-green-400' : 'text-[#2563EB] hover:text-blue-700 dark:hover:text-blue-400'}`}>
                    {copied
                      ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Copied!</>
                      : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy</>
                    }
                  </button>
                </div>
              )}
            </div>
            <div className="flex bg-white dark:bg-[#1e293b] overflow-auto" style={{ minHeight: 300 }}>
              {outputLines.length > 0 && (
                <div className="select-none text-right font-mono text-xs leading-6 pt-3 pb-3 pr-2 pl-2 shrink-0 bg-gray-50 dark:bg-[#162032] border-r border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 sticky left-0" style={{ minWidth: '3rem' }}>
                  {outputLines.map((_, i) => <div key={i}>{i + 1}</div>)}
                </div>
              )}
              <pre className="flex-1 p-3 font-mono text-sm leading-6 overflow-x-auto text-gray-900 dark:text-[#e2e8f0] whitespace-pre-wrap break-all" style={{ minHeight: 300 }}>
                {error
                  ? <span className="text-red-500">{error}</span>
                  : output || <span className="text-gray-400 dark:text-gray-600">{mode === 'encode' ? 'URL encoded output will appear here...' : 'Decoded text will appear here...'}</span>
                }
              </pre>
            </div>
          </div>
        </div>

        {/* Status bar */}
        {debouncedInput.trim() && (
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400">
            <span>{input.length} chars</span>
            {mode === 'encode' && output && encodedCount > 0 && (
              <><span className="text-gray-300 dark:text-gray-600">&middot;</span><span>{encodedCount} characters encoded</span></>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

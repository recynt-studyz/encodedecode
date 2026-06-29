'use client'

import { useState } from 'react'
import ToolHeader from './ToolHeader'

interface JwtParts {
  header: Record<string, unknown> | null
  payload: Record<string, unknown> | null
  signature: string
  error: string | null
}

function base64urlDecode(str: string): string {
  let s = str.replace(/-/g, '+').replace(/_/g, '/')
  const pad = s.length % 4
  if (pad === 2) s += '=='
  else if (pad === 3) s += '='
  return atob(s)
}

function parseJwt(token: string): JwtParts {
  const parts = token.trim().split('.')
  if (parts.length !== 3) {
    return { header: null, payload: null, signature: '', error: `Invalid JWT: expected 3 parts separated by ".", got ${parts.length}` }
  }
  try {
    const header = JSON.parse(base64urlDecode(parts[0]))
    const payload = JSON.parse(base64urlDecode(parts[1]))
    return { header, payload, signature: parts[2], error: null }
  } catch (e) {
    return { header: null, payload: null, signature: '', error: e instanceof Error ? e.message : 'Failed to decode JWT' }
  }
}

function syntaxHighlightJson(obj: unknown): string {
  const json = JSON.stringify(obj, null, 2)
  const escaped = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return escaped.replace(
    /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      if (/^"/.test(match)) {
        if (/:$/.test(match)) return `<span style="color:#2563EB">${match}</span>`
        return `<span style="color:#16a34a">${match}</span>`
      }
      if (/true|false/.test(match)) return `<span style="color:#7c3aed">${match}</span>`
      if (/null/.test(match)) return `<span style="color:#dc2626">${match}</span>`
      return `<span style="color:#ea580c">${match}</span>`
    }
  )
}

function formatTimestamp(ts: unknown): string {
  if (typeof ts !== 'number') return String(ts)
  return new Date(ts * 1000).toLocaleString()
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }
  return (
    <button
      onClick={handleCopy}
      className={`text-xs font-medium transition flex items-center gap-1 ${copied ? 'text-green-600 dark:text-green-400' : 'text-[#2563EB] hover:text-blue-700 dark:hover:text-blue-400'}`}
    >
      {copied
        ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Copied!</>
        : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy</>
      }
    </button>
  )
}

export default function JwtTool() {
  const [input, setInput] = useState('')

  const jwt = input.trim() ? parseJwt(input) : null
  const now = Math.floor(Date.now() / 1000)

  let expiryEl: React.ReactNode = null
  if (jwt?.payload && typeof jwt.payload.exp === 'number') {
    const exp = jwt.payload.exp as number
    if (exp > now) {
      const diff = exp - now
      const hours = Math.floor(diff / 3600)
      const mins = Math.floor((diff % 3600) / 60)
      expiryEl = (
        <div className="flex items-center gap-2 mt-2 text-xs">
          <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Token valid until {formatTimestamp(exp)}
          </span>
          <span className="text-gray-400">({hours > 0 ? `${hours}h ` : ''}{mins}m remaining)</span>
        </div>
      )
    } else {
      const diff = now - exp
      const hours = Math.floor(diff / 3600)
      const mins = Math.floor((diff % 3600) / 60)
      const days = Math.floor(diff / 86400)
      const ago = days > 0 ? `${days}d ago` : hours > 0 ? `${hours}h ${mins}m ago` : `${mins}m ago`
      expiryEl = (
        <div className="flex items-center gap-2 mt-2 text-xs">
          <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-medium">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Token expired — {formatTimestamp(exp)} ({ago})
          </span>
        </div>
      )
    }
  }

  return (
    <div className="w-full">
      <ToolHeader />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        {/* Privacy notice */}
        <div className="mb-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 px-4 py-3 text-xs text-blue-800 dark:text-blue-300 flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Your JWT is decoded entirely in your browser. It is never sent to any server.
        </div>

        {/* Input */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b]">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">JWT Token</span>
            {input && (
              <button onClick={() => setInput('')} className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition" aria-label="Clear">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-4 font-mono text-sm bg-white dark:bg-[#1e293b] outline-none resize-none leading-6 text-gray-900 dark:text-[#e2e8f0] placeholder-gray-400 dark:placeholder-gray-600"
            placeholder="Paste your JWT token here... (eyJ...)"
            rows={4}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>

        {/* Error state */}
        {jwt?.error && (
          <div className="mb-6 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {jwt.error}
          </div>
        )}

        {/* Output cards */}
        {jwt && !jwt.error && (
          <div className="space-y-4">
            {/* Header card */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b]">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-red-400" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Header</span>
                  <span className="text-xs text-gray-400">{(jwt.header as { alg?: string })?.alg ?? ''} · {(jwt.header as { typ?: string })?.typ ?? ''}</span>
                </div>
                <CopyButton text={JSON.stringify(jwt.header, null, 2)} />
              </div>
              <pre
                className="p-4 font-mono text-sm leading-6 bg-white dark:bg-[#1e293b] overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: syntaxHighlightJson(jwt.header) }}
              />
            </div>

            {/* Payload card */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b]">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-blue-400" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Payload</span>
                  {typeof (jwt.payload as { sub?: unknown })?.sub === 'string' && (
                    <span className="text-xs text-gray-400">sub: {String((jwt.payload as { sub?: unknown }).sub)}</span>
                  )}
                </div>
                <CopyButton text={JSON.stringify(jwt.payload, null, 2)} />
              </div>
              <div className="bg-white dark:bg-[#1e293b] px-4 pb-4">
                <pre
                  className="pt-4 font-mono text-sm leading-6 overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: syntaxHighlightJson(jwt.payload) }}
                />
                {expiryEl}
                {/* Human-readable timestamps */}
                {(['iat', 'exp', 'nbf'] as const).some((k) => typeof (jwt.payload as Record<string, unknown>)[k] === 'number') && (
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-1">
                    {(['iat', 'exp', 'nbf'] as const).map((k) => {
                      const val = (jwt.payload as Record<string, unknown>)[k]
                      if (typeof val !== 'number') return null
                      const labels: Record<string, string> = { iat: 'Issued At', exp: 'Expires', nbf: 'Not Before' }
                      return (
                        <div key={k} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <span className="font-mono text-gray-400 dark:text-gray-500 w-20">{labels[k]}:</span>
                          <span>{formatTimestamp(val)}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Signature card */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b]">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-purple-400" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Signature</span>
                </div>
                <CopyButton text={jwt.signature} />
              </div>
              <div className="p-4 bg-white dark:bg-[#1e293b]">
                <p className="font-mono text-sm text-gray-600 dark:text-gray-400 break-all leading-6">{jwt.signature}</p>
                <p className="mt-3 text-xs text-gray-400 dark:text-gray-500 italic">
                  Signature verification requires the secret key — this tool only decodes, it does not verify.
                </p>
              </div>
            </div>
          </div>
        )}

        {!input.trim() && (
          <div className="text-center py-16 text-gray-400 dark:text-gray-600">
            <svg className="mx-auto mb-4 opacity-30" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <p className="text-sm">Paste a JWT token above to decode it</p>
          </div>
        )}
      </div>
    </div>
  )
}

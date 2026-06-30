'use client'

import { useState } from 'react'
import ToolHeader from './ToolHeader'

type Tab = 'rot13' | 'caesar'
type EncodeMode = 'encode' | 'decode'

function rot13(str: string): string {
  return str.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= 'Z' ? 65 : 97
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base)
  })
}

function caesar(str: string, shift: number, encode: boolean): string {
  const s = encode ? shift : 26 - shift
  return str.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= 'Z' ? 65 : 97
    return String.fromCharCode(((c.charCodeAt(0) - base + s) % 26) + base)
  })
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

export default function Rot13Tool() {
  const [tab, setTab] = useState<Tab>('rot13')
  const [shift, setShift] = useState(3)
  const [encodeMode, setEncodeMode] = useState<EncodeMode>('encode')
  const [input, setInput] = useState('')

  const output = input
    ? tab === 'rot13'
      ? rot13(input)
      : caesar(input, shift, encodeMode === 'encode')
    : ''

  // Generate shift mapping for display
  const shiftMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((c) => {
    const from = c
    const to = caesar(c, shift, true)
    return `${from}→${to}`
  })

  const inputLines = input ? input.split('\n') : ['']
  const outputLines = output ? output.split('\n') : []

  return (
    <div className="w-full">
      <ToolHeader />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        {/* Tab selector */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div
            className="inline-flex items-center gap-1 rounded-2xl bg-gray-100 dark:bg-gray-800 p-1.5"
            style={{ boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }}
          >
            {([
              { value: 'rot13' as Tab, label: 'ROT13' },
              { value: 'caesar' as Tab, label: 'Caesar Cipher' },
            ]).map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={`rounded-xl px-5 py-2.5 text-sm transition-all duration-150 ${
                  tab === value
                    ? 'font-semibold text-white'
                    : 'font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
                style={tab === value ? { background: '#2563EB', boxShadow: '0 4px 14px rgba(37,99,235,0.4)', transform: 'scale(1.05)' } : undefined}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === 'caesar' && (
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">Shift:</span>
                <input
                  type="range"
                  min={1}
                  max={25}
                  value={shift}
                  onChange={(e) => setShift(Number(e.target.value))}
                  className="w-24 accent-[#2563EB]"
                />
                <span className="text-sm font-mono font-bold text-[#2563EB] w-6 text-center">{shift}</span>
              </div>

              <div
                className="inline-flex items-center gap-1 rounded-2xl bg-gray-100 dark:bg-gray-800 p-1"
                style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.08)' }}
              >
                {(['encode', 'decode'] as EncodeMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setEncodeMode(m)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all duration-150 capitalize ${
                      encodeMode === m
                        ? 'text-white'
                        : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm hover:bg-gray-50'
                    }`}
                    style={encodeMode === m ? { background: '#2563EB' } : undefined}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {tab === 'rot13' && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
            ROT13 is its own inverse — applying it twice returns the original text. Non-alphabetic characters pass through unchanged.
          </p>
        )}

        {/* Two-panel layout */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Input */}
          <div className="flex-1 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b]">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Input</span>
              {input && (
                <button onClick={() => setInput('')} className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition" aria-label="Clear">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>
            <div className="flex bg-white dark:bg-[#1e293b] overflow-auto">
              <div className="select-none text-right font-mono text-xs leading-6 pt-3 pb-3 pr-2 pl-2 shrink-0 bg-gray-50 dark:bg-[#162032] border-r border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 sticky left-0" style={{ minWidth: '3rem' }}>
                {inputLines.map((_, i) => <div key={i}>{i + 1}</div>)}
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-3 font-mono text-sm bg-transparent outline-none resize-none leading-6 text-gray-900 dark:text-[#e2e8f0] placeholder-gray-400 dark:placeholder-gray-600 min-w-0"
                placeholder={tab === 'rot13' ? 'Type or paste text to ROT13 encode/decode...' : `Type or paste text to ${encodeMode} with shift ${shift}...`}
                style={{ minHeight: 300, overflow: 'hidden' }}
                spellCheck={false}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Output */}
          <div className="flex-1 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b]">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Output</span>
              {output && <CopyButton text={output} />}
            </div>
            <div className="flex bg-white dark:bg-[#1e293b] overflow-auto" style={{ minHeight: 300 }}>
              {outputLines.length > 0 && (
                <div className="select-none text-right font-mono text-xs leading-6 pt-3 pb-3 pr-2 pl-2 shrink-0 bg-gray-50 dark:bg-[#162032] border-r border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 sticky left-0" style={{ minWidth: '3rem' }}>
                  {outputLines.map((_, i) => <div key={i}>{i + 1}</div>)}
                </div>
              )}
              <pre className="flex-1 p-3 font-mono text-sm leading-6 overflow-x-auto text-gray-900 dark:text-[#e2e8f0] whitespace-pre-wrap break-words" style={{ minHeight: 300 }}>
                {output || <span className="text-gray-400 dark:text-gray-600">
                  {tab === 'rot13' ? 'Uryyb Jbeyq!' : `Encoded output (shift ${shift})...`}
                </span>}
              </pre>
            </div>
          </div>
        </div>

        {/* Caesar shift mapping */}
        {tab === 'caesar' && (
          <div className="mt-6 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#162032]">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Shift {shift} Mapping (A→{caesar('A', shift, true)}, B→{caesar('B', shift, true)}, C→{caesar('C', shift, true)}...)
              </span>
            </div>
            <div className="p-4 bg-white dark:bg-[#1e293b]">
              <div className="grid grid-cols-6 sm:grid-cols-9 lg:grid-cols-13 gap-1.5">
                {shiftMap.map((m, i) => (
                  <div key={i} className="text-center rounded-lg border border-gray-100 dark:border-gray-700 px-1.5 py-1.5">
                    <span className="text-xs font-mono text-gray-600 dark:text-gray-400">{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import ToolHeader from './ToolHeader'

type Mode = 'forward' | 'reverse'
type HexCase = 'lower' | 'upper'

function textToBinary(text: string): string {
  return Array.from(new TextEncoder().encode(text))
    .map((b) => b.toString(2).padStart(8, '0'))
    .join(' ')
}

function textToHex(text: string, upper: boolean): string {
  return Array.from(new TextEncoder().encode(text))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(' ')
    .replace(upper ? /./g : /$/g, upper ? (c) => c.toUpperCase() : (c) => c)
}

function binaryToText(bin: string): string {
  const groups = bin.trim().replace(/\s+/g, ' ').split(' ').filter(Boolean)
  const bytes = groups.map((g) => parseInt(g, 2))
  if (bytes.some(isNaN)) throw new Error('Invalid binary')
  return new TextDecoder().decode(new Uint8Array(bytes))
}

function hexToText(hex: string): string {
  const groups = hex.trim().replace(/\s+/g, ' ').split(' ').filter(Boolean)
  const bytes = groups.map((g) => parseInt(g, 16))
  if (bytes.some(isNaN)) throw new Error('Invalid hex')
  return new TextDecoder().decode(new Uint8Array(bytes))
}

function detectFormat(input: string): 'binary' | 'hex' | null {
  const clean = input.trim().replace(/\s+/g, ' ')
  const groups = clean.split(' ')
  if (groups.every((g) => /^[01]+$/.test(g))) return 'binary'
  if (groups.every((g) => /^[0-9a-fA-F]+$/.test(g))) return 'hex'
  return null
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

export default function BinaryTool() {
  const [mode, setMode] = useState<Mode>('forward')
  const [hexCase, setHexCase] = useState<HexCase>('upper')

  // Forward mode state
  const [textInput, setTextInput] = useState('')

  // Reverse mode state
  const [reverseInput, setReverseInput] = useState('')

  // Forward outputs
  const binaryOut = textInput ? textToBinary(textInput) : ''
  const hexOut = textInput ? textToHex(textInput, hexCase === 'upper') : ''

  // Reverse output
  let reverseOut = ''
  let reverseError: string | null = null
  let detectedFormat: 'binary' | 'hex' | null = null
  if (reverseInput.trim()) {
    detectedFormat = detectFormat(reverseInput)
    try {
      if (detectedFormat === 'binary') reverseOut = binaryToText(reverseInput)
      else if (detectedFormat === 'hex') reverseOut = hexToText(reverseInput)
      else reverseError = 'Could not detect format. Input should be space-separated 8-bit binary groups (e.g. 01001000) or hex pairs (e.g. 48).'
    } catch {
      reverseError = 'Invalid input — check that each group is valid binary or hex.'
    }
  }

  const panelClass = 'rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden'
  const headerClass = 'flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b]'
  const labelClass = 'text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'
  const areaClass = 'w-full p-4 font-mono text-sm bg-white dark:bg-[#1e293b] outline-none resize-none leading-6 text-gray-900 dark:text-[#e2e8f0] placeholder-gray-400 dark:placeholder-gray-600'

  return (
    <div className="w-full">
      <ToolHeader />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        {/* Mode toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div
            className="inline-flex items-center gap-1 rounded-2xl bg-gray-100 dark:bg-gray-800 p-1.5"
            style={{ boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }}
          >
            {([
              { value: 'forward' as Mode, label: 'Text → Binary / Hex' },
              { value: 'reverse' as Mode, label: 'Binary / Hex → Text' },
            ]).map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setMode(value)}
                className={`rounded-xl px-5 py-2.5 text-sm transition-all duration-150 ${
                  mode === value
                    ? 'font-semibold text-white'
                    : 'font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
                style={mode === value ? { background: '#2563EB', boxShadow: '0 4px 14px rgba(37,99,235,0.4)', transform: 'scale(1.05)' } : undefined}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Hex:</span>
            {(['upper', 'lower'] as HexCase[]).map((c) => (
              <button
                key={c}
                onClick={() => setHexCase(c)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition capitalize ${
                  hexCase === c
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {c === 'upper' ? 'A–F' : 'a–f'}
              </button>
            ))}
          </div>
        </div>

        {mode === 'forward' ? (
          <div className="space-y-4">
            {/* Text input */}
            <div className={panelClass}>
              <div className={headerClass}>
                <span className={labelClass}>Text Input</span>
                {textInput && (
                  <button onClick={() => setTextInput('')} className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition" aria-label="Clear">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                )}
              </div>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className={areaClass}
                placeholder="Enter text here..."
                rows={4}
                spellCheck={false}
                autoComplete="off"
              />
            </div>

            {/* Binary output */}
            <div className={panelClass}>
              <div className={headerClass}>
                <span className={labelClass}>Binary</span>
                {binaryOut && <CopyButton text={binaryOut} />}
              </div>
              <div className="p-4 bg-white dark:bg-[#1e293b] min-h-20 overflow-x-auto">
                <pre className="font-mono text-sm text-gray-800 dark:text-[#e2e8f0] whitespace-pre-wrap break-words leading-7">
                  {binaryOut || <span className="text-gray-400 dark:text-gray-600">01001000 01100101 01101100 01101100 01101111</span>}
                </pre>
              </div>
            </div>

            {/* Hex output */}
            <div className={panelClass}>
              <div className={headerClass}>
                <span className={labelClass}>Hexadecimal</span>
                {hexOut && <CopyButton text={hexOut} />}
              </div>
              <div className="p-4 bg-white dark:bg-[#1e293b] min-h-20 overflow-x-auto">
                <pre className="font-mono text-sm text-gray-800 dark:text-[#e2e8f0] whitespace-pre-wrap break-words leading-7">
                  {hexOut || <span className="text-gray-400 dark:text-gray-600">{hexCase === 'upper' ? '48 65 6C 6C 6F' : '48 65 6c 6c 6f'}</span>}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Reverse input */}
            <div className={panelClass}>
              <div className={headerClass}>
                <div className="flex items-center gap-2">
                  <span className={labelClass}>Binary or Hex Input</span>
                  {detectedFormat && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-400 font-medium capitalize">
                      {detectedFormat} detected
                    </span>
                  )}
                </div>
                {reverseInput && (
                  <button onClick={() => setReverseInput('')} className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition" aria-label="Clear">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                )}
              </div>
              <textarea
                value={reverseInput}
                onChange={(e) => setReverseInput(e.target.value)}
                className={areaClass}
                placeholder={'Paste binary (01001000 01100101...) or hex (48 65 6C...) here...'}
                rows={5}
                spellCheck={false}
                autoComplete="off"
              />
            </div>

            {/* Text output */}
            {reverseError ? (
              <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {reverseError}
              </div>
            ) : (
              <div className={panelClass}>
                <div className={headerClass}>
                  <span className={labelClass}>Decoded Text</span>
                  {reverseOut && <CopyButton text={reverseOut} />}
                </div>
                <div className="p-4 bg-white dark:bg-[#1e293b] min-h-24">
                  <pre className="font-mono text-sm text-gray-800 dark:text-[#e2e8f0] whitespace-pre-wrap break-words leading-6">
                    {reverseOut || <span className="text-gray-400 dark:text-gray-600">Decoded text will appear here...</span>}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

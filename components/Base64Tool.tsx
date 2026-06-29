'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import ToolHeader from './ToolHeader'

type Mode = 'encode' | 'decode'
type Format = 'standard' | 'urlsafe'

function encodeBase64(str: string, format: Format): string {
  const bytes = new TextEncoder().encode(str)
  let b64 = btoa(String.fromCharCode(...bytes))
  if (format === 'urlsafe') b64 = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  return b64
}

function decodeBase64(str: string): string {
  // Normalize URL-safe base64
  let normalized = str.replace(/-/g, '+').replace(/_/g, '/')
  // Pad to multiple of 4
  const pad = normalized.length % 4
  if (pad === 2) normalized += '=='
  else if (pad === 3) normalized += '='
  const binary = atob(normalized)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

function isValidBase64(str: string): boolean {
  if (!str.trim()) return true
  try {
    let normalized = str.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '')
    const pad = normalized.length % 4
    if (pad === 2) normalized += '=='
    else if (pad === 3) normalized += '='
    atob(normalized)
    return true
  } catch {
    return false
  }
}

function detectImageType(bytes: Uint8Array): string | null {
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'image/png'
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg'
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return 'image/gif'
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) return 'image/webp'
  return null
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1048576) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1048576).toFixed(1)} MB`
}

export default function Base64Tool() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<Mode>('encode')
  const [format, setFormat] = useState<Format>('standard')
  const [debouncedInput, setDebouncedInput] = useState('')
  const [copied, setCopied] = useState(false)
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number; type: string; dataUrl: string } | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setDebouncedInput(input), 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [input])

  // Compute output
  let output = ''
  let error: string | null = null
  let valid = true

  if (debouncedInput.trim()) {
    if (mode === 'encode') {
      try {
        output = encodeBase64(debouncedInput, format)
      } catch (e) {
        error = e instanceof Error ? e.message : 'Encoding failed'
        valid = false
      }
    } else {
      if (!isValidBase64(debouncedInput.replace(/\s/g, ''))) {
        valid = false
        error = 'Invalid Base64 — check for illegal characters'
      } else {
        try {
          output = decodeBase64(debouncedInput.replace(/\s/g, ''))
        } catch (e) {
          error = e instanceof Error ? e.message : 'Decoding failed'
          valid = false
        }
      }
    }
  }

  // Detect image in decode mode
  useEffect(() => {
    setImagePreview(null)
    if (mode === 'decode' && output) {
      if (output.startsWith('data:image')) {
        setImagePreview(output)
      } else {
        // Try to detect image from raw bytes
        try {
          let normalized = debouncedInput.replace(/\s/g, '').replace(/-/g, '+').replace(/_/g, '/')
          const pad = normalized.length % 4
          if (pad === 2) normalized += '=='
          else if (pad === 3) normalized += '='
          const binary = atob(normalized)
          const bytes = new Uint8Array(binary.length)
          for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
          const mimeType = detectImageType(bytes)
          if (mimeType) {
            const blob = new Blob([bytes], { type: mimeType })
            const url = URL.createObjectURL(blob)
            setImagePreview(url)
            return () => URL.revokeObjectURL(url)
          }
        } catch { /* not an image */ }
      }
    }
  }, [mode, output, debouncedInput])

  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.max(300, el.scrollHeight) + 'px'
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    setFileInfo(null)
    requestAnimationFrame(resizeTextarea)
  }

  const handleClear = () => {
    setInput('')
    setDebouncedInput('')
    setFileInfo(null)
    setImagePreview(null)
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
    a.download = mode === 'encode' ? 'encoded.txt' : 'decoded.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadImage = () => {
    if (!imagePreview) return
    const a = document.createElement('a')
    a.href = imagePreview
    a.download = 'decoded-image'
    a.click()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      setFileInfo({ name: file.name, size: file.size, type: file.type || 'application/octet-stream', dataUrl })
      // Extract base64 from data URL
      const b64 = dataUrl.split(',')[1] || ''
      const formatted = format === 'urlsafe'
        ? b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
        : b64
      setInput(formatted)
      requestAnimationFrame(resizeTextarea)
    }
    reader.readAsDataURL(file)
  }

  const inputLines = input ? input.split('\n') : ['']
  const outputLines = output ? output.split('\n') : []

  const inputBytes = new TextEncoder().encode(input).length
  const outputBytes = output ? new TextEncoder().encode(output).length : 0

  const statusBar = debouncedInput.trim() ? (
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-xs">
      {mode === 'decode' ? (
        valid ? (
          <span className="flex items-center gap-1.5 text-green-700 dark:text-green-400 font-medium">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            Valid Base64
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-medium">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            Invalid Base64 — {error}
          </span>
        )
      ) : null}
      <span className="text-gray-500 dark:text-gray-400">
        {input.length} chars · {formatBytes(inputBytes)}
        {mode === 'encode' && output && ` · ${output.length} Base64 chars`}
        {mode === 'decode' && output && ` · decoded: ${formatBytes(outputBytes)}`}
      </span>
    </div>
  ) : null

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

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Format:</span>
            {(['standard', 'urlsafe'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  format === f
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {f === 'standard' ? 'Standard' : 'URL-safe'}
              </button>
            ))}
          </div>
        </div>

        {/* Two-panel layout */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left panel: Input */}
          <div className="flex-1 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b]">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {mode === 'encode' ? 'Plain Text' : 'Base64'}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 dark:text-gray-500">Drop a file to encode</span>
                {input && (
                  <button
                    onClick={handleClear}
                    className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                    aria-label="Clear input"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {fileInfo && (
              <div className="px-4 py-2 bg-blue-50 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/50 flex items-center gap-3 text-xs text-blue-800 dark:text-blue-300">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <span className="font-mono font-medium">{fileInfo.name}</span>
                <span className="text-blue-600 dark:text-blue-400">{formatBytes(fileInfo.size)}</span>
                <span className="text-blue-600 dark:text-blue-400">{fileInfo.type}</span>
                {fileInfo.type.startsWith('image/') && (
                  <img src={fileInfo.dataUrl} alt="preview" className="h-8 w-8 object-cover rounded border border-blue-200 dark:border-blue-800" />
                )}
              </div>
            )}

            <div
              className="flex bg-white dark:bg-[#1e293b] overflow-auto"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <div
                className="select-none text-right font-mono text-xs leading-6 pt-3 pb-3 pr-2 pl-2 shrink-0 bg-gray-50 dark:bg-[#162032] border-r border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 sticky left-0"
                style={{ minWidth: '3rem' }}
              >
                {inputLines.map((_, i) => <div key={i}>{i + 1}</div>)}
              </div>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                className="flex-1 p-3 font-mono text-sm bg-transparent outline-none resize-none leading-6 text-gray-900 dark:text-[#e2e8f0] placeholder-gray-400 dark:placeholder-gray-600 min-w-0"
                placeholder={mode === 'encode' ? 'Paste text or drop a file here...' : 'Paste Base64 here...'}
                style={{ minHeight: 300, overflow: 'hidden' }}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>
          </div>

          {/* Right panel: Output */}
          <div className="flex-1 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b]">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {mode === 'encode' ? 'Base64' : 'Plain Text'}
              </span>
              {output && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDownload}
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium transition flex items-center gap-1"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download
                  </button>
                  <button
                    onClick={handleCopy}
                    className={`text-xs font-medium transition flex items-center gap-1 ${copied ? 'text-green-600 dark:text-green-400' : 'text-[#2563EB] hover:text-blue-700 dark:hover:text-blue-400'}`}
                  >
                    {copied ? (
                      <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Copied!</>
                    ) : (
                      <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy</>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="flex bg-white dark:bg-[#1e293b] overflow-auto" style={{ minHeight: 300 }}>
              {outputLines.length > 0 && (
                <div
                  className="select-none text-right font-mono text-xs leading-6 pt-3 pb-3 pr-2 pl-2 shrink-0 bg-gray-50 dark:bg-[#162032] border-r border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 sticky left-0"
                  style={{ minWidth: '3rem' }}
                >
                  {outputLines.map((_, i) => <div key={i}>{i + 1}</div>)}
                </div>
              )}
              <pre
                className="flex-1 p-3 font-mono text-sm leading-6 overflow-x-auto text-gray-900 dark:text-[#e2e8f0] whitespace-pre-wrap break-all"
                style={{ minHeight: 300 }}
              >
                {output || (
                  <span className="text-gray-400 dark:text-gray-600">
                    {mode === 'encode' ? 'Base64 output will appear here...' : 'Decoded text will appear here...'}
                  </span>
                )}
              </pre>
            </div>
          </div>
        </div>

        {statusBar}

        {/* Image preview in decode mode */}
        {imagePreview && mode === 'decode' && (
          <div className="mt-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Image Preview</span>
              <button
                onClick={handleDownloadImage}
                className="text-xs text-[#2563EB] hover:text-blue-700 dark:hover:text-blue-400 font-medium transition flex items-center gap-1"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Image
              </button>
            </div>
            <img
              src={imagePreview}
              alt="Decoded"
              className="max-h-64 max-w-full rounded-lg border border-gray-100 dark:border-gray-700 object-contain"
              onError={() => setImagePreview(null)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import ToolHeader from './ToolHeader'

const MIME_LABELS: Record<string, string> = {
  'image/png': 'PNG',
  'image/jpeg': 'JPEG',
  'image/gif': 'GIF',
  'image/webp': 'WebP',
  'image/svg+xml': 'SVG',
  'image/bmp': 'BMP',
  'image/x-icon': 'ICO',
  'image/ico': 'ICO',
}

const MIME_EXT: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'image/bmp': 'bmp',
  'image/x-icon': 'ico',
  'image/ico': 'ico',
}

function detectMimeFromBase64(b64: string): string | null {
  try {
    // Decode enough bytes to cover WebP "WEBP" signature at offset 8–11 (~15 bytes needed)
    // Use 48 chars (multiple of 4) → 36 decoded bytes
    const raw = b64.slice(0, 48).replace(/-/g, '+').replace(/_/g, '/')
    const padded = raw.padEnd(Math.ceil(raw.length / 4) * 4, '=')
    const binary = atob(padded)
    const bytes = Array.from(binary).map((c) => c.charCodeAt(0))
    console.log('[B64->Img] Decoded magic bytes (hex):', bytes.slice(0, 12).map(b => b.toString(16).padStart(2, '0')).join(' '))
    if (bytes[0] === 0xFF && bytes[1] === 0xD8) return 'image/jpeg'
    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) return 'image/png'
    if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return 'image/gif'
    // WebP: RIFF....WEBP — check "WEBP" identifier at bytes 8–11
    if (bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return 'image/webp'
    if (bytes[0] === 0x3C && (bytes[1] === 0x73 || bytes[1] === 0x3F || bytes[1] === 0x21)) return 'image/svg+xml'
    if (bytes[0] === 0x42 && bytes[1] === 0x4D) return 'image/bmp'
    if (bytes[0] === 0x00 && bytes[1] === 0x00 && bytes[2] === 0x01 && bytes[3] === 0x00) return 'image/x-icon'
    console.log('[B64->Img] No magic byte pattern matched')
  } catch (e) {
    console.log('[B64->Img] atob() threw:', e instanceof Error ? e.message : String(e))
  }
  return null
}

function buildDataUrl(input: string): { dataUrl: string; mime: string } | null {
  const trimmed = input.trim().replace(/\s/g, '')
  console.log('[B64->Img] Raw input length:', input.length, '| Cleaned length:', trimmed.length)
  console.log('[B64->Img] Cleaned prefix (50 chars):', trimmed.slice(0, 50))
  if (!trimmed) return null

  // Already a data URL
  if (trimmed.startsWith('data:image')) {
    console.log('[B64->Img] Detected as data URL')
    const match = trimmed.match(/^data:(image\/[^;]+);base64,(.+)$/)
    if (match) return { dataUrl: trimmed, mime: match[1] }
    console.log('[B64->Img] data URL regex did not match — malformed?')
    return null
  }

  // Raw base64 — detect mime from bytes
  console.log('[B64->Img] Treating as raw base64 — running magic byte detection')
  const mime = detectMimeFromBase64(trimmed)
  console.log('[B64->Img] Detected mime type:', mime)
  if (!mime) return null
  return { dataUrl: `data:${mime};base64,${trimmed}`, mime }
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1048576) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1048576).toFixed(1)} MB`
}

export default function Base64ToImageTool() {
  const [input, setInput] = useState('')
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const [mime, setMime] = useState<string | null>(null)
  const [dimensions, setDimensions] = useState<{ w: number; h: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const trimmed = input.trim()
      if (!trimmed) {
        setDataUrl(null); setMime(null); setDimensions(null); setError(null)
        return
      }
      const result = buildDataUrl(trimmed)
      console.log('[B64->Img] buildDataUrl result:', result ? `mime=${result.mime}, dataUrl length=${result.dataUrl.length}` : 'null')
      if (!result) {
        setDataUrl(null); setMime(null); setDimensions(null)
        setError("This doesn't appear to be a valid Base64 image. Make sure you're pasting image data, not encoded text.")
        return
      }
      setError(null)
      setDataUrl(result.dataUrl)
      setMime(result.mime)
      setDimensions(null)
      const img = new Image()
      img.onload = () => setDimensions({ w: img.naturalWidth, h: img.naturalHeight })
      img.onerror = () => {
        console.log('[B64->Img] img.onerror fired — browser rejected the data URL (mime/data mismatch or corrupt data)')
        setDataUrl(null); setMime(null)
        setError("This doesn't appear to be a valid Base64 image. Make sure you're pasting image data, not encoded text.")
      }
      img.src = result.dataUrl
    }, 400)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [input])

  const handleDownload = () => {
    if (!dataUrl || !mime) return
    const ext = MIME_EXT[mime] ?? 'bin'
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `decoded-image.${ext}`
    a.click()
  }

  const handleCopyDataUrl = async () => {
    if (!dataUrl) return
    try {
      await navigator.clipboard.writeText(dataUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }

  // Estimate file size from base64 length
  const estimatedBytes = dataUrl
    ? Math.floor((dataUrl.split(',')[1]?.length ?? 0) * 0.75)
    : 0

  return (
    <div className="w-full">
      <ToolHeader />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        {/* Input */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b]">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Base64 Input</span>
            {input && (
              <button
                onClick={() => { setInput(''); setDataUrl(null); setMime(null); setDimensions(null); setError(null) }}
                className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                aria-label="Clear"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-4 font-mono text-sm bg-white dark:bg-[#1e293b] outline-none resize-none leading-6 text-gray-900 dark:text-[#e2e8f0] placeholder-gray-400 dark:placeholder-gray-600"
            placeholder="Paste Base64 image string here... (raw Base64 or data:image/png;base64,...)"
            rows={5}
            spellCheck={false}
            autoComplete="off"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Image output */}
        {dataUrl && mime && (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b]">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Preview</span>
                <span className="text-xs text-gray-400 font-mono">{MIME_LABELS[mime] ?? mime}</span>
                {dimensions && (
                  <span className="text-xs text-gray-400">{dimensions.w} × {dimensions.h} px</span>
                )}
                {estimatedBytes > 0 && (
                  <span className="text-xs text-gray-400">{formatBytes(estimatedBytes)}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopyDataUrl}
                  className={`text-xs font-medium transition flex items-center gap-1 ${copied ? 'text-green-600 dark:text-green-400' : 'text-[#2563EB] hover:text-blue-700 dark:hover:text-blue-400'}`}
                >
                  {copied
                    ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Copied!</>
                    : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy data URL</>
                  }
                </button>
                <button
                  onClick={handleDownload}
                  className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition flex items-center gap-1"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download Image
                </button>
              </div>
            </div>
            <div className="p-6 bg-[#f8fafc] dark:bg-[#1e293b] flex items-center justify-center min-h-48">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={dataUrl}
                alt="Decoded"
                className="max-h-[500px] max-w-full rounded-lg shadow-md object-contain"
                style={{ background: 'repeating-conic-gradient(#e5e7eb 0% 25%, white 0% 50%) 0 0 / 16px 16px' }}
              />
            </div>
          </div>
        )}

        {!input.trim() && (
          <div className="text-center py-16 text-gray-400 dark:text-gray-600">
            <svg className="mx-auto mb-4 opacity-30" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
            <p className="text-sm">Paste a Base64 image string above to preview and download it</p>
            <p className="text-xs mt-1">Accepts raw Base64 or full <code className="font-mono">data:image/...;base64,</code> URLs</p>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useRef, useCallback } from 'react'
import ToolHeader from './ToolHeader'

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1048576) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1048576).toFixed(1)} MB`
}

function CopyButton({ text, label }: { text: string; label: string }) {
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
        : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>{label}</>
      }
    </button>
  )
}

interface ImageState {
  fileName: string
  fileSize: number
  mime: string
  previewUrl: string
  dataUrl: string
  rawBase64: string
  width: number
  height: number
}

export default function ImageToBase64Tool() {
  const [image, setImage] = useState<ImageState | null>(null)
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/') && !file.name.endsWith('.svg') && !file.name.endsWith('.ico')) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      const rawBase64 = dataUrl.split(',')[1] ?? ''
      const previewUrl = URL.createObjectURL(file)
      const img = new Image()
      img.onload = () => {
        setImage({
          fileName: file.name,
          fileSize: file.size,
          mime: file.type || 'image/octet-stream',
          previewUrl,
          dataUrl,
          rawBase64,
          width: img.naturalWidth,
          height: img.naturalHeight,
        })
      }
      img.onerror = () => {
        // Still show for SVG/ICO that may not load as img
        setImage({
          fileName: file.name,
          fileSize: file.size,
          mime: file.type || 'image/octet-stream',
          previewUrl,
          dataUrl,
          rawBase64,
          width: 0,
          height: 0,
        })
      }
      img.src = previewUrl
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleClear = () => {
    if (image?.previewUrl) URL.revokeObjectURL(image.previewUrl)
    setImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const ACCEPTED = 'image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/x-icon,.svg,.ico'

  return (
    <div className="w-full">
      <ToolHeader />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        {/* Drop zone */}
        {!image ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`rounded-2xl border-2 border-dashed cursor-pointer transition-colors py-20 flex flex-col items-center justify-center gap-4 ${
              dragging
                ? 'border-[#2563EB] bg-blue-50 dark:bg-blue-950/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-[#2563EB] hover:bg-gray-50 dark:hover:bg-gray-800/30'
            }`}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={dragging ? '#2563EB' : '#9ca3af'} strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Drop image here or <span className="text-[#2563EB]">browse</span></p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF, WebP, SVG, ICO</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-full">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Image never leaves your browser
            </div>
            <input ref={fileInputRef} type="file" accept={ACCEPTED} className="hidden" onChange={handleFileChange} />
          </div>
        ) : (
          <div className="space-y-4">
            {/* File info card */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b] p-4 flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.previewUrl} alt="Preview" className="w-20 h-20 object-cover rounded-xl border border-gray-100 dark:border-gray-700 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-[#e2e8f0] truncate">{image.fileName}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {image.mime}
                  {image.width > 0 && ` · ${image.width} × ${image.height} px`}
                  {` · ${formatBytes(image.fileSize)}`}
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400 dark:text-gray-500">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Image never leaves your browser
                </div>
              </div>
              <button
                onClick={handleClear}
                className="shrink-0 p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                aria-label="Clear"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Panel 1: Raw Base64 */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Raw Base64</span>
                  <span className="text-xs text-gray-400">{image.rawBase64.length.toLocaleString()} chars</span>
                </div>
                <CopyButton text={image.rawBase64} label="Copy Base64" />
              </div>
              <div className="p-4 bg-white dark:bg-[#1e293b] max-h-40 overflow-y-auto">
                <p className="font-mono text-xs text-gray-600 dark:text-gray-400 break-all leading-5 select-all">{image.rawBase64}</p>
              </div>
            </div>

            {/* Panel 2: Data URL */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data URL</span>
                  <span className="text-xs text-gray-400">ready for CSS &amp; HTML</span>
                </div>
                <CopyButton text={image.dataUrl} label="Copy Data URL" />
              </div>
              <div className="p-4 bg-white dark:bg-[#1e293b] max-h-40 overflow-y-auto">
                <p className="font-mono text-xs text-gray-600 dark:text-gray-400 break-all leading-5 select-all">{image.dataUrl}</p>
              </div>
            </div>

            {/* Usage examples */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#162032]">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Usage Examples</span>
              </div>
              <div className="p-4 bg-white dark:bg-[#1e293b] space-y-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">HTML img tag:</p>
                  <code className="text-xs font-mono text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-[#0f172a] px-3 py-2 rounded-lg block break-all">
                    {`<img src="${image.dataUrl.slice(0, 60)}..." />`}
                  </code>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">CSS background-image:</p>
                  <code className="text-xs font-mono text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-[#0f172a] px-3 py-2 rounded-lg block break-all">
                    {`background-image: url("${image.dataUrl.slice(0, 50)}...");`}
                  </code>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

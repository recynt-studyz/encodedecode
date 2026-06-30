'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import ToolHeader from './ToolHeader'

// ── Color math ────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace('#', '').trim()
  const expanded = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean
  if (expanded.length !== 6) return null
  const r = parseInt(expanded.slice(0, 2), 16)
  const g = parseInt(expanded.slice(2, 4), 16)
  const b = parseInt(expanded.slice(4, 6), 16)
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null
  return [r, g, b]
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0').toUpperCase()).join('')
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function hue2rgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1; if (t > 1) t -= 1
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
  return p
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360; s /= 100; l /= 100
  let r, g, b
  if (s === 0) {
    r = g = b = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1 / 3)
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

function rgbToCmyk(r: number, g: number, b: number): [number, number, number, number] {
  r /= 255; g /= 255; b /= 255
  const k = 1 - Math.max(r, g, b)
  if (k === 1) return [0, 0, 0, 100]
  const c = (1 - r - k) / (1 - k)
  const m = (1 - g - k) / (1 - k)
  const y = (1 - b - k) / (1 - k)
  return [Math.round(c * 100), Math.round(m * 100), Math.round(y * 100), Math.round(k * 100)]
}

function cmykToRgb(c: number, m: number, y: number, k: number): [number, number, number] {
  const r = 255 * (1 - c / 100) * (1 - k / 100)
  const g = 255 * (1 - m / 100) * (1 - k / 100)
  const b = 255 * (1 - y / 100) * (1 - k / 100)
  return [Math.round(r), Math.round(g), Math.round(b)]
}

function relativeLuminance(r: number, g: number, b: number): number {
  return [r, g, b].reduce((acc, v, i) => {
    const c = v / 255
    const lin = c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    return acc + lin * [0.2126, 0.7152, 0.0722][i]
  }, 0)
}

function contrastRatio(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  const l1 = relativeLuminance(r1, g1, b1)
  const l2 = relativeLuminance(r2, g2, b2)
  const lighter = Math.max(l1, l2), darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

// ── Parse helpers ─────────────────────────────────────────────────────────────

function parseRgb(s: string): [number, number, number] | null {
  const nums = s.replace(/rgb\s*\(/i, '').replace(/\)/g, '').split(/[\s,]+/).map(Number)
  if (nums.length < 3 || nums.some(isNaN)) return null
  if (nums.some(n => n < 0 || n > 255)) return null
  return [nums[0], nums[1], nums[2]]
}

function parseHsl(s: string): [number, number, number] | null {
  const nums = s.replace(/hsl\s*\(/i, '').replace(/\)/g, '').replace(/%/g, '').split(/[\s,]+/).map(Number)
  if (nums.length < 3 || nums.some(isNaN)) return null
  if (nums[0] < 0 || nums[0] > 360) return null
  if (nums[1] < 0 || nums[1] > 100 || nums[2] < 0 || nums[2] > 100) return null
  return [nums[0], nums[1], nums[2]]
}

function parseCmyk(s: string): [number, number, number, number] | null {
  const nums = s.replace(/cmyk\s*\(/i, '').replace(/\)/g, '').replace(/%/g, '').split(/[\s,]+/).map(Number)
  if (nums.length < 4 || nums.some(isNaN)) return null
  if (nums.some(n => n < 0 || n > 100)) return null
  return [nums[0], nums[1], nums[2], nums[3]]
}

// ── Storage ───────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'encodedecode-colors'

function loadRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}

function saveRecent(hex: string, current: string[]): string[] {
  const next = [hex, ...current.filter(c => c !== hex)].slice(0, 8)
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* ignore */ }
  return next
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CopyBtn({ value }: { value: string }) {
  const [done, setDone] = useState(false)
  const copy = () => { navigator.clipboard.writeText(value).then(() => { setDone(true); setTimeout(() => setDone(false), 1500) }) }
  return (
    <button onClick={copy} className="shrink-0 text-xs px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition">
      {done ? '✓' : 'Copy'}
    </button>
  )
}

function Badge({ pass, label }: { pass: boolean; label: string }) {
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${pass ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'}`}>
      {label} {pass ? '✓' : '✗'}
    </span>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

const INIT_RGB: [number, number, number] = [37, 99, 235]

export default function ColorTool() {
  const [rgb, setRgb] = useState<[number, number, number]>(INIT_RGB)
  const [hexInput, setHexInput] = useState(rgbToHex(...INIT_RGB))
  const [rgbInput, setRgbInput] = useState(`rgb(${INIT_RGB.join(', ')})`)
  const [hslInput, setHslInput] = useState(() => { const [h,s,l]=rgbToHsl(...INIT_RGB); return `hsl(${h}, ${s}%, ${l}%)` })
  const [cmykInput, setCmykInput] = useState(() => { const [c,m,y,k]=rgbToCmyk(...INIT_RGB); return `cmyk(${c}%, ${m}%, ${y}%, ${k}%)` })
  const [hexErr, setHexErr] = useState(false)
  const [rgbErr, setRgbErr] = useState(false)
  const [hslErr, setHslErr] = useState(false)
  const [cmykErr, setCmykErr] = useState(false)
  const [recent, setRecent] = useState<string[]>([])
  const [bgRgb, setBgRgb] = useState<[number, number, number]>([255, 255, 255])
  const [bgHexInput, setBgHexInput] = useState('#FFFFFF')
  const activeRef = useRef<'hex' | 'rgb' | 'hsl' | 'cmyk' | null>(null)

  useEffect(() => { setRecent(loadRecent()) }, [])

  const syncAll = useCallback((nr: number, ng: number, nb: number, source: 'hex' | 'rgb' | 'hsl' | 'cmyk' | 'picker' | 'random') => {
    setRgb([nr, ng, nb])
    const hex = rgbToHex(nr, ng, nb)
    const [h, s, l] = rgbToHsl(nr, ng, nb)
    const [c, m, y, k] = rgbToCmyk(nr, ng, nb)
    if (source !== 'hex') { setHexInput(hex); setHexErr(false) }
    if (source !== 'rgb') { setRgbInput(`rgb(${nr}, ${ng}, ${nb})`); setRgbErr(false) }
    if (source !== 'hsl') { setHslInput(`hsl(${h}, ${s}%, ${l}%)`); setHslErr(false) }
    if (source !== 'cmyk') { setCmykInput(`cmyk(${c}%, ${m}%, ${y}%, ${k}%)`); setCmykErr(false) }
    if (source === 'picker' || source === 'random') {
      setRecent(prev => saveRecent(hex, prev))
    }
  }, [])

  const handleHexChange = (val: string) => {
    setHexInput(val)
    const parsed = hexToRgb(val)
    if (parsed) { setHexErr(false); syncAll(...parsed, 'hex') }
    else setHexErr(true)
  }

  const handleRgbChange = (val: string) => {
    setRgbInput(val)
    const parsed = parseRgb(val)
    if (parsed) { setRgbErr(false); syncAll(...parsed, 'rgb') }
    else setRgbErr(true)
  }

  const handleHslChange = (val: string) => {
    setHslInput(val)
    const parsed = parseHsl(val)
    if (parsed) { setHslErr(false); syncAll(...hslToRgb(...parsed), 'hsl') }
    else setHslErr(true)
  }

  const handleCmykChange = (val: string) => {
    setCmykInput(val)
    const parsed = parseCmyk(val)
    if (parsed) { setCmykErr(false); syncAll(...cmykToRgb(...parsed), 'cmyk') }
    else setCmykErr(true)
  }

  const handleHexBlur = () => {
    if (hexErr) { setHexInput(rgbToHex(...rgb)); setHexErr(false) }
  }
  const handleRgbBlur = () => {
    if (rgbErr) { setRgbInput(`rgb(${rgb.join(', ')})`); setRgbErr(false) }
  }
  const handleHslBlur = () => {
    if (hslErr) { const [h,s,l]=rgbToHsl(...rgb); setHslInput(`hsl(${h}, ${s}%, ${l}%)`); setHslErr(false) }
  }
  const handleCmykBlur = () => {
    if (cmykErr) { const [c,m,y,k]=rgbToCmyk(...rgb); setCmykInput(`cmyk(${c}%, ${m}%, ${y}%, ${k}%)`); setCmykErr(false) }
  }

  const randomColor = () => {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    syncAll(r, g, b, 'random')
  }

  const handleBgHexChange = (val: string) => {
    setBgHexInput(val)
    const parsed = hexToRgb(val)
    if (parsed) setBgRgb(parsed)
  }

  const ratio = contrastRatio(...rgb, ...bgRgb)
  const ratioFixed = ratio.toFixed(2)

  const swatchBg = `rgb(${rgb.join(',')})`
  const hexCanonical = rgbToHex(...rgb)

  const inputClass = (err: boolean) =>
    `flex-1 font-mono text-sm px-3 py-2 rounded-lg border bg-white dark:bg-[#1e293b] text-gray-900 dark:text-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
      err ? 'border-red-400 dark:border-red-500' : 'border-gray-200 dark:border-gray-700'
    }`

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a]">
      <ToolHeader />
      <main className="max-w-[700px] mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* Color swatch */}
        <div className="relative rounded-2xl overflow-hidden cursor-pointer group" style={{ height: '140px', background: swatchBg }}>
          <div className="absolute inset-0 flex items-end justify-end p-3 opacity-0 group-hover:opacity-100 transition">
            <span className="text-xs bg-black/40 text-white rounded px-2 py-1">Click to pick color</span>
          </div>
          <input
            type="color"
            value={hexCanonical}
            onChange={e => syncAll(...(hexToRgb(e.target.value) ?? rgb), 'picker')}
            onBlur={() => setRecent(prev => saveRecent(hexCanonical, prev))}
            title="Open color picker"
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </div>

        {/* Color fields */}
        <div className="space-y-3">
          {[
            { label: 'HEX', value: hexInput, err: hexErr, onChange: handleHexChange, onBlur: handleHexBlur, display: hexCanonical },
            { label: 'RGB', value: rgbInput, err: rgbErr, onChange: handleRgbChange, onBlur: handleRgbBlur, display: `rgb(${rgb.join(', ')})` },
            { label: 'HSL', value: hslInput, err: hslErr, onChange: handleHslChange, onBlur: handleHslBlur, display: (() => { const [h,s,l]=rgbToHsl(...rgb); return `hsl(${h}, ${s}%, ${l}%)` })() },
            { label: 'CMYK', value: cmykInput, err: cmykErr, onChange: handleCmykChange, onBlur: handleCmykBlur, display: (() => { const [c,m,y,k]=rgbToCmyk(...rgb); return `cmyk(${c}%, ${m}%, ${y}%, ${k}%)` })() },
          ].map(({ label, value, err, onChange, onBlur, display }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="w-10 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide shrink-0">{label}</span>
              <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                onBlur={onBlur}
                onFocus={() => { activeRef.current = label.toLowerCase() as 'hex' | 'rgb' | 'hsl' | 'cmyk' }}
                spellCheck={false}
                autoComplete="off"
                className={inputClass(err)}
              />
              <CopyBtn value={display} />
            </div>
          ))}
        </div>

        {/* Random + recent */}
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={randomColor}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition"
          >
            🎲 Random color
          </button>

          {recent.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-gray-400 shrink-0">Recent:</span>
              {recent.map(hex => (
                <button
                  key={hex}
                  onClick={() => syncAll(...(hexToRgb(hex) ?? rgb), 'picker')}
                  title={hex}
                  className="w-6 h-6 rounded-md border-2 border-white dark:border-gray-700 shadow-sm hover:scale-110 transition"
                  style={{ background: hex }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Contrast checker */}
        <div className="rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-50 dark:bg-[#1e293b] border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Contrast Checker (WCAG)</h3>
          </div>
          <div className="p-4 space-y-3">
            {/* Preview */}
            <div
              className="rounded-lg p-4 flex items-center justify-center text-sm font-medium"
              style={{ background: `rgb(${bgRgb.join(',')})`, color: swatchBg }}
            >
              Sample text — Aa Bb Cc 123
            </div>

            {/* Background picker */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 w-20 shrink-0">Background</span>
              <div className="relative w-7 h-7 rounded-md border border-gray-200 dark:border-gray-600 overflow-hidden shrink-0">
                <div className="absolute inset-0" style={{ background: `rgb(${bgRgb.join(',')})` }} />
                <input
                  type="color"
                  value={`#${bgRgb.map(v => v.toString(16).padStart(2, '0')).join('')}`}
                  onChange={e => { setBgHexInput(e.target.value); const p=hexToRgb(e.target.value); if(p) setBgRgb(p) }}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>
              <input
                type="text"
                value={bgHexInput}
                onChange={e => handleBgHexChange(e.target.value)}
                spellCheck={false}
                className="flex-1 font-mono text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b] text-gray-900 dark:text-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Ratio + badges */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="text-lg font-bold text-gray-900 dark:text-[#e2e8f0]">{ratioFixed}:1</div>
              <Badge pass={ratio >= 4.5} label="AA Normal" />
              <Badge pass={ratio >= 3} label="AA Large" />
              <Badge pass={ratio >= 7} label="AAA Normal" />
              <Badge pass={ratio >= 4.5} label="AAA Large" />
            </div>
          </div>
        </div>

        <p className="text-xs text-center text-gray-400 dark:text-gray-500 pb-4">
          🔒 All color math happens in your browser
        </p>
      </main>
    </div>
  )
}

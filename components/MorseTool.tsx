'use client'

import { useState, useRef, useCallback } from 'react'
import ToolHeader from './ToolHeader'

type Mode = 'encode' | 'decode'
type Speed = 'slow' | 'normal' | 'fast'

const MORSE: Record<string, string> = {
  A:'.-', B:'-...', C:'-.-.', D:'-..', E:'.', F:'..-.', G:'--.', H:'....', I:'..', J:'.---',
  K:'-.-', L:'.-..', M:'--', N:'-.', O:'---', P:'.--.', Q:'--.-', R:'.-.', S:'...', T:'-',
  U:'..-', V:'...-', W:'.--', X:'-..-', Y:'-.--', Z:'--..',
  '0':'-----', '1':'.----', '2':'..---', '3':'...--', '4':'....-',
  '5':'.....', '6':'-....', '7':'--...', '8':'---..',  '9':'----.',
  '.':'.-.-.-', ',':'--..--', '?':'..--..', "'":'.----.', '!':'-.-.--',
  '/':'-..-.', '(':'-.--.', ')':'-.--.-', '&':'.-...', ':':'---...',
  ';':'-.-.-.', '=':'-...-', '+':'.-.-.', '-':'-....-', '"':'.-..-.', '@':'.--.-.',
}

const MORSE_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE).map(([k, v]) => [v, k])
)

function textToMorse(text: string): string {
  return text.toUpperCase().trim().split(/\s+/).map((word) =>
    word.split('').map((c) => MORSE[c] ?? '[?]').join(' ')
  ).join(' / ')
}

function morseToText(morse: string): string {
  // Normalize various dash forms
  const normalized = morse.trim().replace(/[–—]/g, '-').replace(/•/g, '.').replace(/\s*\/\s*/g, ' / ')
  return normalized.split(/\s*\/\s*/).map((word) =>
    word.trim().split(/\s+/).map((code) => code ? (MORSE_REVERSE[code] ?? '[?]') : '').join('')
  ).join(' ')
}

const SPEED_MULT: Record<Speed, number> = { slow: 2, normal: 1, fast: 0.5 }

const REF_CHARS = [
  ['A','.-'],['B','-...'],['C','-.-.'],['D','-..'],['E','.'],['F','..-.'],
  ['G','--.'],['H','....'],['I','..'],['J','.---'],['K','-.-'],['L','.-..'],
  ['M','--'],['N','-.'],['O','---'],['P','.--.'],['Q','--.-'],['R','.-.'],
  ['S','...'],['T','-'],['U','..-'],['V','...-'],['W','.--'],['X','-..-'],
  ['Y','-.--'],['Z','--..'],
  ['0','-----'],['1','.----'],['2','..---'],['3','...--'],['4','....-'],
  ['5','.....'],['6','-....'],['7','--...'],['8','---..'],['9','----.'],
]

export default function MorseTool() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<Mode>('encode')
  const [speed, setSpeed] = useState<Speed>('normal')
  const [playing, setPlaying] = useState(false)
  const [copied, setCopied] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const stopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const output = input.trim()
    ? mode === 'encode' ? textToMorse(input) : morseToText(input)
    : ''

  const morseForAudio = mode === 'encode' ? output : input

  const handleClear = () => setInput('')

  const handleCopy = async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }

  const stopPlayback = useCallback(() => {
    if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current)
    audioCtxRef.current?.close().catch(() => {})
    audioCtxRef.current = null
    setPlaying(false)
  }, [])

  const startPlayback = useCallback(() => {
    if (playing) { stopPlayback(); return }
    const morse = morseForAudio.trim()
    if (!morse) return

    const ctx = new AudioContext()
    audioCtxRef.current = ctx
    setPlaying(true)

    const mult = SPEED_MULT[speed]
    const DIT = 0.06 * mult
    const DAH = 0.18 * mult
    const SYM_GAP = 0.06 * mult
    const LTR_GAP = 0.18 * mult
    const WRD_GAP = 0.42 * mult
    const RAMP = 0.005 // 5ms onset/offset ramp to prevent clicks

    let t = ctx.currentTime + 0.15

    const words = morse.split(/\s*\/\s*/)
    for (let wi = 0; wi < words.length; wi++) {
      const letters = words[wi].trim().split(/\s+/)
      for (let li = 0; li < letters.length; li++) {
        const letter = letters[li]
        const syms = letter.split('')
        for (let si = 0; si < syms.length; si++) {
          const sym = syms[si]
          if (sym !== '.' && sym !== '-') continue
          const dur = sym === '.' ? DIT : DAH
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.type = 'sine'
          osc.frequency.value = 600
          gain.gain.setValueAtTime(0, t)
          gain.gain.linearRampToValueAtTime(0.5, t + RAMP)
          gain.gain.setValueAtTime(0.5, t + dur - RAMP)
          gain.gain.linearRampToValueAtTime(0, t + dur)
          osc.start(t)
          osc.stop(t + dur + 0.01)
          t += dur + SYM_GAP
        }
        if (li < letters.length - 1) t += LTR_GAP - SYM_GAP
      }
      if (wi < words.length - 1) t += WRD_GAP - LTR_GAP
    }

    const totalMs = (t - ctx.currentTime) * 1000 + 300
    stopTimeoutRef.current = setTimeout(() => {
      if (audioCtxRef.current === ctx) {
        ctx.close().catch(() => {})
        audioCtxRef.current = null
        setPlaying(false)
      }
    }, totalMs)
  }, [playing, morseForAudio, speed, stopPlayback])

  const inputLines = input ? input.split('\n') : ['']
  const outputLines = output ? output.split('\n') : []

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
            {([
              { value: 'encode' as Mode, label: 'Text → Morse' },
              { value: 'decode' as Mode, label: 'Morse → Text' },
            ]).map(({ value, label }) => (
              <button
                key={value}
                onClick={() => { setMode(value); handleClear() }}
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

          {/* Audio controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={startPlayback}
              disabled={!morseForAudio.trim()}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                playing
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-[#2563EB] text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              {playing ? (
                <><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>Stop</>
              ) : (
                <><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>Play Audio</>
              )}
            </button>

            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">Speed:</span>
              {(['slow', 'normal', 'fast'] as Speed[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition capitalize ${
                    speed === s
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Two-panel layout */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Input */}
          <div className="flex-1 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b]">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {mode === 'encode' ? 'Plain Text' : 'Morse Code'}
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
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-3 font-mono text-sm bg-transparent outline-none resize-none leading-6 text-gray-900 dark:text-[#e2e8f0] placeholder-gray-400 dark:placeholder-gray-600 min-w-0"
                placeholder={mode === 'encode' ? 'Type text to convert to Morse code...' : 'Paste Morse code here (dots, dashes, slashes)...'}
                style={{ minHeight: 300, overflow: 'hidden' }}
                spellCheck={false}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Output */}
          <div className="flex-1 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b]">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {mode === 'encode' ? 'Morse Code' : 'Plain Text'}
              </span>
              {output && (
                <button onClick={handleCopy} className={`text-xs font-medium transition flex items-center gap-1 ${copied ? 'text-green-600 dark:text-green-400' : 'text-[#2563EB] hover:text-blue-700 dark:hover:text-blue-400'}`}>
                  {copied
                    ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Copied!</>
                    : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy</>
                  }
                </button>
              )}
            </div>
            <div className="flex bg-white dark:bg-[#1e293b] overflow-auto" style={{ minHeight: 300 }}>
              {outputLines.length > 0 && (
                <div className="select-none text-right font-mono text-xs leading-6 pt-3 pb-3 pr-2 pl-2 shrink-0 bg-gray-50 dark:bg-[#162032] border-r border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 sticky left-0" style={{ minWidth: '3rem' }}>
                  {outputLines.map((_, i) => <div key={i}>{i + 1}</div>)}
                </div>
              )}
              <pre className="flex-1 p-3 font-mono text-sm leading-6 overflow-x-auto text-gray-900 dark:text-[#e2e8f0] whitespace-pre-wrap break-words" style={{ minHeight: 300 }}>
                {output || <span className="text-gray-400 dark:text-gray-600">{mode === 'encode' ? 'Morse code output...' : 'Decoded text...'}</span>}
              </pre>
            </div>
          </div>
        </div>

        {/* Word separator note */}
        {mode === 'encode' && output && (
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-600">
            Symbols separated by spaces · Words separated by <code className="font-mono">/</code>
          </p>
        )}

        {/* Character reference card */}
        <div className="mt-8 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#162032]">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Morse Code Reference</span>
          </div>
          <div className="p-4 bg-white dark:bg-[#1e293b]">
            <div className="grid grid-cols-6 sm:grid-cols-9 lg:grid-cols-12 gap-2">
              {REF_CHARS.map(([char, code]) => (
                <div key={char} className="flex flex-col items-center rounded-lg border border-gray-100 dark:border-gray-700 px-2 py-2 text-center">
                  <span className="text-sm font-bold text-gray-800 dark:text-[#e2e8f0]">{char}</span>
                  <span className="text-xs font-mono text-gray-400 dark:text-gray-500 mt-0.5 tracking-wider">{code}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

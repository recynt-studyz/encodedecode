'use client'

import { useState, useEffect, useRef } from 'react'
import ToolHeader from './ToolHeader'

type CaseMode = 'lower' | 'upper'

// Pure JavaScript MD5 implementation (no external library)
function md5(inputString: string): string {
  function safeAdd(x: number, y: number): number {
    const lsw = (x & 0xffff) + (y & 0xffff)
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xffff)
  }
  function bitRotateLeft(num: number, cnt: number): number {
    return (num << cnt) | (num >>> (32 - cnt))
  }
  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
  }
  function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t)
  }
  function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t)
  }
  function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn(b ^ c ^ d, a, b, x, s, t)
  }
  function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t)
  }
  function str2binl(str: string): number[] {
    const bin: number[] = []
    for (let i = 0; i < str.length * 8; i += 8) {
      bin[i >> 5] = (bin[i >> 5] ?? 0) | ((str.charCodeAt(i / 8) & 0xff) << (i % 32))
    }
    return bin
  }
  function binl2hex(binarray: number[]): string {
    const hex_tab = '0123456789abcdef'
    let str = ''
    for (let i = 0; i < binarray.length * 4; i++) {
      str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xf) +
             hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xf)
    }
    return str
  }
  function coreMd5(x: number[], len: number): number[] {
    x[len >> 5] = (x[len >> 5] ?? 0) | (0x80 << (len % 32))
    x[(((len + 64) >>> 9) << 4) + 14] = len
    let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878
    for (let i = 0; i < x.length; i += 16) {
      const oa = a, ob = b, oc = c, od = d
      a = md5ff(a,b,c,d, x[i+ 0]??0, 7,-680876936); d = md5ff(d,a,b,c, x[i+ 1]??0,12,-389564586)
      c = md5ff(c,d,a,b, x[i+ 2]??0,17, 606105819); b = md5ff(b,c,d,a, x[i+ 3]??0,22,-1044525330)
      a = md5ff(a,b,c,d, x[i+ 4]??0, 7,-176418897); d = md5ff(d,a,b,c, x[i+ 5]??0,12,1200080426)
      c = md5ff(c,d,a,b, x[i+ 6]??0,17,-1473231341); b = md5ff(b,c,d,a, x[i+ 7]??0,22,-45705983)
      a = md5ff(a,b,c,d, x[i+ 8]??0, 7,1770035416); d = md5ff(d,a,b,c, x[i+ 9]??0,12,-1958414417)
      c = md5ff(c,d,a,b, x[i+10]??0,17,-42063); b = md5ff(b,c,d,a, x[i+11]??0,22,-1990404162)
      a = md5ff(a,b,c,d, x[i+12]??0, 7,1804603682); d = md5ff(d,a,b,c, x[i+13]??0,12,-40341101)
      c = md5ff(c,d,a,b, x[i+14]??0,17,-1502002290); b = md5ff(b,c,d,a, x[i+15]??0,22,1236535329)
      a = md5gg(a,b,c,d, x[i+ 1]??0, 5,-165796510); d = md5gg(d,a,b,c, x[i+ 6]??0, 9,-1069501632)
      c = md5gg(c,d,a,b, x[i+11]??0,14, 643717713); b = md5gg(b,c,d,a, x[i+ 0]??0,20,-373897302)
      a = md5gg(a,b,c,d, x[i+ 5]??0, 5,-701558691); d = md5gg(d,a,b,c, x[i+10]??0, 9,38016083)
      c = md5gg(c,d,a,b, x[i+15]??0,14,-660478335); b = md5gg(b,c,d,a, x[i+ 4]??0,20,-405537848)
      a = md5gg(a,b,c,d, x[i+ 9]??0, 5, 568446438); d = md5gg(d,a,b,c, x[i+14]??0, 9,-1019803690)
      c = md5gg(c,d,a,b, x[i+ 3]??0,14,-187363961); b = md5gg(b,c,d,a, x[i+ 8]??0,20,1163531501)
      a = md5gg(a,b,c,d, x[i+13]??0, 5,-1444681467); d = md5gg(d,a,b,c, x[i+ 2]??0, 9,-51403784)
      c = md5gg(c,d,a,b, x[i+ 7]??0,14,1735328473); b = md5gg(b,c,d,a, x[i+12]??0,20,-1926607734)
      a = md5hh(a,b,c,d, x[i+ 5]??0, 4,-378558); d = md5hh(d,a,b,c, x[i+ 8]??0,11,-2022574463)
      c = md5hh(c,d,a,b, x[i+11]??0,16,1839030562); b = md5hh(b,c,d,a, x[i+14]??0,23,-35309556)
      a = md5hh(a,b,c,d, x[i+ 1]??0, 4,-1530992060); d = md5hh(d,a,b,c, x[i+ 4]??0,11,1272893353)
      c = md5hh(c,d,a,b, x[i+ 7]??0,16,-155497632); b = md5hh(b,c,d,a, x[i+10]??0,23,-1094730640)
      a = md5hh(a,b,c,d, x[i+13]??0, 4, 681279174); d = md5hh(d,a,b,c, x[i+ 0]??0,11,-358537222)
      c = md5hh(c,d,a,b, x[i+ 3]??0,16,-722521979); b = md5hh(b,c,d,a, x[i+ 6]??0,23,76029189)
      a = md5hh(a,b,c,d, x[i+ 9]??0, 4,-640364487); d = md5hh(d,a,b,c, x[i+12]??0,11,-421815835)
      c = md5hh(c,d,a,b, x[i+15]??0,16, 530742520); b = md5hh(b,c,d,a, x[i+ 2]??0,23,-995338651)
      a = md5ii(a,b,c,d, x[i+ 0]??0, 6,-198630844); d = md5ii(d,a,b,c, x[i+ 7]??0,10,1126891415)
      c = md5ii(c,d,a,b, x[i+14]??0,15,-1416354905); b = md5ii(b,c,d,a, x[i+ 5]??0,21,-57434055)
      a = md5ii(a,b,c,d, x[i+12]??0, 6,1700485571); d = md5ii(d,a,b,c, x[i+ 3]??0,10,-1894986606)
      c = md5ii(c,d,a,b, x[i+10]??0,15,-1051523); b = md5ii(b,c,d,a, x[i+ 1]??0,21,-2054922799)
      a = md5ii(a,b,c,d, x[i+ 8]??0, 6,1873313359); d = md5ii(d,a,b,c, x[i+15]??0,10,-30611744)
      c = md5ii(c,d,a,b, x[i+ 6]??0,15,-1560198380); b = md5ii(b,c,d,a, x[i+13]??0,21,1309151649)
      a = md5ii(a,b,c,d, x[i+ 4]??0, 6,-145523070); d = md5ii(d,a,b,c, x[i+11]??0,10,-1120210379)
      c = md5ii(c,d,a,b, x[i+ 2]??0,15, 718787259); b = md5ii(b,c,d,a, x[i+ 9]??0,21,-343485551)
      a = safeAdd(a,oa); b = safeAdd(b,ob); c = safeAdd(c,oc); d = safeAdd(d,od)
    }
    return [a, b, c, d]
  }
  // Convert UTF-8 string to latin1 for MD5
  const utf8 = unescape(encodeURIComponent(inputString))
  return binl2hex(coreMd5(str2binl(utf8), utf8.length * 8))
}

async function sha(algorithm: 'SHA-1' | 'SHA-256' | 'SHA-512', data: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest(algorithm, data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1048576) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1048576).toFixed(1)} MB`
}

interface Hashes {
  md5: string
  sha1: string
  sha256: string
  sha512: string
}

function HashRow({ algo, value, caseMode, onCopy }: { algo: string; value: string; caseMode: CaseMode; onCopy: (v: string) => void }) {
  const [copied, setCopied] = useState(false)
  const display = caseMode === 'upper' ? value.toUpperCase() : value
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(display)
      setCopied(true)
      onCopy(display)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <span className="w-16 shrink-0 text-xs font-mono font-semibold text-gray-500 dark:text-gray-400 uppercase">{algo}</span>
      <span className="flex-1 font-mono text-xs text-gray-800 dark:text-[#e2e8f0] break-all leading-5">
        {value ? display : <span className="text-gray-300 dark:text-gray-600">—</span>}
      </span>
      {value && (
        <button
          onClick={handleCopy}
          className={`shrink-0 text-xs font-medium transition flex items-center gap-1 ${copied ? 'text-green-600 dark:text-green-400' : 'text-[#2563EB] hover:text-blue-700 dark:hover:text-blue-400'}`}
        >
          {copied
            ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Copied!</>
            : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy</>
          }
        </button>
      )}
    </div>
  )
}

export default function HashTool() {
  const [input, setInput] = useState('')
  const [debouncedInput, setDebouncedInput] = useState('')
  const [caseMode, setCaseMode] = useState<CaseMode>('lower')
  const [hashes, setHashes] = useState<Hashes>({ md5: '', sha1: '', sha256: '', sha512: '' })
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null)
  const [computing, setComputing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setDebouncedInput(input), 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [input])

  useEffect(() => {
    if (!debouncedInput) {
      setHashes({ md5: '', sha1: '', sha256: '', sha512: '' })
      return
    }
    setComputing(true)
    const bytes = new TextEncoder().encode(debouncedInput)
    const md5hash = md5(debouncedInput)
    Promise.all([
      sha('SHA-1', bytes.buffer as ArrayBuffer),
      sha('SHA-256', bytes.buffer as ArrayBuffer),
      sha('SHA-512', bytes.buffer as ArrayBuffer),
    ]).then(([sha1, sha256, sha512]) => {
      setHashes({ md5: md5hash, sha1, sha256, sha512 })
      setComputing(false)
    })
  }, [debouncedInput])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file) return
    hashFile(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    hashFile(file)
  }

  const hashFile = (file: File) => {
    setFileInfo({ name: file.name, size: file.size })
    setInput('')
    setDebouncedInput('')
    setComputing(true)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const buffer = ev.target?.result as ArrayBuffer
      const uint8 = new Uint8Array(buffer)
      // MD5 needs string-like input — convert via latin1
      let binary = ''
      for (let i = 0; i < uint8.length; i++) binary += String.fromCharCode(uint8[i])
      // For MD5, work with raw bytes represented as latin1 string
      function md5FromBinary(bin: string): string {
        function safeAdd(x: number, y: number): number {
          const lsw = (x & 0xffff) + (y & 0xffff)
          return ((x >> 16) + (y >> 16) + (lsw >> 16)) << 16 | (lsw & 0xffff)
        }
        function bitRotateLeft(n: number, c: number): number { return (n << c) | (n >>> (32 - c)) }
        function c(q: number, a: number, b: number, x: number, s: number, t: number) {
          return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
        }
        function ff(a: number, b: number, d1: number, d2: number, x: number, s: number, t: number) { return c((b & d1) | (~b & d2), a, b, x, s, t) }
        function gg(a: number, b: number, d1: number, d2: number, x: number, s: number, t: number) { return c((b & d2) | (d1 & ~d2), a, b, x, s, t) }
        function hh(a: number, b: number, d1: number, d2: number, x: number, s: number, t: number) { return c(b ^ d1 ^ d2, a, b, x, s, t) }
        function ii(a: number, b: number, d1: number, d2: number, x: number, s: number, t: number) { return c(d1 ^ (b | ~d2), a, b, x, s, t) }
        const bins: number[] = []
        for (let i = 0; i < bin.length * 8; i += 8) bins[i >> 5] = (bins[i >> 5] ?? 0) | ((bin.charCodeAt(i / 8) & 0xff) << (i % 32))
        const len = bin.length * 8
        bins[len >> 5] = (bins[len >> 5] ?? 0) | (0x80 << (len % 32))
        bins[(((len + 64) >>> 9) << 4) + 14] = len
        let a = 1732584193, b = -271733879, cc = -1732584194, dd = 271733878
        for (let i = 0; i < bins.length; i += 16) {
          const oa=a,ob=b,oc=cc,od=dd
          a=ff(a,b,cc,dd,bins[i+0]??0,7,-680876936);dd=ff(dd,a,b,cc,bins[i+1]??0,12,-389564586);cc=ff(cc,dd,a,b,bins[i+2]??0,17,606105819);b=ff(b,cc,dd,a,bins[i+3]??0,22,-1044525330)
          a=ff(a,b,cc,dd,bins[i+4]??0,7,-176418897);dd=ff(dd,a,b,cc,bins[i+5]??0,12,1200080426);cc=ff(cc,dd,a,b,bins[i+6]??0,17,-1473231341);b=ff(b,cc,dd,a,bins[i+7]??0,22,-45705983)
          a=ff(a,b,cc,dd,bins[i+8]??0,7,1770035416);dd=ff(dd,a,b,cc,bins[i+9]??0,12,-1958414417);cc=ff(cc,dd,a,b,bins[i+10]??0,17,-42063);b=ff(b,cc,dd,a,bins[i+11]??0,22,-1990404162)
          a=ff(a,b,cc,dd,bins[i+12]??0,7,1804603682);dd=ff(dd,a,b,cc,bins[i+13]??0,12,-40341101);cc=ff(cc,dd,a,b,bins[i+14]??0,17,-1502002290);b=ff(b,cc,dd,a,bins[i+15]??0,22,1236535329)
          a=gg(a,b,cc,dd,bins[i+1]??0,5,-165796510);dd=gg(dd,a,b,cc,bins[i+6]??0,9,-1069501632);cc=gg(cc,dd,a,b,bins[i+11]??0,14,643717713);b=gg(b,cc,dd,a,bins[i+0]??0,20,-373897302)
          a=gg(a,b,cc,dd,bins[i+5]??0,5,-701558691);dd=gg(dd,a,b,cc,bins[i+10]??0,9,38016083);cc=gg(cc,dd,a,b,bins[i+15]??0,14,-660478335);b=gg(b,cc,dd,a,bins[i+4]??0,20,-405537848)
          a=gg(a,b,cc,dd,bins[i+9]??0,5,568446438);dd=gg(dd,a,b,cc,bins[i+14]??0,9,-1019803690);cc=gg(cc,dd,a,b,bins[i+3]??0,14,-187363961);b=gg(b,cc,dd,a,bins[i+8]??0,20,1163531501)
          a=gg(a,b,cc,dd,bins[i+13]??0,5,-1444681467);dd=gg(dd,a,b,cc,bins[i+2]??0,9,-51403784);cc=gg(cc,dd,a,b,bins[i+7]??0,14,1735328473);b=gg(b,cc,dd,a,bins[i+12]??0,20,-1926607734)
          a=hh(a,b,cc,dd,bins[i+5]??0,4,-378558);dd=hh(dd,a,b,cc,bins[i+8]??0,11,-2022574463);cc=hh(cc,dd,a,b,bins[i+11]??0,16,1839030562);b=hh(b,cc,dd,a,bins[i+14]??0,23,-35309556)
          a=hh(a,b,cc,dd,bins[i+1]??0,4,-1530992060);dd=hh(dd,a,b,cc,bins[i+4]??0,11,1272893353);cc=hh(cc,dd,a,b,bins[i+7]??0,16,-155497632);b=hh(b,cc,dd,a,bins[i+10]??0,23,-1094730640)
          a=hh(a,b,cc,dd,bins[i+13]??0,4,681279174);dd=hh(dd,a,b,cc,bins[i+0]??0,11,-358537222);cc=hh(cc,dd,a,b,bins[i+3]??0,16,-722521979);b=hh(b,cc,dd,a,bins[i+6]??0,23,76029189)
          a=hh(a,b,cc,dd,bins[i+9]??0,4,-640364487);dd=hh(dd,a,b,cc,bins[i+12]??0,11,-421815835);cc=hh(cc,dd,a,b,bins[i+15]??0,16,530742520);b=hh(b,cc,dd,a,bins[i+2]??0,23,-995338651)
          a=ii(a,b,cc,dd,bins[i+0]??0,6,-198630844);dd=ii(dd,a,b,cc,bins[i+7]??0,10,1126891415);cc=ii(cc,dd,a,b,bins[i+14]??0,15,-1416354905);b=ii(b,cc,dd,a,bins[i+5]??0,21,-57434055)
          a=ii(a,b,cc,dd,bins[i+12]??0,6,1700485571);dd=ii(dd,a,b,cc,bins[i+3]??0,10,-1894986606);cc=ii(cc,dd,a,b,bins[i+10]??0,15,-1051523);b=ii(b,cc,dd,a,bins[i+1]??0,21,-2054922799)
          a=ii(a,b,cc,dd,bins[i+8]??0,6,1873313359);dd=ii(dd,a,b,cc,bins[i+15]??0,10,-30611744);cc=ii(cc,dd,a,b,bins[i+6]??0,15,-1560198380);b=ii(b,cc,dd,a,bins[i+13]??0,21,1309151649)
          a=ii(a,b,cc,dd,bins[i+4]??0,6,-145523070);dd=ii(dd,a,b,cc,bins[i+11]??0,10,-1120210379);cc=ii(cc,dd,a,b,bins[i+2]??0,15,718787259);b=ii(b,cc,dd,a,bins[i+9]??0,21,-343485551)
          a=safeAdd(a,oa);b=safeAdd(b,ob);cc=safeAdd(cc,oc);dd=safeAdd(dd,od)
        }
        const hex='0123456789abcdef';let r=''
        for(let i=0;i<[a,b,cc,dd].length*4;i++){const n=[a,b,cc,dd][i>>2]??0;r+=hex[(n>>((i%4)*8+4))&0xf]+hex[(n>>((i%4)*8))&0xf]}
        return r
      }
      const md5hash = md5FromBinary(binary)
      Promise.all([
        sha('SHA-1', buffer),
        sha('SHA-256', buffer),
        sha('SHA-512', buffer),
      ]).then(([sha1, sha256, sha512]) => {
        setHashes({ md5: md5hash, sha1, sha256, sha512 })
        setComputing(false)
      })
    }
    reader.readAsArrayBuffer(file)
  }

  const handleClear = () => {
    setInput('')
    setDebouncedInput('')
    setFileInfo(null)
    setHashes({ md5: '', sha1: '', sha256: '', sha512: '' })
  }

  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="w-full">
      <ToolHeader />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        {/* Options */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">Output:</span>
          {([
            { value: 'lower' as CaseMode, label: 'Lowercase' },
            { value: 'upper' as CaseMode, label: 'Uppercase' },
          ]).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setCaseMode(value)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                caseMode === value
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div
          className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-6"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b]">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {fileInfo ? 'File' : 'Input'}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium transition flex items-center gap-1"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Hash a file
              </button>
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
              {(input || fileInfo) && (
                <button onClick={handleClear} className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition" aria-label="Clear">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>
          </div>

          {fileInfo ? (
            <div className="px-4 py-6 bg-white dark:bg-[#1e293b] flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span className="font-mono font-medium">{fileInfo.name}</span>
              <span className="text-gray-400">{formatBytes(fileInfo.size)}</span>
              {computing && <span className="text-xs text-blue-500 animate-pulse">Computing...</span>}
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-4 font-mono text-sm bg-white dark:bg-[#1e293b] outline-none resize-none leading-6 text-gray-900 dark:text-[#e2e8f0] placeholder-gray-400 dark:placeholder-gray-600"
              placeholder="Enter text to hash, or drop a file anywhere on this panel..."
              rows={5}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
          )}
        </div>

        {/* Hash output rows */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-[#1e293b]">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#162032]">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hash Values</span>
          </div>
          {computing ? (
            <div className="px-4 py-8 text-center text-xs text-blue-500 animate-pulse">Computing hashes...</div>
          ) : (
            <>
              <HashRow algo="MD5" value={hashes.md5} caseMode={caseMode} onCopy={() => {}} />
              <HashRow algo="SHA-1" value={hashes.sha1} caseMode={caseMode} onCopy={() => {}} />
              <HashRow algo="SHA-256" value={hashes.sha256} caseMode={caseMode} onCopy={() => {}} />
              <HashRow algo="SHA-512" value={hashes.sha512} caseMode={caseMode} onCopy={() => {}} />
            </>
          )}
        </div>

        {!input && !fileInfo && (
          <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-600">
            Type or paste text above to generate hashes instantly — or drop any file to hash it
          </p>
        )}
      </div>
    </div>
  )
}

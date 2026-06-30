'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

const PRIMARY_TOOLS = [
  { href: '/', label: 'Base64' },
  { href: '/url', label: 'URL' },
  { href: '/html', label: 'HTML' },
  { href: '/jwt', label: 'JWT' },
  { href: '/hash', label: 'Hash' },
  { href: '/base64-to-image', label: '→Img' },
]

const MORE_TOOLS = [
  { href: '/image-to-base64', label: 'Img→' },
  { href: '/morse', label: 'Morse' },
  { href: '/binary', label: 'Binary' },
  { href: '/rot13', label: 'ROT13' },
  { href: '/regex', label: 'Regex' },
  { href: '/cron', label: 'Cron' },
  { href: '/color', label: 'Color' },
]

export default function ToolNav() {
  const pathname = usePathname()
  const [darkMode, setDarkMode] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sync = () => setDarkMode(document.documentElement.classList.contains('dark'))
    sync()
    const obs = new MutationObserver(sync)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setShowMore(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close More dropdown when route changes
  useEffect(() => { setShowMore(false) }, [pathname])

  const toggleDark = () => {
    const next = !darkMode
    document.documentElement.classList.toggle('dark', next)
    try { localStorage.setItem('encodedecode-theme', next ? 'dark' : 'light') } catch { /* ignore */ }
  }

  const moreActive = MORE_TOOLS.some(t => t.href === pathname)

  const tabClass = (isActive: boolean) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
      isActive
        ? 'bg-blue-50 dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-400'
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
    }`

  return (
    <nav className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0f172a] px-4 sm:px-6 overflow-x-auto">
      <div className="flex items-center gap-0.5 max-w-[1600px] mx-auto py-1.5 min-w-max">

        {/* Primary tabs — always visible */}
        {PRIMARY_TOOLS.map(({ href, label }) => (
          <Link key={href} href={href} className={tabClass(pathname === href)}>
            {label}
          </Link>
        ))}

        {/* More dropdown */}
        <div ref={moreRef} className="relative">
          <button
            onClick={() => setShowMore(v => !v)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              moreActive
                ? 'bg-blue-50 dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            aria-expanded={showMore}
            aria-haspopup="true"
          >
            More
            <svg
              width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              className={`transition-transform duration-150 ${showMore ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {showMore && (
            <div className="absolute top-full left-0 mt-1.5 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1 z-50 min-w-[140px]">
              {MORE_TOOLS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === href
                      ? 'text-[#2563EB] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1 shrink-0" />

        <button
          onClick={toggleDark}
          className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition focus:outline-none"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>
    </nav>
  )
}

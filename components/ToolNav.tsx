'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const ALL_TOOLS = [
  { href: '/', label: 'Base64' },
  { href: '/url', label: 'URL' },
  { href: '/html', label: 'HTML' },
  { href: '/jwt', label: 'JWT' },
  { href: '/hash', label: 'Hash' },
  { href: '/base64-to-image', label: '→Img' },
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

  useEffect(() => {
    const sync = () => setDarkMode(document.documentElement.classList.contains('dark'))
    sync()
    const obs = new MutationObserver(sync)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  const toggleDark = () => {
    const next = !darkMode
    document.documentElement.classList.toggle('dark', next)
    try { localStorage.setItem('encodedecode-theme', next ? 'dark' : 'light') } catch { /* ignore */ }
  }

  const tabClass = (isActive: boolean) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
      isActive
        ? 'bg-blue-50 dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-400'
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
    }`

  return (
    <nav className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0f172a] px-4 sm:px-6">
      <div className="max-w-[1600px] mx-auto flex items-center">

        {/* All tabs — overflow-x-auto scrolls horizontally on any viewport width.
            min-w-max prevents wrapping so all tabs stay on one row. */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex items-center gap-0.5 py-1.5 min-w-max">
            {ALL_TOOLS.map(({ href, label }) => (
              <Link key={href} href={href} className={tabClass(pathname === href)}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Dark mode toggle — lives outside the overflow container so it's
            always pinned to the right and never scrolls with the tabs. */}
        <div className="flex items-center py-1.5 shrink-0 pl-1">
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

      </div>
    </nav>
  )
}

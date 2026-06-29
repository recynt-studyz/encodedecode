'use client'

import ToolNav from './ToolNav'

export default function ToolHeader() {
  return (
    <>
      <header className="border-b border-gray-100 dark:border-gray-800 px-4 sm:px-6 py-3 flex items-center bg-white dark:bg-[#0f172a]">
        <div className="flex items-baseline gap-3">
          <a href="/" className="font-mono font-bold text-xl text-gray-900 dark:text-white tracking-tight hover:text-[#2563EB] transition-colors">
            encodedecode.app
          </a>
          <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">
            Free developer encoding &amp; decoding tools
          </span>
        </div>
      </header>
      <ToolNav />
    </>
  )
}

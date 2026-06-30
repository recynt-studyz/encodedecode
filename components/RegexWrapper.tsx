'use client'

import dynamic from 'next/dynamic'

const RegexTool = dynamic(() => import('./RegexTool'), { ssr: false })

export default function RegexWrapper() {
  return <RegexTool />
}

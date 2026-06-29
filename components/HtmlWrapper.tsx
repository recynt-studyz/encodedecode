'use client'

import dynamic from 'next/dynamic'

const HtmlTool = dynamic(() => import('./HtmlTool'), { ssr: false })

export default function HtmlWrapper() {
  return <HtmlTool />
}

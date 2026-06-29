'use client'

import dynamic from 'next/dynamic'

const UrlTool = dynamic(() => import('./UrlTool'), { ssr: false })

export default function UrlWrapper() {
  return <UrlTool />
}

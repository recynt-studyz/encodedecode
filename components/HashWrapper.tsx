'use client'

import dynamic from 'next/dynamic'

const HashTool = dynamic(() => import('./HashTool'), { ssr: false })

export default function HashWrapper() {
  return <HashTool />
}

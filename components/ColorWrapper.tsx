'use client'

import dynamic from 'next/dynamic'

const ColorTool = dynamic(() => import('./ColorTool'), { ssr: false })

export default function ColorWrapper() {
  return <ColorTool />
}

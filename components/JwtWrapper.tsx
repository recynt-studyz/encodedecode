'use client'

import dynamic from 'next/dynamic'

const JwtTool = dynamic(() => import('./JwtTool'), { ssr: false })

export default function JwtWrapper() {
  return <JwtTool />
}

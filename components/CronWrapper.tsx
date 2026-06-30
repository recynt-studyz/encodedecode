'use client'

import dynamic from 'next/dynamic'

const CronTool = dynamic(() => import('./CronTool'), { ssr: false })

export default function CronWrapper() {
  return <CronTool />
}

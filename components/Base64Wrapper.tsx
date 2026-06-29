'use client'

import dynamic from 'next/dynamic'

const Base64Tool = dynamic(() => import('./Base64Tool'), { ssr: false })

export default function Base64Wrapper() {
  return <Base64Tool />
}

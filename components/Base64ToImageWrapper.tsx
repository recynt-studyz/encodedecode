'use client'
import dynamic from 'next/dynamic'
const Base64ToImageTool = dynamic(() => import('./Base64ToImageTool'), { ssr: false })
export default function Base64ToImageWrapper() { return <Base64ToImageTool /> }

'use client'
import dynamic from 'next/dynamic'
const MorseTool = dynamic(() => import('./MorseTool'), { ssr: false })
export default function MorseWrapper() { return <MorseTool /> }

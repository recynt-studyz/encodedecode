'use client'
import dynamic from 'next/dynamic'
const BinaryTool = dynamic(() => import('./BinaryTool'), { ssr: false })
export default function BinaryWrapper() { return <BinaryTool /> }

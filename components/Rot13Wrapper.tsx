'use client'
import dynamic from 'next/dynamic'
const Rot13Tool = dynamic(() => import('./Rot13Tool'), { ssr: false })
export default function Rot13Wrapper() { return <Rot13Tool /> }

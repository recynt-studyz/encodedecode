'use client'
import dynamic from 'next/dynamic'
const ImageToBase64Tool = dynamic(() => import('./ImageToBase64Tool'), { ssr: false })
export default function ImageToBase64Wrapper() { return <ImageToBase64Tool /> }

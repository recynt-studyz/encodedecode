import { ImageResponse } from 'next/og'

export const size = { width: 48, height: 48 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          background: 'linear-gradient(135deg, #0f172a, #1e293b)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <span style={{
          fontSize: 11,
          color: '#34d399',
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: 1,
        }}>01</span>
        <span style={{
          fontSize: 14,
          color: '#60a5fa',
          fontWeight: 900,
          lineHeight: 1,
        }}>⇄</span>
        <span style={{
          fontSize: 11,
          color: '#f472b6',
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: 1,
        }}>Az</span>
      </div>
    ),
    { ...size }
  )
}

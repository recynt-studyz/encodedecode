import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Base64 Encode Decode — Free Developer Tools | encodedecode.app',
  description:
    'Free online Base64 encoder decoder, URL encoder, HTML entity converter, JWT decoder, and hash generator. Instant, private, no signup required.',
  keywords: [
    'base64 decode',
    'base64 encode',
    'base64 decoder online',
    'url decode',
    'url encode',
    'html encode',
    'jwt decoder',
    'hash generator',
    'sha256 generator',
    'md5 hash online',
    'base64 to text',
    'encode decode online',
  ],
  metadataBase: new URL('https://encodedecode.app'),
  alternates: { canonical: 'https://encodedecode.app' },
  openGraph: {
    title: 'Base64 Encode Decode — Free Developer Tools | encodedecode.app',
    description:
      'Free online Base64 encoder decoder, URL encoder, HTML entity converter, JWT decoder, and hash generator. Instant, private, no signup required.',
    url: 'https://encodedecode.app',
    siteName: 'encodedecode.app',
    type: 'website',
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'Encode & Decode Anything Instantly' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Base64 Encode Decode — Free Developer Tools | encodedecode.app',
    description: 'Free online Base64 encoder decoder, URL encoder, HTML entity converter, JWT decoder, and hash generator. No signup required.',
    images: ['/twitter-image.png'],
  },
  robots: { index: true, follow: true },
  verification: { google: 'PLACEHOLDER_GOOGLE_SITE_VERIFICATION' },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <meta name="google-adsense-account" content="ca-pub-5035661017594256" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('encodedecode-theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(s==='dark'||(s===null&&d)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WMXLR3GJ7S"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WMXLR3GJ7S');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-[#0f172a] text-gray-900 dark:text-[#e2e8f0]">
        {children}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5035661017594256"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}

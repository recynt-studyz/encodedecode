import type { Metadata } from 'next'
import AdBanner from '@/components/AdBanner'
import Base64Wrapper from '@/components/Base64Wrapper'
import FAQ, { type FaqItem } from '@/components/FAQ'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Base64 Encode / Decode — Free, Instant, Private',
  description:
    'Encode text or files to Base64 and decode Base64 strings instantly in your browser. Supports UTF-8, file upload, and image preview. Free, no signup.',
  alternates: { canonical: 'https://encodedecode.app' },
}

const faqs: FaqItem[] = [
  {
    q: 'What is Base64 encoding?',
    a: 'Base64 is a binary-to-text encoding scheme that represents binary data using 64 printable ASCII characters (A–Z, a–z, 0–9, +, /). It is commonly used to encode binary data — such as images or files — for transmission over text-based protocols like email or HTTP. base64 encode operations increase size by approximately 33%.',
  },
  {
    q: 'How do I decode a Base64 string?',
    a: 'Switch to Decode mode using the toolbar above. Paste your Base64 string into the left panel and the decoded output appears instantly on the right. encodedecode.app supports standard Base64, URL-safe Base64 (with - and _ instead of + and /), and handles padding automatically.',
  },
  {
    q: 'Is my data sent to a server when encoding?',
    a: 'No. All base64 encode and decode operations run entirely in your browser using native JavaScript APIs (btoa, atob, TextEncoder). Your data never leaves your device. You can verify this by opening DevTools → Network tab — zero outbound requests during encoding.',
  },
  {
    q: 'What is the difference between Base64 and Base64URL?',
    a: 'Standard Base64 uses + and / as characters 62 and 63, and = for padding. These characters have special meanings in URLs. Base64URL (also called URL-safe Base64) replaces + with -, / with _, and omits padding. Use the URL-safe toggle to switch between formats.',
  },
  {
    q: 'Can I encode files to Base64?',
    a: 'Yes. Drag and drop any file onto the input panel to base64 encode it. The tool uses the FileReader API to read the file locally — it is never uploaded. After encoding, you can see the full data URL (data:mime;base64,...) and download the result. Image files show a thumbnail preview.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Base64 Encode / Decode',
  url: 'https://encodedecode.app',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Base64 Encode and Decode Online',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Select mode',
      text: 'Choose Encode to convert text or files to Base64, or Decode to convert Base64 back to plain text.',
    },
    {
      '@type': 'HowToStep',
      name: 'Paste text or drop a file',
      text: 'Type or paste your input into the left panel. For file encoding, drag and drop any file onto the panel.',
    },
    {
      '@type': 'HowToStep',
      name: 'Copy or download the result',
      text: 'The Base64 output appears instantly on the right. Click Copy to copy to clipboard or Download to save as a .txt file.',
    },
  ],
}

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema).replace(/</g, '\\u003c') }} />

      <Base64Wrapper />

      <section className="bg-white dark:bg-[#0f172a]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="pb-2">
            <AdBanner slot="1111111111" />
          </div>

          <div className="max-w-3xl mx-auto pb-8 pt-4">
            <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 px-6 py-5">
              <h2 className="text-base font-bold text-blue-900 dark:text-blue-300 mb-2">
                Why &ldquo;your data never leaves your browser&rdquo; actually matters
              </h2>
              <p className="text-sm text-blue-800 dark:text-blue-400 leading-relaxed">
                Most base64 encode tools send your data to a remote server. That means your files, API keys, and private content pass
                through someone else&apos;s infrastructure. encodedecode.app is different: every base64 encode and base64 decode
                operation runs in your browser using native <code className="font-mono text-xs">btoa()</code>,{' '}
                <code className="font-mono text-xs">atob()</code>, and{' '}
                <code className="font-mono text-xs">TextEncoder</code>. Zero outbound requests.
              </p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto pb-10">
            <FAQ questions={faqs} />
          </div>

          <div className="max-w-3xl mx-auto pb-6">
            <AdBanner slot="2222222222" />
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

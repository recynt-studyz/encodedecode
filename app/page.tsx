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

      <h1 className="sr-only">Base64 Encode / Decode — Free, Instant, Private</h1>
      <Base64Wrapper />

      <section className="bg-white dark:bg-[#0f172a]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-4 space-y-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How Base64 Encoding Works</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>Base64 encoding was invented to solve a specific problem: binary data cannot be safely transmitted over protocols designed for plain text. Early email systems, HTTP headers, and XML documents were built to handle ASCII text — not the raw bytes that make up images, audio files, or compressed archives. When those systems encountered a binary zero byte or a control character, they often corrupted or truncated the data. Base64 solves this by converting any binary input into a safe subset of 64 printable ASCII characters: A–Z, a–z, 0–9, plus <code className="font-mono text-xs">+</code> and <code className="font-mono text-xs">/</code>.</p>
              <p>The encoding algorithm works in groups of three bytes. Each group of 3 bytes (24 bits) is split into four 6-bit values, and each 6-bit value maps to one of the 64 characters in the Base64 alphabet. If the input length is not a multiple of 3, one or two <code className="font-mono text-xs">=</code> padding characters are appended to make the output length a multiple of 4. This predictable structure makes Base64 easy to detect and decode reliably.</p>
              <p>Because three bytes of input produce four characters of output, Base64 increases data size by exactly one third. A 1 MB image becomes approximately 1.33 MB as a Base64 string. This size penalty is the primary tradeoff. Common use cases where it is worth it include embedding images in HTML or CSS as data URIs (avoiding an extra HTTP request), encoding email attachments in MIME format, storing binary data in JSON payloads, and transmitting cryptographic keys or certificates in PEM format.</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">A Worked Example: Encoding &ldquo;Hello&rdquo;</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>Consider a developer building an HTML email template who needs to include a small company logo. External image URLs are frequently blocked by corporate email clients — Outlook, Gmail, and Apple Mail all have different rules about loading remote images. The reliable solution is to embed the image as a Base64 data URI directly in the <code className="font-mono text-xs">img</code> tag&apos;s <code className="font-mono text-xs">src</code> attribute.</p>
              <p>She takes her 2 KB PNG logo and converts it to Base64, producing a ~2.7 KB string. She embeds it as <code className="font-mono text-xs break-all">{`<img src="data:image/png;base64,iVBORw0KGgo...">`}</code>. The browser (or email client) renders this identically to a file reference — same pixel-perfect image, same quality — but with zero additional HTTP requests. The entire email is self-contained.</p>
              <p>To see the encoding step by step, consider the string <strong>Hello</strong>. Its ASCII bytes are 72, 101, 108, 108, 111. Grouping into sets of three: <strong>72 101 108</strong> and <strong>108 111</strong> (with padding). The first group in binary is 010010000110010101101100, split into four 6-bit chunks: 010010 (18 → S), 000110 (6 → G), 010101 (21 → V), 101100 (44 → s). The second group produces <strong>bG8=</strong>. Combined result: <strong>Hello → SGVsbG8=</strong>. Paste <em>Hello</em> into the encoder above to verify this result instantly.</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Base64URL, Padding, and When Not to Use Base64</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p><strong>Base64URL</strong> is a URL-safe variant that replaces <code className="font-mono text-xs">+</code> with <code className="font-mono text-xs">-</code> and <code className="font-mono text-xs">/</code> with <code className="font-mono text-xs">_</code>, and typically omits the <code className="font-mono text-xs">=</code> padding. This matters because standard Base64 characters <code className="font-mono text-xs">+</code>, <code className="font-mono text-xs">/</code>, and <code className="font-mono text-xs">=</code> have special meanings in URLs and query strings. JSON Web Tokens always use Base64URL encoding for their header and payload sections.</p>
              <p><strong>Line length limits</strong> matter in email contexts. The MIME specification requires Base64-encoded content to be split into lines of 76 characters maximum. Most email libraries handle this automatically, but if you are manually constructing MIME messages, a missing line break can cause some mail servers to reject the message.</p>
              <p><strong>When not to use Base64</strong>: the 33% size increase becomes significant for large files. A 10 MB video encoded as Base64 becomes 13.3 MB and must be decoded in memory before use. For large binary transfers, use multipart form data or a direct binary HTTP body. Base64 is best suited for small assets — icons, thumbnails, short strings — where the HTTP round-trip overhead outweighs the size penalty, or where the protocol requires text-only transmission.</p>
            </div>
          </div>
        </div>
      </section>

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

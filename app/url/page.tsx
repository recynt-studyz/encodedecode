import type { Metadata } from 'next'
import AdBanner from '@/components/AdBanner'
import UrlWrapper from '@/components/UrlWrapper'
import FAQ, { type FaqItem } from '@/components/FAQ'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'URL Encode / Decode — Free Online URL Encoder',
  description:
    'URL encode and decode strings instantly. Convert special characters to percent encoding and back. Free online URL encoder decoder, no signup required.',
  alternates: { canonical: 'https://encodedecode.app/url' },
}

const faqs: FaqItem[] = [
  {
    q: 'What is URL encoding?',
    a: 'URL encoding (also called percent encoding) converts characters that are not allowed in a URL into a safe format. Each unsafe character is replaced with a % followed by two hexadecimal digits representing the character\'s UTF-8 byte value. For example, a space becomes %20 and & becomes %26.',
  },
  {
    q: 'Why do URLs have % characters in them?',
    a: 'The % characters you see in URLs are percent-encoded characters. URLs can only contain a limited set of ASCII characters safely. Any character outside that set — including spaces, non-ASCII letters, and special symbols — must be url encode\'d using the %XX format so the URL is transmitted correctly by browsers and servers.',
  },
  {
    q: 'What is the difference between encodeURI and encodeURIComponent?',
    a: 'encodeURI is designed for encoding a full URL — it preserves characters like :, /, ?, &, = that have structural meaning in a URL. encodeURIComponent is designed for encoding a single query parameter value — it encodes those structural characters too, so the value cannot be confused for URL structure. Use encodeURIComponent (Component mode) for individual values.',
  },
  {
    q: 'How do I decode a URL encoded string?',
    a: 'Switch to Decode mode and paste your percent-encoded string. The tool uses the native decodeURIComponent function to decode it instantly in your browser. This converts %20 back to space, %26 back to &, and so on. Your data never leaves your device.',
  },
  {
    q: 'Is URL encoding the same as Base64 encoding?',
    a: 'No. URL encoding and Base64 encoding solve different problems. URL encoding replaces unsafe URL characters with %XX sequences and is used to safely transmit data in URLs. Base64 encoding converts binary data to a printable ASCII string and is used for transmitting binary data over text-based protocols. They are not interchangeable.',
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
  name: 'URL Encode / Decode',
  url: 'https://encodedecode.app/url',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to URL Encode and Decode Online',
  step: [
    { '@type': 'HowToStep', name: 'Select mode', text: 'Choose Encode to convert text to percent encoding, or Decode to convert percent-encoded strings back to plain text.' },
    { '@type': 'HowToStep', name: 'Paste your text', text: 'Paste the text or URL you want to url encode or url decode into the left panel.' },
    { '@type': 'HowToStep', name: 'Copy the result', text: 'The encoded or decoded output appears instantly. Click Copy to copy to clipboard.' },
  ],
}

export default function UrlPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema).replace(/</g, '\\u003c') }} />

      <UrlWrapper />

      <section className="bg-white dark:bg-[#0f172a]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="pb-2">
            <AdBanner slot="3333333333" />
          </div>
          <div className="max-w-3xl mx-auto pb-10 pt-4">
            <FAQ questions={faqs} />
          </div>
          <div className="max-w-3xl mx-auto pb-6">
            <AdBanner slot="4444444444" />
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

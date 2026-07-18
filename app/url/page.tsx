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

      <h1 className="sr-only">URL Encode / Decode — Free Online URL Encoder Decoder</h1>
      <UrlWrapper />

      <section className="bg-white dark:bg-[#0f172a]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-4 space-y-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How URL Encoding Works</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>URL encoding — formally called percent encoding — is defined by RFC 3986, the specification that governs the syntax of Uniform Resource Identifiers. A URL can only safely contain a limited set of characters: letters, digits, and a handful of unreserved symbols like hyphens, dots, tildes, and underscores. Any other character — including spaces, ampersands, equal signs, non-ASCII letters, and most punctuation — must be encoded as a percent sign followed by two hexadecimal digits representing the character&apos;s byte value in UTF-8. A space becomes <code className="font-mono text-xs">%20</code>, an ampersand becomes <code className="font-mono text-xs">%26</code>, and the at symbol becomes <code className="font-mono text-xs">%40</code>.</p>
              <p>JavaScript provides two native functions for URL encoding with importantly different behaviors. <code className="font-mono text-xs">encodeURI()</code> is designed for encoding a complete URL — it preserves characters that have structural meaning in a URL, such as <code className="font-mono text-xs">/</code>, <code className="font-mono text-xs">?</code>, <code className="font-mono text-xs">#</code>, <code className="font-mono text-xs">&amp;</code>, and <code className="font-mono text-xs">=</code>. <code className="font-mono text-xs">encodeURIComponent()</code> encodes everything including those structural characters, making it the right choice for encoding individual query parameter values. Use <code className="font-mono text-xs">encodeURIComponent()</code> for query string values and path segments that may contain special characters.</p>
              <p>One subtle distinction worth knowing: HTML form submissions via the GET method use <code className="font-mono text-xs">application/x-www-form-urlencoded</code> format, which encodes spaces as <code className="font-mono text-xs">+</code> rather than <code className="font-mono text-xs">%20</code>. Standard percent encoding always uses <code className="font-mono text-xs">%20</code> for spaces. Both decode back to a space, but they are not interchangeable — a <code className="font-mono text-xs">+</code> in a URL path means a literal plus sign, not a space.</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">A Worked Example: Encoding a Search Query</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>A developer builds a product search feature. The user types <em>best coffee &amp; tea shops near me</em> into the search box. The JavaScript <code className="font-mono text-xs">encodeURIComponent()</code> function transforms this into <code className="font-mono text-xs break-all">best%20coffee%20%26%20tea%20shops%20near%20me</code>. Each space becomes <code className="font-mono text-xs">%20</code> and the ampersand becomes <code className="font-mono text-xs">%26</code>. The resulting URL is a valid, unambiguous string that any server or browser can parse.</p>
              <p>Without URL encoding, the ampersand would break the query string parser. The server would see two parameters — <code className="font-mono text-xs">q=best coffee </code> and <code className="font-mono text-xs">tea shops near me</code> — instead of one intact search phrase. URL encoding ensures the entire value is transmitted as a single parameter.</p>
              <p>International characters follow the same principle. The Japanese characters for Tokyo (東京) encode as <code className="font-mono text-xs">%E6%9D%B1%E4%BA%AC</code> — each UTF-8 byte pair percent-encoded. Modern browsers display the decoded version in the address bar for readability, but the actual network request always uses the encoded form. This is why pasting a URL from a browser address bar sometimes reveals encoded sequences that were not visible when you copied it.</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Reserved Characters, Double Encoding, and Unicode</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p><strong>Reserved vs unreserved characters</strong>: RFC 3986 divides URL characters into two groups. Reserved characters (<code className="font-mono text-xs">/ ? # [ ] @ ! $ &amp; &apos; ( ) * + , ; =</code>) have structural meaning in URLs and must only be encoded when they appear inside a parameter value. Unreserved characters (letters, digits, <code className="font-mono text-xs">- _ . ~</code>) never need encoding and should be left as-is.</p>
              <p><strong>Double encoding</strong> is one of the most common URL handling mistakes. If a URL is encoded twice — for example, <code className="font-mono text-xs">%20</code> becomes <code className="font-mono text-xs">%2520</code> on the second pass (the <code className="font-mono text-xs">%</code> sign itself gets encoded) — then decoding once produces <code className="font-mono text-xs">%20</code>, not a space. The server or client must decode again to recover the original value. Always encode exactly once and decode exactly once.</p>
              <p><strong>Path encoding vs query string encoding</strong>: the path segment of a URL (<code className="font-mono text-xs">/products/my item</code>) and the query string (<code className="font-mono text-xs">?name=my item</code>) have slightly different encoding rules. Both need spaces encoded, but path segments must not have <code className="font-mono text-xs">/</code> encoded (it separates path levels), while query strings must encode <code className="font-mono text-xs">&amp;</code> and <code className="font-mono text-xs">=</code> inside values. Use <code className="font-mono text-xs">encodeURIComponent()</code> for individual values in either context.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-[#0f172a]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="pb-2">
            <AdBanner slot="3333333333" />
          </div>
          <div className="max-w-3xl mx-auto pb-8 pt-4">
            <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 px-6 py-5">
              <h2 className="text-base font-bold text-blue-900 dark:text-blue-300 mb-2">url encode decode online — instant percent-encoding</h2>
              <p className="text-sm text-blue-800 dark:text-blue-400 leading-relaxed">
                This url encoder decoder converts text to percent-encoded format and back in real time using native
                <code className="font-mono text-xs"> encodeURIComponent</code> and <code className="font-mono text-xs">decodeURIComponent</code>.
                Use Component mode for individual query parameter values, or Full URL mode to encode a complete URL while preserving
                its structure. All processing runs in your browser — no data is sent to any server.
              </p>
            </div>
          </div>
          <div className="max-w-3xl mx-auto pb-10">
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

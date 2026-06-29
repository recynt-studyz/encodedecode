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

      <HtmlWrapper />

      <section className="bg-white dark:bg-[#0f172a]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="pb-2">
            <AdBanner slot="5555555555" />
          </div>
          <div className="max-w-3xl mx-auto pb-10 pt-4">
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

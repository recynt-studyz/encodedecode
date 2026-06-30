import type { Metadata } from 'next'
import AdBanner from '@/components/AdBanner'
import BinaryWrapper from '@/components/BinaryWrapper'
import FAQ, { type FaqItem } from '@/components/FAQ'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Binary & Hex Converter — Text to Binary Online',
  description:
    'Convert text to binary and hexadecimal instantly. Real-time binary to text and hex to text converter. Free online binary converter, no signup.',
  alternates: { canonical: 'https://encodedecode.app/binary' },
}

const faqs: FaqItem[] = [
  {
    q: 'How do I convert text to binary?',
    a: 'Select "Text → Binary / Hex" mode and type or paste your text. The binary converter instantly shows the binary representation of each character as space-separated 8-bit groups. For example, "Hello" becomes "01001000 01100101 01101100 01101100 01101111". Each character is converted to its UTF-8 byte value, then to 8-bit binary.',
  },
  {
    q: 'What is binary code?',
    a: 'Binary code is a number system using only two digits: 0 and 1. Computers use binary because digital circuits have two states: on (1) and off (0). Text is represented in binary by first converting each character to a number (using a standard like UTF-8 or ASCII), then representing that number in base-2. The letter "A" is 65 in decimal, which is 01000001 in 8-bit binary.',
  },
  {
    q: 'How do I convert binary back to text?',
    a: 'Select "Binary / Hex → Text" mode and paste your binary code. Input should be space-separated 8-bit groups (e.g. "01001000 01100101"). The tool automatically detects binary format and converts each 8-bit group back to the corresponding character. Non-standard binary (not 8-bit groups) may not decode correctly.',
  },
  {
    q: 'What is the difference between binary and hexadecimal?',
    a: 'Binary (base-2) uses digits 0 and 1. Hexadecimal (base-16) uses digits 0–9 and letters A–F. Both can represent the same data — hex is more compact: one hex digit represents 4 binary digits, and two hex digits represent one byte (8 bits). The letter "H" is 01001000 in binary and 48 in hex. Programmers often prefer hex for readability.',
  },
  {
    q: 'How do I convert text to hexadecimal?',
    a: 'Use the same "Text → Binary / Hex" mode — the hex output is shown alongside the binary output. Each character becomes two hexadecimal digits representing its UTF-8 byte value. "Hello" becomes "48 65 6C 6C 6F" in hex (uppercase) or "48 65 6c 6c 6f" (lowercase). Use the toggle to switch between uppercase and lowercase hex.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
}

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Binary & Hex Converter',
  url: 'https://encodedecode.app/binary',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Convert Text to Binary Online',
  step: [
    { '@type': 'HowToStep', name: 'Select mode', text: 'Choose "Text → Binary / Hex" to convert text, or "Binary / Hex → Text" to decode binary or hex back to text.' },
    { '@type': 'HowToStep', name: 'Enter your text', text: 'Type or paste your text. The binary and hex outputs update instantly as you type.' },
    { '@type': 'HowToStep', name: 'Copy the result', text: 'Click Copy next to the Binary or Hex output to copy the result to your clipboard.' },
  ],
}

export default function BinaryPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema).replace(/</g, '\\u003c') }} />

      <BinaryWrapper />

      <section className="bg-white dark:bg-[#0f172a]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="pb-2"><AdBanner slot="4050607080" /></div>
          <div className="max-w-3xl mx-auto pb-8 pt-4">
            <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 px-6 py-5">
              <h2 className="text-base font-bold text-blue-900 dark:text-blue-300 mb-2">text to binary converter online — instant results</h2>
              <p className="text-sm text-blue-800 dark:text-blue-400 leading-relaxed">
                This binary converter online converts text to binary and hex in real time. All conversion uses native JavaScript
                and the TextEncoder API — no libraries, no server. Works in reverse too: paste binary or hex to decode back to text.
                The format is auto-detected so you can paste either format without selecting it manually.
              </p>
            </div>
          </div>
          <div className="max-w-3xl mx-auto pb-10">
            <FAQ questions={faqs} />
          </div>
          <div className="max-w-3xl mx-auto pb-6"><AdBanner slot="4050607081" /></div>
        </div>
      </section>

      <Footer />
    </>
  )
}

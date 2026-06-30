import type { Metadata } from 'next'
import AdBanner from '@/components/AdBanner'
import Rot13Wrapper from '@/components/Rot13Wrapper'
import FAQ, { type FaqItem } from '@/components/FAQ'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'ROT13 & Caesar Cipher Encoder — Free Online Tool',
  description:
    'Encode and decode ROT13 and Caesar cipher text instantly in your browser. Adjustable shift for all 25 Caesar cipher variations. Free, no signup.',
  alternates: { canonical: 'https://encodedecode.app/rot13' },
}

const faqs: FaqItem[] = [
  {
    q: 'What is ROT13?',
    a: 'ROT13 (Rotate by 13) is a simple letter substitution cipher that replaces each letter with the letter 13 positions after it in the alphabet. A becomes N, B becomes O, and so on. Since the alphabet has 26 letters and ROT13 shifts by 13, applying ROT13 twice returns the original text. Numbers, spaces, and punctuation are not affected.',
  },
  {
    q: 'How do I decode ROT13?',
    a: 'ROT13 is its own inverse — you decode it by encoding it again. Just paste your ROT13 text into the input field on this page and the decoded text appears immediately on the right. The same operation both encodes and decodes, so there is no separate decode button for ROT13.',
  },
  {
    q: 'What is the difference between ROT13 and Caesar cipher?',
    a: 'ROT13 is a specific case of the Caesar cipher with a shift of 13. The Caesar cipher is a general substitution cipher where you choose any shift from 1 to 25. Julius Caesar reportedly used a shift of 3. ROT13 is popular online for hiding spoilers and punchlines because it is easily reversible. Use the Caesar Cipher tab to try any shift value.',
  },
  {
    q: 'Is ROT13 encryption?',
    a: 'No. ROT13 is technically a cipher but provides no real security. It has only one possible "key" and anyone who knows about ROT13 (which is publicly documented) can instantly decode it. ROT13 is used for obfuscation — hiding text from casual view — not for security. For actual encryption, use proper cryptographic algorithms.',
  },
  {
    q: 'What shift does ROT13 use?',
    a: 'ROT13 uses a shift of 13. With 26 letters in the alphabet, a shift of 13 means encoding and decoding are identical operations. The Caesar Cipher tab on this page lets you try any shift from 1 to 25 with a visual mapping showing how each letter transforms. Shift 13 in Caesar cipher mode is equivalent to ROT13.',
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
  name: 'ROT13 & Caesar Cipher Encoder',
  url: 'https://encodedecode.app/rot13',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Use the ROT13 Decoder and Caesar Cipher Online',
  step: [
    { '@type': 'HowToStep', name: 'Choose ROT13 or Caesar', text: 'Select the ROT13 tab for instant ROT13 encoding/decoding, or the Caesar Cipher tab to choose a custom shift value.' },
    { '@type': 'HowToStep', name: 'Enter your text', text: 'Type or paste your text into the left panel. The encoded or decoded result appears instantly on the right.' },
    { '@type': 'HowToStep', name: 'Copy the result', text: 'Click Copy to copy the output to your clipboard. For Caesar cipher, adjust the shift slider and toggle encode/decode as needed.' },
  ],
}

export default function Rot13Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema).replace(/</g, '\\u003c') }} />

      <h1 className="sr-only">ROT13 &amp; Caesar Cipher Encoder — Free Online Tool</h1>
      <Rot13Wrapper />

      <section className="bg-white dark:bg-[#0f172a]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="pb-2"><AdBanner slot="5060708090" /></div>
          <div className="max-w-3xl mx-auto pb-8 pt-4">
            <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 px-6 py-5">
              <h2 className="text-base font-bold text-blue-900 dark:text-blue-300 mb-2">rot13 decoder & caesar cipher online — instant results</h2>
              <p className="text-sm text-blue-800 dark:text-blue-400 leading-relaxed">
                This rot13 decoder and caesar cipher online tool converts text instantly as you type. ROT13 encodes and
                decodes with a single operation. The Caesar cipher tab lets you pick any shift from 1–25 and shows the
                full letter mapping so you can understand exactly what each letter maps to. All processing is client-side — no data is sent to any server.
              </p>
            </div>
          </div>
          <div className="max-w-3xl mx-auto pb-10">
            <FAQ questions={faqs} />
          </div>
          <div className="max-w-3xl mx-auto pb-6"><AdBanner slot="5060708091" /></div>
        </div>
      </section>

      <Footer />
    </>
  )
}

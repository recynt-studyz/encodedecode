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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-4 space-y-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How ROT13 and Caesar Ciphers Work</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>ROT13 is a special case of the Caesar cipher — a substitution cipher named after Julius Caesar, who reportedly used a shift of 3 positions to protect military communications. In a Caesar cipher, each letter in the plaintext is replaced by the letter a fixed number of positions further along the alphabet. With a shift of 3, A becomes D, B becomes E, and Z wraps around to C. The cipher is symmetric: to decrypt, shift in the opposite direction by the same amount.</p>
              <p>ROT13 specifically uses a shift of 13. The English alphabet has 26 letters, so a shift of 13 lands exactly halfway around the circle. This means applying ROT13 twice returns the original text — ROT13 is its own inverse. There is no separate encode and decode operation; the same transformation does both. This elegant property makes ROT13 uniquely convenient: one button, no key to remember, perfect reversibility. The cipher affects only letters and preserves their case. Digits, spaces, punctuation, and non-Latin characters pass through unchanged.</p>
              <p>The cipher has a long history of casual internet use for hiding content that someone might prefer to read only intentionally. Online communities have used it since the early Usenet days to hide puzzle answers, movie spoilers, offensive jokes, and punchlines. Because the encoding pattern is visually distinctive — every word looks like scrambled letters of a similar length — readers immediately recognize encoded text and know they can decode it if they choose to.</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">A Worked Example: Hiding a Spoiler</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>A film discussion forum wants to allow users to post spoilers without ruining the experience for others who have not yet seen the movie. A user wants to share: <em>The butler did it. He framed the detective in the final scene.</em></p>
              <p>After ROT13 encoding: <em>Gur ohgyre qvq vg. Ur senzrq gur qrgrpgvir va gur svany fprar.</em> The encoded text is clearly altered — any reader recognizes it as ROT13, so no one will accidentally read the spoiler. Anyone who wants to read it can decode it in one click. The casual reader is protected; the curious reader is not blocked.</p>
              <p>To trace the rotation letter by letter: T (position 19) + 13 = 32, which wraps to 6 → G. H + 13 = U. E + 13 = R. The word <em>The</em> becomes <em>Gur</em>. Similarly, <em>butler</em> becomes <em>ohgyre</em> and <em>did</em> becomes <em>qvq</em>. Paste <em>The butler did it</em> into the encoder above to see every rotation in real time, then paste the result back to confirm ROT13&apos;s self-reversing property.</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Caesar Cipher Variants and ROT13&apos;s Limits</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p><strong>ROT13 provides no security.</strong> It is a single, publicly documented transformation with no key and no variation. Anyone who recognizes ROT13 text — which is visually distinctive — can decode it instantly using any ROT13 tool. It is a casual obfuscation technique for spoilers, hints, and puzzle answers, not a privacy or security measure. For actual content protection, use properly authenticated encryption.</p>
              <p><strong>The full range of Caesar cipher shifts</strong> (ROT1 through ROT25) is available in the Caesar cipher tab. Each shift value is a different cipher. ROT13 is the most common because it is self-reversing. ROT1 and ROT25 are each other&apos;s inverse. ROT3 is the historical Caesar cipher. ROT47 is a variant that extends the rotation to include digits and punctuation (printable ASCII from ! to ~, a range of 94 characters), sometimes used in a similar casual obfuscation context.</p>
              <p><strong>Non-Latin alphabets</strong> are not affected by ROT13. Russian, Arabic, Chinese, Japanese, Korean, and other non-Latin scripts pass through the cipher unchanged, because ROT13 is defined only for the 26 letters of the Latin alphabet. For languages that use Latin characters with diacritical marks (é, ü, ñ, etc.), those extended characters also pass through unchanged — only the plain A–Z letters rotate.</p>
            </div>
          </div>
        </div>
      </section>

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

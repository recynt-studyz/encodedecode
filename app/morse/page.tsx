import type { Metadata } from 'next'
import AdBanner from '@/components/AdBanner'
import MorseWrapper from '@/components/MorseWrapper'
import FAQ, { type FaqItem } from '@/components/FAQ'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Morse Code Translator — Text to Morse Code Online',
  description:
    'Translate text to Morse code and Morse code to text instantly. Includes audio playback with adjustable speed. Free online Morse code translator.',
  alternates: { canonical: 'https://encodedecode.app/morse' },
}

const faqs: FaqItem[] = [
  {
    q: 'What is Morse code?',
    a: 'Morse code is a telecommunication encoding system that uses sequences of dots (short signals, called dits) and dashes (longer signals, called dahs) to represent letters, digits, and punctuation. It was developed by Samuel Morse and Alfred Vail in the 1830s and 1840s for use with the electrical telegraph. Each character is separated by a short pause, and words by a longer pause.',
  },
  {
    q: 'How do I translate text to Morse code?',
    a: 'Select "Text → Morse" mode and type or paste your text into the left panel. The morse code translator instantly converts each letter and number to its Morse code equivalent, separated by spaces. Words are separated by a slash (/). You can also play the Morse code as audio using the Play Audio button.',
  },
  {
    q: 'How do I decode Morse code?',
    a: 'Select "Morse → Text" mode and paste your Morse code into the left panel. Separate individual characters with spaces and words with " / " (space-slash-space). The morse code translator supports standard dot-dash notation and also accepts alternative characters like • and –.',
  },
  {
    q: 'What do dots and dashes mean in Morse code?',
    a: 'In Morse code, a dot (dit) represents a short signal and a dash (dah) represents a long signal. A dah is typically three times the duration of a dit. The gap between symbols in the same character is one dit. The gap between characters is three dits. The gap between words is seven dits.',
  },
  {
    q: 'Can I hear the Morse code audio?',
    a: 'Yes. Click the Play Audio button to hear the Morse code played as audio tones using the Web Audio API. The tones are generated at 600 Hz directly in your browser — no audio files are downloaded. You can adjust the playback speed (Slow, Normal, Fast) and stop playback at any time by clicking the Stop button.',
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
  name: 'Morse Code Translator',
  url: 'https://encodedecode.app/morse',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Translate Text to Morse Code Online',
  step: [
    { '@type': 'HowToStep', name: 'Select direction', text: 'Choose "Text → Morse" to convert text to Morse code, or "Morse → Text" to decode Morse code to plain text.' },
    { '@type': 'HowToStep', name: 'Enter your input', text: 'Type or paste your text (or Morse code) into the left panel. The translation appears instantly on the right.' },
    { '@type': 'HowToStep', name: 'Play or copy', text: 'Click Play Audio to hear the Morse code as tones, or Copy to copy the result to your clipboard.' },
  ],
}

export default function MorsePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema).replace(/</g, '\\u003c') }} />

      <h1 className="sr-only">Morse Code Translator — Text to Morse Code Online</h1>
      <MorseWrapper />

      <section className="bg-white dark:bg-[#0f172a]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-4 space-y-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How Morse Code Works</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>Morse code was developed in the 1830s and 1840s by Samuel Morse and Alfred Vail for use with the electrical telegraph — one of the first technologies capable of long-distance communication at the speed of electricity. The system encodes text as sequences of short signals (dots, called dits) and long signals (dashes, called dahs). A dash lasts three times as long as a dot. The gap between symbols within the same character equals one dot, the gap between characters equals three dots, and the gap between words equals seven dots.</p>
              <p>The character assignments are not arbitrary. Morse and Vail analyzed letter frequency in English text by physically counting the type in a printer&apos;s type case — letters used more often in printed English got shorter codes. E (the most common English letter) is a single dot. T (second most common) is a single dash. Less frequent letters like Q, X, Y, and Z get longer four-symbol codes. This frequency-optimized design made high-speed commercial telegraphy faster and more efficient for operators.</p>
              <p>International Morse Code was standardized in 1865 and is maintained by the ITU today. It differs slightly from the original American Morse Code in a few character patterns. Modern uses include amateur (ham) radio communication, aviation navigation beacons (which still broadcast their identifier in Morse code to aircraft), naval signaling, and accessibility applications — some assistive technology allows people with severe motor impairments to input text using only two buttons in a Morse pattern.</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">A Worked Example: SOS and Ham Radio Practice</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>The most recognized Morse sequence in the world is SOS: <code className="font-mono text-xs">... --- ...</code> — three dots, three dashes, three dots. Despite widespread belief, SOS is not an acronym for any phrase. It was chosen in 1908 as the international maritime distress signal purely because the pattern is unmistakable even when received partially or in poor conditions. Its symmetry — short, long, short — is distinct from any routine transmission and recognizable to any radio operator worldwide, regardless of language.</p>
              <p>An amateur radio operator studying for their license uses this tool to practice encoding and decoding phrases. She types a practice sentence, sees the full Morse output with dot-and-dash notation, and then plays the audio. The tones are generated at 600 Hz directly in the browser using the Web Audio API — no audio files are downloaded. She adjusts the speed to Slow while learning, then gradually works up to Fast as her ear improves. Speed in Morse is measured in words per minute (WPM), standardized against the word PARIS, which contains exactly 50 timing units at correct tempo. Skilled operators reach 25–30 WPM; commercial telegraph operators in the 1800s commonly exceeded 35 WPM.</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Timing, Prosigns, and Modern Uses</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p><strong>Timing ratios</strong> are the foundation of Morse code. The fundamental unit is the length of one dot. A dash = 3 units. The gap between symbols in the same character = 1 unit. The gap between characters = 3 units. The gap between words = 7 units. These ratios are what allow trained operators to copy Morse code accurately at high speed — the rhythm is as meaningful as the individual dots and dashes.</p>
              <p><strong>Prosigns</strong> are special procedural signals formed by combining two letters without the normal inter-character gap, giving them a distinct sound. Common prosigns include AR (end of message), SK (end of contact, also written as &lt;SK&gt;), BT (break separator, equivalent to a paragraph break), and KN (invitation to a specific station to reply). These signals have no letter equivalents and are part of the operating procedure for structured radio contacts.</p>
              <p><strong>Modern uses</strong> of Morse code extend well beyond maritime distress signals. Amateur radio operators use it for long-distance contacts where voice is marginal — Morse signals penetrate noise and interference that would make voice unintelligible. Aviation VOR and NDB navigation beacons still transmit their three-letter station identifiers in Morse code, audible on aircraft receivers. Accessibility researchers have applied Morse input as an alternative communication method for people with limited motor control, using eye blinks or single switches to compose text character by character.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-[#0f172a]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="pb-2"><AdBanner slot="3040506070" /></div>
          <div className="max-w-3xl mx-auto pb-8 pt-4">
            <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 px-6 py-5">
              <h2 className="text-base font-bold text-blue-900 dark:text-blue-300 mb-2">morse code translator with audio playback</h2>
              <p className="text-sm text-blue-800 dark:text-blue-400 leading-relaxed">
                This free online morse code translator converts text to morse code and back instantly. Unlike text-only tools,
                it plays the actual Morse code audio using the Web Audio API — 600 Hz sine tones with smooth onset and offset
                to eliminate clicks. Useful for learning Morse code, amateur radio practice, or just having fun. All translation
                and audio generation runs in your browser — no data is sent to any server.
              </p>
            </div>
          </div>
          <div className="max-w-3xl mx-auto pb-10">
            <FAQ questions={faqs} />
          </div>
          <div className="max-w-3xl mx-auto pb-6"><AdBanner slot="3040506071" /></div>
        </div>
      </section>

      <Footer />
    </>
  )
}

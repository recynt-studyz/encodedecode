import type { Metadata } from 'next'
import AdBanner from '@/components/AdBanner'
import ColorWrapper from '@/components/ColorWrapper'
import FAQ, { type FaqItem } from '@/components/FAQ'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Color Converter — HEX, RGB, HSL, CMYK Online',
  description:
    'Convert colors between HEX, RGB, HSL, and CMYK instantly. Includes a color picker, WCAG contrast checker, and recent color history. Free online color converter.',
  alternates: { canonical: 'https://encodedecode.app/color' },
}

const faqs: FaqItem[] = [
  {
    q: 'How do I convert HEX to RGB?',
    a: 'Type or paste a hex color code (such as #2563EB or 2563EB) into the HEX field. The color converter instantly converts it to RGB (red, green, blue values 0–255), HSL (hue 0–360°, saturation and lightness 0–100%), and CMYK (cyan, magenta, yellow, black 0–100%). You can also click the color swatch at the top to open your browser\'s native color picker.',
  },
  {
    q: 'What is HSL color format used for?',
    a: 'HSL (hue, saturation, lightness) separates the color identity (hue, 0–360°) from its intensity (saturation) and brightness (lightness). This makes it intuitive to create color variations: decrease lightness to darken, decrease saturation to mute. CSS natively supports HSL with the hsl(217, 91%, 60%) syntax, making it popular for design systems and theme variables.',
  },
  {
    q: 'How do I check color contrast for accessibility?',
    a: 'Enter your foreground color using the main color picker, then enter the background color in the Contrast Checker section. The tool calculates the WCAG contrast ratio and shows pass/fail badges for AA (≥4.5:1 for normal text, ≥3:1 for large text) and AAA (≥7:1 for normal text, ≥4.5:1 for large text) accessibility standards. A live text preview shows how the colors look together.',
  },
  {
    q: 'What is the difference between RGB and CMYK?',
    a: 'RGB (Red, Green, Blue) is an additive color model for screens — colors are created by combining light, with white being the maximum of all three. CMYK (Cyan, Magenta, Yellow, Black) is a subtractive model for print — colors are created by absorbing light via ink, with white being the absence of all inks. The same hex color may look different when printed in CMYK due to gamut limitations.',
  },
  {
    q: 'Is my color data sent to a server?',
    a: 'No. All color conversion, contrast calculation, and recent color history storage runs entirely in your browser using JavaScript math. No color data is ever transmitted to any server. The recent colors history is stored in your browser\'s localStorage under the key "encodedecode-colors" and never leaves your device.',
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
  name: 'Color Converter — HEX, RGB, HSL, CMYK',
  url: 'https://encodedecode.app/color',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Convert Colors Between HEX, RGB, HSL, and CMYK',
  step: [
    { '@type': 'HowToStep', name: 'Pick or enter a color', text: 'Click the color swatch to open the native color picker, or type a value into any of the HEX, RGB, HSL, or CMYK fields.' },
    { '@type': 'HowToStep', name: 'All formats update instantly', text: 'Editing any field updates all other formats and the color swatch in real time. Copy any value with the Copy button.' },
    { '@type': 'HowToStep', name: 'Check contrast', text: 'In the Contrast Checker section, enter a background color to see the WCAG contrast ratio and AA/AAA pass/fail badges.' },
  ],
}

export default function ColorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema).replace(/</g, '\\u003c') }} />

      <h1 className="sr-only">Color Converter — HEX, RGB, HSL, CMYK Online</h1>
      <ColorWrapper />

      <section className="bg-white dark:bg-[#0f172a]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="pb-2"><AdBanner slot="8091011121" /></div>
          <div className="max-w-3xl mx-auto pb-8 pt-4">
            <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 px-6 py-5">
              <h2 className="text-base font-bold text-blue-900 dark:text-blue-300 mb-2">color converter — hex to rgb, hsl, and cmyk in one tool</h2>
              <p className="text-sm text-blue-800 dark:text-blue-400 leading-relaxed">
                This color converter syncs HEX, RGB, HSL, and CMYK formats in real time as you type in any field. Click the
                large color swatch to open the native color picker. The random color generator and recent colors history (stored
                in localStorage) make it easy to explore palettes. The built-in WCAG contrast checker shows AA and AAA
                pass/fail for any foreground/background combination. All color math happens in your browser.
              </p>
            </div>
          </div>
          <div className="max-w-3xl mx-auto pb-10">
            <FAQ questions={faqs} />
          </div>
          <div className="max-w-3xl mx-auto pb-6"><AdBanner slot="8091011122" /></div>
        </div>
      </section>

      <Footer />
    </>
  )
}

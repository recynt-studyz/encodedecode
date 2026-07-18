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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-4 space-y-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How Color Formats Work</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>Digital color exists in multiple formats because different tools, contexts, and output devices use different color models. Web browsers, design software, digital displays, and printing presses each operate differently, and converting between their formats accurately is a routine task in web development and design work.</p>
              <p>HEX (hexadecimal) is the most common color format in web development. A hex code like <code className="font-mono text-xs">#1E3A8A</code> represents three bytes: red (<code className="font-mono text-xs">1E</code> = 30), green (<code className="font-mono text-xs">3A</code> = 58), blue (<code className="font-mono text-xs">8A</code> = 138). Each pair of hex digits ranges from <code className="font-mono text-xs">00</code> (0) to <code className="font-mono text-xs">FF</code> (255), giving 256 possible values per channel and over 16 million possible colors. Modern CSS also supports four-character shorthand (<code className="font-mono text-xs">#RGB</code> expands to <code className="font-mono text-xs">#RRGGBB</code>) and eight-character format (<code className="font-mono text-xs">#RRGGBBAA</code>) with an alpha transparency channel.</p>
              <p>RGB (red, green, blue) is the native model for digital displays. Screens emit light from red, green, and blue subpixels, mixing them additively to produce color. Maximum intensity on all channels (255, 255, 255) produces white; zero on all channels produces black. HSL (hue, saturation, lightness) separates color identity from its properties. Hue is the color angle on a 360-degree wheel (0° = red, 120° = green, 240° = blue). Saturation controls intensity from grey (0%) to vivid (100%). Lightness controls brightness from black (0%) to white (100%). Designers prefer HSL because adjusting one axis does not accidentally affect the others: to lighten a color, increase the lightness value and the hue stays exactly the same.</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">A Worked Example: One Color, Four Formats</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>A brand designer specifies the primary brand color as <code className="font-mono text-xs">#2563EB</code>. The same color is needed in four different formats for four different uses across the project.</p>
              <p>The developer defines it as a CSS custom property using hex: <code className="font-mono text-xs">--color-primary: #2563EB</code>. For a CSS gradient function that requires RGB values: <code className="font-mono text-xs">background: linear-gradient(to right, rgb(37, 99, 235), rgb(79, 70, 229))</code>. The motion designer needs HSL for creating lighter and darker color variants without picking new colors from scratch: the base color is <code className="font-mono text-xs">hsl(217, 91%, 53%)</code> — decreasing lightness to 43% produces a darker pressed state, and increasing to 63% produces a hover state, both perfectly matched in hue and saturation. For a print brochure, the print team needs CMYK values: C=84% M=58% Y=0% K=8%. All four representations describe exactly the same color.</p>
              <p>This tool converts between all four formats instantly as you type in any field. Change the HEX value and RGB, HSL, and CMYK update immediately. Adjust the HSL saturation and all other formats reflect the change. The color swatch updates in real time so you always see the actual color you are working with.</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">WCAG Contrast, Color Gamut, and Modern Color Spaces</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p><strong>WCAG accessibility contrast requirements</strong> specify minimum contrast ratios between foreground and background colors to ensure readability for users with low vision. Normal text requires at least 4.5:1 for AA conformance and 7:1 for AAA. Large text (18pt or larger, or 14pt bold or larger) requires 3:1 for AA and 4.5:1 for AAA. The contrast checker in this tool calculates the luminance of both colors, computes the ratio, and shows clear pass/fail badges for both AA and AAA thresholds. Any production design that must meet accessibility standards — which includes most public-facing web applications — should verify contrast ratios before shipping.</p>
              <p><strong>Color gamut limitations</strong> affect print reproduction. The sRGB color space used by most computer monitors can display colors that CMYK printing cannot reproduce accurately. Bright saturated greens and blues that look vivid on screen often print as duller, less saturated versions. The CMYK values this tool provides are a mathematical approximation — always request a physical print proof or digital soft-proof when precise color matching is required for production print materials.</p>
              <p><strong>Modern color spaces</strong> are gaining adoption in CSS. The <code className="font-mono text-xs">oklch</code> color space (part of CSS Color Level 4) provides perceptually uniform color — equal numeric steps in lightness produce equal perceived brightness differences, which is not true of HSL. This makes oklch ideal for generating accessible, harmonious color palettes programmatically. The <code className="font-mono text-xs">display-p3</code> color space covers a wider gamut than sRGB and is supported on modern Apple displays and many newer monitors, allowing richer, more vivid colors for devices that can display them.</p>
            </div>
          </div>
        </div>
      </section>

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

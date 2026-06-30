import type { Metadata } from 'next'
import AdBanner from '@/components/AdBanner'
import Base64ToImageWrapper from '@/components/Base64ToImageWrapper'
import FAQ, { type FaqItem } from '@/components/FAQ'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Base64 to Image Converter — Free Online Tool',
  description:
    'Convert Base64 strings to images instantly in your browser. Supports PNG, JPEG, GIF and WebP. No upload, no server, completely free.',
  alternates: { canonical: 'https://encodedecode.app/base64-to-image' },
}

const faqs: FaqItem[] = [
  {
    q: 'How do I convert Base64 to an image?',
    a: 'Paste your Base64 string into the input field above. This base64 to image converter automatically detects the image format from the data and renders a live preview. You can then download the image or copy the data URL. Both raw Base64 strings and full data URLs (data:image/png;base64,...) are accepted.',
  },
  {
    q: 'What image formats can be decoded from Base64?',
    a: 'This base64 to image tool supports PNG, JPEG, GIF, WebP, SVG, and BMP. The format is detected automatically from the Base64 data — either from the data URL prefix (data:image/png;base64,...) or from the image magic bytes in the raw data.',
  },
  {
    q: 'How do I use a Base64 image in HTML or CSS?',
    a: 'Use the full data URL format: data:image/png;base64,YOURBASE64STRING. In HTML: <img src="data:image/png;base64,...">. In CSS: background-image: url("data:image/png;base64,..."). The data URL embeds the image directly in the code — no separate file needed.',
  },
  {
    q: 'Why is my Base64 image not displaying?',
    a: 'Common causes: the Base64 string is not image data (it may be encoded text), the string is truncated or missing padding, or it contains whitespace that should be removed. Make sure you\'re pasting the entire Base64 string without line breaks. This tool shows an error message if the data cannot be decoded as an image.',
  },
  {
    q: 'Is my Base64 data sent to a server?',
    a: 'No. This decode base64 image tool runs entirely in your browser. Your Base64 data is never transmitted anywhere. The image rendering happens locally using the browser\'s native image rendering engine. You can verify this by checking the Network tab in DevTools — there are zero outbound requests.',
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
  name: 'Base64 to Image Converter',
  url: 'https://encodedecode.app/base64-to-image',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Convert Base64 to an Image Online',
  step: [
    { '@type': 'HowToStep', name: 'Paste your Base64 string', text: 'Copy your Base64 image data and paste it into the input field. Accepts raw Base64 or full data URL format.' },
    { '@type': 'HowToStep', name: 'Preview the image', text: 'The tool automatically detects the image type and renders a live preview below the input.' },
    { '@type': 'HowToStep', name: 'Download or copy', text: 'Click Download Image to save the file with the correct extension, or Copy Data URL to use it in HTML or CSS.' },
  ],
}

export default function Base64ToImagePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema).replace(/</g, '\\u003c') }} />

      <h1 className="sr-only">Base64 to Image Converter — Free Online Tool</h1>
      <Base64ToImageWrapper />

      <section className="bg-white dark:bg-[#0f172a]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="pb-2"><AdBanner slot="1020304050" /></div>
          <div className="max-w-3xl mx-auto pb-8 pt-4">
            <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 px-6 py-5">
              <h2 className="text-base font-bold text-blue-900 dark:text-blue-300 mb-2">base64 to image — instant, private, no server</h2>
              <p className="text-sm text-blue-800 dark:text-blue-400 leading-relaxed">
                This decode base64 image tool converts Base64 strings directly in your browser. Paste any Base64 image string
                — raw or as a data URL — and get an instant preview. The image never leaves your device. Useful for debugging
                API responses, email attachments, and embedded assets.
              </p>
            </div>
          </div>
          <div className="max-w-3xl mx-auto pb-10">
            <FAQ questions={faqs} />
          </div>
          <div className="max-w-3xl mx-auto pb-6"><AdBanner slot="1020304051" /></div>
        </div>
      </section>

      <Footer />
    </>
  )
}

import type { Metadata } from 'next'
import AdBanner from '@/components/AdBanner'
import ImageToBase64Wrapper from '@/components/ImageToBase64Wrapper'
import FAQ, { type FaqItem } from '@/components/FAQ'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Image to Base64 Converter — Free Online Tool',
  description:
    'Convert images to Base64 strings instantly in your browser. Get raw Base64 or full data URL ready for CSS and HTML. No upload required.',
  alternates: { canonical: 'https://encodedecode.app/image-to-base64' },
}

const faqs: FaqItem[] = [
  {
    q: 'How do I convert an image to Base64?',
    a: 'Drop an image file onto the drop zone or click to browse and select a file. This image to base64 converter instantly reads the file using the browser\'s FileReader API and outputs both the raw Base64 string and the full data URL. No upload is required — the conversion happens entirely in your browser.',
  },
  {
    q: 'What is a Base64 data URL?',
    a: 'A Base64 data URL is a string that encodes an image (or any file) directly into a URL. It has the format: data:image/jpeg;base64,YOURBASE64STRING. This allows images to be embedded directly in HTML, CSS, or JSON without needing a separate file. The data URL includes both the image type and the encoded data.',
  },
  {
    q: 'How do I use a Base64 image in CSS?',
    a: 'Copy the data URL output and use it as the value of the CSS background-image property: background-image: url("data:image/jpeg;base64,..."). This embeds the image directly in the stylesheet. It is best suited for small images like icons, as large base64 data urls increase CSS file size significantly.',
  },
  {
    q: 'Is there a file size limit for image to Base64?',
    a: 'There is no hard limit imposed by this tool — conversion happens in your browser and is limited only by available memory. However, Base64 encoding increases file size by approximately 33%, so a 1 MB image becomes ~1.33 MB of Base64 text. Very large images (over 5 MB) may be slow to display as a data URL.',
  },
  {
    q: 'Is my image uploaded to a server during conversion?',
    a: 'No. This image to base64 converter processes everything locally in your browser using the FileReader API. Your image is never uploaded to any server. You can verify this by opening DevTools → Network tab and dropping an image — there will be zero outbound requests.',
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
  name: 'Image to Base64 Converter',
  url: 'https://encodedecode.app/image-to-base64',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Convert an Image to Base64 Online',
  step: [
    { '@type': 'HowToStep', name: 'Drop or select an image', text: 'Drag and drop any image file onto the drop zone, or click to browse. Supports JPG, PNG, GIF, WebP, SVG, and ICO.' },
    { '@type': 'HowToStep', name: 'Get your Base64 output', text: 'The tool instantly displays the raw Base64 string and the full data URL (data:image/jpeg;base64,...) ready for use.' },
    { '@type': 'HowToStep', name: 'Copy and use', text: 'Copy the raw Base64 or data URL with one click. Use it in HTML img tags, CSS background-image, or anywhere that accepts a base64 data url.' },
  ],
}

export default function ImageToBase64Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema).replace(/</g, '\\u003c') }} />

      <ImageToBase64Wrapper />

      <section className="bg-white dark:bg-[#0f172a]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="pb-2"><AdBanner slot="2030405060" /></div>
          <div className="max-w-3xl mx-auto pb-8 pt-4">
            <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 px-6 py-5">
              <h2 className="text-base font-bold text-blue-900 dark:text-blue-300 mb-2">image to base64 — instant, private conversion</h2>
              <p className="text-sm text-blue-800 dark:text-blue-400 leading-relaxed">
                Convert any image to a base64 data url instantly. Drop your image and immediately get the raw Base64 string
                and the full data:image/...;base64,... format ready for HTML and CSS. Useful for embedding images inline,
                building email templates, or testing API payloads. Files never leave your browser.
              </p>
            </div>
          </div>
          <div className="max-w-3xl mx-auto pb-10">
            <FAQ questions={faqs} />
          </div>
          <div className="max-w-3xl mx-auto pb-6"><AdBanner slot="2030405061" /></div>
        </div>
      </section>

      <Footer />
    </>
  )
}

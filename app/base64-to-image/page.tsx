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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-4 space-y-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How Base64 Image Decoding Works</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>Images embedded as Base64 strings in web applications follow the data URI format specified by RFC 2397: <code className="font-mono text-xs">data:[mediatype];base64,[data]</code>. The media type identifies the image format — <code className="font-mono text-xs">image/png</code>, <code className="font-mono text-xs">image/jpeg</code>, <code className="font-mono text-xs">image/gif</code>, <code className="font-mono text-xs">image/webp</code>, or <code className="font-mono text-xs">image/svg+xml</code>. The browser&apos;s native image rendering engine decodes the Base64 data and displays the image exactly as it would from a standard file URL — but with no additional HTTP request and no dependency on an external server.</p>
              <p>Each image format has a unique binary signature called magic bytes at the beginning of its raw data. After Base64 decoding, these bytes identify the format even when no data URI prefix is present. PNG images begin with the bytes <code className="font-mono text-xs">89 50 4E 47</code>, which Base64-encodes to <code className="font-mono text-xs">iVBOR</code>. JPEG images begin with <code className="font-mono text-xs">FF D8 FF</code>, Base64: <code className="font-mono text-xs">/9j/</code>. GIF images begin with <code className="font-mono text-xs">47 49 46 38</code>, Base64: <code className="font-mono text-xs">R0lGO</code>. WebP images begin with <code className="font-mono text-xs">52 49 46 46</code>, Base64: <code className="font-mono text-xs">UklG</code>. This is how the tool detects image format from raw Base64 strings before rendering them.</p>
              <p>Base64 images appear most commonly in API responses that bundle image data alongside other JSON fields, in HTML email templates where external image URLs are blocked, in CSS for small embedded icons and gradients, and in SVG files that embed raster images internally. They are also used in Content Security Policy (CSP) environments that restrict loading from external URLs.</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">A Worked Example: Verifying an API Response Image</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>A developer is integrating a third-party identity verification API. The API response includes a user&apos;s uploaded ID document as a Base64-encoded JPEG inside a JSON field. Before writing any image display code, she pastes the Base64 string into this tool to visually confirm the API is returning valid image data. The tool instantly renders the JPEG preview — saving the time it would take to write a temporary display component, create a test page, or build decoding logic just to see whether the API response is correct.</p>
              <p>In another case, a developer is debugging an HTML email template. An image displays correctly in the browser preview but shows as a broken icon in Outlook. He extracts the Base64 string from the <code className="font-mono text-xs">img src</code> attribute and pastes it here. The tool confirms the Base64 is valid and renders correctly — but a closer look at the data URI reveals it is using <code className="font-mono text-xs">image/jpg</code> as the MIME type instead of the correct <code className="font-mono text-xs">image/jpeg</code>. Some email clients reject the incorrect MIME type. The fix is a one-character change in the data URI prefix.</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Data URI Limits, Format Support, and SVG Considerations</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p><strong>Data URI size limits</strong> vary by browser and context. Modern browsers support data URIs up to several megabytes in HTML attributes. CSS data URIs over ~32 KB can cause noticeable rendering slowdowns on some browsers. For images larger than 100 KB, a separate file URL with proper caching is almost always more efficient than a data URI — the browser must parse and decode the entire Base64 string on every page load rather than serving a cached file.</p>
              <p><strong>Strip the data URI prefix when working with APIs.</strong> Many APIs and server-side libraries expect raw Base64 without the <code className="font-mono text-xs">data:image/png;base64,</code> prefix. If you receive a data URI and need to pass only the Base64 portion to an API, copy everything after the comma. This is a frequent source of confusion and 400 Bad Request errors when integrating image upload APIs.</p>
              <p><strong>SVG images</strong> can be embedded as Base64 data URIs, but this is rarely the best approach. SVG is text-based XML, so it can also be inlined directly in HTML without any encoding: <code className="font-mono text-xs">{`<img src="data:image/svg+xml,<svg>...</svg>">`}</code> (with URL encoding) or placed directly as an inline <code className="font-mono text-xs">&lt;svg&gt;</code> element in the HTML. Inline SVG without Base64 is smaller, indexable, and styleable with CSS — prefer it over Base64-encoded SVG when the context allows.</p>
            </div>
          </div>
        </div>
      </section>

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

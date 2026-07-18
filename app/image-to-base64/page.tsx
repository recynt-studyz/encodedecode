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

      <h1 className="sr-only">Image to Base64 Converter — Free Online Tool</h1>
      <ImageToBase64Wrapper />

      <section className="bg-white dark:bg-[#0f172a]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-4 space-y-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How Image-to-Base64 Conversion Works</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>The browser&apos;s <code className="font-mono text-xs">FileReader</code> API provides a <code className="font-mono text-xs">readAsDataURL()</code> method that reads any file from the local filesystem and returns a data URI containing the file&apos;s content encoded as Base64. This entire process runs in the browser using JavaScript — no server is involved at any stage, and the image file is never uploaded anywhere. The resulting data URI has the format <code className="font-mono text-xs">data:[mime-type];base64,[base64data]</code>, where the MIME type is determined automatically from the file&apos;s binary signature.</p>
              <p>The <code className="font-mono text-xs">FileReader</code> API reads the raw bytes of the image file and encodes them using the standard Base64 algorithm — every 3 bytes of binary data produces 4 Base64 characters. A 100 KB PNG file produces a data URI of approximately 137 KB. This one-third size overhead is inherent to Base64 encoding and applies to all file types. The raw Base64 string (without the <code className="font-mono text-xs">data:</code> prefix) is also available separately for use with APIs that expect raw Base64 input rather than a full data URI.</p>
              <p>Data URIs allow images to be embedded directly in HTML, CSS, JavaScript, JSON, and XML without any external file dependency. This is particularly useful for HTML email templates where external images are frequently blocked, offline web applications that must function without network access, CSS sprites and icon systems, and REST API payloads that include image data as part of a JSON request body.</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">A Worked Example: Email Template Without External Images</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>A front-end developer is building an HTML email newsletter. Email clients including Outlook 2019 and many corporate mail servers block external image URLs by default, displaying broken image icons in place of any <code className="font-mono text-xs">img</code> tag that loads from an external URL. The designer has provided a 3 KB company logo as a PNG file.</p>
              <p>The developer drops the PNG into this tool and immediately receives the raw Base64 string and the complete data URI. She copies the data URI and pastes it as the <code className="font-mono text-xs">src</code> attribute of the <code className="font-mono text-xs">img</code> tag in the email template. The logo now renders correctly in every email client — including those with external image blocking — because the entire image is part of the email itself. The 4 KB data URI is a small price for guaranteed rendering across clients.</p>
              <p>In another workflow, a mobile app developer is testing an image upload endpoint. Rather than setting up a multipart form upload to test the API, she drops a sample photo into this tool, copies the raw Base64 output, and pastes it into her API testing tool (Postman, Insomnia, or HTTPie) as the request body value. The endpoint receives valid image data and the developer can verify the API&apos;s behavior in seconds, before writing any upload code in the application.</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Size Tradeoffs, Caching, and Blob URL Alternatives</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p><strong>Base64 increases file size by approximately 33%.</strong> A 1 MB image produces roughly 1.33 MB of Base64 text that the browser must parse and decode on every page load. For images larger than 200–300 KB, the size penalty usually outweighs the benefit of embedding. For images used on multiple pages, a standard file URL is always more efficient — the browser caches the file independently and reuses it without re-downloading or re-decoding.</p>
              <p><strong>Data URIs are not cached separately from the HTML document.</strong> A standard image file loaded via URL is cached by the browser and reused across pages and sessions. An image embedded as a data URI is re-parsed every time the HTML document is loaded, because the image data is part of the document itself. This matters most for large data URIs on high-traffic pages.</p>
              <p><strong>Blob URLs</strong> are an alternative to data URIs for large files. Created with <code className="font-mono text-xs">URL.createObjectURL(file)</code>, a blob URL is a temporary in-memory reference to the file&apos;s raw binary data — no Base64 encoding required, no 33% overhead. Blob URLs are ideal for image previews in file upload interfaces where you want to show the selected image before submitting the form. They are revoked when the page unloads or when explicitly released with <code className="font-mono text-xs">URL.revokeObjectURL()</code>.</p>
            </div>
          </div>
        </div>
      </section>

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

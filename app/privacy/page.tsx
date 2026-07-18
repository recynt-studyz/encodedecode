import type { Metadata } from 'next'
import ToolHeader from '@/components/ToolHeader'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy — encodedecode.app',
  description: 'Privacy policy for encodedecode.app. All encoding and decoding happens in your browser. No data is ever transmitted to any server.',
}

export default function PrivacyPage() {
  return (
    <>
      <ToolHeader />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>

        <div className="space-y-8 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-[#e2e8f0] mb-3">No data collection</h2>
            <p className="mb-3">
              encodedecode.app does not collect, store, transmit, or process any of the data you enter into our tools.
              All encoding and decoding operations — Base64, URL, HTML entities, JWT decoding, hash generation, color
              conversion, binary conversion, ROT13, Morse code, cron parsing, and regex matching — happen entirely in
              your browser using native JavaScript APIs. Your data never leaves your device.
            </p>
            <p>
              This applies to every type of input: text strings, file contents, JWT tokens, image files, and any other
              data you bring to these tools. The server that hosts encodedecode.app delivers the page code to your
              browser exactly once. After that, all computation runs locally. The server does not receive your input
              and cannot see what you are encoding, decoding, or hashing.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-[#e2e8f0] mb-3">Technical verification</h2>
            <p>
              You can verify our privacy claims at any time: open your browser&apos;s DevTools (F12 or Cmd+Option+I),
              go to the Network tab, and use any tool on this site. You will see zero outbound requests triggered by
              encoding or decoding operations. The processing is performed by the JavaScript running in your browser
              tab, using these native APIs:
            </p>
            <ul className="mt-3 space-y-1 list-disc list-inside font-mono text-xs text-gray-500 dark:text-gray-500">
              <li>Base64: btoa(), atob(), TextEncoder, FileReader</li>
              <li>URL: encodeURIComponent(), decodeURIComponent()</li>
              <li>HTML entities: manual character mapping</li>
              <li>JWT: manual Base64URL decoding, JSON.parse()</li>
              <li>Hashing: window.crypto.subtle.digest() + pure-JS MD5</li>
              <li>Images: FileReader.readAsDataURL(), native img rendering</li>
              <li>Binary/Hex: TextEncoder, manual bit manipulation</li>
              <li>Color: pure JavaScript math, no third-party library</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-[#e2e8f0] mb-3">A note on the JWT decoder</h2>
            <p>
              The JWT decoder on this site reads and displays the contents of JSON Web Tokens. It decodes the
              Base64URL-encoded header and payload and shows the claims in a readable format. It does not validate
              the token signature. Signature validation requires the secret key or public key, which this tool never
              receives. This means the tool is safe to use with real tokens — no key material is exposed and no
              token data is transmitted. The decoded payload is displayed only in your browser.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-[#e2e8f0] mb-3">Analytics</h2>
            <p>
              We use Google Analytics 4 to collect anonymous page view data — which pages are visited, approximate
              geographic region, and general device type (desktop vs mobile). Google Analytics does not receive the
              content you enter into any tool. It tracks page visits, not tool usage data. You can opt out of Google
              Analytics tracking using the{' '}
              <a href="https://tools.google.com/dlpage/gaoptout" className="text-[#2563EB] hover:underline">
                Google Analytics Opt-out Browser Add-on
              </a>
              {' '}or by enabling Do Not Track in your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-[#e2e8f0] mb-3">Advertising</h2>
            <p>
              encodedecode.app is free and supported by advertising. We use Google AdSense to display advertisements.
              Google AdSense may use cookies to serve ads relevant to your interests based on your prior visits to
              this and other websites. This is standard interest-based advertising behavior. We do not control which
              specific ads are shown. You can opt out of personalized advertising by visiting{' '}
              <a href="https://www.google.com/settings/ads" className="text-[#2563EB] hover:underline">
                Google Ad Settings
              </a>
              {' '}or by using the AdChoices opt-out. Opting out of personalized ads does not remove ads — it causes
              generic, non-personalized ads to be shown instead.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-[#e2e8f0] mb-3">Local storage</h2>
            <p>
              We store a small number of preferences in your browser&apos;s <code className="font-mono text-xs">localStorage</code>.
              Your dark/light mode preference is stored under the key <code className="font-mono text-xs">encodedecode-theme</code>.
              The color converter stores recently used colors under <code className="font-mono text-xs">encodedecode-colors</code>.
              These values exist only in your browser and are never transmitted to any server. You can clear them
              at any time by clearing your browser&apos;s local storage for this site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-[#e2e8f0] mb-3">GDPR and CCPA</h2>
            <p>
              Because encodedecode.app does not collect personal data through its tools, the primary data processing
              disclosures relevant to GDPR (EU) and CCPA (California) relate to Google Analytics and Google AdSense,
              both of which are governed by Google&apos;s own privacy policy and data processing terms. No account is
              required to use this site. No personally identifiable information is collected by encodedecode.app
              itself. No data entered into any tool is retained after your browser session ends.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-[#e2e8f0] mb-3">Contact</h2>
            <p>
              If you have questions about this privacy policy or the data practices described here, please use the
              Contact link in the footer. We will respond to privacy inquiries as promptly as possible.
            </p>
          </section>

          <p className="text-xs text-gray-400 dark:text-gray-600 pt-4 border-t border-gray-100 dark:border-gray-800">
            Last updated: June 2026
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}

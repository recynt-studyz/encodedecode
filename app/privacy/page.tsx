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
            <p>
              encodedecode.app does not collect, store, transmit, or process any of the data you enter into our tools.
              All encoding and decoding operations — Base64, URL, HTML entities, JWT decoding, and hash generation —
              happen entirely in your browser using native JavaScript APIs.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-[#e2e8f0] mb-3">Technical verification</h2>
            <p>
              You can verify our privacy claims yourself: open your browser&apos;s DevTools (F12), go to the Network
              tab, and use any tool on this site. You will see zero outbound requests triggered by encoding or decoding
              operations. The processing is performed by the JavaScript running in your browser tab, using these native APIs:
            </p>
            <ul className="mt-3 space-y-1 list-disc list-inside font-mono text-xs text-gray-500 dark:text-gray-500">
              <li>Base64: btoa(), atob(), TextEncoder</li>
              <li>URL: encodeURIComponent(), decodeURIComponent()</li>
              <li>HTML entities: manual character replacement</li>
              <li>JWT: manual Base64URL decoding, JSON.parse()</li>
              <li>Hashing: window.crypto.subtle.digest() + pure-JS MD5</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-[#e2e8f0] mb-3">Advertising</h2>
            <p>
              encodedecode.app is free and ad-supported. We use Google AdSense to display advertisements.
              Google AdSense may use cookies to serve ads based on your prior visits to this and other websites.
              You can opt out of personalized advertising by visiting{' '}
              <a href="https://www.google.com/settings/ads" className="text-[#2563EB] hover:underline">
                Google Ad Settings
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-[#e2e8f0] mb-3">Local storage</h2>
            <p>
              We store your dark/light mode preference in your browser&apos;s <code className="font-mono text-xs">localStorage</code>{' '}
              under the key <code className="font-mono text-xs">encodedecode-theme</code>. This data never leaves your device.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-[#e2e8f0] mb-3">Contact</h2>
            <p>
              If you have any questions about this privacy policy, please contact us. Use the Contact link in the footer.
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

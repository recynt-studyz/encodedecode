import type { Metadata } from 'next'
import ToolHeader from '@/components/ToolHeader'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'About — encodedecode.app',
  description: 'About encodedecode.app — free developer encoding and decoding tools built for speed, privacy, and simplicity.',
}

export default function AboutPage() {
  return (
    <>
      <ToolHeader />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 flex-1">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">About encodedecode.app</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-10">
          Free developer encoding &amp; decoding tools. No signup, no upload, no limits.
        </p>

        <div className="space-y-8 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-[#e2e8f0] mb-3">What is encodedecode.app?</h2>
            <p>
              encodedecode.app is a collection of free developer tools for encoding and decoding data. All tools are
              instant, private, and run entirely in your browser. There is no server processing your data — ever.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-[#e2e8f0] mb-3">Tools available</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {[
                { href: '/', name: 'Base64 Encode / Decode', desc: 'Encode text and files to Base64, decode Base64 strings, image preview' },
                { href: '/url', name: 'URL Encode / Decode', desc: 'Percent-encode URL components, decode encoded URLs' },
                { href: '/html', name: 'HTML Encode / Decode', desc: 'Convert HTML special characters to entities and back' },
                { href: '/jwt', name: 'JWT Decoder', desc: 'Decode JSON Web Tokens, inspect claims, check expiry' },
                { href: '/hash', name: 'Hash Generator', desc: 'Generate MD5, SHA-1, SHA-256, SHA-512 from text or files' },
              ].map((tool) => (
                <a
                  key={tool.href}
                  href={tool.href}
                  className="group block rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1e293b] p-4 hover:border-[#2563EB] dark:hover:border-blue-600 transition"
                >
                  <div className="font-medium text-gray-800 dark:text-[#e2e8f0] group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition mb-1">
                    {tool.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">{tool.desc}</div>
                </a>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-[#e2e8f0] mb-3">Privacy first</h2>
            <p>
              Every tool on encodedecode.app processes data exclusively in your browser. We use only native browser APIs:
              <code className="mx-1 font-mono text-xs">btoa()</code>,
              <code className="mx-1 font-mono text-xs">atob()</code>,
              <code className="mx-1 font-mono text-xs">encodeURIComponent()</code>,
              <code className="mx-1 font-mono text-xs">crypto.subtle</code>,
              and the <code className="mx-1 font-mono text-xs">FileReader</code> API.
              No data is ever transmitted to any server.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-[#e2e8f0] mb-3">Built for developers</h2>
            <p>
              This site is built by developers, for developers. The goal is a tool you can bookmark and use every day
              without friction — no popups, no account requirements, no file size limits. Just fast, private encoding
              and decoding that works.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

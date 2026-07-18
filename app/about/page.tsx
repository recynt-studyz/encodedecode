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
              encodedecode.app is a collection of free developer tools for encoding, decoding, and converting data.
              All tools are instant, private, and run entirely in your browser. There is no server processing your
              data — ever. Whether you are decoding a JWT during API debugging, verifying a file checksum, or
              converting a hex color for a CSS variable, the goal is to give you the answer in under five seconds
              with zero friction.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-[#e2e8f0] mb-3">Why we built it</h2>
            <p className="mb-3">
              Developer tools on the web have a persistent problem: they are often slow, cluttered with ads, require
              accounts, or silently send your data to a remote server. Pasting a JWT containing user data into a
              random online decoder is a real security risk. Uploading a sensitive file to an online Base64 converter
              is a data leak waiting to happen.
            </p>
            <p>
              encodedecode.app was built with a single constraint: every operation must run entirely in the browser
              using only native APIs. No npm encoding libraries, no server-side processing, no data collection. You
              can open DevTools, switch to the Network tab, and use any tool on this site — you will see zero
              outbound requests triggered by the encoding or decoding operation itself.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-[#e2e8f0] mb-3">Who uses these tools</h2>
            <p className="mb-3">
              <strong className="font-medium text-gray-800 dark:text-[#e2e8f0]">Web and backend developers</strong> use
              the Base64, URL, HTML, JWT, and Hash tools daily during API integration, debugging, and security testing.
              Decoding a JWT to check claims and expiry, percent-encoding a query parameter, or generating a SHA-256
              checksum are tasks that come up constantly in development workflows.
            </p>
            <p className="mb-3">
              <strong className="font-medium text-gray-800 dark:text-[#e2e8f0]">DevOps and sysadmins</strong> use
              the Cron expression generator to build and verify scheduled job syntax before deploying to production,
              and the Binary &amp; Hex converter for reading protocol dumps and memory addresses.
            </p>
            <p className="mb-3">
              <strong className="font-medium text-gray-800 dark:text-[#e2e8f0]">Designers and front-end engineers</strong>
              {' '}use the Color converter to translate between HEX, RGB, HSL, and CMYK formats and to verify
              accessibility contrast ratios against WCAG standards.
            </p>
            <p>
              <strong className="font-medium text-gray-800 dark:text-[#e2e8f0]">Students learning web development</strong>
              {' '}use the tools to understand how encoding systems work in practice — seeing &ldquo;Hello&rdquo; become
              &ldquo;SGVsbG8=&rdquo; in Base64, or watching a cron expression parse into a plain-English schedule,
              makes abstract concepts immediately concrete.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-[#e2e8f0] mb-3">Tools available</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {[
                { href: '/', name: 'Base64 Encode / Decode', desc: 'Encode text and files to Base64, decode Base64 strings, URL-safe variant, image preview' },
                { href: '/url', name: 'URL Encode / Decode', desc: 'Percent-encode URL components and full URLs, decode percent-encoded strings' },
                { href: '/html', name: 'HTML Encode / Decode', desc: 'Convert HTML special characters to entities — basic, extended, and numeric modes' },
                { href: '/jwt', name: 'JWT Decoder', desc: 'Decode JSON Web Tokens, inspect all claims, check expiry with human-readable timestamps' },
                { href: '/hash', name: 'Hash Generator', desc: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text or files' },
                { href: '/base64-to-image', name: 'Base64 to Image', desc: 'Render Base64 strings as images with instant preview and format detection' },
                { href: '/image-to-base64', name: 'Image to Base64', desc: 'Convert image files to Base64 data URIs for HTML, CSS, and API use' },
                { href: '/binary', name: 'Binary & Hex', desc: 'Convert text to binary and hexadecimal and back, with auto-format detection' },
                { href: '/rot13', name: 'ROT13 / Caesar', desc: 'Apply ROT13 or any Caesar cipher shift with live letter mapping' },
                { href: '/morse', name: 'Morse Code', desc: 'Translate text to Morse code and back, with audio playback at adjustable speed' },
                { href: '/cron', name: 'Cron Expression', desc: 'Build and decode cron expressions with plain-English descriptions and next run times' },
                { href: '/regex', name: 'Regex Tester', desc: 'Test regular expressions with live highlighting, match list, and capture group display' },
                { href: '/color', name: 'Color Converter', desc: 'Convert between HEX, RGB, HSL, and CMYK with WCAG contrast checker' },
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
            <p className="mb-3">
              Every tool on encodedecode.app processes data exclusively in your browser using only native APIs:
              <code className="mx-1 font-mono text-xs">btoa()</code>,
              <code className="mx-1 font-mono text-xs">atob()</code>,
              <code className="mx-1 font-mono text-xs">encodeURIComponent()</code>,
              <code className="mx-1 font-mono text-xs">window.crypto.subtle</code>,
              and the <code className="mx-1 font-mono text-xs">FileReader</code> API.
              No data is ever transmitted to any server. No encoding library npm packages.
            </p>
            <p>
              This matters most for sensitive data. A JWT token contains user identity information. A file being
              hashed may be confidential. A Base64 string may encode an API key or private certificate. With
              encodedecode.app, none of that data leaves your machine. You can verify this yourself at any time
              by opening DevTools → Network tab and using any tool — you will see zero outbound requests.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-[#e2e8f0] mb-3">Built for developers</h2>
            <p>
              This site is built by developers, for developers. The goal is a tool you can bookmark and reach for
              every day without friction — no popups, no account requirements, no upload limits, no waiting for
              server responses. Every tool is instant because all computation happens locally in your browser. The
              dark mode respects your system preference and persists in localStorage. The URL for each tool is clean
              and memorable. Everything is designed to get out of your way and give you the answer.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

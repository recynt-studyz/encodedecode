import type { Metadata } from 'next'
import AdBanner from '@/components/AdBanner'
import HashWrapper from '@/components/HashWrapper'
import FAQ, { type FaqItem } from '@/components/FAQ'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Hash Generator — MD5, SHA-1, SHA-256, SHA-512',
  description:
    'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text or files instantly in your browser. Free online hash generator, no signup required.',
  alternates: { canonical: 'https://encodedecode.app/hash' },
}

const faqs: FaqItem[] = [
  {
    q: 'What is a hash function?',
    a: 'A hash function takes input data of any size and produces a fixed-size output called a hash or digest. Hash functions are deterministic (same input always produces same output), fast to compute, and designed so that small changes in input produce completely different outputs. They are used in checksums, password storage, digital signatures, and data integrity verification.',
  },
  {
    q: 'What is the difference between MD5 and SHA-256?',
    a: 'MD5 produces a 128-bit (32 hex character) hash and is very fast, but is cryptographically broken — it is vulnerable to collision attacks and should not be used for security purposes. SHA-256 produces a 256-bit (64 hex character) hash and is cryptographically secure. Use SHA-256 for any security-sensitive application. MD5 is still useful for checksums where collision resistance is not required.',
  },
  {
    q: 'Can I reverse a hash?',
    a: 'No. Hash functions are one-way functions — given a hash output, it is computationally infeasible to reconstruct the original input. This property is called pre-image resistance. While dictionary attacks and rainbow tables can sometimes reverse weak passwords, a properly generated hash of sufficient-length random input cannot be reversed.',
  },
  {
    q: 'How do I hash a file online?',
    a: 'Click "Hash a file" or drag and drop any file onto the input area. The tool reads the file using the FileReader API in your browser and computes MD5, SHA-1, SHA-256, and SHA-512 hashes simultaneously. The file is never uploaded — all hashing happens locally. This is useful for verifying file integrity by comparing hashes.',
  },
  {
    q: 'Is SHA-256 safe to use in 2026?',
    a: 'Yes. SHA-256 is part of the SHA-2 family and remains cryptographically secure as of 2026. It is widely used in TLS/SSL certificates, Bitcoin, and many security protocols. For password hashing specifically, use a dedicated password hashing function like bcrypt, scrypt, or Argon2 instead, as they are designed to be slow and resist brute-force attacks.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Hash Generator — MD5, SHA-1, SHA-256, SHA-512',
  url: 'https://encodedecode.app/hash',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Generate a Hash Online',
  step: [
    { '@type': 'HowToStep', name: 'Enter text or upload a file', text: 'Type or paste text into the input field, or click "Hash a file" to select a file. You can also drag and drop a file.' },
    { '@type': 'HowToStep', name: 'View all hashes instantly', text: 'MD5, SHA-1, SHA-256, and SHA-512 hashes are computed and displayed simultaneously as you type.' },
    { '@type': 'HowToStep', name: 'Copy the hash you need', text: 'Click the Copy button next to any hash value to copy it to your clipboard.' },
  ],
}

export default function HashPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema).replace(/</g, '\\u003c') }} />

      <h1 className="sr-only">Hash Generator — MD5, SHA-1, SHA-256, SHA-512 Online</h1>
      <HashWrapper />

      <section className="bg-white dark:bg-[#0f172a]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="pb-2">
            <AdBanner slot="9999999999" />
          </div>
          <div className="max-w-3xl mx-auto pb-8 pt-4">
            <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 px-6 py-5">
              <h2 className="text-base font-bold text-blue-900 dark:text-blue-300 mb-2">md5 sha256 hash generator — instant, client-side</h2>
              <p className="text-sm text-blue-800 dark:text-blue-400 leading-relaxed">
                This online hash generator computes MD5, SHA-1, SHA-256, and SHA-512 hashes instantly as you type. MD5 uses a
                pure-JavaScript implementation; SHA hashes use the native Web Crypto API. Drop any file to hash it — no upload,
                no server. All hashing runs entirely in your browser.
              </p>
            </div>
          </div>
          <div className="max-w-3xl mx-auto pb-10">
            <FAQ questions={faqs} />
          </div>
          <div className="max-w-3xl mx-auto pb-6">
            <AdBanner slot="0000000001" />
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-4 space-y-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How Hash Functions Work</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>A cryptographic hash function takes input data of any size and produces a fixed-length output called a digest or hash. Hash functions have three essential properties. First, they are deterministic: the same input always produces the same output. Second, they are one-way: given a hash, it is computationally infeasible to reconstruct the original input. Third, they exhibit the avalanche effect: a single bit change in the input produces a completely different hash, making it impossible to infer anything about the input by comparing two hashes.</p>
              <p>MD5 produces a 128-bit (32 hex character) hash and was once widely used for security purposes. It is now cryptographically broken — researchers have demonstrated practical MD5 collision attacks where two different inputs produce the same hash. MD5 remains useful for non-security purposes like file deduplication and checksums, but must not be used for passwords, digital signatures, or any security-sensitive application. SHA-1 (160-bit, 40 hex characters) was deprecated for security use after the 2017 SHAttered collision attack.</p>
              <p>SHA-256 (256-bit, 64 hex characters), part of the SHA-2 family, is the current standard for security-sensitive hashing. SHA-512 (512-bit, 128 hex characters) offers a larger safety margin for long-term security needs. Both use the native Web Crypto API in this tool, which provides hardware-accelerated computation where supported. Common use cases include file integrity verification, digital signatures, password storage (with proper salting), and data fingerprinting.</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">A Worked Example: File Integrity and Password Storage</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>A developer publishes a software release and wants to let users verify the download has not been tampered with. She computes the SHA-256 hash of the installer file and publishes it alongside the download link. Users download the file, compute its SHA-256 hash locally, and compare. If the hashes match exactly — all 64 hex characters — the file is authentic and unmodified. If even a single byte was changed by a malicious actor or corrupted during download, the hash would be completely different. This is how Linux distributions, package managers, and security-conscious software projects publish checksums.</p>
              <p>For password storage, the same one-way property is critical. When a user creates an account with a password, the server computes its hash and stores only the hash — never the plain text. When the user logs in, the server hashes the submitted password and compares to the stored hash. Even if an attacker steals the database, they have hashes, not passwords. To illustrate the avalanche effect: hash <em>password123</em> and <em>password124</em> — the SHA-256 outputs share no visible similarity despite differing by one character. This makes it impossible to guess partial passwords from partial hash matches.</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Salting, Rainbow Tables, and Password Hashing Functions</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p><strong>Rainbow tables</strong> are precomputed dictionaries that map common passwords to their hashes. An attacker with a stolen database of plain SHA-256 password hashes can look up each hash in a rainbow table and recover the password in milliseconds — no brute-force required. Salting defeats this: a unique random value (the salt) is appended to each password before hashing, so the same password hashes differently for each user, invalidating any precomputed table.</p>
              <p><strong>Dedicated password hashing functions</strong> — bcrypt, scrypt, and Argon2 — are specifically designed for password storage and should be used instead of general-purpose hash functions like SHA-256. They are intentionally slow and memory-intensive, making brute-force attacks expensive. A single bcrypt hash may take 100 milliseconds to compute. SHA-256 on a GPU can compute billions of hashes per second; bcrypt reduces that to thousands. The computational cost is configurable via a work factor that can be increased as hardware improves.</p>
              <p><strong>HMAC</strong> (Hash-based Message Authentication Code) combines a hash function with a shared secret key to authenticate messages. HMAC-SHA256 is how JWT tokens signed with the HS256 algorithm are created — the signature proves both that the payload was not altered and that it was created by someone with the secret key. File download verification, API request signing, and webhook payload validation all commonly use HMAC.</p>
            </div>
          </div>
        </div>
      </section>

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

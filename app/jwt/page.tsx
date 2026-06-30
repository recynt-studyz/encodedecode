import type { Metadata } from 'next'
import AdBanner from '@/components/AdBanner'
import JwtWrapper from '@/components/JwtWrapper'
import FAQ, { type FaqItem } from '@/components/FAQ'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'JWT Decoder — Decode JSON Web Tokens Online',
  description:
    'Decode and inspect JWT tokens instantly in your browser. View header, payload, and expiry. Your token never leaves your device. Free JWT decoder online.',
  alternates: { canonical: 'https://encodedecode.app/jwt' },
}

const faqs: FaqItem[] = [
  {
    q: 'What is a JWT token?',
    a: 'A JSON Web Token (JWT) is a compact, URL-safe token format for securely transmitting information between parties as a JSON object. A JWT consists of three Base64URL-encoded parts separated by dots: a Header (algorithm and token type), a Payload (claims/data), and a Signature. JWTs are widely used for authentication and authorization in web APIs.',
  },
  {
    q: 'How do I decode a JWT without a library?',
    a: 'A JWT has three parts separated by dots. Split the token on ".", then Base64URL-decode each part. The header and payload are JSON strings that can be parsed with JSON.parse(). The signature is raw binary data. This jwt decoder does exactly that — no library required. All decoding runs natively in your browser.',
  },
  {
    q: 'Is it safe to decode a JWT online?',
    a: 'This jwt decoder is completely safe to use. Your token is decoded entirely in your browser using native JavaScript — it is never sent to any server. You can verify this by opening DevTools → Network tab while decoding: there are zero outbound requests. The tool performs only decoding, not verification.',
  },
  {
    q: 'What is the difference between JWT decoding and verification?',
    a: 'Decoding a JWT simply reads the Base64URL-encoded data inside the token. Anyone can decode a JWT without the secret key. Verification checks the cryptographic signature to confirm that the token was issued by a trusted party and has not been tampered with. Verification requires the secret key or public key. This tool decodes only — it does not verify signatures.',
  },
  {
    q: 'What does the exp claim in a JWT mean?',
    a: 'The exp (expiration time) claim specifies the Unix timestamp after which the JWT must not be accepted. This jwt decoder automatically detects the exp claim and shows whether the token is currently valid or has expired, along with the human-readable expiration date and time remaining or time since expiry.',
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
  name: 'JWT Decoder',
  url: 'https://encodedecode.app/jwt',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Decode a JWT Token Online',
  step: [
    { '@type': 'HowToStep', name: 'Paste your JWT', text: 'Paste your JSON web token (starting with eyJ) into the input field.' },
    { '@type': 'HowToStep', name: 'View decoded parts', text: 'The header, payload, and signature are decoded and displayed instantly in separate cards with syntax highlighting.' },
    { '@type': 'HowToStep', name: 'Check expiry', text: 'If the token has an exp claim, the tool shows whether the token is valid or expired, with a human-readable date.' },
  ],
}

export default function JwtPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema).replace(/</g, '\\u003c') }} />

      <h1 className="sr-only">JWT Decoder — Decode JSON Web Tokens Online</h1>
      <JwtWrapper />

      <section className="bg-white dark:bg-[#0f172a]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="pb-2">
            <AdBanner slot="7777777777" />
          </div>
          <div className="max-w-3xl mx-auto pb-8 pt-4">
            <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 px-6 py-5">
              <h2 className="text-base font-bold text-blue-900 dark:text-blue-300 mb-2">jwt decoder online — inspect tokens instantly</h2>
              <p className="text-sm text-blue-800 dark:text-blue-400 leading-relaxed">
                This jwt decoder online tool decodes JSON Web Tokens directly in your browser. Paste any JWT starting with
                <code className="font-mono text-xs"> eyJ</code> to see the decoded header, payload, and expiry status. Timestamps
                for <code className="font-mono text-xs">iat</code>, <code className="font-mono text-xs">exp</code>, and{' '}
                <code className="font-mono text-xs">nbf</code> are shown in human-readable format. Your token never leaves your
                device — zero outbound requests.
              </p>
            </div>
          </div>
          <div className="max-w-3xl mx-auto pb-10">
            <FAQ questions={faqs} />
          </div>
          <div className="max-w-3xl mx-auto pb-6">
            <AdBanner slot="8888888888" />
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

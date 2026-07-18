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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-4 space-y-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How JSON Web Tokens Work</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>A JSON Web Token (JWT) is a compact, URL-safe token format defined by RFC 7519. Every JWT consists of three Base64URL-encoded sections separated by dots: <code className="font-mono text-xs">header.payload.signature</code>. The header specifies the token type and signing algorithm. The payload contains claims — structured assertions about the token subject and any application-specific data. The signature is a cryptographic hash of the header and payload that allows servers to verify the token has not been tampered with.</p>
              <p>The header typically contains two fields: <code className="font-mono text-xs">alg</code> (the signing algorithm, such as <code className="font-mono text-xs">HS256</code> for HMAC-SHA256 or <code className="font-mono text-xs">RS256</code> for RSA-SHA256) and <code className="font-mono text-xs">typ</code> (always <code className="font-mono text-xs">JWT</code>). The payload contains registered claims — standardized fields including <code className="font-mono text-xs">sub</code> (subject, usually a user ID), <code className="font-mono text-xs">iat</code> (issued at, a Unix timestamp), <code className="font-mono text-xs">exp</code> (expiration time), and <code className="font-mono text-xs">nbf</code> (not before) — plus any custom claims the application adds, such as roles, permissions, or feature flags.</p>
              <p>JWTs are popular for API authentication because they are stateless: the server does not need to maintain a session database. The client stores the JWT (typically in an HTTP-only cookie or localStorage) and sends it with every request in the <code className="font-mono text-xs">Authorization: Bearer [token]</code> header. The server validates the signature using its secret or public key, reads the claims, and processes the request — no database lookup required.</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">A Worked Example: Decoding a Real JWT</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>After a successful login, an API returns a JWT. Paste it into the decoder above and the three sections are immediately visible. The decoded header reveals the algorithm and token type. The decoded payload reveals the claims the API embedded: a user ID in <code className="font-mono text-xs">sub</code>, the user&apos;s display name and role as custom claims, the timestamp the token was issued in <code className="font-mono text-xs">iat</code>, and the expiration timestamp in <code className="font-mono text-xs">exp</code>.</p>
              <p>The <code className="font-mono text-xs">iat</code> and <code className="font-mono text-xs">exp</code> fields contain Unix timestamps — seconds since January 1, 1970 UTC. The decoder automatically converts these to human-readable dates and calculates whether the token is currently valid or has expired, and how long remains until expiry. This is immediately useful during API integration: you can confirm the token grants the expected role, check whether the expiration window matches your application&apos;s session requirements, and verify the issued-at time aligns with when the login occurred.</p>
              <p>A developer integrating a third-party OAuth provider uses this tool to quickly inspect access tokens during development, without writing any decoding code. When the API starts returning 401 Unauthorized errors, decoding the token immediately reveals whether it has expired — saving time that would otherwise be spent adding debug logging to the application.</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Security Considerations: What JWTs Are and Are Not</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p><strong>JWT payloads are encoded, not encrypted.</strong> Base64URL decoding is not a security measure — anyone who possesses the token can read the payload. Never include sensitive data (passwords, credit card numbers, social security numbers, or private personal identifiers) in a JWT payload. If the payload must be confidential, use JWE (JSON Web Encryption, RFC 7516) instead.</p>
              <p><strong>Algorithm confusion attacks</strong> are a real threat. An attacker might modify the header&apos;s <code className="font-mono text-xs">alg</code> field from <code className="font-mono text-xs">RS256</code> (asymmetric RSA signing) to <code className="font-mono text-xs">HS256</code> (symmetric HMAC) and forge a token using the server&apos;s public key as the HMAC secret. Server-side JWT libraries must always enforce the expected algorithm and never trust the algorithm declared in the token header alone.</p>
              <p><strong>Short expiration is a best practice.</strong> Access tokens should expire in 15 minutes to 1 hour. A stolen token is valid until it expires — a short window limits the damage. Pair short-lived access tokens with a longer-lived refresh token (stored securely, validated server-side) to maintain sessions without requiring frequent re-login. Never set <code className="font-mono text-xs">exp</code> years in the future for tokens that grant sensitive access.</p>
            </div>
          </div>
        </div>
      </section>

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

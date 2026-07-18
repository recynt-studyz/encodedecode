import type { Metadata } from 'next'
import AdBanner from '@/components/AdBanner'
import BinaryWrapper from '@/components/BinaryWrapper'
import FAQ, { type FaqItem } from '@/components/FAQ'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Binary & Hex Converter — Text to Binary Online',
  description:
    'Convert text to binary and hexadecimal instantly. Real-time binary to text and hex to text converter. Free online binary converter, no signup.',
  alternates: { canonical: 'https://encodedecode.app/binary' },
}

const faqs: FaqItem[] = [
  {
    q: 'How do I convert text to binary?',
    a: 'Select "Text → Binary / Hex" mode and type or paste your text. The binary converter instantly shows the binary representation of each character as space-separated 8-bit groups. For example, "Hello" becomes "01001000 01100101 01101100 01101100 01101111". Each character is converted to its UTF-8 byte value, then to 8-bit binary.',
  },
  {
    q: 'What is binary code?',
    a: 'Binary code is a number system using only two digits: 0 and 1. Computers use binary because digital circuits have two states: on (1) and off (0). Text is represented in binary by first converting each character to a number (using a standard like UTF-8 or ASCII), then representing that number in base-2. The letter "A" is 65 in decimal, which is 01000001 in 8-bit binary.',
  },
  {
    q: 'How do I convert binary back to text?',
    a: 'Select "Binary / Hex → Text" mode and paste your binary code. Input should be space-separated 8-bit groups (e.g. "01001000 01100101"). The tool automatically detects binary format and converts each 8-bit group back to the corresponding character. Non-standard binary (not 8-bit groups) may not decode correctly.',
  },
  {
    q: 'What is the difference between binary and hexadecimal?',
    a: 'Binary (base-2) uses digits 0 and 1. Hexadecimal (base-16) uses digits 0–9 and letters A–F. Both can represent the same data — hex is more compact: one hex digit represents 4 binary digits, and two hex digits represent one byte (8 bits). The letter "H" is 01001000 in binary and 48 in hex. Programmers often prefer hex for readability.',
  },
  {
    q: 'How do I convert text to hexadecimal?',
    a: 'Use the same "Text → Binary / Hex" mode — the hex output is shown alongside the binary output. Each character becomes two hexadecimal digits representing its UTF-8 byte value. "Hello" becomes "48 65 6C 6C 6F" in hex (uppercase) or "48 65 6c 6c 6f" (lowercase). Use the toggle to switch between uppercase and lowercase hex.',
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
  name: 'Binary & Hex Converter',
  url: 'https://encodedecode.app/binary',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Convert Text to Binary Online',
  step: [
    { '@type': 'HowToStep', name: 'Select mode', text: 'Choose "Text → Binary / Hex" to convert text, or "Binary / Hex → Text" to decode binary or hex back to text.' },
    { '@type': 'HowToStep', name: 'Enter your text', text: 'Type or paste your text. The binary and hex outputs update instantly as you type.' },
    { '@type': 'HowToStep', name: 'Copy the result', text: 'Click Copy next to the Binary or Hex output to copy the result to your clipboard.' },
  ],
}

export default function BinaryPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema).replace(/</g, '\\u003c') }} />

      <h1 className="sr-only">Binary &amp; Hex Converter — Text to Binary Online</h1>
      <BinaryWrapper />

      <section className="bg-white dark:bg-[#0f172a]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-4 space-y-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How Binary and Hexadecimal Work</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>All data in a computer is ultimately stored and processed as binary — sequences of 0s and 1s representing the two states of digital circuits. A single binary digit is a bit. Eight bits form a byte, which can represent 256 different values (0 through 255). Most text and data standards organize information at the byte level, and understanding how bytes map to characters is fundamental to working with network protocols, file formats, encoding systems, and low-level APIs.</p>
              <p>Hexadecimal (base-16) uses digits 0–9 and letters A–F to represent values 0 through 15. One hex digit represents exactly 4 bits (a nibble), and two hex digits represent one full byte. This makes hex a compact and readable representation of binary data — the byte value <code className="font-mono text-xs">10001010</code> in binary is simply <code className="font-mono text-xs">8A</code> in hex. Developers use hexadecimal far more than raw binary for reading memory dumps, color codes, MAC addresses, cryptographic hashes, and file format magic bytes — hex is four times more compact than binary while maintaining a direct one-to-one correspondence with each bit.</p>
              <p>Text encoding maps characters to byte values. In ASCII, the letter A is byte 65 (decimal), <code className="font-mono text-xs">01000001</code> (binary), or <code className="font-mono text-xs">41</code> (hex). UTF-8 extends ASCII to cover all Unicode characters: ASCII characters use one byte, Latin-extended characters use two bytes, and characters from other writing systems use two to four bytes. When you convert text to binary or hex in this tool, you are seeing the UTF-8 byte representation of each character.</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">A Worked Example: Colors, Protocols, and Text</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>A developer working with WebGL shaders needs to perform bitwise operations on color channels. The design file specifies the brand color as <code className="font-mono text-xs">#1E3A8A</code>. Converting to binary: the red channel is <code className="font-mono text-xs">0x1E</code> = <code className="font-mono text-xs">00011110</code> (decimal 30), the green channel is <code className="font-mono text-xs">0x3A</code> = <code className="font-mono text-xs">00111010</code> (decimal 58), and the blue channel is <code className="font-mono text-xs">0x8A</code> = <code className="font-mono text-xs">10001010</code> (decimal 138). The most significant bit of the blue channel is set (value ≥ 128), which affects how certain bitwise blending operations behave in the shader.</p>
              <p>In another case, a developer debugging a binary network protocol receives a packet header. The first five bytes in hex are <code className="font-mono text-xs">48 65 6C 6C 6F</code>. Converting these to ASCII text reveals the string <em>Hello</em> — the protocol&apos;s magic identifier confirming a valid packet header. Without a hex-to-text converter, reading raw hex dumps requires mentally decoding each byte, which is error-prone and slow. This tool does the conversion instantly in either direction.</p>
              <p>To trace the full conversion chain: the character <strong>H</strong> has ASCII code 104 decimal → <code className="font-mono text-xs">01101000</code> in binary → <code className="font-mono text-xs">68</code> in hex. Paste <em>Hello, World!</em> into the converter to see the complete binary and hex output for every character simultaneously.</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Endianness, Two&apos;s Complement, and Bitwise Operations</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p><strong>Endianness</strong> describes the byte order for multi-byte values. Big-endian systems store the most significant byte first — the way humans naturally write numbers. Little-endian systems store the least significant byte first, which is what x86 and x64 processors use. A 32-bit integer <code className="font-mono text-xs">0x12345678</code> is stored as <code className="font-mono text-xs">12 34 56 78</code> in memory on a big-endian system but <code className="font-mono text-xs">78 56 34 12</code> on a little-endian system. Network protocols standardize on big-endian (called network byte order) so that different hardware can communicate reliably.</p>
              <p><strong>Two&apos;s complement</strong> is how computers represent negative integers in binary. To negate a number: flip all bits, then add 1. The signed byte value -1 is <code className="font-mono text-xs">11111111</code> in binary — all bits set. This is why a signed 8-bit integer ranges from -128 to +127, while an unsigned 8-bit integer ranges from 0 to 255. Both use exactly the same 8 bits; the difference is only in how the value is interpreted.</p>
              <p><strong>Bitwise operators</strong> — AND (&amp;), OR (|), XOR (^), NOT (~), left shift (&lt;&lt;), right shift (&gt;&gt;) — work directly on the binary representation and appear frequently in low-level programming, permission bit flags, hash functions, graphics operations, and network protocol implementations. Understanding binary representation is essential for reading and writing code that uses these operators effectively.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-[#0f172a]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="pb-2"><AdBanner slot="4050607080" /></div>
          <div className="max-w-3xl mx-auto pb-8 pt-4">
            <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 px-6 py-5">
              <h2 className="text-base font-bold text-blue-900 dark:text-blue-300 mb-2">text to binary converter online — instant results</h2>
              <p className="text-sm text-blue-800 dark:text-blue-400 leading-relaxed">
                This binary converter online converts text to binary and hex in real time. All conversion uses native JavaScript
                and the TextEncoder API — no libraries, no server. Works in reverse too: paste binary or hex to decode back to text.
                The format is auto-detected so you can paste either format without selecting it manually.
              </p>
            </div>
          </div>
          <div className="max-w-3xl mx-auto pb-10">
            <FAQ questions={faqs} />
          </div>
          <div className="max-w-3xl mx-auto pb-6"><AdBanner slot="4050607081" /></div>
        </div>
      </section>

      <Footer />
    </>
  )
}

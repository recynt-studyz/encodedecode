import type { Metadata } from 'next'
import AdBanner from '@/components/AdBanner'
import RegexWrapper from '@/components/RegexWrapper'
import FAQ, { type FaqItem } from '@/components/FAQ'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Regex Tester — Test Regular Expressions Online',
  description:
    'Test regular expressions instantly in your browser. Live match highlighting, capture groups, and flag controls (g/i/m/s). Free online regex tester.',
  alternates: { canonical: 'https://encodedecode.app/regex' },
}

const faqs: FaqItem[] = [
  {
    q: 'How do I test a regular expression online?',
    a: 'Paste your pattern into the regex field and your text into the test string area. Matches are highlighted in yellow in real time as you type (debounced 300ms). The match count is shown next to the label, and the match list below shows each match with its start and end index and any named capture groups.',
  },
  {
    q: 'What do regex flags g, i, m, s mean?',
    a: 'g (global) finds all matches in the string — without it only the first match is returned. i (case insensitive) makes letter matching ignore case so "Hello" matches "hello". m (multiline) makes ^ match the start of each line and $ match the end of each line instead of just the whole string. s (dotAll) makes the . metacharacter match newline characters as well as all other characters.',
  },
  {
    q: 'Why is my regex pattern not matching?',
    a: 'Common causes: the g flag is off so only the first match shows; the pattern is anchored with ^ or $ which prevents partial string matches; special characters like . * + ? ( ) [ ] { } \\ | ^ $ are not escaped with \\; or the i flag is needed for case-insensitive matching. The error message shows JavaScript\'s native error for invalid patterns. Use the common patterns section for working examples.',
  },
  {
    q: 'Is my regex pattern sent to a server?',
    a: 'No. All regex matching is performed locally using the JavaScript RegExp engine built into your browser. Your pattern and test string are never transmitted to any server. You can verify this by opening DevTools → Network tab while testing — there are zero outbound requests.',
  },
  {
    q: 'What is a capture group in regex?',
    a: 'A capture group is a portion of a regex pattern enclosed in parentheses () that captures the matched text separately from the full match. For example, (\\w+)@(\\w+) captures the username and domain as separate groups. Named groups use the syntax (?<name>...) — for example (?<year>\\d{4})-(?<month>\\d{2}) captures a date with named groups "year" and "month" shown in the Groups column of the match list.',
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
  name: 'Regex Tester',
  url: 'https://encodedecode.app/regex',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Test a Regular Expression Online',
  step: [
    { '@type': 'HowToStep', name: 'Enter your pattern', text: 'Type your regex pattern into the pattern field. Set flags using the checkboxes: g for global, i for case-insensitive, m for multiline, s for dotAll.' },
    { '@type': 'HowToStep', name: 'Paste your test string', text: 'Paste the text you want to test against into the test string area. Matches are highlighted in yellow in real time.' },
    { '@type': 'HowToStep', name: 'Review matches', text: 'The match count appears next to the test string label. The match list shows each match with its position and any capture groups.' },
  ],
}

export default function RegexPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema).replace(/</g, '\\u003c') }} />

      <h1 className="sr-only">Regex Tester — Test Regular Expressions Online</h1>
      <RegexWrapper />

      <section className="bg-white dark:bg-[#0f172a]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-4 space-y-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How Regular Expressions Work</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>A regular expression (regex) is a sequence of characters that defines a search pattern for string matching. The concept was developed by mathematician Stephen Kleene in the 1950s as part of formal language theory. Ken Thompson implemented the first practical regex engine in the Unix text editor ed in 1969, and the technology has been built into virtually every programming language and text editor ever since.</p>
              <p>The core syntax: a literal character matches itself. The dot (<code className="font-mono text-xs">.</code>) matches any single character except newline. Quantifiers control repetition: <code className="font-mono text-xs">*</code> means zero or more, <code className="font-mono text-xs">+</code> means one or more, <code className="font-mono text-xs">?</code> means zero or one, and <code className="font-mono text-xs">{`{n,m}`}</code> means between n and m times. Anchors restrict match position: <code className="font-mono text-xs">^</code> matches the start of the string and <code className="font-mono text-xs">$</code> matches the end. Character classes in square brackets (<code className="font-mono text-xs">[abc]</code>) match any one listed character; <code className="font-mono text-xs">[^abc]</code> matches any character not listed. The escape sequences <code className="font-mono text-xs">\d</code> (digit), <code className="font-mono text-xs">\w</code> (word character: letters, digits, underscore), and <code className="font-mono text-xs">\s</code> (whitespace) are shorthand for common character classes.</p>
              <p>Parentheses create capture groups, extracting matched substrings for later use. The pipe (<code className="font-mono text-xs">|</code>) provides alternation — matching either the left or right expression. These primitives compose into patterns of arbitrary complexity for form validation, log parsing, data extraction, search-and-replace operations, and text transformation.</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">A Worked Example: Email Validation</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>A developer needs to validate email addresses in a signup form before submitting to the server. She starts with the pattern <code className="font-mono text-xs">/^[^\s@]+@[^\s@]+\.[^\s@]+$/</code>. Breaking it down: <code className="font-mono text-xs">^</code> anchors to the start of the string. <code className="font-mono text-xs">[^\s@]+</code> matches one or more characters that are not whitespace or @. The literal <code className="font-mono text-xs">@</code> matches the at sign. Another <code className="font-mono text-xs">[^\s@]+</code> matches the domain. <code className="font-mono text-xs">\.</code> matches a literal dot (the backslash escapes the dot, preventing it from matching any character). A final <code className="font-mono text-xs">[^\s@]+</code> matches the TLD. <code className="font-mono text-xs">$</code> anchors to the end of the string.</p>
              <p>Testing against real inputs using this tool: <em>user@example.com</em> matches (valid structure), <em>plainaddress</em> does not match (missing @), <em>@example.com</em> does not match (nothing before @), <em>user@example.co.uk</em> matches (multiple dot segments allowed), <em>user @example.com</em> does not match (space in local part). She iterates on the pattern in the live tester, adjusting for her application&apos;s specific requirements, until all relevant edge cases behave correctly. The live highlighting shows exactly which characters each part of the pattern is matching, making debugging immediate rather than requiring repeated test runs.</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Greedy vs Lazy, Lookahead, and Catastrophic Backtracking</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p><strong>Greedy vs lazy quantifiers</strong>: by default, quantifiers are greedy and match as many characters as possible. The pattern <code className="font-mono text-xs">&lt;.+&gt;</code> applied to <code className="font-mono text-xs">{`<a>click here</a>`}</code> matches the entire string from the first <code className="font-mono text-xs">&lt;</code> to the last <code className="font-mono text-xs">&gt;</code>, because <code className="font-mono text-xs">.+</code> greedily consumes everything. Adding <code className="font-mono text-xs">?</code> makes the quantifier lazy (<code className="font-mono text-xs">&lt;.+?&gt;</code>), matching only <code className="font-mono text-xs">&lt;a&gt;</code> — as few characters as possible while still satisfying the pattern. This distinction is critical when matching delimited content like HTML tags, quoted strings, or parenthesized expressions.</p>
              <p><strong>Lookahead and lookbehind assertions</strong> match positions rather than characters. A positive lookahead <code className="font-mono text-xs">(?=...)</code> asserts that the pattern inside must follow the current position without consuming characters. For example, <code className="font-mono text-xs">\d+(?= dollars)</code> matches a number only if followed by &ldquo; dollars&rdquo;, without including &ldquo; dollars&rdquo; in the match. Named capture groups <code className="font-mono text-xs">(?&lt;year&gt;\d{4})</code> label captured substrings for reference by name rather than index, making complex patterns far more readable.</p>
              <p><strong>Catastrophic backtracking</strong> is a performance hazard. Some patterns with nested quantifiers — like <code className="font-mono text-xs">(a+)+</code> — take exponential time on certain inputs. A 30-character input could cause the regex engine to evaluate billions of state combinations before reporting no match. ReDoS (Regular Expression Denial of Service) exploits this by sending inputs that trigger catastrophic backtracking in server-side regex validation. For web applications that accept and evaluate user-supplied patterns, always set a timeout or validate patterns against known-safe inputs before using them in production.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-[#0f172a]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="pb-2"><AdBanner slot="6070809010" /></div>
          <div className="max-w-3xl mx-auto pb-8 pt-4">
            <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 px-6 py-5">
              <h2 className="text-base font-bold text-blue-900 dark:text-blue-300 mb-2">regex tester online — live highlighting, no server</h2>
              <p className="text-sm text-blue-800 dark:text-blue-400 leading-relaxed">
                This regex tester lets you test regular expressions against any text instantly in your browser. Matches are
                highlighted in yellow as you type, with position and capture group details in the match list. The common patterns
                reference includes patterns for email, URL, phone, IP address, and date formats — click any to load it. All
                matching uses the native JavaScript RegExp engine. Your regex pattern and test data never leave your browser.
              </p>
            </div>
          </div>
          <div className="max-w-3xl mx-auto pb-10">
            <FAQ questions={faqs} />
          </div>
          <div className="max-w-3xl mx-auto pb-6"><AdBanner slot="6070809011" /></div>
        </div>
      </section>

      <Footer />
    </>
  )
}

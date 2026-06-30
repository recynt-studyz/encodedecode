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

import type { Metadata } from 'next'
import AdBanner from '@/components/AdBanner'
import CronWrapper from '@/components/CronWrapper'
import FAQ, { type FaqItem } from '@/components/FAQ'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Cron Expression Generator — Build & Decode Cron Jobs',
  description:
    'Generate and decode cron expressions visually. Plain English descriptions, next 5 execution times, and common presets. Free online cron job builder.',
  alternates: { canonical: 'https://encodedecode.app/cron' },
}

const faqs: FaqItem[] = [
  {
    q: 'How do I write a cron expression?',
    a: 'A cron expression has 5 space-separated fields: minute (0–59), hour (0–23), day of month (1–31), month (1–12), and day of week (0–6, where 0 is Sunday). Use * to mean "every value". For example: 0 9 * * 1 means "at 9:00 AM every Monday". Use the Build tab to generate expressions visually from field inputs and preset buttons.',
  },
  {
    q: 'What does the asterisk mean in cron syntax?',
    a: 'An asterisk (*) in a cron field means "every possible value" for that field. * in the minute field means every minute of the hour. * in the month field means every month of the year. A bare * * * * * runs the job every minute. You can combine * with / for step values: */15 in the minute field means every 15 minutes.',
  },
  {
    q: 'How do I run a cron job every 15 minutes?',
    a: 'Use the step syntax with */15 in the minute field: */15 * * * *. This runs at minutes 0, 15, 30, and 45 of every hour. Click the "Every 15 minutes" preset button in the Build tab to load this automatically. The next 5 execution times are shown so you can confirm the schedule.',
  },
  {
    q: 'What is the difference between cron and crontab?',
    a: 'A cron expression is the scheduling syntax (e.g., 0 9 * * 1) that describes when a job should run. Crontab (cron table) is the configuration file that stores cron expressions alongside the commands to execute — edited with the crontab -e command on Unix/Linux. cron is the background daemon process that reads crontab files and runs the scheduled commands.',
  },
  {
    q: 'How do I decode an existing cron expression?',
    a: 'Switch to Decode mode and paste your cron expression into the input field. The tool parses each of the 5 fields, generates a plain English description (for example "at 9:00 AM, on Monday"), and shows the next 5 scheduled execution times with actual dates and times so you can verify the schedule is correct before deploying.',
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
  name: 'Cron Expression Generator',
  url: 'https://encodedecode.app/cron',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Build a Cron Expression Online',
  step: [
    { '@type': 'HowToStep', name: 'Choose Build or Decode mode', text: 'Use Build mode to create a new cron expression, or Decode mode to parse an existing one.' },
    { '@type': 'HowToStep', name: 'Set fields or use a preset', text: 'In Build mode, enter values for minute, hour, day, month, and weekday fields. Or click a preset like "Every 15 minutes" to populate them automatically.' },
    { '@type': 'HowToStep', name: 'Review and copy', text: 'The plain English description and next 5 execution times update instantly. Click Copy to copy the expression to your clipboard.' },
  ],
}

export default function CronPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema).replace(/</g, '\\u003c') }} />

      <h1 className="sr-only">Cron Expression Generator — Build &amp; Decode Cron Jobs</h1>
      <CronWrapper />

      <section className="bg-white dark:bg-[#0f172a]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="pb-2"><AdBanner slot="7080901011" /></div>
          <div className="max-w-3xl mx-auto pb-8 pt-4">
            <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 px-6 py-5">
              <h2 className="text-base font-bold text-blue-900 dark:text-blue-300 mb-2">cron expression generator — build, decode, and verify cron jobs</h2>
              <p className="text-sm text-blue-800 dark:text-blue-400 leading-relaxed">
                This cron expression generator converts visual field inputs into valid cron syntax and vice versa. The cron job
                builder shows a plain English description and the next 5 actual execution dates so you can verify your schedule
                before deploying. Supports all standard cron features: * (any), , (list), - (range), and / (step). All parsing
                and date calculation runs in your browser — no server required.
              </p>
            </div>
          </div>
          <div className="max-w-3xl mx-auto pb-10">
            <FAQ questions={faqs} />
          </div>
          <div className="max-w-3xl mx-auto pb-6"><AdBanner slot="7080901012" /></div>
        </div>
      </section>

      <Footer />
    </>
  )
}

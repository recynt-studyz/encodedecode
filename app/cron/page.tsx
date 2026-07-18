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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-4 space-y-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How Cron Expressions Work</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>Cron is a time-based job scheduler built into Unix and Linux operating systems. The name comes from the Greek word χρόνος (chronos), meaning time. The cron daemon reads a configuration file called a crontab (cron table) and executes scheduled commands at the specified times. Every developer who has automated a nightly database backup, sent a scheduled report email, rotated log files, or cleared a cache on a timer has worked with cron expressions.</p>
              <p>A standard cron expression has five space-separated fields: minute (0–59), hour (0–23), day of month (1–31), month (1–12), and day of week (0–6, where both 0 and 7 represent Sunday). Four special characters extend the syntax. An asterisk (<code className="font-mono text-xs">*</code>) means every possible value for that field. A comma (<code className="font-mono text-xs">,</code>) separates multiple values — <code className="font-mono text-xs">1,15</code> means the 1st and 15th. A hyphen (<code className="font-mono text-xs">-</code>) defines a range — <code className="font-mono text-xs">1-5</code> means Monday through Friday. A slash (<code className="font-mono text-xs">/</code>) defines step values — <code className="font-mono text-xs">*/15</code> means every 15 units.</p>
              <p>Three expressions every developer should commit to memory: <code className="font-mono text-xs">0 * * * *</code> (every hour at the top of the hour), <code className="font-mono text-xs">0 0 * * *</code> (every day at midnight), and <code className="font-mono text-xs">*/5 * * * *</code> (every 5 minutes). More specific schedules like <code className="font-mono text-xs">30 9 * * 1-5</code> (9:30 AM on weekdays) and <code className="font-mono text-xs">0 0 1 * *</code> (midnight on the first of each month) cover the majority of real-world scheduling requirements.</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">A Worked Example: Backups and Weekly Reports</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>A developer needs to automate two recurring tasks for a production application: a database backup every night at 3:30 AM, and a weekly summary report emailed to the team every Monday at 9:00 AM.</p>
              <p>For the nightly backup: <code className="font-mono text-xs">30 3 * * *</code>. Reading left to right — minute 30, hour 3, any day of month (<code className="font-mono text-xs">*</code>), any month (<code className="font-mono text-xs">*</code>), any day of week (<code className="font-mono text-xs">*</code>). This runs at exactly 3:30 AM every single day, regardless of weekday or month. She pastes it into the decoder above to confirm the plain-English description reads &ldquo;at 3:30 AM, every day&rdquo; and checks the next five execution times against her expected schedule before deploying.</p>
              <p>For the weekly report: <code className="font-mono text-xs">0 9 * * 1</code>. Minute 0, hour 9, any day of month, any month, day of week 1 (Monday). This runs at 9:00 AM every Monday. The decoder shows the next five Mondays at 9:00 AM, confirming the schedule is correct. Both expressions are added to the server&apos;s crontab and tested in staging before being promoted to production.</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Timezone Pitfalls, Six-Field Cron, and Common Shortcuts</h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p><strong>Timezone handling</strong> is the most common source of cron bugs in production. Standard cron runs in the server&apos;s local timezone. A server configured to UTC running <code className="font-mono text-xs">0 9 * * 1</code> will send the Monday report at 9:00 AM UTC — which is 4:00 AM or 5:00 AM Eastern time, depending on daylight saving. Cloud scheduling services like AWS EventBridge, Google Cloud Scheduler, and Azure Logic Apps allow explicit timezone configuration, which is strongly preferred over manual offset calculation.</p>
              <p><strong>Six-field cron syntax</strong> adds a seconds field at the very beginning: <code className="font-mono text-xs">seconds minute hour day month weekday</code>. Spring Boot&apos;s <code className="font-mono text-xs">@Scheduled</code> annotation, Jenkins pipelines, and Quartz Scheduler use this format. A job running every 30 seconds in six-field cron is <code className="font-mono text-xs">*/30 * * * * *</code>. This tool uses the standard five-field POSIX cron syntax. If your platform uses six fields, prepend the seconds value.</p>
              <p><strong>Common shorthand expressions</strong> simplify frequent schedules: <code className="font-mono text-xs">@yearly</code> (= <code className="font-mono text-xs">0 0 1 1 *</code>), <code className="font-mono text-xs">@monthly</code> (= <code className="font-mono text-xs">0 0 1 * *</code>), <code className="font-mono text-xs">@weekly</code> (= <code className="font-mono text-xs">0 0 * * 0</code>), <code className="font-mono text-xs">@daily</code> (= <code className="font-mono text-xs">0 0 * * *</code>), <code className="font-mono text-xs">@hourly</code> (= <code className="font-mono text-xs">0 * * * *</code>), and <code className="font-mono text-xs">@reboot</code> (runs once on system startup). One important pitfall: specifying both day-of-month and day-of-week uses OR logic in standard cron — <code className="font-mono text-xs">0 0 1 * 1</code> runs at midnight on the first of every month AND on every Monday, not only on Mondays that happen to be the first.</p>
            </div>
          </div>
        </div>
      </section>

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

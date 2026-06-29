export interface FaqItem {
  q: string
  a: string
}

export default function FAQ({ questions }: { questions: FaqItem[] }) {
  return (
    <section className="w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Frequently Asked Questions
      </h2>
      <div className="space-y-3">
        {questions.map((faq, i) => (
          <details key={i} className="group rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-[#1e293b]">
            <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-medium text-gray-800 dark:text-[#e2e8f0] hover:text-[#2563EB] dark:hover:text-blue-400 transition">
              {faq.q}
              <span className="ml-4 shrink-0 text-gray-400 group-open:rotate-180 transition-transform duration-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </summary>
            <p className="px-5 pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

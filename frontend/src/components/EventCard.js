import { useTranslation } from 'next-i18next'

function formatDate(value, locale) {
  if (!value) return ''
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export default function EventCard({ event, locale = 'en' }) {
  const { t } = useTranslation('common')
  const eventDate = formatDate(event.start_at, locale)
  const place = [event.venue, event.city].filter(Boolean).join(' · ')

  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-red-500/30 hover:bg-white/[0.05]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">{eventDate}</div>
          <h3 className="text-xl font-semibold text-white">{event.title}</h3>
          <p className="text-sm text-zinc-400">{place}</p>
          {event.description ? <p className="max-w-3xl text-sm leading-6 text-zinc-500">{event.description}</p> : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {event.ticket_url ? (
            <a href={event.ticket_url} target="_blank" rel="noreferrer" className="rounded-full bg-gradient-to-r from-red-600 to-rose-700 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5">
              {t('actions.tickets')}
            </a>
          ) : null}
          {event.source_url ? (
            <a href={event.source_url} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:border-white/20 hover:bg-white/10">
              {t('actions.source')}
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}

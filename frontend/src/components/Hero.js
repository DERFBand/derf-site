import Link from 'next/link'
import { useTranslation } from 'next-i18next'

function formatReleaseDate(value, locale) {
  if (!value) return null
  const date = new Date(value)
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(date)
}

function formatEventDate(value, locale) {
  if (!value) return null
  const date = new Date(value)
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export default function Hero({ latestRelease, nextEvent, backgroundImage }) {
  const { t, i18n } = useTranslation('common')
  const locale = i18n.language || 'en'
  const releaseTitle = latestRelease?.title || latestRelease?.slug || t('empty.releases')
  const releaseLink = latestRelease?.external_url || '/music'
  const releaseIsExternal = Boolean(latestRelease?.external_url)
  const releaseDate = formatReleaseDate(latestRelease?.release_date, locale)
  const eventDate = formatEventDate(nextEvent?.start_at, locale)

  return (
    <section
      className="relative isolate overflow-hidden border-b border-white/8"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(180deg, rgba(10,10,10,0.98) 0%, rgba(8,8,8,0.96) 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      aria-label={t('hero.eyebrow')}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/65 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(185,28,28,0.22),transparent_38%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.12),transparent_26%)]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-92px)] max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-[1.2fr_0.8fr] md:px-6 md:py-24">
        <div className="max-w-3xl space-y-8">
          <div className="space-y-4">
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-300 backdrop-blur">
              {t('hero.eyebrow')}
            </div>
            <h1 className="font-heading text-6xl leading-none tracking-[0.18em] text-white drop-shadow-[0_14px_40px_rgba(0,0,0,0.65)] sm:text-7xl lg:text-8xl">
              {t('brand')}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">{t('hero.body')}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {releaseIsExternal ? (
              <a href={releaseLink} target="_blank" rel="noreferrer" className="rounded-full bg-gradient-to-r from-red-600 to-rose-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-950/30 transition hover:-translate-y-0.5">
                {t('hero.primaryCta')}
              </a>
            ) : (
              <Link href={releaseLink} className="rounded-full bg-gradient-to-r from-red-600 to-rose-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-950/30 transition hover:-translate-y-0.5">
                {t('hero.primaryCta')}
              </Link>
            )}
            <Link href="/shows" className="rounded-full border border-white/12 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-100 transition hover:border-white/20 hover:bg-white/10">
              {t('hero.secondaryCta')}
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-3xl border border-white/10 bg-black/45 p-5 backdrop-blur-xl">
              <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">{t('sections.latestRelease')}</div>
              <h2 className="mt-3 text-2xl font-semibold text-white">{releaseTitle}</h2>
              {releaseDate ? <p className="mt-2 text-sm text-zinc-400">{releaseDate}</p> : null}
              <div className="mt-4">
                {releaseIsExternal ? (
                  <a href={releaseLink} target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:border-red-500/40 hover:bg-red-500/10">
                    {t('actions.openRelease')}
                  </a>
                ) : (
                  <Link href={releaseLink} className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:border-red-500/40 hover:bg-red-500/10">
                    {t('actions.openRelease')}
                  </Link>
                )}
              </div>
            </article>

            <article className="rounded-3xl border border-white/10 bg-black/45 p-5 backdrop-blur-xl">
              <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">{t('sections.nextShow')}</div>
              <h2 className="mt-3 text-2xl font-semibold text-white">{nextEvent?.title || t('empty.events')}</h2>
              {nextEvent?.venue || nextEvent?.city || eventDate ? (
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {[nextEvent?.venue, nextEvent?.city].filter(Boolean).join(' · ')}
                  {eventDate ? ` · ${eventDate}` : ''}
                </p>
              ) : null}
              <div className="mt-4">
                <Link href="/shows" className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:border-amber-400/40 hover:bg-amber-400/10">
                  {t('sections.shows')}
                </Link>
              </div>
            </article>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="rounded-[2rem] border border-white/10 bg-black/45 p-5 shadow-2xl shadow-black/50 backdrop-blur-xl">
            <div className="aspect-[3/4] overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-b from-white/10 to-white/0">
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(180deg, rgba(24,24,27,1) 0%, rgba(9,9,11,1) 100%)' }}
              />
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-zinc-400">
              <span>{t('brand')}</span>
              <span>{releaseTitle}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

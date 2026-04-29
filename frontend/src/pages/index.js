import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useEffect, useMemo, useState } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import Hero from '../components/Hero'
import { useSiteSettings } from '../context/SiteSettingsContext'
import { fetchHomeContent, fetchMediaList } from '../lib/contentApi'
import { buildPageTitle } from '../lib/pageTitle'

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

export default function Home() {
  const router = useRouter()
  const { t, i18n } = useTranslation('common')
  const { siteName } = useSiteSettings()
  const [home, setHome] = useState(null)
  const [featuredMedia, setFeaturedMedia] = useState([])
  const [loading, setLoading] = useState(true)

  const lang = router.locale || 'en'

  useEffect(() => {
    if (!router.isReady) return
    let cancelled = false
    setLoading(true)

    Promise.all([fetchHomeContent(lang), fetchMediaList({ featured_only: true })])
      .then(([homeData, mediaData]) => {
        if (cancelled) return
        setHome(homeData)
        setFeaturedMedia(mediaData)
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [lang, router.isReady])

  const latestRelease = home?.latest_release || null
  const nextShow = home?.next_event || null
  const heroBackground = useMemo(() => {
    const mediaPool = featuredMedia.length ? featuredMedia : home?.featured_media || []
    const candidate = mediaPool.find((item) => item.media_type === 'photo') || mediaPool[0]
    return candidate?.thumbnail_url || candidate?.url || '/assets/logo-placeholder.svg'
  }, [featuredMedia, home])

  const locale = i18n.language || lang

  return (
    <>
      <Head>
        <title>{buildPageTitle(t('brand'), siteName)}</title>
      </Head>

      <Hero latestRelease={latestRelease} nextEvent={nextShow} backgroundImage={heroBackground} />

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid gap-5 lg:grid-cols-3">
          <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
            <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">{t('sections.latestRelease')}</div>
            <h2 className="mt-3 text-2xl font-semibold text-white">{latestRelease?.title || latestRelease?.slug || t('empty.releases')}</h2>
            {latestRelease?.description ? <p className="mt-3 text-sm leading-6 text-zinc-400">{latestRelease.description}</p> : null}
            {latestRelease?.release_date ? <p className="mt-3 text-sm text-zinc-500">{formatDate(latestRelease.release_date, locale)}</p> : null}
            {latestRelease?.external_url ? (
              <a href={latestRelease.external_url} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-full bg-gradient-to-r from-red-600 to-rose-700 px-4 py-2 text-sm font-semibold text-white">
                {t('actions.openRelease')}
              </a>
            ) : null}
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
            <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">{t('sections.nextShow')}</div>
            <h2 className="mt-3 text-2xl font-semibold text-white">{nextShow?.title || t('empty.events')}</h2>
            {nextShow ? (
              <div className="mt-3 space-y-2 text-sm text-zinc-400">
                <p>{[nextShow.venue, nextShow.city].filter(Boolean).join(' · ')}</p>
                <p>{formatDate(nextShow.start_at, locale)}</p>
              </div>
            ) : null}
            <Link href="/shows" className="mt-5 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-100">
              {t('sections.shows')}
            </Link>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
            <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">{t('sections.featuredMedia')}</div>
            <div className="mt-3 space-y-4">
              {featuredMedia.slice(0, 3).map((item) => (
                <a key={item.id} href={item.url} target="_blank" rel="noreferrer" className="group flex items-center gap-4 rounded-2xl border border-white/8 bg-black/20 p-3 transition hover:border-white/15 hover:bg-white/[0.04]">
                  <img src={item.thumbnail_url || item.url} alt={item.title || item.alt_text || 'Media'} className="h-20 w-20 rounded-xl object-cover" />
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-zinc-500">{item.media_type}</div>
                    <div className="mt-1 text-sm font-semibold text-white">{item.title || item.alt_text || item.caption || 'Media'}</div>
                  </div>
                </a>
              ))}
              {!featuredMedia.length && !loading ? <p className="text-sm text-zinc-400">{t('empty.media')}</p> : null}
            </div>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl font-semibold text-white">{t('sections.pressHighlights')}</h2>
              <Link href="/press" className="text-sm font-semibold text-zinc-300 underline decoration-white/20 underline-offset-4 hover:text-white">
                {t('sections.press')}
              </Link>
            </div>
            <div className="mt-5 space-y-3">
              {(home?.press_items || []).slice(0, 4).map((item) => (
                <a key={item.id} href={item.url} target="_blank" rel="noreferrer" className="block rounded-2xl border border-white/8 bg-black/20 p-4 transition hover:border-red-500/25 hover:bg-white/[0.04]">
                  <div className="text-sm font-semibold text-white">{item.title || item.url}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.22em] text-zinc-500">{item.kind}</div>
                  {item.description ? <p className="mt-2 text-sm leading-6 text-zinc-400">{item.description}</p> : null}
                </a>
              ))}
              {!home?.press_items?.length && !loading ? <p className="text-sm text-zinc-400">{t('empty.press')}</p> : null}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold text-white">{t('sections.music')}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">{t('hero.body')}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/music" className="rounded-full bg-gradient-to-r from-red-600 to-rose-700 px-4 py-2 text-sm font-semibold text-white">
                {t('sections.music')}
              </Link>
              <Link href="/forum" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-100">
                {t('sections.forum')}
              </Link>
              <Link href="/chat" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-100">
                {t('sections.chat')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  }
}

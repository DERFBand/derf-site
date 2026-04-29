import Head from 'next/head'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useEffect, useMemo, useState } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import EventCard from '../components/EventCard'
import { useSiteSettings } from '../context/SiteSettingsContext'
import { fetchEvents } from '../lib/contentApi'
import { buildPageTitle } from '../lib/pageTitle'

export default function Shows() {
  const router = useRouter()
  const { t, i18n } = useTranslation('common')
  const { siteName } = useSiteSettings()
  const [events, setEvents] = useState([])
  const lang = router.locale || 'en'

  useEffect(() => {
    if (!router.isReady) return
    fetchEvents(lang)
      .then((data) => setEvents(data))
      .catch((error) => console.error(error))
  }, [lang, router.isReady])

  const { upcoming, past } = useMemo(() => {
    const now = new Date()
    const upcomingItems = []
    const pastItems = []
    for (const event of events) {
      if (event.start_at && new Date(event.start_at) >= now) upcomingItems.push(event)
      else pastItems.push(event)
    }
    return { upcoming: upcomingItems, past: pastItems }
  }, [events])

  return (
    <>
      <Head>
        <title>{buildPageTitle(t('sections.shows'), siteName)}</title>
      </Head>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">{t('sections.shows')}</div>
        <h1 className="mt-3 font-heading text-5xl text-white md:text-6xl">{t('sections.shows')}</h1>

        <div className="mt-10 space-y-10">
          <div>
            <h2 className="text-2xl font-semibold text-white">{t('sections.upcomingShows')}</h2>
            <div className="mt-5 space-y-4">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} locale={i18n.language || lang} />
              ))}
              {!upcoming.length ? <p className="text-sm text-zinc-400">{t('empty.events')}</p> : null}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">{t('sections.pastShows')}</h2>
            <div className="mt-5 space-y-4">
              {past.map((event) => (
                <EventCard key={event.id} event={event} locale={i18n.language || lang} />
              ))}
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

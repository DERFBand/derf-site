import Head from 'next/head'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { api } from '../lib/api'

function formatDate(value, locale) {
  if (!value) return null
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(value))
}

export default function Music() {
  const router = useRouter()
  const { t, i18n } = useTranslation('common')
  const [releases, setReleases] = useState([])
  const lang = router.locale || 'en'

  useEffect(() => {
    if (!router.isReady) return
    api
      .get('/api/v1/content/releases', { params: { lang } })
      .then((response) => setReleases(response.data || []))
      .catch((error) => console.error(error))
  }, [lang, router.isReady])

  return (
    <>
      <Head>
        <title>{t('sections.music')} — D.E.R.F.</title>
      </Head>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">{t('sections.music')}</div>
            <h1 className="mt-3 font-heading text-5xl text-white md:text-6xl">{t('sections.music')}</h1>
          </div>
          <a href="https://band.link/UXd3W" target="_blank" rel="noreferrer" className="rounded-full bg-gradient-to-r from-red-600 to-rose-700 px-5 py-3 text-sm font-semibold text-white">
            {t('actions.openRelease')}
          </a>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {releases.map((release) => (
            <article key={release.id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl transition hover:-translate-y-1 hover:border-red-500/30">
              <div className="aspect-[16/10] bg-gradient-to-br from-zinc-900 via-zinc-950 to-black">
                {release.cover_url ? <img src={release.cover_url} alt={release.title || release.slug} className="h-full w-full object-cover" /> : null}
              </div>
              <div className="p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">{release.slug}</div>
                <h2 className="mt-2 text-2xl font-semibold text-white">{release.title || release.slug}</h2>
                {release.description ? <p className="mt-3 text-sm leading-6 text-zinc-400">{release.description}</p> : null}
                {release.release_date ? <p className="mt-3 text-sm text-zinc-500">{formatDate(release.release_date, i18n.language || lang)}</p> : null}
                <div className="mt-5 flex flex-wrap gap-3">
                  {release.external_url ? (
                    <a href={release.external_url} target="_blank" rel="noreferrer" className="rounded-full bg-gradient-to-r from-red-600 to-rose-700 px-4 py-2 text-sm font-semibold text-white">
                      {t('actions.openRelease')}
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
          {!releases.length ? <p className="text-sm text-zinc-400">{t('empty.releases')}</p> : null}
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

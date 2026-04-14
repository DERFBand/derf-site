import Head from 'next/head'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useEffect, useMemo, useState } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import MediaGrid from '../components/MediaGrid'
import { api } from '../lib/api'

export default function Media() {
  const router = useRouter()
  const { t } = useTranslation('common')
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('all')
  const lang = router.locale || 'en'

  useEffect(() => {
    if (!router.isReady) return
    api
      .get('/api/v1/media/list', { params: { lang } })
      .then((response) => setItems(response.data || []))
      .catch((error) => console.error(error))
  }, [lang, router.isReady])

  const filtered = useMemo(() => {
    if (filter === 'all') return items
    return items.filter((item) => item.media_type === filter)
  }, [filter, items])

  return (
    <>
      <Head>
        <title>{t('sections.media')} — D.E.R.F.</title>
      </Head>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">{t('sections.media')}</div>
        <h1 className="mt-3 font-heading text-5xl text-white md:text-6xl">{t('sections.media')}</h1>

        <div className="mt-8 flex flex-wrap gap-2">
          {['all', 'photo', 'video', 'audio'].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === value
                  ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white'
                  : 'border border-white/10 bg-white/5 text-zinc-200 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              {value === 'all' ? t('filters.all') : value === 'photo' ? t('filters.photos') : value === 'video' ? t('filters.videos') : t('filters.audio')}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <MediaGrid items={filtered} />
          {!filtered.length ? <p className="text-sm text-zinc-400">{t('empty.media')}</p> : null}
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

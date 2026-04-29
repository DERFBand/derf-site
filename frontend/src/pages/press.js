import Head from 'next/head'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { useSiteSettings } from '../context/SiteSettingsContext'
import { fetchPressItems } from '../lib/contentApi'
import { buildPageTitle } from '../lib/pageTitle'

export default function Press() {
  const router = useRouter()
  const { t } = useTranslation('common')
  const { siteName } = useSiteSettings()
  const [items, setItems] = useState([])
  const lang = router.locale || 'en'

  useEffect(() => {
    if (!router.isReady) return
    fetchPressItems(lang)
      .then((data) => setItems(data))
      .catch((error) => console.error(error))
  }, [lang, router.isReady])

  return (
    <>
      <Head>
        <title>{buildPageTitle(t('sections.press'), siteName)}</title>
      </Head>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">{t('sections.press')}</div>
        <h1 className="mt-3 font-heading text-5xl text-white md:text-6xl">{t('sections.press')}</h1>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {items.map((item) => (
            <a key={item.id} href={item.url} target="_blank" rel="noreferrer" className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-red-500/30 hover:bg-white/[0.05]">
              <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">{item.kind}</div>
              <h2 className="mt-3 text-2xl font-semibold text-white">{item.title || item.url}</h2>
              {item.description ? <p className="mt-3 text-sm leading-6 text-zinc-400">{item.description}</p> : null}
              <div className="mt-5 text-sm font-semibold text-zinc-200 underline decoration-white/20 underline-offset-4">{t('actions.openLink')}</div>
            </a>
          ))}
          {!items.length ? <p className="text-sm text-zinc-400">{t('empty.press')}</p> : null}
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

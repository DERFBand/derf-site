import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'

import { fetchSiteLinks } from '../lib/contentApi'

export default function Footer() {
  const { t } = useTranslation('common')
  const year = new Date().getFullYear()
  const [links, setLinks] = useState([])

  useEffect(() => {
    let cancelled = false
    fetchSiteLinks()
      .then((data) => {
        if (!cancelled) setLinks(data)
      })
      .catch((error) => console.error(error))
    return () => { cancelled = true }
  }, [])

  return (
    <footer className="border-t border-white/10 bg-black/60 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 md:flex-row md:items-end md:justify-between md:px-6">
        <div className="max-w-xl space-y-3">
          <div className="font-heading text-4xl tracking-[0.22em] text-white">{t('brand')}</div>
          <p className="max-w-lg text-sm leading-6 text-zinc-400">{t('hero.body')}</p>
          <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">
            {t('footer.rights')} {year}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          {links.map((link) => (
            <a key={link.id} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-zinc-200 transition hover:border-white/20 hover:bg-white/10" href={link.url} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

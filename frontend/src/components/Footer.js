import { useTranslation } from 'next-i18next'

export default function Footer() {
  const { t } = useTranslation('common')
  const year = new Date().getFullYear()

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
          <a className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-zinc-200 transition hover:border-white/20 hover:bg-white/10" href="https://vk.com/derfmusic" target="_blank" rel="noreferrer">
            VK
          </a>
          <a className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-zinc-200 transition hover:border-white/20 hover:bg-white/10" href="https://www.youtube.com/@D_E_R_F" target="_blank" rel="noreferrer">
            YouTube
          </a>
          <a className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-zinc-200 transition hover:border-white/20 hover:bg-white/10" href="https://vkvideo.ru/@derfmusic/all" target="_blank" rel="noreferrer">
            VK Video
          </a>
          <a className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-zinc-200 transition hover:border-white/20 hover:bg-white/10" href="https://band.link/UXd3W" target="_blank" rel="noreferrer">
            Band.link
          </a>
        </div>
      </div>
    </footer>
  )
}

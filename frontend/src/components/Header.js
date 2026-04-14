import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useMemo, useState } from 'react'

import { useAuth } from '../context/AuthContext'

export default function Header() {
  const router = useRouter()
  const { t } = useTranslation('common')
  const { user, logout, loading } = useAuth()
  const [logoFailed, setLogoFailed] = useState(false)

  const navItems = useMemo(
    () => [
      { href: '/music', label: t('nav.music') },
      { href: '/shows', label: t('nav.shows') },
      { href: '/media', label: t('nav.media') },
      { href: '/press', label: t('nav.press') },
      { href: '/forum', label: t('nav.forum') },
      { href: '/chat', label: t('nav.chat') },
    ],
    [t],
  )

  const currentLocale = router.locale || 'en'
  const nextLocale = currentLocale === 'ru' ? 'en' : 'ru'

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#090909]/88 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3" aria-label={t('brand')}>
            {!logoFailed ? (
              <img
                src="/assets/logo.png"
                alt={t('brand')}
                className="h-20 w-auto drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <span className="font-heading text-3xl tracking-[0.22em] text-white">{t('brand')}</span>
            )}
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => router.push(router.pathname, router.asPath, { locale: nextLocale })}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-200 transition hover:border-red-500/40 hover:bg-red-500/10"
            >
              {currentLocale === 'ru' ? t('locale.english') : t('locale.russian')}
            </button>

            {!loading && user ? (
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-200">
                <span className="hidden sm:inline">
                  {t('auth.welcome')} {user.username}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-full bg-red-500/15 px-3 py-1 font-semibold text-red-200 transition hover:bg-red-500/25"
                >
                  {t('actions.logout')}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-gradient-to-r from-red-600 to-rose-700 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-950/30 transition hover:-translate-y-0.5"
              >
                {t('nav.login')}
              </Link>
            )}
          </div>
        </div>

        <nav className="flex items-center gap-3 overflow-x-auto pb-1 text-sm text-zinc-300">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-full border px-4 py-2 transition ${
                router.pathname === item.href
                  ? 'border-red-500/50 bg-red-500/12 text-white'
                  : 'border-white/8 bg-white/[0.03] hover:border-white/18 hover:bg-white/[0.06]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

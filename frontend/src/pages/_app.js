import Head from 'next/head'
import { appWithTranslation } from 'next-i18next'
import nextI18NextConfig from '../../next-i18next.config'

import '../styles/globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { AuthProvider } from '../context/AuthContext'
import { SiteSettingsProvider, useSiteSettings } from '../context/SiteSettingsContext'

function AppShell({ Component, pageProps }) {
  const { siteName, siteTitleSuffix, siteDescription } = useSiteSettings()

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0b0b0b" />
        <meta name="description" content={siteDescription} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <title>{siteName} — {siteTitleSuffix}</title>
      </Head>

      <div className="min-h-screen bg-[#0b0b0b] text-zinc-100">
        <Header />
        <main className="pt-[92px]">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </>
  )
}

function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <SiteSettingsProvider>
        <AppShell Component={Component} pageProps={pageProps} />
      </SiteSettingsProvider>
    </AuthProvider>
  )
}

export default appWithTranslation(App, nextI18NextConfig)

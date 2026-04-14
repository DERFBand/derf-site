import Head from 'next/head'
import { appWithTranslation } from 'next-i18next'

import '../styles/globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { AuthProvider } from '../context/AuthContext'

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0b0b0b" />
        <meta name="description" content="D.E.R.F. — official band website" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <title>D.E.R.F. — Official</title>
      </Head>

      <AuthProvider>
        <div className="min-h-screen bg-[#0b0b0b] text-zinc-100">
          <Header />
          <main className="pt-[92px]">
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </>
  )
}

export default appWithTranslation(App)

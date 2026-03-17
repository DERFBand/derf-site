// frontend/src/pages/_app.js
import Head from 'next/head'
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Display font for headings */}
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet" />
        <title>D.E.R.F. — Official</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
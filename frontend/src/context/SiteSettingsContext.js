import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'

import { fetchSiteSettings } from '../lib/contentApi'

const SiteSettingsContext = createContext({ values: {}, siteName: 'D.E.R.F.' })

export function SiteSettingsProvider({ children }) {
  const router = useRouter()
  const [values, setValues] = useState({})
  const lang = router.locale || 'en'

  useEffect(() => {
    if (!router.isReady) return
    let cancelled = false
    fetchSiteSettings(lang)
      .then((data) => {
        if (!cancelled) setValues(data)
      })
      .catch((error) => console.error(error))
    return () => { cancelled = true }
  }, [lang, router.isReady])

  const contextValue = useMemo(() => ({
    values,
    siteName: values.site_name || 'D.E.R.F.',
    siteTitleSuffix: values.site_title_suffix || 'Official',
    siteDescription: values.site_description || 'D.E.R.F. official band website',
  }), [values])

  return <SiteSettingsContext.Provider value={contextValue}>{children}</SiteSettingsContext.Provider>
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}

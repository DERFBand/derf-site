jest.mock('next/router', () => ({
  useRouter: () => ({ locale: 'en', isReady: true }),
}))

jest.mock('../lib/contentApi', () => ({
  fetchSiteSettings: jest.fn(),
}))

import { render, screen, waitFor } from '@testing-library/react'

import { SiteSettingsProvider, useSiteSettings } from '../context/SiteSettingsContext'
import { fetchSiteSettings } from '../lib/contentApi'

function Probe() {
  const { siteName, siteDescription } = useSiteSettings()
  return (
    <div>
      <span>{siteName}</span>
      <span>{siteDescription}</span>
    </div>
  )
}

describe('SiteSettingsContext', () => {
  it('loads settings and exposes computed values', async () => {
    fetchSiteSettings.mockResolvedValueOnce({
      site_name: 'DERF',
      site_description: 'Band website',
    })

    render(
      <SiteSettingsProvider>
        <Probe />
      </SiteSettingsProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('DERF')).toBeInTheDocument()
      expect(screen.getByText('Band website')).toBeInTheDocument()
    })
  })
})

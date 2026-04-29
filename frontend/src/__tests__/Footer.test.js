jest.mock('next-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}))

jest.mock('../lib/contentApi', () => ({
  fetchSiteLinks: jest.fn(),
}))

import { render, screen, waitFor } from '@testing-library/react'

import Footer from '../components/Footer'
import { fetchSiteLinks } from '../lib/contentApi'

describe('Footer', () => {
  it('renders links from API', async () => {
    fetchSiteLinks.mockResolvedValueOnce([
      { id: 1, label: 'VK', url: 'https://vk.com' },
      { id: 2, label: 'YouTube', url: 'https://youtube.com' },
    ])

    render(<Footer />)

    await waitFor(() => {
      expect(screen.getByText('VK')).toBeInTheDocument()
      expect(screen.getByText('YouTube')).toBeInTheDocument()
    })
  })
})

jest.mock('next/router', () => ({
  useRouter: () => ({ locale: 'en', isReady: true }),
}))

jest.mock('next-i18next', () => ({
  useTranslation: () => ({ t: (key) => key, i18n: { language: 'en' } }),
}))

jest.mock('../context/SiteSettingsContext', () => ({
  useSiteSettings: () => ({ siteName: 'D.E.R.F.' }),
}))

jest.mock('../components/Hero', () => () => <div>Hero</div>)
jest.mock('../components/EventCard', () => ({ event }) => <div>{event.title}</div>)
jest.mock('../components/MediaGrid', () => ({ items }) => <div>media:{items.length}</div>)

jest.mock('../lib/contentApi', () => ({
  fetchHomeContent: jest.fn(),
  fetchMediaList: jest.fn(),
  fetchReleases: jest.fn(),
  fetchPressItems: jest.fn(),
  fetchEvents: jest.fn(),
}))

import { render, screen, waitFor } from '@testing-library/react'

import Home from '../pages/index'
import Media from '../pages/media'
import Music from '../pages/music'
import Press from '../pages/press'
import Shows from '../pages/shows'
import {
  fetchEvents,
  fetchHomeContent,
  fetchMediaList,
  fetchPressItems,
  fetchReleases,
} from '../lib/contentApi'

describe('pages data loading', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('loads and renders home', async () => {
    fetchHomeContent.mockResolvedValueOnce({
      latest_release: { id: 1, title: 'Rel' },
      next_event: { id: 2, title: 'Show', venue: 'A', city: 'B', start_at: '2026-01-01T10:00:00' },
      press_items: [],
      featured_media: [],
    })
    fetchMediaList.mockResolvedValueOnce([])
    render(<Home />)
    await waitFor(() => expect(fetchHomeContent).toHaveBeenCalled())
    expect(screen.getByText('Hero')).toBeInTheDocument()
  })

  it('loads and renders music', async () => {
    fetchReleases.mockResolvedValueOnce([{ id: 1, slug: 'x', title: 'Album' }])
    render(<Music />)
    await waitFor(() => expect(fetchReleases).toHaveBeenCalled())
    expect(screen.getByText('Album')).toBeInTheDocument()
  })

  it('loads and renders press', async () => {
    fetchPressItems.mockResolvedValueOnce([{ id: 1, title: 'Press', url: 'https://example.com', kind: 'article' }])
    render(<Press />)
    await waitFor(() => expect(fetchPressItems).toHaveBeenCalled())
    expect(screen.getByText('Press')).toBeInTheDocument()
  })

  it('loads and renders shows', async () => {
    fetchEvents.mockResolvedValueOnce([{ id: 1, title: 'Show', start_at: '2030-01-01T10:00:00' }])
    render(<Shows />)
    await waitFor(() => expect(fetchEvents).toHaveBeenCalled())
    expect(screen.getByText('Show')).toBeInTheDocument()
  })

  it('loads and renders media', async () => {
    fetchMediaList.mockResolvedValueOnce([{ id: 1, media_type: 'photo' }])
    render(<Media />)
    await waitFor(() => expect(fetchMediaList).toHaveBeenCalled())
    expect(screen.getByText('media:1')).toBeInTheDocument()
  })
})

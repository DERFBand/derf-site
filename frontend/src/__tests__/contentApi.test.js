jest.mock('../lib/api', () => ({
  api: {
    get: jest.fn(),
  },
}))

import { api } from '../lib/api'
import {
  fetchEvents,
  fetchHomeContent,
  fetchMediaList,
  fetchPressItems,
  fetchReleases,
  fetchSiteLinks,
  fetchSiteSettings,
} from '../lib/contentApi'

describe('contentApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches home content', async () => {
    api.get.mockResolvedValueOnce({ data: { latest_release: { id: 1 } } })
    await expect(fetchHomeContent('en')).resolves.toEqual({ latest_release: { id: 1 } })
    expect(api.get).toHaveBeenCalledWith('/api/v1/content/home', { params: { lang: 'en' } })
  })

  it('fetches list endpoints with defaults', async () => {
    api.get.mockResolvedValue({ data: null })
    await expect(fetchMediaList()).resolves.toEqual([])
    await expect(fetchReleases('en')).resolves.toEqual([])
    await expect(fetchPressItems('en')).resolves.toEqual([])
    await expect(fetchEvents('en')).resolves.toEqual([])
    await expect(fetchSiteLinks()).resolves.toEqual([])
  })

  it('fetches site settings values only', async () => {
    api.get.mockResolvedValueOnce({ data: { values: { site_name: 'DERF' } } })
    await expect(fetchSiteSettings('ru')).resolves.toEqual({ site_name: 'DERF' })
    expect(api.get).toHaveBeenCalledWith('/api/v1/content/settings', { params: { lang: 'ru' } })
  })
})

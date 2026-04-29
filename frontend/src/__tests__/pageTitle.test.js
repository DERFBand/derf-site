import { buildPageTitle } from '../lib/pageTitle'

describe('buildPageTitle', () => {
  it('builds title with page and site name', () => {
    expect(buildPageTitle('Music', 'D.E.R.F.')).toBe('Music — D.E.R.F.')
  })

  it('returns site only if page is missing', () => {
    expect(buildPageTitle('', 'D.E.R.F.')).toBe('D.E.R.F.')
  })

  it('returns page only if site is missing', () => {
    expect(buildPageTitle('Music', '')).toBe('Music')
  })
})

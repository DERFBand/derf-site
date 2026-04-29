jest.mock('next-i18next', () => ({
  useTranslation: () => ({ t: (key) => key, i18n: { language: 'en' } }),
}))

jest.mock('next/router', () => ({
  useRouter: () => ({
    locale: 'en',
    pathname: '/music',
    asPath: '/music',
    push: jest.fn(),
  }),
}))

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: null, logout: jest.fn(), loading: false }),
}))

import { fireEvent, render, screen } from '@testing-library/react'

import EventCard from '../components/EventCard'
import Header from '../components/Header'
import Hero from '../components/Hero'
import MediaGrid from '../components/MediaGrid'

describe('components', () => {
  it('renders EventCard with actions', () => {
    render(
      <EventCard
        event={{
          title: 'Show',
          venue: 'Club',
          city: 'City',
          start_at: '2030-01-01T10:00:00',
          ticket_url: 'https://ticket',
          source_url: 'https://source',
        }}
      />
    )
    expect(screen.getByText('Show')).toBeInTheDocument()
    expect(screen.getByText('actions.tickets')).toBeInTheDocument()
    expect(screen.getByText('actions.source')).toBeInTheDocument()
  })

  it('renders MediaGrid list and null on empty', () => {
    const { rerender } = render(<MediaGrid items={[{ id: 1, url: 'https://m', media_type: 'photo' }]} />)
    expect(screen.getByRole('link')).toBeInTheDocument()
    rerender(<MediaGrid items={[]} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('renders Hero primary sections', () => {
    render(<Hero latestRelease={{ title: 'Rel' }} nextEvent={{ title: 'Event' }} />)
    expect(screen.getAllByText('Rel').length).toBeGreaterThan(0)
    expect(screen.getByText('Event')).toBeInTheDocument()
  })

  it('renders Header and switches to text logo on image error', () => {
    render(<Header />)
    const img = screen.getByRole('img')
    fireEvent.error(img)
    expect(screen.getByText('brand')).toBeInTheDocument()
  })
})

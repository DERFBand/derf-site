import { useEffect, useState } from 'react'
import Hero from '../components/Hero'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function Home() {
  const [events, setEvents] = useState([])
  const [releases, setReleases] = useState([])

  useEffect(() => {
    fetch(`${API}/api/v1/events`)
      .then(res => res.json())
      .then(setEvents)
      .catch(console.error)

    fetch(`${API}/api/v1/content/releases`)
      .then(res => res.json())
      .then(setReleases)
      .catch(console.error)
  }, [])

  const nextEvent = events?.[0]
  const latestRelease = releases?.[0]

  return (
    <>
      <Hero title="D.E.R.F." subtitle="Official band site" />

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-6">

          <div className="card">
            <h3 className="font-semibold">Upcoming show</h3>
            <p className="mt-2 text-soft">
              {nextEvent
                ? `${nextEvent.title} — ${new Date(nextEvent.date).toLocaleDateString()}`
                : 'No upcoming events'}
            </p>
          </div>

          <div className="card">
            <h3 className="font-semibold">Latest release</h3>
            <p className="mt-2 text-soft">
              {latestRelease
                ? latestRelease.title || latestRelease.external_url
                : 'No releases yet'}
            </p>
          </div>

          <div className="card">
            <h3 className="font-semibold">Media</h3>
            <p className="mt-2 text-soft">
              Photos and videos from live shows
            </p>
          </div>

        </div>
      </section>
    </>
  )
}
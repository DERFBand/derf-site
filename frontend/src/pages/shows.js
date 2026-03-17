import Header from '../components/Header'
import Footer from '../components/Footer'
import useSWR from 'swr'
import axios from 'axios'
import EventCard from '../components/EventCard'

const fetcher = url => axios.get(url).then(r => r.data)

export default function Shows(){
  const {data, error} = useSWR('/api/shows', () => fetcher((process.env.NEXT_PUBLIC_API_URL || '') + '/api/v1/events'))
  const events = data || []
  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Shows</h2>
        <div className="mt-6 grid gap-4">
          {events.map(e => <EventCard key={e.id} event={e} />)}
        </div>
      </main>
      <Footer />
    </div>
  )
}
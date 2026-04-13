import useSWR from 'swr'
import axios from 'axios'
import MediaGrid from '../components/MediaGrid'

const fetcher = url => axios.get(url).then(r => r.data)

export default function Media(){
  const {data} = useSWR('/api/media', () => fetcher((process.env.NEXT_PUBLIC_API_URL || '') + '/api/v1/media/list'))
  const items = data || []
  return (
    <div>
      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Media</h2>
        <MediaGrid items={items} />
      </main>
    </div>
  )
}

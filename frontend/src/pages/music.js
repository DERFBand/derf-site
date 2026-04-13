import { useEffect, useState } from 'react'
import API from '../lib/api'
import { useTranslation } from 'next-i18next'

export default function Music(){
  const { t } = useTranslation('common')
  const [music, setMusic] = useState([])

  useEffect(() => {
    API.get('/api/v1/media/list')
      .then(res => setMusic(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div>
      <main className="max-w-6xl mx-auto p-6 mt-20">
        <h2 className="text-2xl font-bold mb-4">{t('Music')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded bg-slate-900">
            <h3 className="font-semibold">{t('Latest release')}</h3>
            <p className="mt-2 opacity-70">band.link: <a className="underline" href="https://band.link/UXd3W">UXd3W</a></p>
          </div>
          <div className="p-4 border rounded bg-slate-900">
            <h3 className="font-semibold">All releases</h3>
            <ul className="mt-2 opacity-80">
              <li><a className="underline" href="https://band.link/UXd3W">UXd3W — primary release</a></li>
              <li><a className="underline" href="https://band.link/SJMpv">SJMpv — other release</a></li>
            </ul>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {music.map(item => (
              <div key={item.id} className="card">
                <img src={item.cover_url} alt={item.title} />
                <h2>{item.title}</h2>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

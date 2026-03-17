import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Press(){
  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Press</h2>
        <ul className="mt-4 space-y-3">
          <li className="p-3 border rounded bg-slate-900"><a className="underline" href="https://vk.com/@derfmusic-teksty-pesen-derf">Тексты песен и заметки</a></li>
          <li className="p-3 border rounded bg-slate-900"><a className="underline" href="https://vk.com/@derfmusic-o-zapisi-nastoyaschego-rokametala">О записи настоящего рокаметала</a></li>
          <li className="p-3 border rounded bg-slate-900"><a className="underline" href="https://vkvideo.ru/@derfmusic/all">VK Video archive</a></li>
        </ul>
      </main>
      <Footer />
    </div>
  )
}
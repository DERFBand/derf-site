import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Home(){
  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-6">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-10">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">D.E.R.F.</h1>
            <p className="mt-4 text-lg opacity-80">Latest release: <a className="underline" href="https://band.link/UXd3W">band.link/UXd3W</a></p>
            <div className="mt-6 flex gap-3">
              <a href="/music" className="px-4 py-2 border rounded">Music</a>
              <a href="/shows" className="px-4 py-2 bg-white text-black rounded">Shows</a>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden bg-gradient-to-br from-slate-800 to-slate-700 p-4">
            <div className="w-full h-56 bg-black/40 flex items-center justify-center">Audio placeholder</div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
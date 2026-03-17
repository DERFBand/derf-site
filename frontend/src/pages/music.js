import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Music(){
  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-6 mt-20">
        <h2 className="text-2xl font-bold mb-4">Music</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded bg-slate-900">
            <h3 className="font-semibold">Latest release</h3>
            <p className="mt-2 opacity-70">band.link: <a className="underline" href="https://band.link/UXd3W">UXd3W</a></p>
          </div>
          <div className="p-4 border rounded bg-slate-900">
            <h3 className="font-semibold">All releases</h3>
            <ul className="mt-2 opacity-80">
              <li><a className="underline" href="https://band.link/UXd3W">UXd3W — primary release</a></li>
              <li><a className="underline" href="https://band.link/SJMpv">SJMpv — other release</a></li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

// frontend/src/pages/index.js
import Header from '../components/Header'
import Footer from '../components/Footer'
import Hero from '../components/Hero'

export default function Home(){
  return (
    <div>
      <Header />
      <main>
        <Hero title="D.E.R.F." subtitle="Official band site" />
        <section className="max-w-6xl mx-auto p-6">
          {/* Example short feature row */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card">
              <h3 className="font-semibold">Upcoming show</h3>
              <p className="mt-2 text-soft">Jam Fest — 25 Jan 2026 at Money Honey</p>
            </div>
            <div className="card">
              <h3 className="font-semibold">Latest release</h3>
              <p className="mt-2 text-soft">band.link/UXd3W — out now</p>
            </div>
            <div className="card">
              <h3 className="font-semibold">Media</h3>
              <p className="mt-2 text-soft">Videos, photos and live clips</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
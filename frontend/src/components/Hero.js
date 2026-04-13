export default function Hero({ title = "D.E.R.F.", subtitle = "Official band site", ctaUrl = "/music" }) {
  return (
    <section
      className="hero"
      style={{ backgroundImage: "url('/assets/bg-hero.jpg')" }}
      aria-label="Band hero"
    >
      <div className="hero-content max-w-6xl mx-auto px-6 md:px-8 py-40">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          <div>
            <h1 className="hero-title font-heading">{title}</h1>
            <p className="mt-4 text-soft text-lg max-w-xl">
              Heavy riffs, honest lyrics, and a live energy that hits hard. Latest release — <a className="underline text-accent" href="https://band.link/UXd3W">listen on platforms</a>.
            </p>

            <div className="mt-6 flex gap-3">
              <a className="btn btn-primary" href={ctaUrl}>Listen / Buy</a>
              <a className="btn btn-ghost" href="/shows">Tour dates</a>
            </div>
          </div>

          <div className="hidden md:block">
            {/* Small release card */}
            <div className="card">
              <div className="text-sm text-soft">Latest release</div>
              <div className="mt-2 font-semibold">UXd3W — Single / EP</div>
              <div className="mt-4">
                <a className="btn btn-ghost" href="https://band.link/UXd3W">Open release</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grain" aria-hidden="true" />
    </section>
  )
}

export default function MediaGrid({ items = [] }) {
  if (!items.length) return null

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const src = item.thumbnail_url || item.url
        const title = item.title || item.alt_text || item.caption || 'Media'
        const badge = (item.media_type || 'media').toUpperCase()

        return (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-red-500/30 hover:bg-white/[0.05]"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-black">
              <img
                src={src}
                alt={title}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
              <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-100 backdrop-blur">
                {badge}
              </span>
            </div>
            <div className="space-y-2 p-4">
              <div className="text-sm font-semibold text-white">{title}</div>
              {item.caption ? <p className="text-sm leading-6 text-zinc-400">{item.caption}</p> : null}
            </div>
          </a>
        )
      })}
    </div>
  )
}

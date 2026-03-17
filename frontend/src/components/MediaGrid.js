// frontend/src/components/MediaGrid.js
export default function MediaGrid({items}){
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {items.map(i => (
        <a key={i.id} href={i.url} className="block rounded overflow-hidden bg-slate-900 p-0 card">
          <div className="h-48 bg-black/30 flex items-center justify-center overflow-hidden">
            {/* Use <img> to let browser lazy-load */}
            <img src={i.thumbnail_url || i.url} alt={i.alt_text || i.title || 'Media'} loading="lazy" className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105" />
          </div>
          <div className="p-3">
            <div className="text-sm text-soft">{i.media_type.toUpperCase()}</div>
            <div className="mt-1 font-semibold">{i.alt_text || i.title || 'Untitled'}</div>
          </div>
        </a>
      ))}
    </div>
  )
}
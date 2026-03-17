export default function MediaGrid({items}){
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map(i => (
        <a key={i.id} href={i.url} className="block rounded overflow-hidden bg-slate-900 p-3">
          <div className="h-36 bg-black/40 flex items-center justify-center">{i.media_type}</div>
          <div className="mt-2 text-sm opacity-80">{i.alt_text || i.title || 'Media'}</div>
        </a>
      ))}
    </div>
  )
}
export default function EventCard({event}){
  return (
    <article className="p-4 border rounded bg-slate-900 flex items-center justify-between">
      <div>
        <div className="text-sm opacity-70">{new Date(event.start_at).toLocaleString()}</div>
        <div className="font-semibold text-lg">{event.title}</div>
        <div className="text-sm opacity-60">{event.venue} — {event.city}</div>
      </div>
      <div className="flex gap-2">
        <a className="px-3 py-2 border rounded" href="#">Details</a>
      </div>
    </article>
  )
}
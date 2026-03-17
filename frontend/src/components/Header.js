import Link from 'next/link'
export default function Header() {
  return (
    <header className="max-w-6xl mx-auto p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="text-2xl font-bold">D.E.R.F.</div>
        <nav className="hidden md:flex gap-4 opacity-90">
          <Link href="/music">Music</Link>
          <Link href="/shows">Shows</Link>
          <Link href="/media">Media</Link>
          <Link href="/press">Press</Link>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <a className="px-4 py-2 border rounded" href="#">Subscribe</a>
      </div>
    </header>
  )
}
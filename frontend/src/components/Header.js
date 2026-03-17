import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const [imgError, setImgError] = useState(false);
  const [isLogoHovering, setLogoIsHovered] = useState(false);

  return (
    <header className="bg-transparent fixed top-0 left-0 right-0 z-40">
      <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-3">
          {!imgError ? (
            <Image
              src={isLogoHovering ? "/logo_bright.png" : "/logo.png"}
              alt="D.E.R.F. logo"
              width={150}
              height={100}
              onError={() => setImgError(true)}
              onMouseEnter={() => setLogoIsHovered(true)}
              onMouseLeave={() => setLogoIsHovered(false)}
            />
          ) : (
            <span className="font-heading text-lg">D.E.R.F.</span>
          )}
        </Link>

        <nav className="hidden md:flex gap-6 items-center text-sm">
          <Link href="/music" className="nav-underline">Music</Link>
          <Link href="/shows" className="nav-underline">Shows</Link>
          <Link href="/media" className="nav-underline">Media</Link>
          <Link href="/press" className="nav-underline">Press</Link>

          <a className="ml-4 btn btn-primary" href="https://band.link/UXd3W">
            Listen
          </a>
        </nav>

        <div className="md:hidden">
          <Link href="/shows" className="btn btn-ghost">
            Shows
          </Link>
        </div>

      </div>
    </header>
  )
}

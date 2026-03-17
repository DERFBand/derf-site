// frontend/src/components/Footer.js
export default function Footer(){
  return (
    <footer className="mt-20 border-t border-slate-800 py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-soft">&copy; {new Date().getFullYear()} D.E.R.F. — All rights reserved</div>

        <div className="flex items-center gap-4">
          <a className="text-soft hover:text-white" href="https://vk.com/derfmusic" aria-label="VK">VK</a>
          <a className="text-soft hover:text-white" href="https://www.youtube.com/@D_E_R_F" aria-label="YouTube">YouTube</a>
          <a className="text-soft hover:text-white" href="https://band.link/UXd3W" aria-label="Bandlink">Listen</a>
        </div>
      </div>
    </footer>
  )
}
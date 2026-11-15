import { Link, NavLink } from 'react-router-dom'
import { Rocket } from 'lucide-react'

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm transition ${isActive ? 'text-cyan-300 bg-cyan-500/10' : 'text-slate-300 hover:text-cyan-200 hover:bg-white/5'}`

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-sky-500/20 bg-[#020617]/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-wide text-white">
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 border border-sky-400/30 overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-br from-sky-400/10 to-transparent" />
            <Rocket size={18} className="text-sky-300 relative" />
          </span>
          <span className="text-lg">ASTRA</span>
          <span className="hidden sm:inline text-[10px] uppercase tracking-widest text-sky-300/80 ml-1">Mission Control</span>
        </Link>
        <div className="flex flex-wrap items-center gap-1">
          <NavLink to="/" className={linkClass} end>Home</NavLink>
          <NavLink to="/missions" className={linkClass}>Missions</NavLink>
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/manage" className={linkClass}>Manage</NavLink>
          <NavLink to="/emergencies" className={linkClass}>Emergencies</NavLink>
          <NavLink to="/results" className={linkClass}>Results</NavLink>
          <NavLink to="/learn" className={linkClass}>Learn</NavLink>
        </div>
      </div>
    </nav>
  )
}

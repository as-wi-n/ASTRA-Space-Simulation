import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Dashboard from './Dashboard.jsx'
import MissionResults from './MissionResults.jsx'
import LearnScience from './LearnScience.jsx'
import AboutData from './AboutData.jsx'
import { useMission } from '../hooks/useMission.js'

const tabs = [
  { id: 'dashboard', label: 'Mission Control', path: '/dashboard' },
  { id: 'results', label: 'Mission Report', path: '/results' },
  { id: 'learn', label: 'Learn Science', path: '/learn' },
  { id: 'about', label: 'About the Data', path: '/about' },
]

const pathToTab = {
  '/dashboard': 'dashboard',
  '/results': 'results',
  '/learn': 'learn',
  '/about': 'about',
}

export default function GamePage({ astronautName, destination, onExit }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { state, restart, clearMission } = useMission()

  useEffect(() => {
    if (!state && location.pathname !== '/') {
      navigate('/', { replace: true })
    }
  }, [state, location.pathname, navigate])

  const tab = pathToTab[location.pathname] ?? 'dashboard'

  useEffect(() => {
    // Land on Mission Control after a launch if user opens an unknown path
    if (!pathToTab[location.pathname] && state) {
      navigate('/dashboard', { replace: true })
    }
  }, [location.pathname, state, navigate])

  if (!state) {
    return (
      <div className="min-h-screen grid place-items-center text-slate-300">
        <p>Preparing mission simulation…</p>
      </div>
    )
  }

  const view = {
    dashboard: <Dashboard />,
    results: <MissionResults />,
    learn: <LearnScience />,
    about: <AboutData />,
  }[tab]

  const select = (id) => {
    const target = tabs.find((t) => t.id === id)?.path ?? '/dashboard'
    navigate(target)
  }

  return (
    <div className="min-h-screen text-slate-100 bg-[#080e1b]">
      {/* Game command header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-[#080e1b]/80 border-b border-sky-500/20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] tracking-widest text-sky-300 uppercase">ASTRA Command</span>
            </div>
            <h1 className="text-xl font-bold text-white">
              {astronautName} · {destination === 'Moon' ? 'Lunar Outpost: First Light' : 'Red Frontier: Beyond Earth'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => select('dashboard')} className="px-3 py-2 rounded-lg bg-sky-500 text-slate-950 text-sm font-semibold">MISSION CONTROL</button>
            <button
              onClick={() => {
                restart()
                navigate('/dashboard')
              }}
              className="px-3 py-2 rounded-lg border border-sky-400/30 text-sky-200 hover:bg-sky-500/10 text-sm"
            >
              Restart Mission
            </button>
            <button
              onClick={() => {
                clearMission()
                onExit?.()
                navigate('/', { replace: true })
              }}
              className="px-3 py-2 rounded-lg border border-white/10 text-slate-200 hover:bg-white/5 text-sm"
            >
              ABORT / MAIN MENU
            </button>
          </div>
        </div>
      </div>

      {/* In-game navigation tabs */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap gap-2 border-b border-white/5">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => select(t.id)}
            className={`px-4 py-2 rounded-lg text-sm transition ${tab === t.id ? 'bg-sky-500/15 text-sky-300 border border-sky-400/30' : 'text-slate-300 hover:text-sky-200 hover:bg-white/5'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Embedded mission screens */}
      <div>
        {view}
      </div>
    </div>
  )
}

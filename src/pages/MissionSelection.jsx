import { useNavigate } from 'react-router-dom'
import { Moon, Orbit } from 'lucide-react'
import { useMission } from '../hooks/useMission'
import { MISSIONS } from '../simulation/missionEngine'

function MissionCard({ mission, onSelect }) {
  const Icon = mission.id === 'moon' ? Moon : Orbit
  return (
    <div className="glass rounded-2xl p-6 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-400/20"><Icon className="text-cyan-300" /></span>
          <h2 className="text-2xl font-bold text-white">{mission.name}</h2>
        </div>
        <span className="text-xs px-2 py-1 rounded-full border border-amber-400/30 text-amber-300 bg-amber-500/10">Difficulty: {mission.difficulty}</span>
      </div>
      <p className="text-slate-300 mb-4">{mission.description}</p>
      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
        <div className="rounded-lg bg-slate-900/50 border border-white/5 p-3"><div className="text-slate-400">Duration</div><div className="text-white font-semibold">{mission.durationDays} days</div></div>
        <div className="rounded-lg bg-slate-900/50 border border-white/5 p-3"><div className="text-slate-400">Crew</div><div className="text-white font-semibold">{mission.astronauts} astronauts</div></div>
      </div>
      <h3 className="font-semibold text-cyan-200 mb-2">Environmental Challenges</h3>
      <ul className="text-sm text-slate-300 space-y-2 mb-5 list-disc ml-5">
        {mission.challenges.map((c) => <li key={c}>{c}</li>)}
      </ul>
      <div className="mt-auto">
        <button onClick={onSelect} className="w-full py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition">Select Mission</button>
      </div>
    </div>
  )
}

export default function MissionSelection() {
  const { startMission } = useMission()
  const navigate = useNavigate()
  const choose = (id) => {
    startMission(id)
    navigate('/dashboard')
  }
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-cyan-300 uppercase tracking-wider text-sm">Mission Selection</p>
        <h1 className="text-3xl md:text-4xl font-bold text-white mt-1">Choose Your Destination</h1>
        <p className="text-slate-300 mt-2 max-w-3xl">Each destination presents unique environmental conditions. Your resource strategy must adapt to survive.</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <MissionCard mission={MISSIONS.moon} onSelect={() => choose('moon')} />
        <MissionCard mission={MISSIONS.mars} onSelect={() => choose('mars')} />
      </div>
      <div className="mt-8 glass rounded-xl p-4 text-sm text-slate-300">
        <strong className="text-cyan-200">Note:</strong> Initial resources are illustrative simulation values (e.g. Oxygen 120, Water 240 L, Food 120, Electricity 500, Battery 100%) for three astronauts, not actual NASA mission specifications.
      </div>
    </div>
  )
}

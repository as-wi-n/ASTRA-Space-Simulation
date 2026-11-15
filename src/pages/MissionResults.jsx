import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMission } from '../hooks/useMission'

export default function MissionResults() {
  const { state, hasMission, restart, startMission } = useMission()
  const navigate = useNavigate()
  useEffect(() => { if (!hasMission) navigate('/') }, [hasMission, navigate])
  if (!state) return null
  const result = state.result
  if (!result) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-white mb-3">Mission In Progress</h1>
        <p className="text-slate-300 mb-6">No results yet. Complete the mission or reach a failure condition to generate a report.</p>
        <Link to="/dashboard" className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-semibold">Back to Dashboard</Link>
      </div>
    )
  }

  const success = result.status === 'success'
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <div className={`glass rounded-2xl p-6 border ${success ? 'border-emerald-400/30' : 'border-red-400/30'}`}>
        <p className="text-sm uppercase tracking-wider text-slate-300">Mission Report</p>
        <h1 className={`text-3xl md:text-4xl font-bold mt-1 ${success ? 'text-emerald-300' : 'text-red-300'}`}>{success ? 'Mission Success' : 'Mission Failure'}</h1>
        <p className="text-slate-200 mt-2">{result.reason}</p>
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-3 mt-5">
          {[
            ['Survival Days', result.survivedDays],
            ['Mission Score', result.score],
            ['Crew Health', `${result.averageCrewHealth ?? '—'}%`],
            ['Science', `${result.scientificPoints ?? 0} pts`],
            ['Emergencies', `${result.emergenciesHandled}/${result.emergenciesEncountered} handled`],
            ['Difficulty', (result.difficulty ?? 'survival').replace(/^./, (c) => c.toUpperCase())],
          ].map(([k,v]) => (
            <div key={k} className="rounded-lg bg-slate-900/50 border border-white/5 p-3">
              <div className="text-xs text-slate-400 uppercase">{k}</div>
              <div className="text-white font-semibold mt-1">{v}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {(result.crew ?? []).map((c) => (
            <span key={c.name} className="text-[11px] px-2 py-1 rounded-full bg-slate-900/60 border border-white/10 text-slate-300">{c.name} · {c.profession} · HP {c.health}</span>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          ['Remaining Oxygen', result.remaining.oxygen],
          ['Remaining Water', `${result.remaining.water} L`],
          ['Remaining Food', result.remaining.food],
          ['Remaining Electricity', result.remaining.electricity],
          ['Battery', `${result.remaining.battery ?? 0}%`],
          ['Spare Parts', result.remaining.spareParts ?? 0],
        ].map(([k,v]) => (
          <div key={k} className="glass rounded-xl p-4"><div className="text-slate-400 text-sm">{k}</div><div className="text-2xl font-bold text-white">{v}</div></div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass rounded-xl p-5">
          <h2 className="text-xl font-semibold text-emerald-300 mb-2">Good Decisions</h2>
          <ul className="list-disc ml-5 text-slate-300 space-y-1">{result.good.map((x,i)=><li key={i}>{x}</li>)}</ul>
        </div>
        <div className="glass rounded-xl p-5">
          <h2 className="text-xl font-semibold text-amber-300 mb-2">Bad Decisions / Risks</h2>
          <ul className="list-disc ml-5 text-slate-300 space-y-1">{result.bad.map((x,i)=><li key={i}>{x}</li>)}</ul>
        </div>
        <div className="glass rounded-xl p-5">
          <h2 className="text-xl font-semibold text-red-300 mb-2">Resource Management Mistakes</h2>
          <ul className="list-disc ml-5 text-slate-300 space-y-1">{result.mistakes.map((x,i)=><li key={i}>{x}</li>)}</ul>
        </div>
        <div className="glass rounded-xl p-5">
          <h2 className="text-xl font-semibold text-cyan-300 mb-2">Suggestions for Next Mission</h2>
          <ul className="list-disc ml-5 text-slate-300 space-y-1">{result.suggestions.map((x,i)=><li key={i}>{x}</li>)}</ul>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={() => { restart(); navigate('/dashboard') }} className="px-5 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold">Restart Mission</button>
        <button onClick={() => { startMission(state.missionId === 'moon' ? 'mars' : 'moon', state.astronautName, state.difficulty); navigate('/dashboard') }} className="px-5 py-3 rounded-lg border border-cyan-400/30 text-cyan-200 hover:bg-cyan-500/10">Try Other Mission</button>
      </div>
    </div>
  )
}

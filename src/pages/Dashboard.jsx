import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Droplets, Wind, Apple, Zap, Battery, Thermometer, Radiation, Sun, Users, Activity, Play, Pause, RotateCcw, Wrench, FlaskConical, Rocket, Gauge, Trash2, Radio } from 'lucide-react'
import { useMission } from '../hooks/useMission'
import ResourceCard from '../components/ResourceCard'
import MissionChart from '../components/MissionChart'
import EmergencyModal from '../components/EmergencyModal'
import LunarScene from '../components/LunarScene'
import { getDailyRates } from '../simulation/resourceManager'
import { equipmentDefs } from '../data/equipment'
import KidMissionControl from './KidMissionControl'
import { getPhaseForDay, DIFFICULTIES, CREW, EXPLORATION } from '../simulation/config'
import { CREW_TASKS } from '../simulation/missionEngine'

function statusFor(pct) {
  if (pct > 60) return 'Stable'
  if (pct > 30) return 'Warning'
  return 'Critical'
}

export default function Dashboard() {
  const { state, hasMission, nextDay, chooseEmergency, toggleEquipment, toggleOptionalLoads, repairEquipment, sendRoverSurvey, sendOnEva, setCrewTask, abortRoverMission, askEarth } = useMission()
  const navigate = useNavigate()
  const [running, setRunning] = useState(true)
  const [evaAstronaut, setEvaAstronaut] = useState('maya')
  const [hiddenSummaryDay, setHiddenSummaryDay] = useState(null)

  useEffect(() => {
    if (!hasMission) navigate('/')
  }, [hasMission, navigate])

  useEffect(() => {
    if (state?.phase === 'completed') navigate('/results')
  }, [state?.phase, navigate])

  if (!state) return null
  if (state.difficulty === 'kid') return <KidMissionControl />
  const { resources, environment, atmosphere, equipment, equipmentCondition, mission, day, log, history, pendingEmergency, astronautName, difficulty, stats } = state
  const rates = getDailyRates(state)
  const pct = (c, m) => (m ? (c / m) * 100 : 0)
  // Dust-storm visuals only apply to Mars; lunar night is not a dust storm.
  const storm = mission.id === 'mars' && (environment.solarEfficiency < 60 || pendingEmergency?.type === 'dust_storm' || environment.sunlight < 0.55)
  const mars = mission.id === 'mars'
  const lunarNight = !mars && environment.sunlight < 0.3
  const crew = state.astronauts
  const avgFatigue = Math.round(crew.reduce((s, c) => s + c.fatigue, 0) / crew.length)
  const phase = getPhaseForDay(day)
  const difficultyInfo = DIFFICULTIES[difficulty] ?? DIFFICULTIES.survival
  const assignments = Object.fromEntries(crew.map((c) => [c.id, c.task]))
  const timeLeft = (current, rate) => (rate < -0.01 ? current / -rate : null)
  const timeNote = (current, rate) => {
    const d = timeLeft(current, rate)
    return d !== null && d < 10 ? ` · ≈ ${Math.floor(d)} d left` : ''
  }
  const roverNote = (key) => {
    const a = EXPLORATION[key]
    return `${a.baseScience} base science · ${a.batteryCost} battery · ${a.electricityCost} power · returns in 2 Sols`
  }
  const evaAction = EXPLORATION.geologicalSample
  const evaCrew = crew.find((c) => c.id === evaAstronaut)
  const evaBlocked = state.phase !== 'active' || resources.oxygen.current < 12 || (equipmentCondition?.spacesuit ?? 90) < 40 || resources.battery.current < evaAction.batteryCost || evaCrew?.status !== 'active'

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="glass rounded-xl p-4 border-sky-500/25 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 via-transparent to-indigo-500/5 pointer-events-none" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-sky-300 uppercase tracking-wider text-xs">Live Mission Control · Space Night Ops</p>
            </div>
            <h1 className="text-3xl font-bold text-white">{mission.destination}</h1>
            <p className="text-slate-400">Commander <span className="text-sky-300 font-semibold">{astronautName || 'Astronaut'}</span> · Telemetry active · monitor systems and command daily operations</p>
          </div>

        </div>
      </div>

      <section className="grid md:grid-cols-5 gap-3">
        {[
          ['Destination', mission.name],
          ['Mission Day', `${Math.min(day, state.missionLength)} / ${state.missionLength}`],
          ['Duration', `${state.missionLength} mission Sols`],
          ['Difficulty', difficultyInfo.label],
          ['Status', state.phase === 'emergency' ? 'EMERGENCY' : 'Active'],
        ].map(([k, v]) => (
          <div key={k} className="glass rounded-xl p-4">
            <div className="text-xs text-slate-400 uppercase tracking-wide">{k}</div>
            <div className={`mt-1 font-semibold ${k==='Status' && v==='EMERGENCY' ? 'text-amber-300' : 'text-white'}`}>{v}</div>
          </div>
        ))}
      </section>

      <section className="glass rounded-xl p-4 border-sky-500/20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sky-300 uppercase tracking-wider text-xs">Phase {phase.phase} / 6</p>
            <h2 className="text-xl font-semibold text-white">{phase.name}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {phase.objectives.map((o) => (
              <span key={o} className="text-[11px] px-2 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-200">{o}</span>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2"><Activity size={18} className="text-sky-300"/>1. Base Surface Simulation</h2>
        <div className="grid lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 space-y-3">
            <LunarScene
              running={running}
              storm={storm}
              roverTask={state.roverMission?.actionKey ?? 'patrol'}
              day={Math.min(day, state.missionLength)}
              mars={mars}
              night={lunarNight}
              environment={environment}
              scene={state.scene}
              pendingEmergency={pendingEmergency}
              equipment={equipment}
              phase={state.phase}
              assignments={assignments}
              roverMission={state.roverMission}
            />
            <div className="flex flex-wrap gap-2">
              <button onClick={nextDay} disabled={state.phase !== 'active' || !running} title={!running ? 'Resume the simulation to advance the day' : 'Advance one mission Sol'} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-semibold">Advance Day <span>→</span></button>
              <button onClick={() => setRunning((v) => !v)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-sky-400/30 text-sky-100 hover:bg-sky-500/10 transition">{running ? <Pause size={16}/> : <Play size={16}/>} {running ? 'Pause simulation' : 'Resume simulation'}</button>
              <button onClick={() => abortRoverMission()} disabled={!state.roverMission} title={state.roverMission ? 'Recall the rover now; it returns at the start of the next Sol' : 'Rover is already at base'} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-400/30 text-amber-200 hover:bg-amber-500/10 transition disabled:opacity-40 disabled:cursor-not-allowed"><RotateCcw size={16}/>{state.roverMission ? 'Recall rover to base' : 'Rover at base'}</button>
            </div>
          </div>
          <aside className="lg:col-span-2 space-y-4">
            <div className="glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white flex items-center gap-2"><Users size={16} className="text-sky-300"/>Crew Status</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300">AVG HEALTH {Math.round(crew.reduce((s, c) => s + c.health, 0) / crew.length)}</span>
              </div>
              <div className="space-y-2">
                {crew.map((c) => {
                  const initials = c.name.split(' ').map((p) => p[0]).join('')
                  const fatigueTone = c.fatigue < 40 ? 'bg-sky-400' : c.fatigue < 70 ? 'bg-amber-400' : 'bg-red-400'
                  return (
                    <div key={c.id} className="p-2 rounded-xl bg-slate-900/50 border border-white/5 hover:border-sky-400/20 transition">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold text-slate-950" style={{ background: c.color }}>{initials}<span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-950 ${c.status === 'active' ? 'bg-emerald-400' : c.status === 'incapacitated' ? 'bg-amber-400' : 'bg-red-500'}`} /></div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-white text-sm leading-tight">{c.name}</div>
                          <div className="text-[11px] text-slate-400">{c.profession} · RAD {Math.round(c.radiationDose)} mSv</div>
                        </div>
                        <div className="text-right"><div className="text-lg font-bold text-white leading-none">{Math.round(c.health)}</div><div className="text-[10px] text-slate-400">health</div></div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2 text-[10px] text-slate-400">
                        <div><div className="flex justify-between"><span>Fatigue</span><span className="text-slate-300">{Math.round(c.fatigue)}</span></div><div className="h-1.5 rounded bg-slate-800 overflow-hidden mt-0.5"><div className={`h-full ${fatigueTone}`} style={{ width: `${c.fatigue}%` }} /></div></div>
                        <div><div className="flex justify-between"><span>Hydration</span><span className="text-slate-300">{Math.round(c.hydration)}</span></div><div className="h-1.5 rounded bg-slate-800 overflow-hidden mt-0.5"><div className="h-full bg-cyan-400" style={{ width: `${c.hydration}%` }} /></div></div>
                        <div><div className="flex justify-between"><span>Nutrition</span><span className="text-slate-300">{Math.round(c.nutrition)}</span></div><div className="h-1.5 rounded bg-slate-800 overflow-hidden mt-0.5"><div className="h-full bg-emerald-400" style={{ width: `${c.nutrition}%` }} /></div></div>
                      </div>
                      <select
                        aria-label={`Assigned task for ${c.name}`}
                        value={c.task}
                        onChange={(e) => setCrewTask(c.id, e.target.value)}
                        disabled={state.phase === 'completed'}
                        className="mt-2 w-full bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-[11px] text-slate-200"
                      >
                        {CREW_TASKS.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  )
                })}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {state.lastCycleSummary && state.lastCycleSummary.day !== hiddenSummaryDay && (() => {
        const s = state.lastCycleSummary
        const fmt = (v, unit = '') => `${v >= 0 ? '+' : ''}${v.toFixed(1)}${unit}`
        const tileTone = (v) => (v > 0 ? 'text-emerald-300' : v < 0 ? 'text-red-300' : 'text-slate-200')
        const tiles = [
          ['Oxygen', fmt(s.oxygenDelta), tileTone(s.oxygenDelta)],
          ['Water', fmt(s.waterDelta, ' L'), tileTone(s.waterDelta)],
          ['Food', fmt(s.foodDelta), tileTone(s.foodDelta)],
          ['Power', fmt(s.electricityDelta), tileTone(s.electricityDelta)],
          ['Battery', fmt(s.batteryDelta, '%'), tileTone(s.batteryDelta)],
          ['CO2', fmt(s.co2Delta, ' ppm'), tileTone(-s.co2Delta)],
          ['Pressure', fmt(s.pressureDelta, ' kPa'), tileTone(s.pressureDelta)],
          ['Temp', fmt(s.temperatureDelta, '°C'), tileTone(-s.temperatureDelta)],
          ['Radiation', fmt(s.radiationDelta), tileTone(-s.radiationDelta)],
        ]
        return (
          <section className="glass rounded-xl p-4 border-sky-400/20">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div>
                <p className="text-sky-300 uppercase tracking-wider text-xs">Mission Cycle Summary</p>
                <h2 className="text-lg font-semibold text-white">Sol {s.day} — what happened</h2>
              </div>
              <button onClick={() => setHiddenSummaryDay(s.day)} className="text-xs px-3 py-1.5 rounded border border-white/10 text-slate-300 hover:bg-white/5">Dismiss</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-2 text-center">
              {tiles.map(([k, v, tone]) => (
                <div key={k} className="rounded-lg bg-slate-900/50 border border-white/5 px-2 py-2">
                  <div className="text-[9px] uppercase tracking-wider text-slate-400">{k}</div>
                  <div className={`text-xs font-semibold mt-1 ${tone}`}>{v}</div>
                </div>
              ))}
            </div>
            {s.warnings.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {s.warnings.map((w, i) => (
                  <span key={i} className={`text-[11px] px-2 py-1 rounded-full border ${w.level === 'danger' ? 'border-red-400/40 bg-red-500/10 text-red-300' : 'border-amber-400/40 bg-amber-500/10 text-amber-200'}`}>{w.text}</span>
                ))}
              </div>
            )}
          </section>
        )
      })()}

      <section>
        <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2"><Activity size={18} className="text-sky-300"/>2. Resource Overview</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ResourceCard icon={Wind} title="Oxygen" current={resources.oxygen.current} max={resources.oxygen.max} unit="units" rate={`${rates.oxygenDelta.toFixed(1)} / day${timeNote(resources.oxygen.current, rates.oxygenDelta)}`} status={statusFor(pct(resources.oxygen.current, resources.oxygen.max))} />
          <ResourceCard icon={Droplets} title="Water Supply" current={resources.water.current} max={resources.water.max} unit="L" rate={`${rates.waterDelta.toFixed(1)} / day${timeNote(resources.water.current, rates.waterDelta)}`} status={statusFor(pct(resources.water.current, resources.water.max))} />
          <ResourceCard icon={Apple} title="Food Supply" current={resources.food.current} max={resources.food.max} unit="units" rate={`${rates.foodDelta >= 0 ? '+' : ''}${rates.foodDelta.toFixed(1)} / day${timeNote(resources.food.current, rates.foodDelta)}${equipment.greenhouse ? rates.greenhouseMature ? ' · crops mature' : ` · crops ${state.greenhouseGrowth ?? 0}/${CREW.greenhouseGrowDays} Sols` : ''}`} status={statusFor(pct(resources.food.current, resources.food.max))} />
          <ResourceCard icon={Zap} title="Electricity" current={resources.electricity.current} max={resources.electricity.max} unit="units" rate={`Net ${rates.electricityNet >= 0 ? '+' : ''}${rates.electricityNet.toFixed(1)} / day${timeNote(resources.electricity.current, rates.electricityNet)}`} status={statusFor(pct(resources.electricity.current, resources.electricity.max))} />
          <ResourceCard icon={Battery} title="Battery Charge" current={resources.battery.current} max={resources.battery.max} unit="%" rate={rates.electricityNet >= 0 ? 'Charging (net positive)' : 'Discharging (net deficit)'} status={statusFor(resources.battery.current)} />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
          {[
            ['Spare Parts', resources.spareParts, resources.spareParts <= 1 ? 'text-amber-300' : 'text-white'],
            ['Waste', `${resources.waste.current.toFixed(1)} kg`, resources.waste.current > 22 ? 'text-amber-300' : 'text-white'],
            ['Science', `${stats.scientificPoints} pts`, 'text-violet-300'],
            ['Avg Fatigue', `${avgFatigue}%`, avgFatigue >= 70 ? 'text-amber-300' : 'text-white'],
          ].map(([k, v, tone]) => (
            <div key={k} className="glass rounded-xl p-3">
              <div className="text-[10px] uppercase tracking-wider text-slate-400">{k}</div>
              <div className={`mt-1 text-xl font-bold ${tone}`}>{v}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid lg:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-5 lg:col-span-2">
          <h2 className="text-xl font-semibold text-white mb-3">Resource Trends</h2>
          <MissionChart history={history} />
        </div>
        <div className="space-y-4">
          <div className="glass rounded-xl p-5">
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2"><Thermometer size={18} className="text-sky-300"/>3. Environment &amp; Life Support <span className="text-xs font-normal text-slate-400">Sol {day} forecast</span></h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-300">Habitat Temperature</span><span className={`${atmosphere && (environment.temperature < 17 || environment.temperature > 27) ? 'text-amber-300' : 'text-white'} font-semibold`}>{environment.temperature}°C <span className="text-slate-500 font-normal">(outside {environment.outsideTemp}°C)</span></span></div>
              <div className="flex justify-between"><span className="text-slate-300 flex items-center gap-1"><Wind size={14}/> Cabin Oxygen</span><span className={`${atmosphere.oxygenConc < 19.5 ? 'text-amber-300' : 'text-white'} font-semibold`}>{atmosphere.oxygenConc.toFixed(1)}%</span></div>
              <div className="flex justify-between"><span className="text-slate-300 flex items-center gap-1"><FlaskConical size={14}/> CO2 (scrubber)</span><span className={`${atmosphere.co2Ppm > 2500 ? 'text-red-300' : atmosphere.co2Ppm > 1500 ? 'text-amber-300' : 'text-emerald-300'} font-semibold`}>{Math.round(atmosphere.co2Ppm)} ppm</span></div>
              <div className="flex justify-between"><span className="text-slate-300 flex items-center gap-1"><Gauge size={14}/> Cabin Pressure</span><span className={`${atmosphere.pressure < 95 || atmosphere.pressure > 105 ? 'text-amber-300' : 'text-white'} font-semibold`}>{atmosphere.pressure.toFixed(1)} kPa</span></div>
              <div className="flex justify-between"><span className="text-slate-300">Humidity</span><span className="text-white font-semibold">{Math.round(atmosphere.humidity)}%</span></div>
              <div className="flex justify-between"><span className="text-slate-300 flex items-center gap-1"><Radiation size={14}/> Radiation</span><span className={`${environment.radiation>35?'text-amber-300':'text-white'} font-semibold`}>{environment.radiation} index</span></div>
              <div className="flex justify-between"><span className="text-slate-300 flex items-center gap-1"><Trash2 size={14}/> Waste Level</span><span className={`${resources.waste.current > 22 ? 'text-amber-300' : 'text-white'} font-semibold`}>{resources.waste.current.toFixed(1)} / {resources.waste.max} kg</span></div>
              {state.mission.profile?.archivedStorms?.find((s) => s.day === day) && (
                <div className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs text-red-200"><strong>ARCHIVED STORM SOL:</strong> {state.mission.profile.archivedStorms.find((s) => s.day === day).label}. Radiation spiking — shelter the crew.</div>
              )}
              {!mars && state.mission.profile?.lunarNightDays?.includes(day) && (
                <div className="rounded-lg border border-indigo-400/40 bg-indigo-500/10 px-3 py-2 text-xs text-indigo-200"><strong>LUNAR NIGHT:</strong> The Sun is below the horizon — solar generation is effectively zero. Survive on batteries and discipline.</div>
              )}
              <div className="flex justify-between"><span className="text-slate-300 flex items-center gap-1"><Sun size={14}/> Solar Efficiency</span><span className="text-white font-semibold">{environment.solarEfficiency}%</span></div>
              <div className="flex justify-between"><span className="text-slate-300">Sunlight Factor</span><span className="text-white font-semibold">{environment.sunlight}</span></div>
              <div className="flex justify-between"><span className="text-slate-300">Solar Generation</span><span className="text-sky-200 font-semibold">~{rates.solarGeneration.toFixed(1)} units/day</span></div>
              <p className="text-[11px] text-slate-400 border-t border-white/5 pt-2">
                {rates.power.reserveLow
                  ? 'LOW POWER RESERVE: life support keeps priority; water recovery and greenhouse output are throttled first. Shed optional systems.'
                  : 'Power priority: critical life support runs first; optional loads can be shed to protect the reserve.'}
              </p>
            </div>
          </div>
          {mars && (
            <div className="glass rounded-xl p-5">
              <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2"><Radio size={16} className="text-sky-300"/>4b. Earth Link</h2>
              <p className="text-[11px] text-slate-400">Mars one-way light time ≈ 4–24 min. Earth advises — but the reply arrives late, never in time for live rescue.</p>
              {state.earthRequest ? (
                <div className="text-amber-300 text-sm mt-2">Radio call out — Earth reply expected in ~{Math.max(0, state.earthRequest.answerDay - day)} Sol(s). One-way light time ~{state.earthRequest.delayMin} min.</div>
              ) : state.earthAnswer ? (
                <div className="mt-2 text-sm"><p className="text-sky-300 font-semibold">Earth (delayed {state.earthAnswer.delayMin} min) said:</p><p className="text-slate-200 mt-1">{state.earthAnswer.text}</p></div>
              ) : (
                <div className="text-slate-400 text-sm mt-2">No advisory received. You’re on your own for now.</div>
              )}
              <button onClick={askEarth} disabled={state.phase !== 'active' || !!state.earthRequest} className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-sky-400/30 text-sky-100 hover:bg-sky-500/10 disabled:opacity-40 disabled:cursor-not-allowed text-xs transition"><Radio size={13} /> ASK EARTH (delay 4–24 min)</button>
            </div>
          )}
          <div className="glass rounded-xl p-5">
            <h2 className="text-lg font-semibold text-white mb-2">5. Emergency Notifications</h2>
            {pendingEmergency ? (
              <div className="text-amber-300 text-sm">Active emergency: <strong>{pendingEmergency.title}</strong>. Resolve it below.</div>
            ) : (
              <div className="text-emerald-300 text-sm">No active emergencies. Systems nominal.</div>
            )}
          </div>
        </div>
      </section>

      <section className="grid lg:grid-cols-2 gap-4">
        <div className="glass rounded-xl p-5">
          <h2 className="text-xl font-semibold text-white mb-3">4. Equipment Management</h2>
          <div className="space-y-2">
            {equipmentDefs.map((d) => {
              const cond = equipmentCondition?.[d.id] ?? 100
              const condTone = cond >= 70 ? 'bg-emerald-400' : cond >= 40 ? 'bg-amber-400' : 'bg-red-400'
              return (
                <div key={d.id} className="p-3 rounded-lg bg-slate-900/40 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-white font-medium flex items-center gap-2">{d.name}<span className="text-[9px] uppercase tracking-wider text-slate-500 border border-white/10 rounded px-1">{d.priority}</span></div>
                      <div className="text-xs text-slate-400 truncate">{d.energyUse} units/day · {d.effect}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => repairEquipment(d.id)} title="Repair equipment (1 spare part)" aria-label={`Repair ${d.name}`} className="px-2 py-1.5 rounded-md text-slate-300 border border-white/10 hover:border-amber-400/40 hover:text-amber-200 transition"><Wrench size={14} /></button>
                      <button onClick={() => toggleEquipment(d.id)} className={`px-3 py-1.5 rounded-md text-sm border ${equipment[d.id] ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30' : 'bg-slate-800 text-slate-300 border-white/10'}`}>{equipment[d.id] ? 'ON' : 'OFF'}</button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400"><span className="w-16">Condition</span><div className="flex-1 h-1.5 rounded bg-slate-800 overflow-hidden"><div className={`h-full ${condTone}`} style={{ width: `${cond}%` }} /></div><span className="w-8 text-right text-slate-300">{Math.round(cond)}%</span></div>
                </div>
              )
            })}
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-slate-900/40 px-3 py-2">
            <div>
              <div className="text-sm text-white">Optional loads — science, comms &amp; lighting</div>
              <div className="text-[11px] text-slate-400">Draws 10 power/day while ON. Shed these first; research pauses while OFF.</div>
            </div>
            <button onClick={toggleOptionalLoads} className={`px-3 py-1.5 rounded-md text-sm border shrink-0 ${state.optionalLoads === false ? 'bg-slate-800 text-slate-300 border-white/10' : 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30'}`}>{state.optionalLoads === false ? 'OFF' : 'ON'}</button>
          </div>
          <div className="mt-3 text-xs text-slate-400 border-t border-white/5 pt-2">Spare parts remaining: <span className="text-amber-300 font-semibold">{resources.spareParts}</span>. Repairs restore one system to 100% condition (costs 1 part).</div>

        </div>
        <div className="glass rounded-xl p-5">
          <h2 className="text-xl font-semibold text-white mb-3">6. Mission Activity Log</h2>
          <div className="space-y-2 max-h-80 overflow-auto pr-1">
            {log.map((entry, i) => (
              <div key={i} className={`p-3 rounded-lg border text-sm ${entry.type==='danger'?'border-red-400/30 bg-red-500/10':entry.type==='warning'?'border-amber-400/30 bg-amber-500/10':entry.type==='success'?'border-emerald-400/30 bg-emerald-500/10':'border-white/10 bg-slate-900/40'}`}>
                <span className="text-sky-300 font-medium">Day {entry.day}:</span> <span className="text-slate-200">{entry.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="glass rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <p className="text-sky-300 uppercase tracking-wider text-xs">Surface Ops</p>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2"><Rocket size={18} className="text-sky-300"/>7. Rover &amp; EVA Expeditions</h2>
          </div>
          <span className="text-xs text-slate-400">Costs battery &amp; power · increases fatigue &amp; radiation dose</span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          <button onClick={() => sendRoverSurvey('roverSurvey')} disabled={state.phase !== 'active' || !!state.roverMission} className="text-left p-3 rounded-lg border border-sky-400/30 hover:bg-sky-500/10 transition disabled:opacity-40 disabled:cursor-not-allowed">
            <div className="font-semibold text-white">Rover Survey</div>
            <div className="text-[11px] text-slate-400 mt-1">{roverNote('roverSurvey')}</div>
          </button>
          <button onClick={() => sendRoverSurvey('geologicalSample')} disabled={state.phase !== 'active' || !!state.roverMission} className="text-left p-3 rounded-lg border border-sky-400/30 hover:bg-sky-500/10 transition disabled:opacity-40 disabled:cursor-not-allowed">
            <div className="font-semibold text-white">Geological Sample Run</div>
            <div className="text-[11px] text-slate-400 mt-1">{roverNote('geologicalSample')}</div>
          </button>
          {mars ? (
            <button onClick={() => sendRoverSurvey('marsCo2Study')} disabled={state.phase !== 'active' || !!state.roverMission} className="text-left p-3 rounded-lg border border-violet-400/30 hover:bg-violet-500/10 transition disabled:opacity-40 disabled:cursor-not-allowed">
              <div className="font-semibold text-white">ISRU CO2 Oxygen Study</div>
              <div className="text-[11px] text-slate-400 mt-1">{roverNote('marsCo2Study')}</div>
            </button>
          ) : (
            <button onClick={() => sendRoverSurvey('moonIceDrill')} disabled={state.phase !== 'active' || !!state.roverMission} className="text-left p-3 rounded-lg border border-cyan-400/30 hover:bg-cyan-500/10 transition disabled:opacity-40 disabled:cursor-not-allowed">
              <div className="font-semibold text-white">Ice Drill — Shadowed Crater</div>
              <div className="text-[11px] text-slate-400 mt-1">{roverNote('moonIceDrill')} · chance of +40 L water</div>
            </button>
          )}
          <button onClick={() => sendOnEva(evaAstronaut, 'geologicalSample')} disabled={evaBlocked} className="text-left p-3 rounded-lg border border-amber-400/30 hover:bg-amber-500/10 transition disabled:opacity-40 disabled:cursor-not-allowed">
            <div className="font-semibold text-white">EVA Geological Run</div>
            <div className="text-[11px] text-slate-400 mt-1">{evaAction.baseScience} base science · uses suit O2 &amp; {evaAction.batteryCost} battery · risk: spacesuit emergency</div>
          </button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <label htmlFor="eva-select" className="text-slate-500">EVA crew:</label>
          <select id="eva-select" value={evaAstronaut} onChange={(e) => setEvaAstronaut(e.target.value)} className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200">
            {crew.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.profession}</option>)}
          </select>
          <span>Suit integrity {Math.round(equipmentCondition?.spacesuit ?? 90)}%</span>
          <span className="text-slate-500">Rover trips {stats.roverTrips} · EVAs {stats.evas} · Ice extracted {stats.iceExtractedKg} L</span>
          {state.roverMission && <span className="text-sky-300">Rover away — returns in {state.roverMission.daysRemaining} {state.roverMission.daysRemaining === 1 ? 'Sol' : 'Sols'}</span>}
        </div>
      </section>

      <EmergencyModal emergency={state.phase === 'emergency' ? pendingEmergency : null} onChoose={chooseEmergency} spareParts={resources.spareParts} />
    </div>
  )
}

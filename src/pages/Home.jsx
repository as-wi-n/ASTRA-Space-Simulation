import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Gauge, AlertTriangle, BookOpen, Cpu, Rocket, Radio, Activity } from 'lucide-react'
import LunarScene from '../components/LunarScene'

export default function Home() {
  return (
    <div className="relative">
      <section className="relative overflow-hidden min-h-[88vh] flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(59,130,246,0.16),transparent_30%),linear-gradient(to_bottom,rgba(2,6,23,0.2),rgba(2,6,23,0.95))]" />
        <div className="absolute left-1/2 top-16 -translate-x-1/2 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute -left-20 bottom-10 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 py-16 relative w-full">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 text-sky-200 text-xs tracking-wider uppercase mb-4">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Live Mission Simulation Environment
              </div>
              <p className="text-sky-300 tracking-widest uppercase text-sm mb-3">Astronaut Simulation, Training and Resource Administration</p>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white mb-4">
                YOUR MISSION.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-300 to-blue-400">THEIR SURVIVAL.</span>
              </h1>
              <p className="text-slate-300 text-lg max-w-xl mb-8">
                Take command of a Moon or Mars habitat in a deep-space night environment. Balance oxygen, water, food, power, temperature, and radiation while responding to real-feeling mission emergencies.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/missions" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold transition shadow-lg shadow-sky-500/20">
                  Start Your Mission <ArrowRight size={18} />
                </Link>
                <Link to="/learn" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-sky-400/30 text-sky-100 hover:bg-sky-500/10 transition">
                  Explore Science Briefing
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-3 max-w-xl">
                {[['Crew Systems', 'Nominal'], ['Radiation Watch', 'Active'], ['Habitat Status', 'Online']].map((item, i) => (
                  <div key={item[0]} className="glass rounded-lg p-3">
                    <div className="text-[11px] uppercase tracking-wide text-slate-400">{item[0]}</div>
                    <div className={`font-semibold ${i === 1 ? 'text-amber-300' : 'text-sky-200'}`}>{item[1]}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="glass rounded-2xl p-4 md:p-5 animate-glow scanline overflow-hidden float-y">
                <div className="aspect-[4/3] rounded-xl border border-sky-500/20 bg-gradient-to-b from-[#071225] via-[#0a1022] to-[#020617] relative overflow-hidden">
                  <div className="absolute inset-0 opacity-40" style={{backgroundImage:'radial-gradient(#fff 1px, transparent 1px)', backgroundSize:'28px 28px'}} />
                  <div className="absolute right-8 top-8 h-16 w-16 rounded-full bg-slate-200/90 shadow-[0_0_40px_rgba(226,232,240,0.35)] breathe" />
                  <div className="absolute right-14 top-14 h-2 w-2 rounded-full bg-sky-200 orbit-dot" />
                  <div className="absolute left-10 top-16 h-24 w-24 rounded-full border border-sky-400/20" />
                  <div className="absolute left-0 right-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0b1220] via-[#111827]/80 to-transparent" />
                  <div className="absolute left-0 right-0 bottom-14 h-20 bg-gradient-to-t from-slate-700/20 to-transparent" />
                  
                  {/* Habitat */}
                  <div className="absolute bottom-16 left-10">
                    <div className="w-36 h-16 rounded-t-2xl rounded-b-lg bg-slate-800/90 border border-sky-400/20 relative">
                      <div className="absolute -top-4 left-8 w-20 h-6 rounded-t-xl bg-slate-700/90 border border-sky-400/20" />
                      <div className="absolute top-4 left-4 h-3 w-3 rounded-sm bg-cyan-300/80 animate-pulse" />
                      <div className="absolute top-4 left-10 h-3 w-3 rounded-sm bg-amber-300/80 animate-pulse" />
                      <div className="absolute top-4 left-16 h-3 w-3 rounded-sm bg-cyan-300/70" />
                      <div className="absolute bottom-2 right-3 text-[10px] text-sky-200/80">HAB-01</div>
                    </div>
                    <div className="w-44 h-3 -mt-1 rounded-full bg-black/40 blur-[2px]" />
                  </div>

                  {/* Rover */}
                  <div className="absolute bottom-12 right-16 rover-move">
                    <div className="relative">
                      <div className="w-14 h-6 rounded-md bg-slate-600 border border-slate-400/30" />
                      <div className="absolute -top-3 left-4 w-5 h-4 rounded bg-slate-500 border border-slate-400/30" />
                      <div className="absolute -bottom-2 left-1 w-3 h-3 rounded-full bg-slate-900 border border-slate-500" />
                      <div className="absolute -bottom-2 right-1 w-3 h-3 rounded-full bg-slate-900 border border-slate-500" />
                    </div>
                  </div>

                  {/* Astronaut */}
                  <div className="absolute bottom-14 left-52">
                    <div className="w-5 h-5 rounded-full bg-slate-200 border border-sky-200/50 mb-0.5" />
                    <div className="w-6 h-8 rounded-md bg-slate-300/90 border border-sky-200/30 mx-auto -mt-0.5" />
                  </div>

                  {/* HUD overlays */}
                  <div className="absolute top-4 left-4 glass rounded-lg px-3 py-2 text-xs">
                    <div className="flex items-center gap-2 text-sky-200"><Activity size={14}/> Telemetry Link</div>
                    <div className="text-emerald-300 font-semibold">Signal Stable</div>
                  </div>
                  <div className="absolute top-4 right-4 glass rounded-lg px-3 py-2 text-xs text-right">
                    <div className="text-slate-300 flex items-center justify-end gap-1"><Radio size={14}/> Sol Cycle</div>
                    <div className="text-amber-300 font-semibold">Night Ops Mode</div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
                    {['O₂ 96%', 'Power 82%', 'Radiation Low'].map((t, i) => (
                      <div key={t} className={`rounded-lg px-3 py-2 text-xs border ${i===2 ? 'bg-amber-500/10 border-amber-400/30 text-amber-200' : 'bg-sky-500/10 border-sky-400/20 text-sky-100'}`}>
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-400 mt-3">Immersive space-night mission control simulation · educational, not a real mission tool</p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="max-w-7xl mx-auto px-4 py-16 relative">
        <h2 className="text-3xl font-bold text-white mb-4">About ASTRA</h2>
        <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-6">
          <p className="text-slate-300 max-w-3xl leading-relaxed">
            ASTRA (Astronaut Simulation, Training and Resource Administration) places you in command of an off-world habitat. Every sol, you manage interconnected systems—life support, energy, thermal control, and radiation safety—while adapting to dynamic hazards. The experience is designed to feel grounded in real mission trade-offs while remaining accessible for students.
          </p>
          <div className="glass rounded-xl p-4 text-sm text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-sky-200 font-medium"><Shield size={16}/> Mission Priorities</div>
            <div>• Keep crew alive and systems stable</div>
            <div>• Balance limited power, water, food, and oxygen</div>
            <div>• Respond to emergencies with informed decisions</div>
          </div>
        </div>
      </section>

      <section id="live-preview" className="max-w-7xl mx-auto px-4 pb-16 relative">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
          <div>
            <p className="text-sky-300 uppercase tracking-wider text-xs">Animated Lunar Base</p>
            <h2 className="text-3xl font-bold text-white mt-1">Live Surface Operations Preview</h2>
          </div>
          <Link to="/dashboard" className="text-sky-300 hover:text-sky-200 text-sm font-medium">Open mission control →</Link>
        </div>
        <LunarScene running storm={false} roverTask="patrol" day={1} mars={false} />
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-20 relative">
        <h2 className="text-3xl font-bold text-white mb-6">Core Features</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            [Gauge,'Dynamic Resource Simulation','Daily consumption, recycling, and power balance with consistent rules.'],
            [Cpu,'Equipment Control','Turn systems on/off to conserve energy or boost production.'],
            [AlertTriangle,'Interactive Emergencies','Events with scientific explanations and meaningful choices.'],
            [Shield,'Environmental Monitoring','Track temperature, radiation, and solar efficiency.'],
            [BookOpen,'Educational Insights','Learn space science concepts during play.'],
            [Rocket,'Mission Reports','Performance evaluation, score, and improvement tips.'],
          ].map(([Icon,title,desc]) => (
            <div key={title} className="glass rounded-xl p-5 hover:border-sky-400/40 transition">
              <Icon className="text-sky-300 mb-3" />
              <h3 className="font-semibold text-white mb-1">{title}</h3>
              <p className="text-sm text-slate-300">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-sky-500/15 py-8 text-center text-sm text-slate-400 relative">
        ASTRA – Educational space survival simulation for NASA Space Apps Challenge. Illustrative values, not real mission specifications.
      </footer>
    </div>
  )
}

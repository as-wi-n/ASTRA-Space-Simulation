import { Info, BookOpen, AlertTriangle, Sun, Radio } from 'lucide-react'

export default function AboutData() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div>
        <p className="text-cyan-300 uppercase tracking-wider text-sm flex items-center gap-2"><Info size={16} /> About the Data</p>
        <h1 className="text-3xl md:text-4xl font-bold text-white mt-1">What’s real, what’s simplified</h1>
        <p className="text-slate-300 mt-2">ASTRA mixes real NASA science and archived data with a deliberately simplified game model. This page separates the two, in plain words.</p>
      </div>

      <div className="glass rounded-2xl p-5 border border-emerald-400/20">
        <h2 className="text-xl font-semibold text-emerald-300 flex items-center gap-2 mb-3"><BookOpen size={18} /> Real — archived, cited NASA science &amp; data</h2>
        <ul className="text-slate-200 text-sm leading-relaxed space-y-2 list-disc ml-5">
          <li><strong>Archived solar storms.</strong> The radiation-storm Sols in this game replay real events from the <strong>NASA DONKI / CCMC space-weather catalog</strong>: the <em>October 2003 X17 “Halloween” flare</em>, the <em>September 2017 X9.3 flare</em>, the <em>May 2024 “Gannon” G5 storm</em>, and the <em>July 2012 near-Carrington CME</em> observed by STEREO-A. They are labeled archived — not live predictions — and appear on scripted Sols.</li>
          <li><strong>Radiation dose is cumulative.</strong> Like real spaceflight, dose accumulates over the mission. Shielding (storm vault, thick walls) reduces — but never erases — that dose. In game terms, warning starts near 120 dose points, danger near 260, and critical near 400; high cumulative dose damages crew health, the way real limits (e.g. NASA career exposure limits) do.</li>
          <li><strong>BVAD (NTRS 20210024855).</strong> NASA’s Baseline Values and Assumptions Document informs the crew’s per-Sol oxygen, water, food, and medical consumables.</li>
          <li><strong>The Moon South Pole exists as described.</strong> Permanently shadowed craters preserve water ice; some elevated spots receive near-continuous sunlight while others (and everything for many sols) see ~no sunlight. A 14-day lunar night is real; we compress it to a handful of Sols.</li>
          <li><strong>Mars.</strong> Thin CO₂ atmosphere (unbreathable), dust storms that slash solar generation, a one-way radio delay of roughly <strong>4 to 24 minutes</strong> (distance-dependent), and proposed <strong>ISRU</strong> — making oxygen from CO₂ — are all real concepts humans study.</li>
          <li><strong>Oxygen generation and CO₂ removal are different systems.</strong> Crew exhale CO₂; scrubbers remove it. Oxygen generators (electrolysis of water) restore O₂. One does not substitute for the other.</li>
          <li><strong>Power is prioritized.</strong> Critical life support (O₂ recycling, CO₂ scrubbing, heating) keeps running first. Important systems (water recovery, greenhouse, waste processing, storm shelter) are throttled under low reserve. Optional science/comms/lighting loads draw 10 power/day and can be shed. This mirrors real load-shedding practice.</li>
          <li><strong>Plants need time.</strong> The hydroponic greenhouse must run for three Sols with power and water before the first harvest; it does not produce food instantly.</li>
        </ul>
      </div>

      <div className="glass rounded-2xl p-5 border border-amber-400/20">
        <h2 className="text-xl font-semibold text-amber-300 flex items-center gap-2 mb-3"><AlertTriangle size={18} /> Simplified — game fiction &amp; abstraction</h2>
        <ul className="text-slate-200 text-sm leading-relaxed space-y-2 list-disc ml-5">
          <li><strong>Units are game units, not SI.</strong> “1 oxygen unit ≈ 1 kg O₂,” “Gen ≈ 0.1 kWh,” radiation ≈ mSv-like points. Real missions track these far more precisely. Values are sized for play, not engineering.</li>
          <li><strong>Time is compressed.</strong> A 30-Sol (or 10–12 Sol Kid) mission is a training arc, not a real mission plan. Nothing here is a flight-readiness assessment.</li>
          <li><strong>Events are scripted/seeded randomness.</strong> The game picks plausible hazards weighted by your current conditions (low power, high radiation, low water). It does not forecast space weather.</li>
          <li><strong>Instant actions.</strong> Repairs finish and emergencies resolve “now,” not after real procedure timelines. Rover sorties still take two Sols to return.</li>
          <li><strong>No orbital mechanics.</strong> No launch windows, delta-v, conjunction analysis, or deep-space comm spectrum — only light-time delay, and only on Mars.</li>
          <li><strong>Ventilation and cooling are folded in.</strong> The sim tracks CO₂, humidity and cabin temperature rather than a separate airflow model; waste accumulation stands in for contamination risk.</li>
          <li><strong>Kid Mode gauges</strong> collapse meters/units into three friendly dials (Air, Food &amp; Water, Power). The underlying simulation is the same; the display is simplified.</li>
        </ul>
      </div>

      <div className="glass rounded-2xl p-5">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-3"><Sun size={18} /> Why the two destinations feel different</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
          <div className="rounded-xl bg-slate-900/50 border border-white/5 p-4">
            <p className="text-white font-semibold">Moon — First Light</p>
            <p className="mt-1">No atmosphere; hard vacuum. Sunlight swings wildly — Sols 7–12 are a compressed “lunar night” with near-zero solar generation (survival depends on battery and discipline). Radiation unfiltered. Water ice possible in permanently shadowed craters.</p>
          </div>
          <div className="rounded-xl bg-slate-900/50 border border-white/5 p-4">
            <p className="text-white font-semibold">Mars — Beyond Earth</p>
            <p className="mt-1">Thin CO₂ air; dust storms; a one-way radio delay of 4–24 minutes (8–48 minutes round trip). Earth cannot talk you through a crisis live. Solar generation runs below demand, so shed optional science/comms/lighting loads or switch off other systems to protect the reserve.</p>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-4 flex items-center gap-2"><Radio size={13} /> Sources: NASA DONKI (CCMC), NASA BVAD (NTRS 20210024855), MSL RAD, NASA Moon Trek. Archived references, educational use only.</p>
      </div>
    </div>
  )
}

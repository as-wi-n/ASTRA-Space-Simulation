import { motion, AnimatePresence } from 'framer-motion'

const CREW = [
  { id: 'maya', name: 'MAYA', role: 'Engineer', color: '#ff667c' },
  { id: 'samira', name: 'SAMIRA', role: 'Geologist', color: '#36e0b0' },
  { id: 'alex', name: 'ALEX', role: 'Scientist', color: '#ffbd4a' },
]

const TASK_POSITIONS = {
  shelter: { maya: { x: 828, y: 263 }, samira: { x: 872, y: 267 }, alex: { x: 912, y: 272 } },
  inside: { maya: { x: 395, y: 266 }, samira: { x: 435, y: 270 }, alex: { x: 475, y: 274 } },
  repair: { maya: { x: 632, y: 270 }, samira: { x: 700, y: 273 }, alex: { x: 768, y: 276 } },
  solar: { maya: { x: 122, y: 268 }, samira: { x: 168, y: 262 }, alex: { x: 210, y: 271 } },
  lab: { maya: { x: 640, y: 272 }, samira: { x: 705, y: 275 }, alex: { x: 765, y: 278 } },
  rover: { maya: { x: 235, y: 352 }, samira: { x: 285, y: 356 }, alex: { x: 345, y: 348 } },
  walk: { maya: { x: 432, y: 280 }, samira: { x: 558, y: 278 }, alex: { x: 696, y: 290 } },
  idle: { maya: { x: 430, y: 280 }, samira: { x: 560, y: 278 }, alex: { x: 698, y: 290 } },
}

const CREW_TASK_MAP = {
  'Habitat inspection': 'inside',
  'Equipment repair': 'repair',
  'Solar array maintenance': 'solar',
  'Greenhouse monitoring': 'inside',
  'Scientific research': 'lab',
  'Rover operation': 'rover',
  'Medical monitoring': 'inside',
  'Rest': 'inside',
}

function resolveCrewState(scene, pendingEmergency, equipment, assignments, radiationLevel = 0) {
  const emergency = pendingEmergency?.type
  const override = scene?.crewOverride
  if (override) return override
  // Before an emergency is resolved, stage the crew for the visible hazard.
  if (pendingEmergency?.type) {
    if (emergency === 'dust_storm') return { maya: 'inside', samira: 'inside', alex: 'repair' }
    if (emergency === 'radiation_storm') return { maya: 'walk', samira: 'walk', alex: 'walk' }
    if (emergency === 'oxygen_leak' || emergency === 'water_leak') return { maya: 'repair', samira: 'repair', alex: 'repair' }
    if (emergency === 'equipment_failure') return { maya: 'inside', samira: 'inside', alex: 'repair' }
    if (emergency === 'extreme_temperature') return { maya: 'inside', samira: 'inside', alex: 'inside' }
  }
  // A powered shelter is only occupied when radiation is actually dangerous.
  if (equipment.radiationShelter && radiationLevel > 35) return { maya: 'shelter', samira: 'shelter', alex: 'shelter' }
  // Normal operations: astronauts stand at the stations matching their assigned tasks
  if (assignments && Object.keys(assignments).length) {
    const pick = (id) => CREW_TASK_MAP[assignments[id]] ?? 'walk'
    return { maya: pick('maya'), alex: pick('alex'), samira: pick('samira') }
  }
  return { maya: 'walk', samira: 'walk', alex: 'walk' }
}

function resolveVisualMode(scene, pendingEmergency, environment) {
  if (scene?.mode && scene.mode !== 'nominal') return scene.mode
  if (pendingEmergency?.type) return pendingEmergency.type.replace('_', '_')
  if (environment.radiation > 35) return 'radiation_storm'
  if (environment.solarEfficiency < 60) return 'dust_storm'
  return 'nominal'
}

export default function LunarScene({
  running,
  storm,
  roverTask,
  day,
  mars = false,
  night = false,
  environment = {},
  scene = {},
  pendingEmergency = null,
  equipment = {},
  phase = 'active',
  assignments = {},
  roverMission = null,
}) {
  const stars = Array.from({ length: 90 }, (_, i) => ({ x: (i * 137 + 29) % 1000, y: (i * 83 + 17) % 430, r: (i % 3) * 0.55 + 0.55, d: (i % 7) * 0.35 }))
  const visualMode = resolveVisualMode(scene, pendingEmergency, environment)
  const radiationLevel = environment.radiation ?? 18
  const radiationHigh = radiationLevel > 25
  const radiationCritical = radiationLevel > 37
  const dusty = visualMode === 'dust_storm' || storm
  const sheltering = visualMode === 'shelter' || (equipment?.radiationShelter && radiationHigh)
  const heating = equipment?.heating
  const crewState = resolveCrewState(scene, pendingEmergency, equipment || {}, assignments, radiationLevel)

  const skyFrom = mars ? (visualMode === 'radiation_storm' ? '#2a0d12' : '#120a1f') : (visualMode === 'radiation_storm' ? '#1b0d18' : '#080e24')
  const skyTo = mars ? (visualMode === 'radiation_storm' ? '#6a2a32' : '#2a1238') : (visualMode === 'radiation_storm' ? '#471f2e' : '#172744')

  const panelOpacity = dusty ? 0.35 : 0.9
  const groundFrom = mars ? '#8a4a3a' : '#69788c'
  const groundTo = mars ? '#3a1f1f' : '#344257'

  const statusText =
    phase === 'emergency' && pendingEmergency
      ? `EMERGENCY: ${pendingEmergency.title}`
      : sheltering
        ? 'CREW SHELTERED · STORM VAULT'
        : dusty
          ? 'DUSTY CONDITIONS · SOLAR OUTPUT LOW'
          : radiationHigh
            ? 'ELEVATED RADIATION · LIMIT EVA'
            : night
              ? 'LUNAR NIGHT · SOLAR OUTPUT ~0'
              : 'ALL SYSTEMS NOMINAL'

  return (
    <div className={`scene-frame rounded-2xl border ${visualMode === 'radiation_storm' || visualMode === 'shelter' || dusty ? 'border-amber-500/50' : 'border-sky-500/20'} bg-slate-950 overflow-hidden relative shadow-2xl`}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-sky-500/15 bg-slate-950/80 text-[11px] tracking-widest text-sky-200/90">
        <span className="flex items-center gap-2"><i className="inline-block h-2 w-2 rounded-full" style={{ background: running ? '#42e5a5' : '#ffbd4a' }} /> SURFACE CAM 01</span>
        <span className="text-amber-300">{statusText}</span>
        <span>{mars ? 'LAT 18.4° N · MARTIAN TERRAIN' : 'LAT 89.9° S · LUNAR TERRAIN'}</span>
      </div>

      <svg className="w-full h-auto block" viewBox="0 0 1000 430" role="img" aria-label="Animated lunar or martian base with astronauts, rover, solar array and habitat">
        <defs>
          <linearGradient id="skyVisual" x2="0" y2="1"><stop stopColor={skyFrom} /><stop offset="1" stopColor={skyTo} /></linearGradient>
          <linearGradient id="groundVisual" x2="0" y2="1"><stop stopColor={groundFrom} /><stop offset="1" stopColor={groundTo} /></linearGradient>
          <linearGradient id="panelVisual" x2="0" y2="1"><stop stopColor="#19c6f5" stopOpacity={panelOpacity} /><stop offset="1" stopColor="#07558f" stopOpacity={panelOpacity} /></linearGradient>
          <linearGradient id="domeVisual" x2="0" y2="1"><stop stopColor="#5ad7ff" stopOpacity=".52" /><stop offset="1" stopColor="#0b2445" stopOpacity=".95" /></linearGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="softGlow"><feGaussianBlur stdDeviation="9" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <radialGradient id="radiationHalo"><stop offset="0%" stopColor="#ff6b6b" stopOpacity=".9" /><stop offset="100%" stopColor="#ff6b6b" stopOpacity="0" /></radialGradient>
        </defs>

        {/* Sky / environment */}
        <rect width="1000" height="430" fill="url(#skyVisual)" />
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#e6f4ff" opacity={dusty ? 0.25 : 0.7}>
            <animate attributeName="opacity" values={dusty ? '.1;.35;.1' : '.25;.95;.25'} dur={`${2 + s.d}s`} begin={`${s.d}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {visualMode === 'radiation_storm' && (
          <>
            {/* Sun-driven radiation alert: expanding wave fronts from the Sun toward the base */}
            <circle cx="120" cy="88" r="84" fill="none" stroke="#ff6b6b" strokeWidth="2.5" opacity=".45">
              <animate attributeName="r" values="40;120;40" dur="2.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values=".75;0;.75" dur="2.6s" repeatCount="indefinite" />
            </circle>
            <circle cx="120" cy="88" r="48" fill="none" stroke="#ff8a8a" strokeWidth="1.5" opacity=".35">
              <animate attributeName="r" values="56;150;56" dur="3.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values=".55;0;.55" dur="3.4s" repeatCount="indefinite" />
            </circle>

            {/* Alert beams radiating from the Sun toward the surface */}
            {[
              'M120 88 L360 205',
              'M120 88 L520 260',
              'M120 88 L720 285',
              'M120 88 L900 250',
              'M120 88 L285 300',
            ].map((d, i) => (
              <motion.path
                key={i}
                d={d}
                stroke="#ff7070"
                strokeWidth={i === 2 ? 3.5 : 2.2}
                strokeLinecap="round"
                fill="none"
                initial={{ opacity: 0.15, pathLength: 0.2 }}
                animate={{ opacity: [0.2, 0.9, 0.2], pathLength: [0.35, 1, 0.35] }}
                transition={{ duration: 1.4 + i * 0.15, repeat: Infinity, delay: i * 0.22, ease: 'easeInOut' }}
                style={{ filter: 'drop-shadow(0 0 8px rgba(255, 90, 90, .8))' }}
              />
            ))}

            {/* Incoming radiation particles traveling along the beams */}
            {[
              { x: 240, y: 135 }, { x: 330, y: 175 }, { x: 430, y: 215 }, { x: 540, y: 235 }, { x: 660, y: 255 }, { x: 780, y: 270 },
            ].map((p, i) => (
              <motion.circle key={i} cx={p.x} cy={p.y} r="3.2" fill="#ffd1d1" stroke="#ff4d4d" strokeWidth="1.5" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0], scale: [0.7, 1.2, 0.7] }} transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }} />
            ))}

            {/* Pulsing warning ring around the Sun */}
            <circle cx="120" cy="86" r="68" fill="url(#radiationHalo)" opacity=".55">
              <animate attributeName="r" values="58;92;58" dur="1.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values=".55;.25;.55" dur="1.8s" repeatCount="indefinite" />
            </circle>
            <circle cx="120" cy="86" r="33" fill="#ff4d4d" opacity=".65" />

            {/* Sun alert label — extra visible cue */}
            <g transform="translate(120 150)" textAnchor="middle">
              <rect x="-70" y="-13" width="140" height="26" rx="13" fill="#2a0606" stroke="#ff5a5a" strokeOpacity=".9" />
              <text fill="#ffb4b4" fontSize="11" fontWeight="800" letterSpacing="1.6">RADIATION ALERT</text>
            </g>

            {Array.from({ length: 16 }).map((_, i) => (
              <motion.circle key={`r-${i}`} cx={i * 60 + 40} cy={70 + (i % 5) * 35} r="2.2" fill="#ff8a8a" initial={{ opacity: 0 }} animate={{ opacity: [0.1, 0.8, 0.1], y: [0, 24, 0] }} transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.18 }} />
            ))}
          </>
        )}

        <circle cx="120" cy="88" r="34" fill={mars ? '#ffb27a' : visualMode === 'radiation_storm' ? '#ff9b7a' : '#ffe17a'} filter="url(#glow)" opacity={dusty ? 0.6 : 1} />
        <circle cx="120" cy="88" r="43" fill={mars ? '#ff9a4d' : '#ffd65e'} opacity={dusty ? 0.04 : 0.09} />

        <g transform="translate(850 90)">
          {mars ? (
            <>
              <circle r="35" fill="#472a24" stroke="#c46b4f" strokeWidth="2" />
              <path d="M-13 -3Q-4 -25 9 -11Q20 -2 11 9Q-1 22-13 9Z" fill="#a88b66" opacity=".8" />
              <text y="52" textAnchor="middle" fill="#ffb89a" fontSize="10">PHOBOS</text>
            </>
          ) : (
            <>
              <circle r="35" fill="#2864e8" />
              <path d="M-13 -3Q-4 -25 9 -11Q20 -2 11 9Q-1 22-13 9Z" fill="#4ed28b" />
              <text y="52" textAnchor="middle" fill="#91b8ff" fontSize="10">EARTH</text>
            </>
          )}
        </g>

        <g opacity={dusty ? 0.25 : 0.12}><path d="M120 130L330 300M120 130L550 310M120 130L760 320" stroke={mars ? '#ff9a4d' : visualMode === 'radiation_storm' ? '#ff8a8a' : '#ffe7a1'} strokeWidth="35" /></g>

        <path d="M0 305Q120 285 240 302T500 296T760 301T1000 287L1000 430H0Z" fill="url(#groundVisual)" />
        <path d="M0 350Q180 328 340 350T670 345T1000 338" fill="none" stroke={mars ? '#c59a88' : '#9aa8b8'} opacity=".25" strokeWidth="3" />
        <ellipse cx="785" cy="385" rx="78" ry="15" fill="#18253a" opacity=".45" />
        <ellipse cx="330" cy="395" rx="95" ry="12" fill="#18253a" opacity=".4" />

        {/* Solar array - weakens in dust storms */}
        <g transform="translate(120 235)">
          <text x="70" y="-17" textAnchor="middle" fill={dusty ? '#fbbf24' : '#dceaff'} fontSize="13" fontWeight="700">SOLAR ARRAY{dusty ? ' · LOW INPUT' : ''}</text>
          <path d="M35 18V78M105 18V78" stroke="#aebdd0" strokeWidth="9" opacity={dusty ? 0.6 : 1} />
          <rect x="0" y="0" width="140" height="24" rx="5" fill="url(#panelVisual)" stroke={dusty ? '#a16207' : '#21d7ff'} strokeWidth="4" />
          {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${i * 20} 2V22`} stroke="#7ce9ff" opacity={dusty ? 0.15 : 0.45} />)}
          {!dusty && running ? (
            <motion.g animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: '70px 10px' }}>
              <path d="M0 -5H140V0H0Z" fill="#a9f5ff" opacity=".45" />
            </motion.g>
          ) : (
            <path d="M0 -5H140V0H0Z" fill="#5c6678" opacity=".6" />
          )}
        </g>

        {/* Habitat */}
        <g transform="translate(355 235)">
          <text x="80" y="-18" textAnchor="middle" fill="#e5efff" fontSize="14" fontWeight="700">HABITAT{heating ? ' · HEATED' : ''}</text>
          <path d="M0 85A80 80 0 0 1 160 85Z" fill="url(#domeVisual)" stroke={heating ? '#ffbd4a' : '#56d8ff'} strokeWidth="5" />
          <path d="M80 6V85M25 37Q80 18 135 37" fill="none" stroke={heating ? '#ffbd4a' : '#6ce5ff'} strokeWidth="2" opacity=".6" />
          <rect x="67" y="50" width="26" height="35" rx="4" fill="#102e4e" stroke={heating ? '#ffe9a1' : '#b3eaff'} strokeWidth="2" />
          <rect x="73" y="57" width="14" height="11" rx="2" fill={heating ? '#ffbd4a' : '#44d9ff'} opacity=".9" />
          <path d="M8 84H152" stroke="#d2e7fa" strokeWidth="5" />
          <circle cx="125" cy="54" r="5" fill={radiationCritical ? '#ff6b6b' : '#7df4bd'} filter="url(#glow)" />
        </g>

        {/* Science Lab - crew repair/operate */}
        <g transform="translate(620 250)">
          <text x="72" y="-20" textAnchor="middle" fill="#e5efff" fontSize="13" fontWeight="700">SCIENCE LAB{scene?.mode === 'repair' ? ' · MAINTENANCE' : ''}</text>
          <rect width="145" height="65" rx="10" fill={scene?.mode === 'repair' ? '#7ea7c1' : '#8bb8d7'} stroke={scene?.mode === 'repair' ? '#ffbd4a' : '#48d9ff'} strokeWidth="4" />
          <rect x="12" y="12" width="121" height="40" rx="5" fill="#102d4b" />
          <rect x="26" y="22" width="26" height="12" rx="2" fill={scene?.mode === 'repair' ? '#ffbd4a' : '#24c7ee'} />
          <circle cx="119" cy="32" r="5" fill={scene?.mode === 'repair' ? '#ffbd4a' : '#52e5ae'} />
        </g>

        {/* Storm Vault / shelter */}
        <g transform="translate(815 250)">
          <text x="65" y="-20" textAnchor="middle" fill="#e5efff" fontSize="13" fontWeight="700">STORM VAULT{sheltering ? ' · SEALED' : ' · STANDBY'}</text>
          <rect width="130" height="65" rx="10" fill={sheltering ? '#1c4966' : '#287eaa'} stroke={sheltering ? '#ffbd4a' : '#54d7ff'} strokeWidth="4" />
          <rect x="8" y="8" width="114" height="49" rx="7" fill={sheltering ? '#123147' : '#3db6e4'} opacity=".9" />
          {sheltering && <path d="M65 22v21M54 31h22" stroke="#ffbd4a" strokeWidth="4" />}
        </g>

        <path d="M205 310H950" stroke="#d0d9e3" strokeWidth="12" opacity=".45" />
        <path d="M205 310H950" stroke="#263a53" strokeWidth="3" strokeDasharray="14 12" opacity=".8" />

        {/* Crew - positions react to decisions/environment */}
        {CREW.map((member, idx) => {
          const task = crewState[member.id] || 'walk'
          const pos = TASK_POSITIONS[task]?.[member.id] || TASK_POSITIONS.walk[member.id]
          const insideHabitat = task === 'inside'
          const shelteringNow = task === 'shelter'
          const repairing = task === 'repair'
          return (
            <Astronaut
              key={member.id}
              id={member.id}
              x={pos.x}
              y={pos.y}
              color={member.color}
              name={member.name}
              task={task}
              delay={idx * 1.7}
              sheltering={shelteringNow}
              repairing={repairing}
              insideHabitat={insideHabitat}
            />
          )
        })}

        {/* Rover */}
        <motion.g animate={{ x: roverTask === 'return' ? [0, -150, -150] : roverTask === 'clean' ? [0, 260, 260, 0] : [0, 110, 210, 110, 0] }} transition={{ duration: roverTask === 'clean' ? 8 : 14, repeat: Infinity, ease: 'easeInOut' }}>
          <g transform="translate(260 350)">
            <ellipse cx="25" cy="35" rx="48" ry="7" fill="#101c2d" opacity=".5" />
            <rect x="-7" y="4" width="64" height="25" rx="8" fill={dusty ? '#b8a88e' : '#dce7f2'} stroke="#8298b0" strokeWidth="2" opacity={dusty ? 0.8 : 1} />
            <rect x="4" y="-8" width="40" height="18" rx="5" fill={dusty ? '#6f6658' : '#9bc8e4'} stroke="#e7f5ff" strokeWidth="2" opacity={dusty ? 0.8 : 1} />
            <rect x="15" y="-4" width="17" height="10" rx="2" fill="#102f50" />
            {[4, 25, 47].map((x, i) => (
              <g key={i}><circle cx={x} cy="30" r="10" fill="#17263a" stroke="#b8c8d8" strokeWidth="3" /><circle cx={x} cy="30" r="3" fill="#6f879e" /></g>
            ))}
            <path d="M48 -5L65 -18" stroke="#a8bed2" strokeWidth="3" /><circle cx="66" cy="-19" r="4" fill={dusty ? '#fbbf24' : '#ffe17a'} />
          </g>
        </motion.g>

        {/* Dust storm particles */}
        {dusty && (
          <g>
            {Array.from({ length: 55 }, (_, i) => (
              <motion.circle key={i} cx={(i * 83) % 1000} cy={(i * 47) % 380} r={(i % 3) + 1} fill={mars ? '#e0a080' : '#d6b47d'} opacity=".7" initial={{ x: -30, y: (i * 47) % 380 }} animate={{ x: 1040, y: [(i * 47) % 380, ((i * 47 + 60) % 380)] }} transition={{ duration: 2.5 + (i % 4), repeat: Infinity, delay: (i % 7) * 0.2, ease: 'linear' }} />
            ))}
          </g>
        )}

        {/* Radiation warning particles */}
        {visualMode === 'radiation_storm' && (
          <g>
            {Array.from({ length: 22 }, (_, i) => (
              <motion.circle key={`r-${i}`} cx={90 + (i * 67) % 800} cy={140 + (i * 34) % 150} r="1.8" fill="#ffb4b4" initial={{ opacity: 0.1 }} animate={{ opacity: [0.1, 0.9, 0.1], y: [0, 50, 0] }} transition={{ duration: 2 + (i % 4), repeat: Infinity, delay: (i % 6) * 0.3 }} />
            ))}
          </g>
        )}

        <rect x="15" y="15" width="170" height="28" rx="14" fill="#071225" opacity=".85" stroke="#28415e" />
        <circle cx="31" cy="29" r="4" fill={running ? '#42e5a5' : '#ffbd4a'} />
        <text x="44" y="33" fill="#d9eaff" fontSize="10" letterSpacing="1.3">{running ? 'SIMULATION LIVE' : 'SIMULATION PAUSED'}</text>

        {/* Environment readouts */}
        <text x="980" y="410" textAnchor="end" fill="#b8cce0" fontSize="10">RAD {Math.round(radiationLevel)} · SOL {day} · {dusty ? 'DUST' : 'NOMINAL'}{radiationHigh ? ' · RAD WARNING' : ''}</text>
      </svg>

      <AnimatePresence>
        {dusty && (
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="absolute top-12 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-amber-500/90 text-slate-950 text-xs font-bold tracking-wide">
            ⚠ {mars ? 'DUST STORM' : 'DUST STORM WARNING'} · SOLAR OUTPUT REDUCED
          </motion.div>
        )}
        {visualMode === 'radiation_storm' && !sheltering && (
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="absolute top-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-red-500/90 text-white text-xs font-bold tracking-wide">
            ⚠ RADIATION STORM · CREW OUTSIDE · RISK ELEVATED
          </motion.div>
        )}
        {sheltering && (
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="absolute top-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-emerald-500/90 text-slate-950 text-xs font-bold tracking-wide">
            ✓ CREW IN STORM VAULT / HABITAT · SHIELDED
          </motion.div>
        )}
        {roverMission && (
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="absolute top-28 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-sky-500/90 text-slate-950 text-xs font-bold tracking-wide">
            ↦ ROVER EN ROUTE · returns in {roverMission.daysRemaining} {roverMission.daysRemaining === 1 ? 'Sol' : 'Sols'}{roverMission.aborted ? ' (recalled)' : ''}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4 px-4 py-2 border-t border-sky-500/15 bg-slate-950/70 text-[11px] text-slate-300">
        <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-sky-400" /> Crew positions respond to mission decisions</span>
        <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-amber-400" /> Dust / radiation visual feedback</span>
        <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-emerald-400" /> Habitat & equipment status</span>
      </div>
    </div>
  )
}

function Astronaut({ x, y, color, name, delay = 0, task = 'walk', sheltering = false, repairing = false, insideHabitat = false }) {
  const walking = task === 'walk' && !sheltering
  const motionX = sheltering
    ? [x, x + 1, x]
    : repairing
      ? [x, x + 18, x + 35, x + 18, x]
      : walking
        ? [x, x + 24, x + 48, x + 24, x]
        : insideHabitat
          ? [x, x, x]
          : [x, x + 2, x]
  const duration = sheltering ? 2.5 : repairing ? 6 : walking ? 12 : 3.8
  return (
    <motion.g
      initial={{ x, y }}
      animate={{ x: motionX, y: [y, y - 1, y] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <g className="astronaut" opacity={insideHabitat ? 0.35 : 1}>
        <ellipse cx="0" cy="39" rx="15" ry="4" fill="#020713" opacity=".45" />
        <path d="M-9 19L-11 34L-5 35L0 22L5 35L11 34L9 19Z" fill={repairing ? '#ffe4a3' : '#dce8f5'} stroke="#829bb7" strokeWidth="1.5" />
        <path d="M-12 8Q-17 10-15 22L-9 24L-5 12M12 8Q17 10 15 22L9 24L5 12" fill={insideHabitat ? '#93a7bd' : '#e8f2ff'} stroke="#829bb7" strokeWidth="1.5" />
        <rect x="-10" y="6" width="20" height="17" rx="6" fill={insideHabitat ? '#9fb4cb' : '#f2f7ff'} stroke="#819bb8" />
        <rect x="-14" y="8" width="5" height="12" rx="2" fill="#8ba2ba" /><rect x="9" y="8" width="5" height="12" rx="2" fill="#8ba2ba" />
        <circle cx="0" cy="-2" r="12" fill={insideHabitat ? '#a9bdd0' : '#e8f3ff'} stroke="#9db4ce" strokeWidth="2" /><ellipse cx="0" cy="-2" rx="8.5" ry="7.2" fill="#07182d" stroke={color} strokeWidth="2" />
        <path d="M-5 -3Q0 -8 6 -3" fill="none" stroke={insideHabitat ? '#907040' : '#6bdcff'} strokeWidth="1.5" /><circle cx="-3" cy="-1" r="1" fill="#7ef4ff" /><circle cx="3" cy="-1" r="1" fill="#7ef4ff" />
        <rect x="-8" y="40" width="16" height="3" rx="1.5" fill={color} />
      </g>
      <text x="0" y="56" textAnchor="middle" fill="#f4f8ff" fontSize="9" fontWeight="700">{name}{insideHabitat ? ' · INSIDE' : sheltering ? ' · VAULT' : repairing ? ' · REPAIR' : task === 'solar' ? ' · SOLAR' : task === 'rover' ? ' · ROVER' : task === 'lab' ? ' · LAB' : ''}</text>
    </motion.g>
  )
}

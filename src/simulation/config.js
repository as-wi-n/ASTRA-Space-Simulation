// ASTRA — central simulation configuration.
// Single source of truth for balance, units, difficulty, phases and safe ranges.
// Do not hardcode these values separately in UI components or UI-only helpers.

export const UNITS = {
  oxygen: 'game-units (1 unit ≈ 1 kg O2)',
  co2Ppm: 'ppm',
  pressure: 'kPa',
  oxygenConc: '%',
  humidity: '%',
  water: 'litres',
  food: 'ration units',
  electricity: 'game energy units (GEN ≈ 0.1 kWh)',
  battery: '%',
  temperature: '°C',
  radiation: 'millisieverts accumulated during mission (mSv), displayed as index',
  waste: 'kg',
  spareParts: 'units',
  scientificPoints: 'ASTRA research points',
}

export const MISSION_DURATION_DAYS = 30

export const DIFFICULTIES = {
  explorer: {
    label: 'Explorer',
    description: 'Forgiving supplies and failure rates — best for first missions',
    supplyMultiplier: 1.4,
    consumptionMultiplier: 0.85,
    failureMultiplier: 0.6,
    scoreBonus: 0,
  },
  survival: {
    label: 'Survival',
    description: 'Balanced and challenging — the intended experience',
    supplyMultiplier: 1.1,
    consumptionMultiplier: 1,
    failureMultiplier: 1,
    scoreBonus: 150,
  },
  commander: {
    label: 'Mission Commander',
    description: 'Limited supplies and harsher emergencies',
    supplyMultiplier: 1.0,
    consumptionMultiplier: 1.15,
    failureMultiplier: 1.4,
    scoreBonus: 350,
  },
  // Kid mode — junior audience: big gauges, plain language, 10–12 Sols
  kid: {
    label: 'Kid Mode',
    description: '10–12 Sols · big friendly gauges, plain words',
    supplyMultiplier: 1.7,
    consumptionMultiplier: 0.6,
    failureMultiplier: 0.3,
    scoreBonus: 0,
    durationDays: 11,
    kid: true,
  },
}

// Mission phases: objectives only, never scripted outcomes
export const MISSION_PHASES = [
  { fromDay: 1, toDay: 5, phase: 1, name: 'Initialization', objectives: ['Verify life support', 'Stabilize power', 'Check crew health', 'Establish reserves'] },
  { fromDay: 6, toDay: 10, phase: 2, name: 'Stabilization', objectives: ['Stable atmosphere', 'Improve water recovery', 'Complete maintenance', 'Begin science'] },
  { fromDay: 11, toDay: 15, phase: 3, name: 'Exploration', objectives: ['Rover exploration', 'Collect samples', 'Search for ice / resources', 'Manage EVA risk'] },
  { fromDay: 16, toDay: 20, phase: 4, name: 'Critical Operations', objectives: ['Survive environmental events', 'Keep life support reliable', 'Prevent equipment failures'] },
  { fromDay: 21, toDay: 25, phase: 5, name: 'Long-Term Survival', objectives: ['Crew health', 'Complete repairs', 'Maximize recycling', 'Preserve reserves'] },
  { fromDay: 26, toDay: 30, phase: 6, name: 'Mission Completion', objectives: ['Keep all systems alive', 'Final science objectives', 'All crew survive', 'Complete mission report'] },
]

export function getPhaseForDay(day) {
  return MISSION_PHASES.find((p) => day >= p.fromDay && day <= p.toDay) || MISSION_PHASES[MISSION_PHASES.length - 1]
}

// Habitat / life-support safe operating ranges
export const SAFE_RANGES = {
  oxygenConc: { low: 19.5, high: 23.5 }, // %
  co2Ppm: { warn: 1500, danger: 2500 },  // ppm — above danger, crew damage
  pressure: { low: 95, high: 105 },      // kPa
  temperature: { low: 17, high: 27 },    // °C habitat cabin
  humidity: { low: 20, high: 65 },       // %
}

// Radiation dose accumulation (game-scaled mSv-equivalent points).
// perIndex converts the displayed radiation index into accumulated dose per Sol.
// Thresholds are deliberately reachable inside one 30-Sol mission so shielding matters.
export const RADIATION_DOSE = { warn: 120, danger: 260, critical: 400, perIndex: 0.6 }

// Real archived space-weather events (DONKI/CCMC catalog — used as scripted Sols, NOT live feeds)
export const ARCHIVED_STORMS = {
  moon: [
    { day: 4,  label: 'Oct. 2003 Halloween X17 flare (archived DONKI/CCMC)' },
    { day: 14, label: 'Sep. 2017 X9.3 flare (archived DONKI/CCMC)' },
  ],
  mars: [
    { day: 6,  label: 'May 2024 Gannon G5 geomagnetic storm (archived DONKI/CCMC)' },
    { day: 18, label: 'Jul. 2012 near-Carrington CME — observed by STEREO-A (archived)' },
  ],
}

// Daily crew consumables and physiological effects
export const CREW = {
  baseOxygenUse: 3.2,   // per astronaut per day
  baseWaterUse: 3.6,   // litres / astronaut / day
  baseFoodUse: 2.4,     // rations / astronaut / day
  baseElecUse: 8,       // habitat baseline (life support pumps/fans)
  perCrewElecUse: 2,    // life support per astronaut
  optionalLoadElec: 10, // science, comms and lighting — shed first under power stress
  oxygenRecovery: 0.88, // O2 recycler efficiency (fraction of demand)
  waterRecovery: 0.5,   // water recovery efficiency (fraction of demand)
  greenhouseFood: 4.5,  // rations / day with greenhouse ON and mature
  greenhouseWaterUse: 1.2,
  greenhouseElecUse: 18,
  greenhouseGrowDays: 3, // crops need three Sols of light/water/power before harvest
  lowPowerReserve: 40,   // electricity reserve below this = important systems degrade
  electrolysisWaterUse: 0.8, // competing O2 generation via water electrolysis
  radiationImpact: { warn: 25, danger: 40 }, // radiation index
}

// Power priorities (per spec: CRITICAL / IMPORTANT / OPTIONAL)
export const POWER_PRIORITY = {
  critical: ['oxygenRecycler', 'co2Scrubber', 'heating'],
  important: ['waterRecycler', 'greenhouse', 'radiationShelter', 'wasteProcessor'],
  optional: ['scientific', 'roverCharging', 'comms', 'lighting'],
}

export function equipmentPriority(id) {
  if (POWER_PRIORITY.critical.includes(id)) return 'critical'
  if (POWER_PRIORITY.important.includes(id)) return 'important'
  return 'optional'
}

// Equipment power draw (per day) — kinetic balance
export const EQUIPMENT_POWER = {
  oxygenRecycler: 18,
  co2Scrubber: 10,
  waterRecycler: 16,
  greenhouse: 18,
  solarPower: 0,
  heating: 18,
  radiationShelter: 10,
  wasteProcessor: 6,
}

export const EQUIPMENT_CONDITION = {
  start: 100,
  dailyWear: 0.6,       // slow degradation per day
  emergencyWear: 12,    // additional wear on failures
  repairPartsCost: 1,   // spare parts per repair
}

// Seeded randomness so a run is reproducible given seed + actions
export function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function makeSeed() {
  return (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0
}

// Progressive equipment efficiency: broken/damaged equipment performs worse
export function conditionEfficiency(condition = 100) {
  const pct = Math.max(0, Math.min(100, condition)) / 100
  return 0.45 + 0.55 * pct // broken ≈45% efficient, pristine = 100%
}

// Crew archetypes (3 astronauts, one per profession per game)
export const CREW_ROLES = [
  { id: 'maya', profession: 'Engineer', strength: 'Repairs equipment ~1.4× faster', color: '#ff667c' },
  { id: 'alex', profession: 'Scientist', strength: 'Doubles research points from surveys', color: '#ffbd4a' },
  { id: 'samira', profession: 'Geologist', strength: 'Improves resource/ice discovery odds', color: '#36e0b0' },
]

// EVA / Rover definitions — costs and outcomes
export const EXPLORATION = {
  roverSurvey: { label: 'Rover Survey', batteryCost: 18, electricityCost: 6, fatigue: 8, radiation: 1, baseScience: 12 },
  geologicalSample: { label: 'Geological Sample Run', batteryCost: 25, electricityCost: 8, fatigue: 14, radiation: 2, baseScience: 20 },
  moonIceDrill: { label: 'Drill Perm. Shadowed Crater (Ice)', batteryCost: 35, electricityCost: 12, fatigue: 22, radiation: 3, baseScience: 15, waterReward: 40, appliesTo: 'moon' },
  marsCo2Study: { label: 'ISRU CO2 Oxygen Study', batteryCost: 30, electricityCost: 16, fatigue: 15, radiation: 2, baseScience: 25, appliesTo: 'mars' },
}

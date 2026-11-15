import { MISSIONS, CREW_TASKS } from '../simulation/missionEngine'
import { DIFFICULTIES, MISSION_DURATION_DAYS, EQUIPMENT_CONDITION } from '../simulation/config'
import { defaultEquipmentState, DEFAULT_SPARE_PARTS } from '../data/equipment'

const PHASES = new Set(['active', 'emergency', 'completed'])

function defaultTaskFor(profession) {
  if (profession === 'Engineer') return 'Habitat inspection'
  if (profession === 'Scientist') return 'Scientific research'
  return 'Rover operation'
}

function defaultConditions() {
  return {
    oxygenRecycler: EQUIPMENT_CONDITION.start,
    co2Scrubber: EQUIPMENT_CONDITION.start,
    waterRecycler: EQUIPMENT_CONDITION.start,
    wasteProcessor: EQUIPMENT_CONDITION.start,
    greenhouse: EQUIPMENT_CONDITION.start,
    solarPower: EQUIPMENT_CONDITION.start,
    heating: EQUIPMENT_CONDITION.start,
    radiationShelter: EQUIPMENT_CONDITION.start,
    rover: 90,
    spacesuit: 92,
  }
}

// Old saves (before missionLength / greenhouse growth / storm tracking) must not
// silently freeze. Fill missing fields and keep the single authoritative schema.
export function normalizeLoadedState(raw) {
  if (!raw || typeof raw !== 'object') return null
  const mission = MISSIONS[raw.missionId]
  if (!mission) return null
  if (!raw.resources || !raw.atmosphere || !Array.isArray(raw.astronauts) || raw.astronauts.length === 0) return null
  if (!Number.isFinite(raw.seed)) return null

  const s = structuredClone(raw)
  const difficulty = DIFFICULTIES[s.difficulty] ? s.difficulty : 'survival'
  const diff = DIFFICULTIES[difficulty]
  const supply = diff.supplyMultiplier
  const initial = mission.initial.resources

  s.schemaVersion = 3
  s.difficulty = difficulty
  s.mission = mission // refresh mission profile so archived storms / lunar night exist
  s.missionLength = Number.isFinite(s.missionLength) && s.missionLength > 0
    ? s.missionLength
    : (diff.durationDays ?? MISSION_DURATION_DAYS)
  s.astronautName = typeof s.astronautName === 'string' && s.astronautName.trim() ? s.astronautName : 'Commander'
  s.day = Number.isFinite(s.day) && s.day >= 1 ? Math.floor(s.day) : 1
  s.phase = PHASES.has(s.phase) ? s.phase : 'active'
  s.pendingEmergency = s.pendingEmergency && typeof s.pendingEmergency === 'object' ? s.pendingEmergency : null
  if (s.phase === 'emergency' && !s.pendingEmergency) s.phase = 'active'
  if (s.pendingEmergency && s.phase === 'active') s.phase = 'emergency'
  if (s.phase === 'completed' && !s.result) s.phase = 'active'
  s.result = s.result ?? null

  s.resources = s.resources && typeof s.resources === 'object' ? s.resources : {}
  const resourceDefaults = {
    oxygen: { current: Math.round(initial.oxygen.current * supply), max: Math.round(initial.oxygen.max * supply) },
    water: { current: Math.round(initial.water.current * supply), max: Math.round(initial.water.max * supply) },
    food: { current: Math.round(initial.food.current * supply), max: Math.round(initial.food.max * supply) },
    electricity: { current: Math.round(initial.electricity.current * supply), max: Math.round(initial.electricity.max * supply) },
    battery: { current: initial.battery.current, max: initial.battery.max },
    waste: { current: 4, max: 30 },
  }
  for (const key of Object.keys(resourceDefaults)) {
    const base = resourceDefaults[key]
    const saved = s.resources[key]
    const max = Number.isFinite(saved?.max) && saved.max > 0 ? saved.max : base.max
    s.resources[key] = {
      current: Number.isFinite(saved?.current) ? Math.max(0, Math.min(saved.current, max)) : base.current,
      max,
    }
  }
  s.resources.spareParts = Number.isFinite(s.resources.spareParts) ? Math.max(0, Math.floor(s.resources.spareParts)) : DEFAULT_SPARE_PARTS

  s.atmosphere = { oxygenConc: 20.9, co2Ppm: 520, pressure: 101.3, humidity: 42, ...(s.atmosphere && typeof s.atmosphere === 'object' ? s.atmosphere : {}) }
  s.environment = {
    temperature: 21,
    outsideTemp: mission.initial.environment.temperature,
    radiation: mission.initial.environment.radiation,
    solarEfficiency: mission.initial.environment.solarEfficiency,
    sunlight: mission.initial.environment.sunlight,
    ...(s.environment && typeof s.environment === 'object' ? s.environment : {}),
  }
  s.equipment = { ...defaultEquipmentState(), ...(s.equipment && typeof s.equipment === 'object' ? s.equipment : {}) }
  s.equipmentCondition = { ...defaultConditions(), ...(s.equipmentCondition && typeof s.equipmentCondition === 'object' ? s.equipmentCondition : {}) }
  s.greenhouseGrowth = Number.isFinite(s.greenhouseGrowth) ? Math.max(0, Math.min(3, s.greenhouseGrowth)) : 0
  s.optionalLoads = typeof s.optionalLoads === 'boolean' ? s.optionalLoads : true
  s.firedStorms = Array.isArray(s.firedStorms) ? s.firedStorms.filter((d) => Number.isFinite(d)) : []
  s.earthRequest = s.earthRequest && typeof s.earthRequest === 'object' ? s.earthRequest : null
  s.earthAnswer = s.earthAnswer && typeof s.earthAnswer === 'object' ? s.earthAnswer : null
  s.roverMission = s.roverMission && typeof s.roverMission === 'object' ? s.roverMission : null
  s.modifiers = s.modifiers && typeof s.modifiers === 'object' ? s.modifiers : {}
  s.scene = s.scene && typeof s.scene === 'object'
    ? { mode: 'nominal', crewOverride: null, lastDecision: null, ...s.scene }
    : { mode: 'nominal', crewOverride: null, lastDecision: null }
  s.stats = {
    emergenciesEncountered: 0,
    emergenciesHandled: 0,
    scientificPoints: 0,
    roverTrips: 0,
    evas: 0,
    iceExtractedKg: 0,
    ...(s.stats && typeof s.stats === 'object' ? s.stats : {}),
  }
  s.astronauts = s.astronauts.map((a) => ({
    ...a,
    health: Number.isFinite(a.health) ? Math.max(0, Math.min(100, a.health)) : 100,
    fatigue: Number.isFinite(a.fatigue) ? Math.max(0, Math.min(100, a.fatigue)) : 10,
    stress: Number.isFinite(a.stress) ? Math.max(0, Math.min(100, a.stress)) : 15,
    hydration: Number.isFinite(a.hydration) ? Math.max(0, Math.min(100, a.hydration)) : 88,
    nutrition: Number.isFinite(a.nutrition) ? Math.max(0, Math.min(100, a.nutrition)) : 92,
    radiationDose: Number.isFinite(a.radiationDose) ? Math.max(0, a.radiationDose) : 0,
    status: ['active', 'incapacitated', 'lost'].includes(a.status) ? a.status : 'active',
    task: CREW_TASKS.includes(a.task) ? a.task : defaultTaskFor(a.profession),
  }))
  s.log = Array.isArray(s.log) ? s.log : []
  s.lastCycleSummary = s.lastCycleSummary ?? null
  s.rates = s.rates ?? null
  s.history = Array.isArray(s.history) && s.history.length
    ? s.history
    : [{
        day: s.day,
        oxygen: Math.round(s.resources.oxygen.current),
        water: Math.round(s.resources.water.current),
        food: Math.round(s.resources.food.current),
        electricity: Math.round(s.resources.electricity.current),
        battery: Math.round(s.resources.battery.current),
        temperature: s.environment.temperature,
        radiation: s.environment.radiation,
        co2Ppm: s.atmosphere.co2Ppm,
      }]
  return s
}

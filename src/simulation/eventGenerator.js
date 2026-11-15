import { emergencyTemplates } from '../data/emergencyEvents'

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateEmergency(state) {
  // Don't stack emergencies; lower chance early, higher mid/late
  if (state.pendingEmergency) return null
  const day = state.day
  const chance = Math.min(0.55, 0.18 + day * 0.015)
  if (Math.random() > chance) return null

  const applicable = emergencyTemplates.filter((t) => t.appliesTo.includes(state.mission.id))
  // bias toward relevant conditions
  let pool = [...applicable]
  if (state.environment.solarEfficiency < 55) pool = pool.concat(applicable.filter((t) => t.type === 'dust_storm' || t.type === 'equipment_failure'))
  if (state.environment.radiation > 30) pool = pool.concat(applicable.filter((t) => t.type === 'radiation_storm'))
  const template = pick(pool)
  return {
    id: `${template.type}-${day}-${Math.floor(Math.random() * 1000)}`,
    day,
    ...template,
  }
}

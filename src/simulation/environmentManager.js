import { clamp } from '../utils/calculations'

export function updateEnvironment(state) {
  const env = { ...state.environment }
  const profile = state.mission.profile
  const day = state.day
  const mod = state.modifiers || {}

  // Temperature oscillation + mission trend
  const swing = Math.sin(day / 2) * profile.tempSwing * 0.3
  let temp = profile.baseTemp + swing + (mod.temperatureOffset || 0)
  if (state.equipment.heating) temp += 10
  else temp -= 8
  env.temperature = Math.round(temp)

  // Radiation baseline + events/modifiers
  let radiation = profile.baseRadiation + (mod.radiationOffset || 0) + (day % 6 === 0 ? 4 : 0)
  if (state.equipment.radiationShelter) radiation -= 6
  env.radiation = clamp(Math.round(radiation), 0, 100)

  // Solar/sunlight
  let sunlight = profile.solarBase + (Math.cos(day / 3) * 0.08)
  sunlight = clamp(sunlight - (mod.solarPenalty || 0), 0.15, 1.1)
  env.sunlight = Number(sunlight.toFixed(2))

  let efficiency = (state.mission.initial.environment.solarEfficiency || 75) + (mod.solarEfficiencyDelta || 0)
  // gradual dust accumulation on Mars unless mitigated by event choices
  if (state.mission.id === 'mars' && day % 5 === 0) efficiency -= 1.5
  env.solarEfficiency = clamp(Math.round(efficiency), 20, 100)

  // decay temporary modifiers
  const nextModifiers = { ...mod }
  if (nextModifiers.duration && nextModifiers.duration > 0) {
    nextModifiers.duration -= 1
    if (nextModifiers.duration <= 0) {
      nextModifiers.solarPenalty = 0
      nextModifiers.solarEfficiencyDelta = 0
    }
  }

  return { environment: env, modifiers: nextModifiers }
}

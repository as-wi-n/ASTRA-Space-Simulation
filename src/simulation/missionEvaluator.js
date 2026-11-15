import { DIFFICULTIES, MISSION_DURATION_DAYS } from './config'

export function evaluateMission(state, { forcedFailure = null } = {}) {
  const r = state.resources
  const survivedDays = state.day
  const crew = state.astronauts ?? []
  const alive = crew.filter((c) => c.status !== 'lost').length
  const avgHealth = crew.length ? Math.round(crew.reduce((s, c) => s + c.health, 0) / crew.length) : 0
  const avgFatigue = crew.length ? Math.round(crew.reduce((s, c) => s + c.fatigue, 0) / crew.length) : 0
  const difficulty = state.difficulty || 'survival'
  const diff = DIFFICULTIES[difficulty] ?? DIFFICULTIES.survival

  const missionLength = state.missionLength ?? MISSION_DURATION_DAYS
  let status = 'success'
  let reason = `Mission completed: crew sustained ${missionLength} Sols and returned with humanity intact.`
  if (forcedFailure) {
    status = 'failure'
    reason = forcedFailure
  } else if (alive === 0) {
    status = 'failure'; reason = 'Mission failed: all crew members lost.'
  } else if (r.oxygen.current <= 0) { status = 'failure'; reason = 'Mission failed: oxygen depleted.' }
  else if (r.water.current <= 0) { status = 'failure'; reason = 'Mission failed: water reserves depleted.' }
  else if (r.food.current <= 0) { status = 'failure'; reason = 'Mission failed: food supplies depleted.' }
  else if (r.electricity.current <= 0 && r.battery.current <= 0) { status = 'failure'; reason = 'Mission failed: total power loss.' }

  const remaining = {
    oxygen: Math.round(r.oxygen.current),
    water: Math.round(r.water.current),
    food: Math.round(r.food.current),
    electricity: Math.round(r.electricity.current),
    battery: Math.round(r.battery.current),
    spareParts: r.spareParts ?? 0,
  }
  const emergenciesEncountered = state.stats?.emergenciesEncountered || 0
  const emergenciesHandled = state.stats?.emergenciesHandled || 0
  const science = state.stats?.scientificPoints || 0

  // Score weights: survival and crew health dominate; science and care are bonuses
  const vitalsScore = status === 'success' ? 650 : 150
  const scienceScore = Math.min(science * 2, 350) // capped bonus
  const careScore = (emergenciesHandled * 30) - Math.max(0, emergenciesEncountered - emergenciesHandled) * 20
  const survivalBonus = Math.max(0, avgHealth) // 0..100
  const fatiguePenalty = Math.max(0, avgFatigue - 55) // heavy fatigue erodes score
  const remainingBonus = remaining.oxygen + remaining.water * 0.5 + remaining.food + remaining.electricity * 0.15 + remaining.battery * 1.5 + remaining.spareParts * 40
  const score = Math.max(0, Math.round(
    vitalsScore +
    survivedDays * 12 +
    remainingBonus +
    survivalBonus * 1.8 +
    scienceScore +
    careScore -
    fatiguePenalty +
    diff.scoreBonus,
  ))

  const good = []
  const bad = []
  const mistakes = []
  if (avgHealth >= 75) good.push('Crew returned in strong physical health.')
  else if (avgHealth >= 45) bad.push('Crew health took meaningful damage during the mission.')
  else bad.push('Crew health was critical — prioritize atmosphere and medical response next time.')
  if (remaining.oxygen > 40) good.push('Oxygen reserves were maintained through recycling and discipline.')
  else bad.push('Oxygen margins were thin; prioritize leak response and recycler uptime.')
  if (remaining.water > 80) good.push('Water management kept reserves stable.')
  else mistakes.push('Water ran low — balance greenhouse use and recovery priority.')
  if (remaining.food > 40) good.push('Food supply remained sufficient.')
  else mistakes.push('Food production fell behind consumption — protect greenhouse operation.')
  if (science >= 60) good.push('A strong science return: experiments and surveys paid off.')
  if (emergenciesHandled >= emergenciesEncountered && emergenciesEncountered > 0) good.push('Emergencies were handled decisively.')
  if (emergenciesHandled < emergenciesEncountered) { bad.push('Some emergencies were handled sub-optimally.'); mistakes.push('Sub-optimal emergency choices increased losses.') }
  if (remaining.spareParts <= 1) mistakes.push('Spare parts ran dangerously low — repairs become impossible.')
  if (avgFatigue >= 60) mistakes.push('Crew fatigue was high; overworked crews perform worse and tire more.')

  const suggestions = [
    'Keep O2/CO2 systems ON when power allows; they define survival.',
    'Use spare parts before crises — an ignored fault becomes an emergency.',
    'Turn on the radiation shelter during radiation storms; healthcare plus shielding wins.',
    'Run rover surveys on Sol 11–15 to bank science and (on the Moon) water ice.',
  ]

  return {
    status,
    reason,
    survivedDays,
    astronautStatus: status === 'success' ? 'All crew survived' : 'Crew safety compromised',
    crew: crew.map((c) => ({ name: c.name, profession: c.profession, health: Math.round(c.health), status: c.status })),
    averageCrewHealth: avgHealth,
    averageFatigue: avgFatigue,
    remaining,
    emergenciesEncountered,
    emergenciesHandled,
    scientificPoints: science,
    roverTrips: state.stats?.roverTrips ?? 0,
    evas: state.stats?.evas ?? 0,
    iceExtractedKg: state.stats?.iceExtractedKg ?? 0,
    difficulty,
    score,
    good: good.length ? good : ['Mission completed with baseline stability.'],
    bad: bad.length ? bad : ['No major negative trends recorded.'],
    mistakes: mistakes.length ? mistakes : ['No critical resource management mistakes detected.'],
    suggestions,
  }
}

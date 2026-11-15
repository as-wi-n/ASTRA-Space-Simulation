import { clamp } from '../utils/calculations'
import { CREW, DIFFICULTIES, EQUIPMENT_POWER, conditionEfficiency } from './config'

export function equipmentEfficiencyFor(state, id) {
  const condition = state?.equipmentCondition?.[id] ?? 100
  return conditionEfficiency(condition)
}

// Power priorities in action: critical life support keeps running while reserve
// remains; important systems degrade first; optional systems degrade hardest.
// When both electricity reserve and battery are empty, nothing runs.
export function powerAvailability(state) {
  const elec = state?.resources?.electricity?.current ?? 0
  const battery = state?.resources?.battery?.current ?? 0
  const hasPower = elec > 0 || battery > 0
  const reserveLow = elec < CREW.lowPowerReserve
  return {
    hasPower,
    reserveLow,
    critical: hasPower ? 1 : 0,
    important: hasPower ? (reserveLow ? 0.6 : 1) : 0,
    optional: hasPower ? (reserveLow ? 0.35 : 1) : 0,
  }
}

export function getDailyRates(state) {
  const { astronauts, equipment, environment, modifiers, difficulty } = state
  const crewCount = Array.isArray(astronauts) ? astronauts.length : astronauts
  const diff = DIFFICULTIES[difficulty] ?? DIFFICULTIES.survival
  const mult = diff.consumptionMultiplier
  const eff = modifiers?.equipmentEfficiency ?? 1
  const stormSolarPenalty = modifiers?.solarPenalty ?? 0
  const power = powerAvailability(state)
  const growth = Number.isFinite(state.greenhouseGrowth) ? state.greenhouseGrowth : 0
  const greenhouseMature = growth >= CREW.greenhouseGrowDays

  // Daily physiology-scale consumption (see CREW config)
  const baseOxygenUse = CREW.baseOxygenUse * crewCount * mult
  const baseWaterUse = CREW.baseWaterUse * crewCount * mult
  const baseFoodUse = CREW.baseFoodUse * crewCount * mult
  const baseElecUse = CREW.baseElecUse + (CREW.perCrewElecUse ?? 2) * crewCount
  const optionalLoads = state.optionalLoads !== false
  const optionalElec = optionalLoads ? CREW.optionalLoadElec : 0

  // Equipment efficiencies degrade with condition
  const oxyEff = equipmentEfficiencyFor(state, 'oxygenRecycler') * eff
  const waterEff = equipmentEfficiencyFor(state, 'waterRecycler') * eff
  const greenhouseEff = equipmentEfficiencyFor(state, 'greenhouse') * eff
  const solarEffCondition = equipmentEfficiencyFor(state, 'solarPower')
  const wasteEff = equipmentEfficiencyFor(state, 'wasteProcessor') * eff

  // Recovery/production requires power and working equipment.
  // Critical systems keep priority; important systems take the hit first.
  const oxygenRecovery = equipment.oxygenRecycler ? CREW.oxygenRecovery * oxyEff * power.critical : 0.04
  const waterRecovery = equipment.waterRecycler ? CREW.waterRecovery * waterEff * power.important : 0.04
  const greenhouseFood = equipment.greenhouse && greenhouseMature ? CREW.greenhouseFood * greenhouseEff * power.optional : 0
  const greenhouseWaterUse = equipment.greenhouse ? (greenhouseMature ? CREW.greenhouseWaterUse : CREW.greenhouseWaterUse * 0.5) : 0
  const electrolysisWaterUse = equipment.oxygenRecycler && power.hasPower ? CREW.electrolysisWaterUse : 0
  const wasteRecovery = equipment.wasteProcessor ? 2.2 * wasteEff : 0

  // Daily life-support rates (net)
  const oxygenDelta = -(baseOxygenUse * (1 - oxygenRecovery))
  const waterDelta = -(baseWaterUse * (1 - waterRecovery)) - greenhouseWaterUse - electrolysisWaterUse
  const foodDelta = -baseFoodUse + greenhouseFood

  // Power balance
  const sunlight = Math.max(0, (environment.sunlight ?? 1) * (1 - stormSolarPenalty))
  const solarEff = clamp((environment.solarEfficiency ?? 70) / 100, 0, 1.2) * solarEffCondition
  const solarMult = state.mission?.profile?.solarGenerationMult ?? 1
  const solarGeneration = equipment.solarPower ? 140 * solarMult * sunlight * solarEff : 0
  const cabinTemp = environment.temperature ?? 21
  const heatingElec = equipment.heating ? (cabinTemp < 17 ? EQUIPMENT_POWER.heating + 8 : EQUIPMENT_POWER.heating) : 4
  const shelterElec = equipment.radiationShelter ? EQUIPMENT_POWER.radiationShelter : 0
  const recyclerElec = (equipment.oxygenRecycler ? EQUIPMENT_POWER.oxygenRecycler : 0) + (equipment.co2Scrubber ? EQUIPMENT_POWER.co2Scrubber : 0) + (equipment.waterRecycler ? EQUIPMENT_POWER.waterRecycler : 0)
  const greenhouseElecUse = equipment.greenhouse ? EQUIPMENT_POWER.greenhouse : 0
  const wasteElec = equipment.wasteProcessor ? EQUIPMENT_POWER.wasteProcessor : 0
  const electricityDemand = baseElecUse + optionalElec + heatingElec + shelterElec + recyclerElec + greenhouseElecUse + wasteElec
  const electricityNet = solarGeneration - electricityDemand

  return {
    oxygenDelta,
    waterDelta,
    foodDelta,
    electricityNet,
    electricityDemand,
    optionalLoads,
    optionalElec,
    solarGeneration,
    sunlight,
    wasteProcessed: wasteRecovery,
    heatingElec,
    greenhouseMature,
    greenhouseDaysLeft: Math.max(0, CREW.greenhouseGrowDays - growth),
    power,
  }
}

export function applyDailyResources(state) {
  const rates = getDailyRates(state)
  const r = structuredClone(state.resources)
  const diff = DIFFICULTIES[state.difficulty] ?? DIFFICULTIES.survival
  const power = rates.power

  r.oxygen.current = clamp(r.oxygen.current + rates.oxygenDelta, 0, r.oxygen.max)
  r.water.current = clamp(r.water.current + rates.waterDelta, 0, r.water.max)
  r.food.current = clamp(r.food.current + rates.foodDelta, 0, r.food.max)

  // Battery / electricity: surplus charges battery first, deficit drains it then the reserve
  let battery = r.battery.current
  let elec = r.electricity.current
  if (rates.electricityNet >= 0) {
    const charge = rates.electricityNet * 0.12
    battery = clamp(battery + charge, 0, r.battery.max)
    elec = clamp(elec + rates.electricityNet * 0.15, 0, r.electricity.max)
  } else {
    const deficit = Math.abs(rates.electricityNet)
    const batteryDrain = deficit * 0.18
    if (battery >= batteryDrain) {
      battery -= batteryDrain
    } else {
      const remaining = batteryDrain - battery
      battery = 0
      elec = clamp(elec - remaining * 2.5, 0, r.electricity.max)
    }
    // Very low reserve strains life support further
    if (elec < 40) {
      r.oxygen.current = clamp(r.oxygen.current - 1.2 * diff.consumptionMultiplier, 0, r.oxygen.max)
      r.water.current = clamp(r.water.current - 0.8 * diff.consumptionMultiplier, 0, r.water.max)
    }
  }
  r.battery.current = clamp(battery, 0, r.battery.max)
  r.electricity.current = clamp(elec, 0, r.electricity.max)

  // Crops need a real growing period: 3 Sols of power + water before harvest.
  // Turning the greenhouse off pauses growth (crops are not destroyed).
  let growth = Number.isFinite(state.greenhouseGrowth) ? state.greenhouseGrowth : 0
  if (state.equipment?.greenhouse && power.hasPower && r.water.current > 5) {
    growth = Math.min(CREW.greenhouseGrowDays, growth + 1)
  }

  return { resources: r, rates, greenhouseGrowth: growth }
}

export function applyEffects(state, effects = {}) {
  const r = structuredClone(state.resources)
  const env = { ...state.environment }
  const atm = { ...state.atmosphere }

  if (effects.oxygen) r.oxygen.current = clamp(r.oxygen.current + effects.oxygen, 0, r.oxygen.max)
  if (effects.water) r.water.current = clamp(r.water.current + effects.water, 0, r.water.max)
  if (effects.food) r.food.current = clamp(r.food.current + effects.food, 0, r.food.max)
  if (effects.electricity) r.electricity.current = clamp(r.electricity.current + effects.electricity, 0, r.electricity.max)
  if (effects.battery) r.battery.current = clamp(r.battery.current + effects.battery, 0, r.battery.max)
  if (effects.spareParts) r.spareParts = Math.max(0, (r.spareParts ?? 0) + effects.spareParts)
  if (effects.waste) r.waste.current = clamp(r.waste.current + effects.waste, 0, r.waste.max)
  if (effects.radiation) env.radiation = clamp(env.radiation + effects.radiation, 0, 100)
  if (effects.temperatureDelta) env.temperature = env.temperature + effects.temperatureDelta
  if (effects.cabinO2) atm.oxygenConc = clamp(atm.oxygenConc + effects.cabinO2, 10, 24)
  if (effects.cabinCo2) atm.co2Ppm = clamp(atm.co2Ppm + effects.cabinCo2, 300, 6000)
  if (effects.pressure) atm.pressure = clamp(atm.pressure + effects.pressure, 75, 108)
  if (effects.humidity) atm.humidity = clamp(atm.humidity + effects.humidity, 5, 90)
  // Crew physiological effects — lost crew cannot be revived by a choice.
  if (effects.healthDelta || effects.stressDelta || effects.fatigueDelta) {
    for (const c of state.astronauts) {
      if (c.status === 'lost') continue
      if (effects.healthDelta) c.health = clamp(c.health + effects.healthDelta, 0, 100)
      if (effects.stressDelta) c.stress = clamp(c.stress + effects.stressDelta, 0, 100)
      if (effects.fatigueDelta) c.fatigue = clamp(c.fatigue + effects.fatigueDelta, 0, 100)
    }
  }
  // Equipment condition effects
  if (effects.conditionDelta) {
    for (const key of Object.keys(state.equipmentCondition ?? {})) {
      state.equipmentCondition[key] = clamp(state.equipmentCondition[key] + effects.conditionDelta, 5, 100)
    }
  }

  return { resources: r, environment: env, atmosphere: atm }
}

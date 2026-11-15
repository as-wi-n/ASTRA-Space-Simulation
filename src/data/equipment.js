import { EQUIPMENT_POWER, equipmentPriority } from '../simulation/config'

// Equipment definitions. Power draw and priority come from the simulation config so
// the UI cannot drift from the engine's authoritative values.
export const equipmentDefs = [
  {
    id: 'oxygenRecycler',
    name: 'Oxygen Recycling System',
    icon: 'Wind',
    description: 'Recycles CO2 and conserves breathable oxygen. Electrolysis of water recovers O2 (consumes water and power).',
    energyUse: EQUIPMENT_POWER.oxygenRecycler,
    priority: equipmentPriority('oxygenRecycler'),
    effect: 'Recovers a portion of oxygen demand (does not create unlimited oxygen).',
  },
  {
    id: 'co2Scrubber',
    name: 'CO2 Scrubber',
    icon: 'ArrowDownUp',
    description: 'Removes carbon dioxide from cabin air. A working scrubber is required even if oxygen is adequate.',
    energyUse: EQUIPMENT_POWER.co2Scrubber,
    priority: equipmentPriority('co2Scrubber'),
    effect: 'Keeps CO2 concentration inside safe limits. Failure causes CO2 build-up.',
  },
  {
    id: 'waterRecycler',
    name: 'Water Recovery System',
    icon: 'Droplets',
    description: 'Recovers water from humidity, wastewater and waste streams using filtration.',
    energyUse: EQUIPMENT_POWER.waterRecycler,
    priority: equipmentPriority('waterRecycler'),
    effect: 'Returns a portion of daily water use to reserves. Needs working filters and power.',
  },
  {
    id: 'wasteProcessor',
    name: 'Waste Processor',
    icon: 'Trash2',
    description: 'Processes solid/liquid waste. Bad waste handling harms hygiene and health and contaminates water.',
    energyUse: EQUIPMENT_POWER.wasteProcessor,
    priority: equipmentPriority('wasteProcessor'),
    effect: 'Keeps habitat hygiene acceptable and enables cleaner water recovery.',
  },
  {
    id: 'greenhouse',
    name: 'Hydroponic Greenhouse',
    icon: 'Sprout',
    description: 'Grows supplemental food crops. A crop needs three Sols of light, power and water before harvest.',
    energyUse: EQUIPMENT_POWER.greenhouse,
    priority: equipmentPriority('greenhouse'),
    effect: 'Produces food after a 3-Sol grow cycle; consumes water and electricity.',
  },
  {
    id: 'solarPower',
    name: 'Solar Power System',
    icon: 'Sun',
    description: 'Generates electricity from available sunlight.',
    energyUse: EQUIPMENT_POWER.solarPower,
    priority: equipmentPriority('solarPower'),
    effect: 'Output depends on sunlight, panel condition, dust, and environmental conditions.',
  },
  {
    id: 'heating',
    name: 'Heating / Thermal Control',
    icon: 'Flame',
    description: 'Maintains safe cabin temperature for crew and equipment.',
    energyUse: EQUIPMENT_POWER.heating,
    priority: equipmentPriority('heating'),
    effect: 'Stabilizes cabin temperature; higher demand in cold conditions.',
  },
  {
    id: 'radiationShelter',
    name: 'Radiation Shelter',
    icon: 'Shield',
    description: 'Shielded storm vault that reduces crew radiation exposure.',
    energyUse: EQUIPMENT_POWER.radiationShelter,
    priority: equipmentPriority('radiationShelter'),
    effect: 'Lowers radiation impact when activated, especially during storms.',
  },
]

export function defaultEquipmentState() {
  return {
    oxygenRecycler: true,
    co2Scrubber: true,
    waterRecycler: true,
    wasteProcessor: true,
    greenhouse: true,
    solarPower: true,
    heating: true,
    radiationShelter: false,
  }
}

// Spare parts are limited — needed for field repairs of any equipment
export const DEFAULT_SPARE_PARTS = 3

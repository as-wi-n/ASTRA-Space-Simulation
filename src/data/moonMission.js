export const moonMission = {
  id: 'moon',
  name: 'Moon Base',
  destination: 'Lunar South Pole Habitat',
  difficulty: 'Moderate',
  durationDays: 30,
  astronauts: 3,
  description:
    'Operate a lunar habitat near the South Pole. Manage life support with no breathable atmosphere, extreme temperature swings, radiation exposure, and lighting-dependent solar power.',
  challenges: [
    'No breathable atmosphere – oxygen must be recycled and conserved',
    'Extreme temperature variations require heating control',
    'Radiation exposure demands shelter and shielding discipline',
    'Solar energy availability depends on location and lighting conditions',
  ],
  initial: {
    resources: {
      oxygen: { current: 120, max: 150 },
      water: { current: 240, max: 280 },
      food: { current: 120, max: 140 },
      electricity: { current: 500, max: 600 },
      battery: { current: 100, max: 100 },
    },
    environment: {
      temperature: -20,
      radiation: 18,
      solarEfficiency: 85,
      sunlight: 1.0,
    },
  },
  profile: {
    baseTemp: -20,
    tempSwing: 25,
    baseRadiation: 12,
    solarBase: 0.85,
    dustRisk: 0.05,
    solarGenerationMult: 1.0,
    // Lunar South Pole night: Sols 7–12 receive ~no sunlight (life must run off battery/reserve)
    lunarNightDays: [7, 8, 9, 10, 11, 12],
    nightBaseTemp: -150,
    archivedStorms: [
      { day: 4, label: 'Oct. 2003 Halloween X17 flare (archived DONKI/CCMC)' },
      { day: 14, label: 'Sep. 2017 X9.3 flare (archived DONKI/CCMC)' },
    ],
  },
}

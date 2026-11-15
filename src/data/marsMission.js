export const marsMission = {
  id: 'mars',
  name: 'Mars Base',
  destination: 'Ares Planitia Outpost',
  difficulty: 'Hard',
  durationDays: 30,
  astronauts: 3,
  description:
    'Command a Martian habitat in a thin CO2 atmosphere. Survive cold conditions, dust storms, radiation, and variable solar power while balancing limited supplies.',
  challenges: [
    'Very thin carbon dioxide atmosphere – habitat pressure and oxygen are critical',
    'Dust storms reduce sunlight and solar panel efficiency',
    'Low temperatures increase heating demand',
    'Radiation exposure requires monitoring and shelter use',
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
      temperature: -45,
      radiation: 22,
      solarEfficiency: 75,
      sunlight: 0.9,
    },
  },
  profile: {
    baseTemp: -45,
    tempSwing: 15,
    baseRadiation: 16,
    solarBase: 0.72,
    dustRisk: 0.18,
    solarGenerationMult: 0.85,
    commDelayMinMin: 4,   // one-way light time Earth↔Mars, minutes (archived-real range)
    commDelayMaxMin: 24,
    archivedStorms: [
      { day: 6, label: 'May 2024 Gannon G5 geomagnetic storm (archived DONKI/CCMC)' },
      { day: 18, label: 'Jul. 2012 near-Carrington CME — observed by STEREO-A (archived)' },
    ],
  },
}

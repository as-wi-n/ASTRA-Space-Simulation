const topics = [
  { title: 'Life Support Systems', text: 'Life support systems provide breathable air, safe water, food support, and stable habitat conditions. They integrate recycling, monitoring, and backups to keep crews alive in closed environments.' },
  { title: 'Oxygen Generation and Recycling', text: 'Habitats conserve oxygen by recycling carbon dioxide and recovering breathable gas. Recycling improves efficiency but cannot create unlimited oxygen without inputs and energy.' },
  { title: 'Water Recovery', text: 'Water recovery systems reclaim moisture from air and wastewater. Recovering a portion of used water reduces resupply needs, while leaks or failures can quickly create shortages.' },
  { title: 'Radiation Protection', text: 'Space radiation comes from solar events and galactic cosmic rays. Shielding, sheltering during storms, and limiting exposure time help reduce crew risk. Dose accumulates over the whole mission: warning near 120, danger near 260 and critical near 400 dose points; the storm vault slows accumulation to about a third.' },
  { title: 'Solar Energy in Space', text: 'Solar panels convert sunlight into electricity. Output depends on sunlight availability, panel orientation/condition, dust, and system efficiency; batteries store excess energy for low-light periods.' },
  { title: 'Dust Storms & Mars Surface Ops', text: 'Martian dust can reduce sunlight and coat solar panels, lowering power generation. Missions must conserve energy and maintain equipment during prolonged storms.' },
  { title: 'Space Habitat Temperature Regulation', text: 'External temperatures can be extreme. Heating and thermal control systems use energy to keep habitats within safe ranges for humans and equipment.' },
  { title: 'Food Production in Space', text: 'Greenhouses can supplement stored food, but they require water, power, light, and growing time. In ASTRA the crop cycle is three Sols before the first harvest; turning the greenhouse off pauses growth instead of instantly losing the crop. Balancing food production with other resource demands is a key trade-off.' },
  { title: 'Carbon Dioxide Removal (Scrubbers)', text: 'Crew exhale CO2 with every breath. A functioning scrubber chemically removes it. Even with plenty of oxygen, unsafe CO2 levels cause fatigue and health damage. Oxygen generation and CO2 removal are separate functions.' },
  { title: 'Water Recovery & Purification', text: 'Closed water loops recover humidity and wastewater. Recovery needs power and working filtration. Contamination means water is unusable until treated — protect purification and change filters.' },
  { title: 'Waste Management & Habitat Hygiene', text: 'Solid/liquid waste builds up if unprocessed. High waste means poor hygiene, more stress, higher contamination risk — and worse health.' },
  { title: 'Power Priorities: Critical → Important → Optional', text: 'Oxygen recycling, CO2 removal and heating are CRITICAL and keep running first. Water recovery, the greenhouse, waste processing and the radiation shelter are IMPORTANT and are throttled under low reserve. Science, comms and lighting are OPTIONAL loads: they draw 10 power/day and can be shed, which pauses research but protects the reserve.' },
  { title: 'Lunar Water Ice', text: 'Permanently shadowed craters near the poles preserve water ice. A rover/drill can confirm deposits and extract drinkable water — but only after surveying, not by default.' },
  { title: 'Martian ISRU (In-Situ Resource Utilization)', text: 'Mars CO2 can potentially be converted into oxygen using electricity. It is not automatic — it needs research, energy, equipment and time.' },
  { title: 'Radiation & Spacesuits', text: 'In space, radiation exposure accumulates. Shielding and storm vaults protect the crew. EVA outside the habitat needs suit integrity, oxygen, battery and caution — suit failure is an emergency.' },
  { title: 'Mission Phases & Difficulty', text: 'A full mission runs 30 Sols through Initialization → Stabilization → Exploration → Critical Ops → Long-Term Survival → Completion. Kid Mode compresses the arc to 11 Sols. Explorer is forgiving, Survival is balanced, and Mission Commander is brutal with limited supplies.' },
]

export default function LearnScience() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <p className="text-cyan-300 uppercase tracking-wider text-sm">Education</p>
      <h1 className="text-3xl md:text-4xl font-bold text-white mt-1 mb-2">Learn Space Science</h1>
      <p className="text-slate-300 mb-8 max-w-3xl">Key concepts behind the ASTRA simulation. During emergencies, the dashboard also shows context-specific scientific explanations. All simulation values are illustrative for learning.</p>
      <div className="grid md:grid-cols-2 gap-4">
        {topics.map((t) => (
          <div key={t.title} className="glass rounded-xl p-5">
            <h2 className="text-xl font-semibold text-white mb-2">{t.title}</h2>
            <p className="text-slate-300 text-sm leading-relaxed">{t.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 glass rounded-xl p-5 border border-cyan-400/20">
        <h2 className="text-xl font-semibold text-white mb-2">Science & Assumptions</h2>
        <ul className="text-sm text-slate-300 list-disc ml-5 space-y-2">
          <li>Resource values (e.g. 120 oxygen units, 240 L water, 120 food) are simplified educational units, not real mission specifications.</li>
          <li>Recycling recovers a portion of daily use (efficiency-based) and does not create unlimited resources.</li>
          <li>Solar generation depends on sunlight and panel efficiency; dust/events can reduce output. Excess generation charges batteries; deficits drain batteries then reserves.</li>
          <li>Greenhouse food production consumes electricity and water while adding food, but only after a three-Sol growing period.</li>
          <li>Optional science/comms/lighting loads draw 10 power/day. Shedding them protects the reserve but pauses research.</li>
          <li>Radiation dose accumulates over the mission; the shelter reduces accumulation and storm impact but does not erase past dose.</li>
          <li>Heating and radiation shelter consume power but improve environmental safety; radiation/temperature affect system strain.</li>
        </ul>
      </div>
    </div>
  )
}

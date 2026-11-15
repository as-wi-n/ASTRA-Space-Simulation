import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMission } from '../hooks/useMission'
import EquipmentCard from '../components/EquipmentCard'
import { equipmentDefs } from '../data/equipment'
import { getDailyRates } from '../simulation/resourceManager'

export default function ResourceManagement() {
  const { state, hasMission, toggleEquipment } = useMission()
  const navigate = useNavigate()
  useEffect(() => { if (!hasMission) navigate('/missions') }, [hasMission, navigate])
  if (!state) return null
  const rates = getDailyRates(state)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <div>
        <p className="text-cyan-300 uppercase tracking-wider text-sm">Resource Management</p>
        <h1 className="text-3xl font-bold text-white mt-1">Habitat Systems Control</h1>
        <p className="text-slate-300 mt-2 max-w-3xl">Toggle equipment to balance power, life support, and production. Controls directly affect the simulation calculations each day.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-4"><div className="text-slate-400 text-sm">Projected Oxygen Change</div><div className="text-xl font-semibold text-white">{rates.oxygenDelta.toFixed(1)} / day</div></div>
        <div className="glass rounded-xl p-4"><div className="text-slate-400 text-sm">Projected Water Change</div><div className="text-xl font-semibold text-white">{rates.waterDelta.toFixed(1)} / day</div></div>
        <div className="glass rounded-xl p-4"><div className="text-slate-400 text-sm">Projected Food / Power Net</div><div className="text-xl font-semibold text-white">{rates.foodDelta.toFixed(1)} food · {rates.electricityNet.toFixed(1)} power</div></div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {equipmentDefs.map((def) => (
          <EquipmentCard key={def.id} def={def} enabled={!!state.equipment[def.id]} onToggle={() => toggleEquipment(def.id)} />
        ))}
      </div>

      <div className="glass rounded-xl p-5 border border-cyan-400/20">
        <h2 className="text-xl font-semibold text-white mb-2">Science & Assumptions (Simulation)</h2>
        <ul className="text-sm text-slate-300 list-disc ml-5 space-y-1">
          <li>Initial values are illustrative (e.g. 100 oxygen units, 200 L water, 100 food units, 500 electricity, 100% battery) for 3 astronauts.</li>
          <li>Water and oxygen recycling recover a portion of daily use; they do not create unlimited resources.</li>
          <li>Solar generation depends on sunlight and efficiency (affected by environment/events). Excess charges battery; deficits drain battery then reserves.</li>
          <li>Greenhouse production consumes electricity and water while increasing food.</li>
          <li>Heating and radiation shelter consume power but improve safety/conditions.</li>
        </ul>
      </div>
    </div>
  )
}

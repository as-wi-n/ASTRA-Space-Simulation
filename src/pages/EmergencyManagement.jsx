import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMission } from '../hooks/useMission'
import EmergencyModal from '../components/EmergencyModal'

export default function EmergencyManagement() {
  const { state, hasMission, chooseEmergency } = useMission()
  const navigate = useNavigate()
  useEffect(() => { if (!hasMission) navigate('/missions') }, [hasMission, navigate])
  useEffect(() => { if (state?.phase === 'completed') navigate('/results') }, [state?.phase, navigate])
  if (!state) return null
  const pending = state.pendingEmergency

  const tips = [
    { title: 'Dust Storm', text: 'Solar efficiency drops. Conserve power or perform maintenance to recover output.' },
    { title: 'Oxygen Leakage', text: 'Act fast to seal or use reserves; delays cause rapid oxygen loss.' },
    { title: 'Water Leakage', text: 'Isolate or reroute quickly to preserve reserves for crew and systems.' },
    { title: 'Radiation Storm', text: 'Use the radiation shelter and reduce exposure; continuing operations increases risk.' },
    { title: 'Equipment Failure', text: 'Repairs cost resources now but prevent cascading losses.' },
    { title: 'Extreme Temperature', text: 'Thermal control uses energy; insufficient heating risks habitat conditions.' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <div>
        <p className="text-cyan-300 uppercase tracking-wider text-sm">Emergency Management</p>
        <h1 className="text-3xl font-bold text-white mt-1">Emergency Operations Center</h1>
        <p className="text-slate-300 mt-2">When emergencies occur, you must choose a response. Each option explains consequences and updates mission resources.</p>
      </div>

      <div className={`glass rounded-xl p-5 border ${pending ? 'border-amber-400/40' : 'border-emerald-400/20'}`}>
        {pending ? (
          <div>
            <h2 className="text-xl font-semibold text-amber-300 mb-1">Active Emergency: {pending.title}</h2>
            <p className="text-slate-200 mb-2">{pending.description}</p>
            <p className="text-sm text-cyan-200 mb-3"><strong>Scientific reason:</strong> {pending.science}</p>
            <p className="text-slate-300">A decision dialog is available now. Choose one of the three actions below in the modal to apply consequences.</p>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-emerald-300 mb-1">No Active Emergency</h2>
            <p className="text-slate-300">Systems are currently stable. Continue advancing days from the Dashboard to progress the mission. Emergencies may occur dynamically based on mission conditions.</p>
            <Link to="/dashboard" className="inline-block mt-3 text-cyan-300 hover:underline">Return to Dashboard</Link>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white mb-3">Emergency Protocols & Science</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tips.map((t) => (
            <div key={t.title} className="glass rounded-xl p-4">
              <h3 className="font-semibold text-white mb-1">{t.title}</h3>
              <p className="text-sm text-slate-300">{t.text}</p>
            </div>
          ))}
        </div>
      </div>

      <EmergencyModal emergency={pending} onChoose={chooseEmergency} />
    </div>
  )
}

import * as Icons from 'lucide-react'

export default function EquipmentCard({ def, enabled, onToggle }) {
  const Icon = Icons[def.icon] || Icons.Cpu
  return (
    <div className="glass rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-400/20"><Icon size={18} className="text-cyan-300" /></span>
          <div>
            <h3 className="font-semibold text-white">{def.name}</h3>
            <p className="text-xs text-slate-400">Energy: {def.energyUse} units/day</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className={`px-3 py-1.5 rounded-md text-sm font-medium border transition ${enabled ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30' : 'bg-slate-800 text-slate-300 border-white/10'}`}
        >
          {enabled ? 'ON' : 'OFF'}
        </button>
      </div>
      <p className="text-sm text-slate-300">{def.description}</p>
      <p className="text-xs text-cyan-200/90"><strong>Effect:</strong> {def.effect}</p>
    </div>
  )
}

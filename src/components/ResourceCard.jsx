import ProgressBar from './ProgressBar'
import { percent, formatNumber } from '../utils/calculations'

export default function ResourceCard({ icon: Icon, title, current, max, unit = '', rate, status }) {
  const p = percent(current, max)
  const color = p > 60 ? 'green' : p > 30 ? 'orange' : 'red'
  const statusColor = status === 'Stable' ? 'text-emerald-300' : status === 'Warning' ? 'text-amber-300' : 'text-red-300'
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={18} className="text-cyan-300" />}
          <h3 className="font-semibold text-white">{title}</h3>
        </div>
        <span className={`text-xs font-medium ${statusColor}`}>{status}</span>
      </div>
      <div className="text-2xl font-bold text-white">{formatNumber(current, 1)} <span className="text-sm text-slate-400 font-medium">/ {max} {unit}</span></div>
      <div className="mt-2"><ProgressBar value={p} color={color} /></div>
      <div className="mt-2 text-xs text-slate-400">Rate: <span className="text-slate-200">{rate}</span></div>
    </div>
  )
}

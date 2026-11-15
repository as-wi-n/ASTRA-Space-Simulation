export default function ProgressBar({ value = 0, color = 'cyan' }) {
  const pct = Math.max(0, Math.min(100, value))
  const bar = {
    cyan: 'from-cyan-500 to-blue-500',
    green: 'from-emerald-500 to-cyan-400',
    orange: 'from-amber-500 to-orange-500',
    red: 'from-red-500 to-orange-500',
  }[color] || 'from-cyan-500 to-blue-500'
  return (
    <div className="h-2.5 w-full rounded-full bg-slate-800/80 overflow-hidden border border-white/5">
      <div className={`h-full rounded-full bg-gradient-to-r ${bar} transition-all duration-500`} style={{ width: `${pct}%` }} />
    </div>
  )
}

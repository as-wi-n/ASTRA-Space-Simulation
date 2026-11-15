import { AlertTriangle } from 'lucide-react'

export default function EmergencyModal({ emergency, onChoose, spareParts = 0 }) {
  if (!emergency) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full glass rounded-2xl p-5 border border-amber-400/30">
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-400/30"><AlertTriangle className="text-amber-300" /></div>
          <div>
            <p className="text-xs uppercase tracking-wider text-amber-300">Emergency · Day {emergency.day}</p>
            <h2 className="text-2xl font-bold text-white">{emergency.title}</h2>
          </div>
        </div>
        <p className="text-slate-200 mb-2">{emergency.description}</p>
        <div className="rounded-lg bg-slate-900/60 border border-cyan-500/15 p-3 mb-4">
          <p className="text-sm text-cyan-200"><strong>Scientific reason:</strong> {emergency.science}</p>
        </div>
        <div className="rounded-lg border border-amber-400/20 bg-amber-500/5 p-3 mb-3 text-sm">
          <p className="text-amber-200 font-semibold">Before you choose, ask yourself:</p>
          <p className="text-slate-300 mt-1">Are we protecting the <strong>crew</strong>, <strong>air</strong>, <strong>water</strong>, <strong>food</strong>, or <strong>power</strong>? Each choice saves one part of the mission but costs another. Pick the one that fits the emergency.</p>
        </div>
        <div className="grid gap-3">
          {emergency.choices.map((c) => {
            const needsPart = (c.effects?.spareParts ?? 0) < 0
            const disabled = needsPart && spareParts <= 0
            return (
              <button
                key={c.id}
                onClick={() => { if (!disabled) onChoose(c.id) }}
                disabled={disabled}
                className={`text-left p-4 rounded-xl border transition ${disabled
                  ? 'border-white/5 bg-slate-900/20 opacity-55 cursor-not-allowed'
                  : 'border-white/10 hover:border-cyan-400/40 hover:bg-cyan-500/5 bg-slate-900/40'}`}
              >
                <div className="font-semibold text-white mb-1">{c.label}{needsPart ? ' · needs 1 spare part' : ''}</div>
                <div className="text-sm text-slate-300">{c.consequence}</div>
                {disabled && <div className="text-xs text-red-300 mt-1">No spare parts left — choose a different response.</div>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

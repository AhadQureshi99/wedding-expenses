const tones = {
  rose:    'bg-rose-50 text-rose-700',
  amber:   'bg-amber-50 text-amber-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  sky:     'bg-sky-50 text-sky-700',
  slate:   'bg-slate-100 text-slate-700',
}

const StatCard = ({ label, value, hint, icon: Icon, tone = 'rose' }) => (
  <div className="card">
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
      {Icon && (
        <div className={`grid h-8 w-8 place-items-center rounded-lg ${tones[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>
      )}
    </div>
    <div className="mt-3 text-2xl font-semibold text-slate-900">{value}</div>
    {hint && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
  </div>
)

export default StatCard

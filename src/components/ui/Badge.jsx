const tones = {
  rose:    'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200',
  amber:   'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
  emerald: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
  sky:     'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200',
  slate:   'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200',
}

const Badge = ({ children, tone = 'slate' }) => (
  <span className={`badge ${tones[tone]}`}>{children}</span>
)

export default Badge

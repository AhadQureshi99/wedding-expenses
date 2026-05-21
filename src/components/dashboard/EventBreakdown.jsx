import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts'
import { EVENT_COLORS } from '@/constants'
import { formatMoney } from '@/utils/formatters'

const EventBreakdown = ({ data }) => {
  const sorted = [...data].sort((a, b) => b.actual - a.actual)

  return (
    <div className="card">
      <h3 className="mb-4 text-lg">Spend by event</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sorted} margin={{ top: 8, right: 8, left: 8, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="name"
              interval={0}
              tick={{ fontSize: 11, fill: '#64748b' }}
              angle={-25}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => formatMoney(v)} width={80} />
            <Tooltip
              cursor={{ fill: 'rgba(244, 63, 94, 0.05)' }}
              formatter={(value) => formatMoney(value)}
              contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
            />
            <Bar dataKey="actual" radius={[8, 8, 0, 0]}>
              {sorted.map((entry) => (
                <Cell key={entry.name} fill={EVENT_COLORS[entry.name] ?? '#f43f5e'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default EventBreakdown

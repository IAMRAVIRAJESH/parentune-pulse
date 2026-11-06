import { useEffect, useState } from 'react';
import { fetchAnalytics } from '../api.js';

const URGENCY_LABEL = {
  emergency: 'Emergency',
  see_doctor: 'See a doctor',
  community: 'Community',
  instant: 'Instant',
};

function Bars({ title, rows, format = (x) => x }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-slate-800">{title}</h3>
      {rows.length === 0 && <p className="text-sm text-slate-500">No data yet</p>}
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="flex justify-between text-xs text-slate-600">
              <span className="capitalize">{format(r.label)}</span>
              <span>{r.count}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div className="h-2 rounded-full bg-violet-500" style={{ width: `${(r.count / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Insights() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics()
      
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>;
  if (!data) return <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
        <p className="text-3xl font-bold text-violet-600">{data.total}</p>
        <p className="text-sm text-slate-600">concerns triaged</p>
      </div>
      <Bars title="Top concern categories" rows={data.byCategory} />
      <Bars title="Urgency breakdown" rows={data.byUrgency} format={(l) => URGENCY_LABEL[l] ?? l} />
      <Bars title="Last 7 days" rows={data.perDay} />
    </div>
  );
}

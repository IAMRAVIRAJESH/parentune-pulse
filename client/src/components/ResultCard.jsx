import FeedbackBar from './FeedbackBar.jsx';

const URGENCY = {
  emergency: { label: 'Emergency', hint: 'Get medical help right now', box: 'border-red-300 bg-red-50', badge: 'bg-red-600' },
  see_doctor: { label: 'See a doctor', hint: 'Best checked by a doctor soon', box: 'border-orange-300 bg-orange-50', badge: 'bg-orange-500' },
  community: { label: 'Ask the community', hint: 'Experienced parents can help', box: 'border-blue-300 bg-blue-50', badge: 'bg-blue-600' },
  instant: { label: 'Likely manageable', hint: 'Common and usually low-risk', box: 'border-green-300 bg-green-50', badge: 'bg-green-600' },
};

export default function ResultCard({ result }) {
  const u = URGENCY[result.urgency] ?? URGENCY.instant;

  return (
    <div className={`space-y-4 rounded-2xl border p-4 ${u.box}`}>
      <div className="flex items-center justify-between">
        <span className={`rounded-full px-3 py-1 text-sm font-semibold text-white ${u.badge}`}>{u.label}</span>
        <span className="text-xs text-slate-600">{result.category}</span>
      </div>

      <p className="font-medium text-slate-900">{result.summary}</p>

      <div>
        <h3 className="mb-1 text-sm font-semibold text-slate-800">What you can do</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
          {result.advice.map((a, i) => <li key={i}>{a}</li>)}
        </ul>
      </div>

      {result.redFlags?.length > 0 && (
        <div>
          <h3 className="mb-1 text-sm font-semibold text-red-700">See a doctor immediately if</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            {result.redFlags.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 pt-1">
        <button className="rounded-xl bg-violet-600 py-2 text-sm font-semibold text-white">Talk to a doctor</button>
        <button className="rounded-xl border border-violet-600 py-2 text-sm font-semibold text-violet-700">Ask parents</button>
      </div>

      {result.urgency !== 'emergency' && result.id && <FeedbackBar resultId={result.id} />}

      <p className="text-xs text-slate-500">{result.disclaimer}</p>
    </div>
  );
}

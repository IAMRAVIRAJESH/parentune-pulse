import { useState } from 'react';

const EXAMPLES = [
  'My 14-month-old has a fever of 100.5 and won\'t eat',
  'Bacha raat ko baar baar uthta hai, kya karun?',
  'Rash on my baby\'s cheeks after starting solids',
];

export default function TriageForm({ onSubmit, loading }) {
  const [age, setAge] = useState('');
  const [unit, setUnit] = useState('months');
  const [concern, setConcern] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const n = Number(age);
    if (Number.isNaN(n) || age === '') return;
    const ageMonths = unit === 'years' ? Math.round(n * 12) : Math.round(n);
    onSubmit({ concern: concern.trim(), ageMonths });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Child's age</label>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            step="any"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g. 14"
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-violet-500"
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-base"
          >
            <option value="months">months</option>
            <option value="years">years</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">What's worrying you?</label>
        <textarea
          rows={4}
          value={concern}
          onChange={(e) => setConcern(e.target.value)}
          placeholder="Describe it in English, Hindi or Hinglish..."
          required
          maxLength={1000}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-violet-500"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              type="button"
              key={ex}
              onClick={() => setConcern(ex)}
              className="rounded-full bg-violet-50 px-3 py-1 text-xs text-violet-700"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-violet-600 py-3 text-base font-semibold text-white disabled:opacity-60"
      >
        {loading ? 'Checking...' : 'Get guidance'}
      </button>
    </form>
  );
}

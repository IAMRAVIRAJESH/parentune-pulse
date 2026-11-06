import { useState } from 'react';
import TriageForm from './components/TriageForm.jsx';
import ResultCard from './components/ResultCard.jsx';
import Insights from './components/Insights.jsx';
import { triage } from './api.js';

export default function App() {
  const [tab, setTab] = useState('ask');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (payload) => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      setResult(await triage(payload));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const tabClass = (name) =>
    `flex-1 py-3 text-sm font-semibold ${tab === name ? 'text-violet-600' : 'text-slate-500'}`;

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <header className="bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-6 text-white">
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-bold">Parentune Pulse</h1>
          <p className="text-sm text-violet-100">Instant, safe first guidance for your parenting worries</p>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-4 py-6">
        {tab === 'ask' ? (
          <>
            <TriageForm onSubmit={handleSubmit} loading={loading} />
            {loading && <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />}
            {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            {result && <ResultCard result={result} />}
          </>
        ) : (
          <Insights />
        )}
      </main>

      <nav className="fixed inset-x-0 bottom-0 border-t bg-white">
        <div className="mx-auto flex max-w-md">
          <button className={tabClass('ask')} onClick={() => setTab('ask')}>Ask</button>
          <button className={tabClass('insights')} onClick={() => setTab('insights')}>Insights</button>
        </div>
      </nav>
    </div>
  );
}

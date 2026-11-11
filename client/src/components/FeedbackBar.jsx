import { useState } from 'react';
import { sendFeedback } from '../api.js';

export default function FeedbackBar({ resultId }) {
  const [state, setState] = useState('idle'); // idle | sending | done | error

  const send = async (helpful) => {
    setState('sending');
    try {
      await sendFeedback(resultId, helpful);
      setState('done');
    } catch {
      setState('error');
    }
  };

  if (state === 'done') {
    return <p className="text-center text-sm text-slate-600">Thanks for your feedback.</p>;
  }

  return (
    <div className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2">
      <span className="text-sm text-slate-700">Was this helpful?</span>
      <div className="flex gap-2">
        <button
          disabled={state === 'sending'}
          onClick={() => send(true)}
          className="rounded-lg border border-slate-300 px-3 py-1 text-sm disabled:opacity-60"
        >
          Yes
        </button>
        <button
          disabled={state === 'sending'}
          onClick={() => send(false)}
          className="rounded-lg border border-slate-300 px-3 py-1 text-sm disabled:opacity-60"
        >
          No
        </button>
      </div>
      {state === 'error' && <span className="ml-2 text-xs text-red-600">Try again</span>}
    </div>
  );
}

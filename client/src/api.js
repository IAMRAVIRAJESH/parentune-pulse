import { API_URL } from './config.js';

export async function triage(payload) {
  const res = await fetch(`${API_URL}/api/triage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // not JSON
  }

  if (!res.ok || !data) {
    throw new Error(data?.error || 'Server is not responding. Please try again.');
  }
  return data;
}

export async function fetchAnalytics() {
  const res = await fetch(`${API_URL}/api/analytics`);
  if (!res.ok) throw new Error('Could not load insights');
  return res.json();
}

export async function sendFeedback(id, helpful) {
  const res = await fetch(`${API_URL}/api/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, helpful }),
  });
  if (!res.ok) throw new Error('Could not send feedback');
}

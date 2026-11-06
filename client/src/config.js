// Empty in local dev (Vite proxies /api to the backend). Set VITE_API_URL on Netlify.
export const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

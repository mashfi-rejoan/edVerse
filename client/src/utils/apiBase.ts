const rawBase = import.meta.env.VITE_API_URL || '';
const API_BASE = rawBase.replace(/\/$/, '');

export const apiUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${normalizedPath}`;
};

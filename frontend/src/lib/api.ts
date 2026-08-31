// API Client for Saksham AI Gateway Service

const GATEWAY_BASE_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:5000';

export async function fetchFromApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('saksham_token') : null;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${GATEWAY_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    console.warn(`[API Client] Request to ${endpoint} failed: ${err.message}. Using offline fallback.`);
    throw err;
  }
}

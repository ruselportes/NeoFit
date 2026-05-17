const API_BASE = 'http://localhost:8000/api';

async function request(url: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || body.message || `Request failed (${res.status})`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// Dashboard
export const fetchDashboard = () => request('/dashboard');

// Members
export const fetchMembers = (search = '', status = '') =>
  request(`/members?search=${encodeURIComponent(search)}&status=${encodeURIComponent(status)}`);

export const createMember = (data: {
  name: string; contact: string; plan: string; joined_date: string; expiry_date: string;
}) => request('/members', { method: 'POST', body: JSON.stringify(data) });

export const updateMember = (id: number, data: Record<string, string>) =>
  request(`/members/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteMember = (id: number) =>
  request(`/members/${id}`, { method: 'DELETE' });

// Check-ins
export const fetchCheckIns = () => request('/checkins');

export const createCheckIn = (memberId: string) =>
  request('/checkins', { method: 'POST', body: JSON.stringify({ member_id: memberId }) });

// Settings
export const fetchSettings = () => request('/settings');

export const saveSettings = (data: {
  gymName: string; contact: string; address: string; announcement: string;
}) => request('/settings', { method: 'PUT', body: JSON.stringify(data) });

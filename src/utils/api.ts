import { UserProfile, UserProgressData, CheckedMessageRecord, MockCallRecord, AccountRole } from '../types';

const rawApiUrl = (import.meta.env.VITE_API_URL as string | undefined) || '';
const trimmedApiUrl = rawApiUrl.trim().replace(/\/+$/, '');
const noTrailingApi = trimmedApiUrl.replace(/\/api$/i, '');
export const API_BASE = noTrailingApi ? `${noTrailingApi}/api` : '/api';

export const AUTH_TOKEN_KEY = 'clearcue_auth_token';

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string): void {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch (e) {
    console.warn('Failed to save auth token to localStorage', e);
  }
}

export function removeAuthToken(): void {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (e) {
    console.warn('Failed to remove auth token from localStorage', e);
  }
}

export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export interface BackendStatus {
  status: string;
  service: string;
  database: string;
  mongoConnected: boolean;
  environment: string;
  uptimeSeconds: number;
  timestamp: string;
}

export async function fetchBackendStatus(): Promise<BackendStatus> {
  const res = await fetch(`${API_BASE}/status`);
  if (!res.ok) throw new Error('Failed to reach backend status service');
  return res.json();
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: UserProfile;
  error?: string;
}

export async function registerUser(data: {
  username: string;
  password: string;
  name: string;
  email?: string;
  role?: string;
  accountRole?: AccountRole;
  agency?: string;
  avatar?: string;
}): Promise<{ token: string; user: UserProfile }> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Registration failed');
  }
  if (json.token) {
    setAuthToken(json.token);
  }
  return json;
}

export async function loginUser(credentials: {
  identifier: string;
  password: string;
}): Promise<{ token: string; user: UserProfile }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Invalid credentials');
  }
  if (json.token) {
    setAuthToken(json.token);
  }
  return json;
}

export async function logoutUser(): Promise<void> {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
  } catch (e) {
    console.warn('Backend logout call completed with warning:', e);
  } finally {
    removeAuthToken();
  }
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      removeAuthToken();
      return null;
    }
    const data = await res.json();
    return data.user || null;
  } catch (err) {
    console.warn('Failed to verify token:', err);
    return null;
  }
}

export async function fetchUsers(): Promise<UserProfile[]> {
  const res = await fetch(`${API_BASE}/users`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to load user profiles');
  return res.json();
}

export async function createUser(data: {
  username: string;
  name: string;
  password?: string;
  email?: string;
  role?: string;
  agency?: string;
  avatar?: string;
}): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create/switch user profile');
  return res.json();
}

export async function updateUserProfile(
  userId: string,
  data: Partial<UserProfile>
): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/users/${encodeURIComponent(userId)}/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update user profile');
  return res.json();
}

export async function fetchUserProgress(userId: string): Promise<UserProgressData> {
  const res = await fetch(`${API_BASE}/users/${encodeURIComponent(userId)}/progress`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch user progress');
  return res.json();
}

export async function saveUserProgress(
  userId: string,
  progress: Partial<UserProgressData>
): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/users/${encodeURIComponent(userId)}/progress`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(progress),
  });
  if (!res.ok) throw new Error('Failed to update user progress');
  return res.json();
}

export async function saveCheckedMessage(
  userId: string,
  record: CheckedMessageRecord & { fullData?: any }
): Promise<{ success: boolean; totalChecked: number; averageScore: number }> {
  const res = await fetch(`${API_BASE}/users/${encodeURIComponent(userId)}/messages`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(record),
  });
  if (!res.ok) throw new Error('Failed to persist checked message');
  return res.json();
}

export async function saveMockCallRecord(
  userId: string,
  record: MockCallRecord
): Promise<{ success: boolean; id: string }> {
  const res = await fetch(`${API_BASE}/users/${encodeURIComponent(userId)}/mock-calls`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(record),
  });
  if (!res.ok) throw new Error('Failed to persist mock call record');
  return res.json();
}

export async function resetDatabaseProgress(userId: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/users/${encodeURIComponent(userId)}/progress`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to reset user progress in database');
  return res.json();
}

export interface AdminUserRecord extends UserProfile {
  totalChecked: number;
  averageScore: number;
  streakDays: number;
  createdAt?: string;
  lastActive?: string;
}

export async function fetchAdminUsers(): Promise<AdminUserRecord[]> {
  const res = await fetch(`${API_BASE}/admin/users`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || 'Failed to fetch admin users');
  return data.users;
}

export async function updateUserRole(userId: string, accountRole: AccountRole): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/users/${encodeURIComponent(userId)}/role`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ accountRole }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || 'Failed to update user role');
}

export async function deleteAdminUser(userId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/users/${encodeURIComponent(userId)}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || 'Failed to delete user');
}

export interface StudentProgressRecord {
  id: string;
  username: string;
  name: string;
  email?: string;
  role: string;
  agency: string;
  avatar: string;
  totalChecked: number;
  averageScore: number;
  streakDays: number;
  completedScenariosCount: number;
  lastActive?: string;
}

export async function fetchTeacherStudents(): Promise<StudentProgressRecord[]> {
  const res = await fetch(`${API_BASE}/teacher/students`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || 'Failed to fetch student roster');
  return data.students;
}

import type { Role, User, ValidPermission, ApiResponse } from '../../../shared/types';

const API_URL = 'http://localhost:3000/api';

// MOCK AUTHENTICATION: 
// We pretend we are logged in as "user-1" (Alice, the Admin)
// In a real app, you would get this from localStorage or a state management store.
const CURRENT_LOGGED_IN_USER_ID = 'user-1'; 

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { 
      'Content-Type': 'application/json',
      // Attach our VIP wristband to every request!
      'x-user-id': CURRENT_LOGGED_IN_USER_ID, 
      ...options?.headers 
    }
  });
  
  const json: ApiResponse<T> = await res.json();
  if (!json.success) throw new Error(json.error);
  return json.data;
}

export const api = {
  getRoles: () => fetchApi<Role[]>('/roles'),
  createRole: (data: Omit<Role, 'id'>) => fetchApi<Role>('/roles', { method: 'POST', body: JSON.stringify(data) }),
  updateRole: (id: string, data: Omit<Role, 'id'>) => fetchApi<Role>(`/roles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getUsers: () => fetchApi<User[]>('/users'),
  assignRoles: (id: string, roleIds: string[]) => fetchApi<User>(`/users/${id}/roles`, { method: 'PUT', body: JSON.stringify({ roleIds }) }),
  getEffectivePermissions: (id: string) => fetchApi<ValidPermission[]>(`/users/${id}/permissions`)
};
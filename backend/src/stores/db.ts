// backend/src/stores/db.ts
import { Role, User } from '../../../shared/types';
import { VALID_PERMISSIONS } from '../../../shared/constants';

export const rolesStore = new Map<string, Role>();
export const usersStore = new Map<string, User>();

rolesStore.set('123e4567-e89b-12d3-a456-426614174000', {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Admin',
  description: 'Full Access',
  permissions: [...VALID_PERMISSIONS]
});

// FIX: Just use their actual names!
usersStore.set('user-1', { id: 'user-1', name: 'Alice', roleIds: ['123e4567-e89b-12d3-a456-426614174000'] });
usersStore.set('user-2', { id: 'user-2', name: 'Bob', roleIds: [] });
usersStore.set('user-3', { id: 'user-3', name: 'Charlie', roleIds: [] });
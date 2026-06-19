import { rolesStore } from '../stores/db';
import { Role } from '../../../shared/types';
import { randomUUID } from 'crypto';

export class RoleService {
  static getAll(): Role[] {
    return Array.from(rolesStore.values());
  }

  static create(payload: Omit<Role, 'id'>): Role {
    const newRole: Role = { id: randomUUID(), ...payload };
    rolesStore.set(newRole.id, newRole);
    return newRole;
  }

  static update(id: string, payload: Omit<Role, 'id'>): Role | null {
    if (!rolesStore.has(id)) return null;
    const updated = { id, ...payload };
    rolesStore.set(id, updated);
    return updated;
  }
}
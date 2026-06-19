import { usersStore, rolesStore, persistData } from '../stores/db';
import { User, ValidPermission } from '../../../shared/types';

export class UserService {
  static getAll(): User[] {
    return Array.from(usersStore.values());
  }

  static assignRoles(userId: string, roleIds: string[]): User | null {
    const user = usersStore.get(userId);
    if (!user) return null;

    // Validate that all assigned roles actually exist
    const validRoleIds = roleIds.filter(id => rolesStore.has(id));
    
    user.roleIds = validRoleIds;
    usersStore.set(userId, user);

    persistData(); // <-- Save to file
    return user;
  }

  static resolveEffectivePermissions(userId: string): ValidPermission[] | null {
    const user = usersStore.get(userId);
    if (!user) return null;

    const effective = new Set<ValidPermission>();
    for (const roleId of user.roleIds) {
      const role = rolesStore.get(roleId);
      if (role) {
        role.permissions.forEach(p => effective.add(p as ValidPermission));
      }
    }
    return Array.from(effective);
  }
}
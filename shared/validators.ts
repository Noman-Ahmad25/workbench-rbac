import { z } from 'zod';
import { VALID_PERMISSIONS } from './constants';

export const RoleSchema = z.object({
  name: z.string().min(1, "Role name is required").max(50),
  description: z.string().max(200),
  permissions: z.array(z.string()).refine(
    (perms: string[]) => perms.every((p: string) => VALID_PERMISSIONS.includes(p)),
    { message: "Invalid permission string detected" }
  )
});

export const UserRoleAssignmentSchema = z.object({
  roleIds: z.array(z.string().uuid("Invalid Role ID format"))
});

import { z } from 'zod';
import { RoleSchema } from './validators';

export type ValidPermission = typeof import('./constants').VALID_PERMISSIONS[number];


export interface Role extends z.infer<typeof RoleSchema> {
  id: string;
}

export interface User {
  id: string;
  name: string;
  roleIds: string[];
}

export type ApiResponse<T> = { success: true; data: T } | { success: false; error: string };

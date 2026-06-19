export const RESOURCES = ['Projects', 'Tasks', 'Members', 'Billing', 'Settings'] as const;

// Define all specific actions allowed per resource to avoid magic strings
export const PERMISSION_MAP = {
  Projects: ['view', 'create', 'edit', 'delete', 'archive'],
  Tasks: ['view', 'create', 'edit', 'delete', 'assign'],
  Members: ['view', 'invite', 'remove', 'update role'],
  Billing: ['view', 'update', 'download invoices'],
  Settings: ['view', 'update']
} as const;

// Generate array of strictly typed strings (e.g., "Projects:view", "Projects:create")
export const VALID_PERMISSIONS = Object.entries(PERMISSION_MAP).flatMap(
  ([resource, actions]) => actions.map(action => `${resource}:${action}`)
) as readonly string[];
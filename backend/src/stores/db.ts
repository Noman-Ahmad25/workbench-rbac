import fs from 'fs';
import path from 'path';
import { Role, User } from '../../../shared/types';
import { VALID_PERMISSIONS } from '../../../shared/constants';

const DB_FILE = path.join(__dirname, 'data.json');

// Define our seed data
const SEED_ROLES: Role[] = [
  { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Admin', description: 'Full Access', permissions: [...VALID_PERMISSIONS] }
];

const SEED_USERS: User[] = [
  { id: 'user-1', name: 'Alice', roleIds: ['123e4567-e89b-12d3-a456-426614174000'] },
  { id: 'user-2', name: 'Bob', roleIds: [] },
  { id: 'user-3', name: 'Charlie', roleIds: [] }
];

interface DatabaseSchema {
  roles: Record<string, Role>;
  users: Record<string, User>;
}

// 1. Initialize DB from File OR Seed Data
let dbData: DatabaseSchema;

if (fs.existsSync(DB_FILE)) {
  // Load existing data if server restarts
  dbData = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
} else {
  // First time running? Create seed data and save to file
  dbData = {
    roles: Object.fromEntries(SEED_ROLES.map(r => [r.id, r])),
    users: Object.fromEntries(SEED_USERS.map(u => [u.id, u]))
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2));
}

// 2. Export Maps for easy manipulation in our services
export const rolesStore = new Map<string, Role>(Object.entries(dbData.roles));
export const usersStore = new Map<string, User>(Object.entries(dbData.users));

// 3. Export a helper function to save changes back to the file
export const persistData = () => {
  const dataToSave: DatabaseSchema = {
    roles: Object.fromEntries(rolesStore.entries()),
    users: Object.fromEntries(usersStore.entries())
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2));
};
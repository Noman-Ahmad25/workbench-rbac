import { useState, useEffect } from 'react';
import type { Role } from '../../../shared/types';
import { PermissionMatrix } from './PermissionMatrix';

interface Props {
  initialRole?: Role | null;
  onSave: (role: Omit<Role, 'id'>, id?: string) => Promise<void>;
  onCancel: () => void;
}

export function RoleBuilder({ initialRole, onSave, onCancel }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialRole) {
      setName(initialRole.name);
      setDescription(initialRole.description);
      setPermissions(initialRole.permissions);
    } else {
      setName(''); setDescription(''); setPermissions([]);
    }
    setError('');
  }, [initialRole]);

  const handleSubmit = async () => {
    if (!name.trim()) return setError('Role name is required.');
    try {
      await onSave({ name, description, permissions: permissions as any }, initialRole?.id);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">{initialRole ? 'Edit Role' : 'Create Custom Role'}</h2>
        <p className="text-sm text-slate-500">Select the specific actions this role can perform.</p>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm font-medium border border-red-100">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="p-2.5 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
          placeholder="Role Name (e.g. Content Editor)"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="p-2.5 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
          placeholder="Description (Optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <PermissionMatrix selected={permissions} onChange={setPermissions} />

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <button onClick={onCancel} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg transition font-medium">Cancel</button>
        <button onClick={handleSubmit} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition font-medium">
          {initialRole ? 'Save Changes' : 'Create Role'}
        </button>
      </div>
    </div>
  );
}
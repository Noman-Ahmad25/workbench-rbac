import { useState, useEffect } from 'react';
import { RoleBuilder } from './components/RoleBuilder';
import { EffectivePermissionViewer } from './components/EffectivePermissionViewer';
import { api } from './services/api';
import type { Role, User, ValidPermission } from '../../shared/types';

export default function App() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [effectivePerms, setEffectivePerms] = useState<ValidPermission[]>([]);
  const [loadingPerms, setLoadingPerms] = useState(false);
  const [toast, setToast] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    Promise.all([api.getRoles(), api.getUsers()]).then(([r, u]) => { setRoles(r); setUsers(u); });
  }, []);

  const showToast = (msg: string, type: 'success'|'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveRole = async (data: Omit<Role, 'id'>, id?: string) => {
    const saved = id ? await api.updateRole(id, data) : await api.createRole(data);
    setRoles(prev => id ? prev.map(r => r.id === id ? saved : r) : [...prev, saved]);
    setEditingRole(null);
    showToast(id ? 'Role updated' : 'Role created');
    
    // Refresh permissions if a selected user holds the updated role
    if (selectedUser && selectedUser.roleIds.includes(saved.id)) loadPermissions(selectedUser);
  };

  const handleRoleToggle = async (user: User, roleId: string) => {
    const roleIds = user.roleIds.includes(roleId) ? user.roleIds.filter(id => id !== roleId) : [...user.roleIds, roleId];
    await api.assignRoles(user.id, roleIds);
    setUsers(users.map(u => u.id === user.id ? { ...u, roleIds } : u));
    showToast('User roles updated');
    if (selectedUser?.id === user.id) loadPermissions({ ...user, roleIds });
  };

  const loadPermissions = async (user: User) => {
    setSelectedUser(user);
    setLoadingPerms(true);
    setEffectivePerms(await api.getEffectivePermissions(user.id));
    setLoadingPerms(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded shadow-lg font-medium text-white transition ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.msg}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-12">
        <header>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Workbench Access Control</h1>
          <p className="text-slate-500 mt-2">Manage custom roles and user assignments.</p>
        </header>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Roles Management Column */}
          <div className="xl:col-span-2 space-y-6">
            {editingRole || editingRole === undefined ? (
              <RoleBuilder 
                initialRole={editingRole} 
                onSave={handleSaveRole} 
                onCancel={() => setEditingRole(null)} 
              />
            ) : (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Roles</h2>
                  <button onClick={() => setEditingRole(undefined)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                    + New Role
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {roles.map(r => (
                    <div key={r.id} className="p-4 border rounded-lg hover:border-blue-300 transition group flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{r.name}</h3>
                        <p className="text-xs text-slate-500">{r.permissions.length} permissions</p>
                      </div>
                      <button onClick={() => setEditingRole(r)} className="text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition">Edit</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Management & Resolution Column */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Users Directory</h2>
              <div className="space-y-4">
                {users.map(u => (
                  <div key={u.id} className={`p-4 border rounded-lg transition ${selectedUser?.id === u.id ? 'border-blue-500 ring-1 ring-blue-500' : 'hover:border-slate-300'}`}>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold">{u.name}</span>
                      <button onClick={() => loadPermissions(u)} className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">View Access</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {roles.map(r => (
                        <label key={r.id} className={`text-xs px-2 py-1 rounded cursor-pointer border transition ${u.roleIds.includes(r.id) ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                          <input type="checkbox" className="hidden" checked={u.roleIds.includes(r.id)} onChange={() => handleRoleToggle(u, r.id)} />
                          {r.name}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <EffectivePermissionViewer 
              user={selectedUser} 
              permissions={effectivePerms} 
              loading={loadingPerms} 
              roles={selectedUser?.roleIds.map(id => roles.find(r => r.id === id)?.name || 'Unknown') || []}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
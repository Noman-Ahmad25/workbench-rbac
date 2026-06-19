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
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 font-sans">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 px-6 py-3 rounded-lg shadow-xl font-medium text-white transition-all z-50 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.msg}
        </div>
      )}

      <div className="max-w-[1400px] mx-auto space-y-10">
        <header>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Workbench Admin</h1>
          <p className="text-slate-500 mt-2 text-lg">Manage role-based access control and user assignments.</p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT SIDE: ROLE MANAGEMENT (Takes up 7 columns on large screens) --- */}
          <div className="lg:col-span-7 space-y-6">
            {editingRole || editingRole === undefined ? (
              <RoleBuilder
                initialRole={editingRole}
                onSave={handleSaveRole}
                onCancel={() => setEditingRole(null)}
              />
            ) : (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-bold text-slate-800">Available Roles</h2>
                  <button
                    onClick={() => setEditingRole(undefined)}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition"
                  >
                    + Create Custom Role
                  </button>
                </div>
                
                {roles.length === 0 ? (
                  <div className="text-center p-8 text-slate-500 italic border-2 border-dashed rounded-lg">No roles created yet.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {roles.map(r => (
                      <div key={r.id} className="p-4 border border-slate-200 rounded-lg hover:border-blue-400 hover:shadow-md transition group flex justify-between items-start bg-slate-50 hover:bg-white cursor-pointer" onClick={() => setEditingRole(r)}>
                        <div>
                          <h3 className="font-semibold text-slate-800">{r.name}</h3>
                          <p className="text-xs text-slate-500 mt-1">{r.permissions.length} permissions granted</p>
                        </div>
                        <button className="text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition px-3 py-1 bg-blue-50 rounded hover:bg-blue-100">
                          Edit
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* --- RIGHT SIDE: USER ASSIGNMENT (Takes up 5 columns on large screens) --- */}
          <div className="lg:col-span-5 space-y-6 flex flex-col">
            
            {/* User Directory */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex-shrink-0">
              <h2 className="text-xl font-bold mb-4 text-slate-800">User Directory</h2>
              <div className="space-y-3">
                {users.map(u => (
                  <div key={u.id} className={`p-4 border rounded-lg transition ${selectedUser?.id === u.id ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/30' : 'border-slate-200 hover:border-slate-400'}`}>
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{u.name}</span>
                        {u.roleIds.length === 0 && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-bold">Unassigned</span>
                        )}
                      </div>
                      <button onClick={() => loadPermissions(u)} className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition">
                        Inspect Access
                      </button>
                    </div>
                    
                    {/* Role Checkboxes for this user */}
                    <div className="flex flex-wrap gap-2">
                      {roles.map(r => (
                        <label key={r.id} className={`text-xs px-2.5 py-1.5 rounded cursor-pointer border transition font-medium ${u.roleIds.includes(r.id) ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                          <input type="checkbox" className="hidden" checked={u.roleIds.includes(r.id)} onChange={() => handleRoleToggle(u, r.id)} />
                          {r.name}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Resolution Viewer */}
            <div className="flex-grow">
              <EffectivePermissionViewer
                user={selectedUser}
                permissions={effectivePerms}
                loading={loadingPerms}
                roles={selectedUser?.roleIds.map(id => roles.find(r => r.id === id)?.name || 'Unknown') || []}
              />
            </div>
          </div>

        </section>
      </div>
    </div>
  );
}
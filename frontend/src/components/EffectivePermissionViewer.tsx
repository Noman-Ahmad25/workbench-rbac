import type { User, ValidPermission } from '../../../shared/types';

interface Props {
  user: User | null;
  permissions: ValidPermission[];
  roles: string[]; // Role names assigned
  loading: boolean;
}

export function EffectivePermissionViewer({ user, permissions, roles, loading }: Props) {
  if (!user) return (
    <div className="h-full flex items-center justify-center p-8 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 italic">
      Select a user to view their effective access.
    </div>
  );

  if (loading) return <div className="p-8 text-center text-slate-500">Calculating permissions...</div>;

  // Group strings like "Projects:view" -> { Projects: ["view"] }
  const grouped = permissions.reduce((acc, perm) => {
    const [resource, action] = perm.split(':');
    if (!acc[resource]) acc[resource] = [];
    acc[resource].push(action);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="bg-slate-900 rounded-xl p-6 shadow-inner text-slate-200 min-h-[400px]">
      <h3 className="text-white font-bold text-lg mb-1">{user.name}'s Access</h3>
      <p className="text-sm text-slate-400 mb-6 pb-4 border-b border-slate-700">
        Inherited from: <span className="text-blue-400 font-medium">{roles.length ? roles.join(', ') : 'No roles assigned'}</span>
      </p>

      {permissions.length === 0 ? (
        <div className="text-red-400 p-4 bg-red-950/30 rounded border border-red-900/50">User has no permissions.</div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {Object.entries(grouped).map(([resource, actions]) => (
            <div key={resource}>
              <h4 className="text-slate-50 font-semibold mb-2 uppercase text-xs tracking-wider">{resource}</h4>
              <ul className="space-y-1.5">
                {actions.map(action => (
                  <li key={action} className="text-sm flex items-center gap-2">
                    <span className="text-green-400">✓</span> <span className="capitalize text-slate-300">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
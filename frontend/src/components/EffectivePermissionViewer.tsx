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
    // Changed to bg-white with a standard border and shadow
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm text-slate-800 min-h-[400px]">
      <h3 className="text-slate-900 font-bold text-lg mb-1">{user.name}'s Access</h3>
      <p className="text-sm text-slate-500 mb-6 pb-4 border-b border-slate-100">
        Roles: <span className="text-blue-600 font-medium">{roles.length ? roles.join(', ') : 'None'}</span>
      </p>

      {permissions.length === 0 ? (
        // Changed to a light red warning box
        <div className="text-red-600 p-4 bg-red-50 rounded border border-red-100 text-sm font-medium">
          This user currently has zero access to the system.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-8">
          {Object.entries(grouped).map(([resource, actions]) => (
            <div key={resource}>
              {/* Changed headers to dark slate */}
              <h4 className="text-slate-800 font-bold mb-2 uppercase text-xs tracking-widest">{resource}</h4>
              <ul className="space-y-1.5">
                {actions.map(action => (
                  <li key={action} className="text-sm flex items-center gap-2">
                    {/* Kept the green checkmark, changed text to standard slate */}
                    <span className="text-green-500 font-bold">✓</span> <span className="capitalize text-slate-600 font-medium">{action}</span>
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
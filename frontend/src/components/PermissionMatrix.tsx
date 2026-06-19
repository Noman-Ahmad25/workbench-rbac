import { PERMISSION_MAP } from '../../../shared/constants';
import type { ValidPermission } from '../../../shared/types';

interface Props {
  selected: string[];
  onChange: (perms: string[]) => void;
}

const ALL_ACTIONS = Array.from(new Set(Object.values(PERMISSION_MAP).flat()));

export function PermissionMatrix({ selected, onChange }: Props) {
  const toggle = (perm: string) => {
    onChange(selected.includes(perm) ? selected.filter(p => p !== perm) : [...selected, perm]);
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-xs">
          <tr>
            <th className="p-4 border-b">Resource</th>
            {ALL_ACTIONS.map(action => (
              <th key={action} className="p-4 border-b text-center">{action}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {Object.entries(PERMISSION_MAP).map(([resource, actions]) => (
            <tr key={resource} className="hover:bg-slate-50 transition-colors">
              <td className="p-4 font-medium text-slate-800">{resource}</td>
              {ALL_ACTIONS.map(action => {
                const isValidActionForResource = actions.includes(action as any);
                const permString = `${resource}:${action}`;
                
                return (
                  <td key={action} className="p-4 text-center">
                    {isValidActionForResource ? (
                      <input 
                        type="checkbox"
                        checked={selected.includes(permString)}
                        onChange={() => toggle(permString)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
                      />
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
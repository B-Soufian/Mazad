import { Plus, Trash2 } from 'lucide-react';
import { SectionTitle } from './FormUI';
import { List } from 'lucide-react';

export default function SpecificationsEditor({ specifications, onAdd, onRemove, onChange }) {
  return (
    <div>
      <SectionTitle icon={<List size={22} />} title="Specifications" subtitle="Key technical details about the asset." />
      <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-4">
        <div className="grid grid-cols-12 gap-4 text-[12px] font-bold text-[#64748b] uppercase tracking-wider px-2">
          <div className="col-span-5">Specification Name</div>
          <div className="col-span-6">Value</div>
        </div>

        {specifications.map((spec) => (
          <div key={spec.id} className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-5">
              <input
                className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl text-[14px] font-medium text-[#111827] outline-none focus:ring-1 focus:ring-[#d71939] focus:border-[#d71939] transition-all shadow-sm"
                placeholder="e.g. Engine"
                value={spec.label}
                onChange={(e) => onChange(spec.id, 'label', e.target.value)}
              />
            </div>
            <div className="col-span-6">
              <input
                className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl text-[14px] font-medium text-[#111827] outline-none focus:ring-1 focus:ring-[#d71939] focus:border-[#d71939] transition-all shadow-sm"
                placeholder="e.g. V8 Twin Turbo"
                value={spec.value}
                onChange={(e) => onChange(spec.id, 'value', e.target.value)}
              />
            </div>
            <div className="col-span-1 flex justify-center">
              <button
                onClick={() => onRemove(spec.id)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        <div className="pt-2">
          <button
            onClick={onAdd}
            className="text-[#d71939] font-bold text-[14px] flex items-center gap-1 hover:underline px-2"
          >
            <Plus size={16} /> Add Specification
          </button>
        </div>
      </div>
    </div>
  );
}

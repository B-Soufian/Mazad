import { Check } from 'lucide-react';

export const SectionTitle = ({ icon, title, subtitle }) => (
  <div className="flex items-start gap-4 mb-2">
    <div className="p-3 bg-gray-100 rounded-xl text-[#64748b]">{icon}</div>
    <div>
      <h2 className="text-xl font-bold text-[#111827]">{title}</h2>
      {subtitle && <p className="text-[14px] text-[#64748b] mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

export const Input = ({ label, error, ...props }) => (
  <div className="w-full">
    <label className="block text-[12px] font-bold text-[#64748b] uppercase tracking-wider mb-2.5">{label}</label>
    <input
      {...props}
      className={`w-full bg-white border px-4 py-3.5 rounded-xl text-[15px] font-medium text-[#111827] outline-none transition-all shadow-sm ${
        error ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-gray-200 focus:ring-1 focus:ring-[#d71939] focus:border-[#d71939]'
      }`}
    />
    {error && (
      <p className="text-red-500 text-[13px] font-bold mt-2 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />{error}
      </p>
    )}
  </div>
);

export const Select = ({ label, options, ...props }) => (
  <div className="w-full">
    <label className="block text-[12px] font-bold text-[#64748b] uppercase tracking-wider mb-2.5">{label}</label>
    <select
      {...props}
      className="w-full bg-white border border-gray-200 px-4 py-3.5 rounded-xl text-[15px] font-medium text-[#111827] focus:ring-1 focus:ring-[#d71939] focus:border-[#d71939] outline-none transition-all shadow-sm"
    >
      {options.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
    </select>
  </div>
);

export const ReviewRow = ({ label, value, isPrice }) => (
  <div className="flex justify-between items-center">
    <span className="text-[#64748b] font-medium text-[15px]">{label}</span>
    <span className={`font-bold ${isPrice ? 'text-[#0d9488] text-[18px]' : 'text-[#111827] text-[15px]'}`}>{value || '—'}</span>
  </div>
);

export const StepIndicator = ({ step }) => (
  <div className="flex items-center justify-center mb-12">
    {[1, 2, 3].map((num) => (
      <div key={num} className="flex items-center">
        <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all font-bold ${
          step >= num ? 'bg-[#d71939] border-[#d71939] text-white shadow-lg shadow-red-500/20' : 'border-gray-200 text-gray-400 bg-white'
        }`}>
          {step > num ? <Check size={20} strokeWidth={3} /> : num}
        </div>
        {num < 3 && <div className={`w-24 h-1 ${step > num ? 'bg-[#d71939]' : 'bg-gray-200'}`} />}
      </div>
    ))}
  </div>
);

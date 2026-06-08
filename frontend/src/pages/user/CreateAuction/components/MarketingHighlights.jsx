import { Check, Tag } from 'lucide-react';
import { SectionTitle } from './FormUI';

const HIGHLIGHTS = [
  { key: 'singleOwner',       label: 'Single Owner' },
  { key: 'noAccidents',       label: 'No Accidents' },
  { key: 'fullServiceHistory',label: 'Full Service History' },
  { key: 'warranty',          label: 'Warranty' },
  { key: 'gccSpecs',          label: 'GCC Specs' },
  { key: 'dealerMaintained',  label: 'Dealer Maintained' },
  { key: 'pristineCondition', label: 'Pristine Condition' },
  { key: 'lowMileage',        label: 'Low Mileage' },
  { key: 'originalPaint',     label: 'Original Paint' },
];

export default function MarketingHighlights({ marketing, onToggle }) {
  return (
    <div>
      <SectionTitle icon={<Tag size={22} />} title="Marketing Highlights" subtitle="Standout features to attract more buyers." />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {HIGHLIGHTS.map((highlight) => (
          <label
            key={highlight.key}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition shadow-sm bg-white"
          >
            <div className={`w-5 h-5 rounded flex items-center justify-center border flex-shrink-0 ${
              marketing[highlight.key] ? 'bg-[#d71939] border-[#d71939]' : 'border-gray-300 bg-white'
            }`}>
              {marketing[highlight.key] && <Check size={14} className="text-white" strokeWidth={4} />}
            </div>
            <span className="text-[14px] font-semibold text-[#111827]">{highlight.label}</span>
            <input
              type="checkbox"
              className="hidden"
              checked={marketing[highlight.key] || false}
              onChange={() => onToggle(highlight.key)}
            />
          </label>
        ))}
      </div>
    </div>
  );
}

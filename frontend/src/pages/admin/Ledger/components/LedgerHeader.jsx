import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

const TABS = [
  { key: 'all', label: 'ALL FUNDS' },
  { key: 'stripe', label: 'STRIPE ONLY' },
  { key: 'escrow', label: 'ESCROW' },
];

export default function LedgerHeader({ activeTab, onTabChange }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      {/* Left: Title + subtitle */}
      <div>
        <h1 className="text-lg font-bold text-gray-900 leading-tight">Financial Ledger</h1>
        <p className="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed">
          Comprehensive audit of automated Stripe wallet settlements, escrowed funds, and transactional auction deductions.
        </p>
      </div>

      {/* Right: Tab group + filter icon */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`px-3 py-2 text-[10px] font-bold tracking-widest transition-all ${
                activeTab === tab.key
                  ? 'bg-[#0c1220] text-white'
                  : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button className="p-2 border border-gray-200 rounded-md bg-white text-gray-400 hover:text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
          <SlidersHorizontal size={16} />
        </button>
      </div>
    </div>
  );
}

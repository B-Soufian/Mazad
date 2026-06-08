import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ── Helpers ───────────────────────────────────────────────────────────────
const fmtAmount = (n) => {
  const num = Number(n || 0);
  const abs = Math.abs(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return num >= 0 ? `+$${abs}` : `-$${abs}`;
};

// ── Type Badge ────────────────────────────────────────────────────────────
const TYPE_CFG = {
  DEPOSIT:    { bg: '#e8f5e9', color: '#2a7d3b', text: 'DEPOSIT'    },
  FROZEN:     { bg: '#fff3e0', color: '#c84b00', text: 'FROZEN'     },
  DEDUCTION:  { bg: '#fce4ec', color: '#c62828', text: 'DEDUCTION'  },
  WITHDRAWAL: { bg: '#e3f2fd', color: '#1565c0', text: 'WITHDRAWAL' },
  REFUND:     { bg: '#e8f5e9', color: '#2a7d3b', text: 'REFUND'     },
};

function TypeBadge({ type }) {
  const cfg = TYPE_CFG[type] || { bg: '#f3f4f6', color: '#374151', text: type };
  return (
    <span
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
      className="inline-block px-2 py-[3px] text-[8.5px] font-black tracking-widest rounded-[3px] uppercase"
    >
      {cfg.text}
    </span>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────
const STATUS_CFG = {
  'CLEARED':         { dot: '#22c55e', color: '#16a34a' },
  'SETTLED':         { dot: '#22c55e', color: '#16a34a' },
  'PENDING DISPUTE': { dot: '#3b82f6', color: '#2563eb' },
  'COMPLETED':       { dot: '#22c55e', color: '#16a34a' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || { dot: '#9ca3af', color: '#6b7280' };
  return (
    <span style={{ color: cfg.color }} className="flex items-center gap-1.5 text-[10px] font-bold whitespace-nowrap justify-end">
      <span style={{ backgroundColor: cfg.dot }} className="w-[6px] h-[6px] rounded-full shrink-0" />
      {status}
    </span>
  );
}

// ── Source Icon ───────────────────────────────────────────────────────────
function SourceIcon({ source }) {
  if (source === 'Stripe Wallet') return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" className="shrink-0">
      <rect x="2" y="5" width="20" height="14" rx="2"/>
      <line x1="2" y1="10" x2="22" y2="10"/>
    </svg>
  );
  if (source === 'Escrow Hold') return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" className="shrink-0">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" className="shrink-0">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <path d="M8 21h8M12 17v4"/>
    </svg>
  );
}

// ── Main Table ────────────────────────────────────────────────────────────
const COLS = [
  { label: 'Transaction\nID',     width: 'w-28'         },
  { label: 'Asset /\nAuction',    width: 'min-w-[150px]'},
  { label: 'Type',                width: 'w-28'         },
  { label: 'Source',              width: 'w-36'         },
  { label: 'Amount',              width: 'w-32 text-right' },
  { label: 'Status',              width: 'w-32 text-right' },
];

export default function TransactionsTable({ transactions, currentPage, lastPage, total, onPageChange, activeTab }) {
  // Filter by tab
  const filtered = transactions.filter((t) => {
    if (activeTab === 'STRIPE ONLY') return t.source === 'Stripe Wallet';
    if (activeTab === 'ESCROW')      return t.source === 'Escrow Hold';
    return true;
  });

  const from = (currentPage - 1) * 15 + 1;
  const to   = Math.min(currentPage * 15, total);

  // Build page numbers to show
  const pages = [];
  for (let p = 1; p <= Math.min(lastPage, 3); p++) pages.push(p);

  return (
    <div style={{ border: '1.5px dashed #93c5d6' }} className="rounded-md overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">

          {/* Header row */}
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              {COLS.map((col) => (
                <th
                  key={col.label}
                  className={`px-5 py-3.5 ${col.width}`}
                >
                  <span className="text-[8.5px] font-black tracking-[0.14em] text-[#9aafbe] uppercase whitespace-pre-line leading-tight block">
                    {col.label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-sm text-gray-400 font-semibold">
                  No transactions for this filter.
                </td>
              </tr>
            ) : (
              filtered.map((tx, idx) => (
                <tr
                  key={tx.id}
                  style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #f3f4f6' : 'none' }}
                  className="hover:bg-[#f8fbfd] transition-colors"
                >
                  {/* Transaction ID */}
                  <td className="px-5 py-5 align-top">
                    <span className="text-[10px] font-mono font-bold text-gray-400 tracking-wide">
                      #{tx.transaction_id}
                    </span>
                  </td>

                  {/* Asset / Auction */}
                  <td className="px-5 py-5 align-top">
                    <p className="text-[13px] font-bold text-[#1a2332] leading-snug">
                      {tx.asset_title}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">
                      {tx.asset_subtitle}
                    </p>
                  </td>

                  {/* Type */}
                  <td className="px-5 py-5 align-top">
                    <TypeBadge type={tx.type} />
                  </td>

                  {/* Source */}
                  <td className="px-5 py-5 align-top">
                    <span className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                      <SourceIcon source={tx.source} />
                      {tx.source}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-5 align-top text-right">
                    <span
                      className={`text-[13px] font-black tabular-nums ${
                        Number(tx.amount) >= 0 ? 'text-[#1a2332]' : 'text-[#d71939]'
                      }`}
                    >
                      {fmtAmount(tx.amount)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-5 align-top text-right">
                    <StatusBadge status={tx.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div
        style={{ borderTop: '1px solid #e5e7eb' }}
        className="flex items-center justify-between px-5 py-3.5"
      >
        <p className="text-[10px] text-gray-400 font-medium">
          Showing {from}–{to} of {total.toLocaleString('en-US')} verified transactions
        </p>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={13} />
          </button>

          {pages.map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              style={currentPage === p ? { backgroundColor: '#1a2332', color: 'white' } : {}}
              className={`w-6 h-6 flex items-center justify-center rounded text-[11px] font-bold transition-all ${
                currentPage !== p ? 'text-gray-500 hover:bg-gray-100' : ''
              }`}
            >
              {p}
            </button>
          ))}

          {lastPage > 3 && (
            <span className="w-6 h-6 flex items-center justify-center text-gray-400 text-[11px]">›</span>
          )}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === lastPage}
            className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

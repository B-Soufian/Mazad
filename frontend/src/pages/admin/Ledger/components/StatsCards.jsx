import React from 'react';
import { TrendingUp, ArrowRight } from 'lucide-react';

const fmt = (n) =>
  '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function StatsCards({ stats }) {
  const frozenPct = stats.total_liquidity > 0
    ? Math.min(100, Math.round((stats.frozen_funds / stats.total_liquidity) * 100))
    : 0;

  return (
    <div style={{ border: '1.5px dashed #93c5d6' }} className="rounded-md overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3">

        {/* ── Card 1: Total Liquidity ── */}
        <div className="p-6 md:border-r border-[#93c5d6] border-dashed">
          <p className="text-[9px] font-black tracking-[0.18em] text-[#7aafc2] uppercase mb-4">
            Total Liquidity
          </p>

          <div className="flex items-center gap-2 mb-6">
            <span className="text-[26px] font-black text-[#1a2332] leading-none tracking-tight">
              {fmt(stats.total_liquidity)}
            </span>
            <span className="flex items-center gap-0.5 text-[11px] font-bold text-green-500 mt-1">
              <TrendingUp size={11} strokeWidth={2.5} />
              12.5%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-6">
            <div>
              <p className="text-[8px] font-black tracking-[0.15em] text-[#93aab8] uppercase mb-1">
                Stripe Wallet
              </p>
              <p className="text-[13px] font-bold text-[#1a2332]">
                {fmt(stats.stripe_wallet)}
              </p>
            </div>
            <div>
              <p className="text-[8px] font-black tracking-[0.15em] text-[#93aab8] uppercase mb-1">
                Cold Storage
              </p>
              <p className="text-[13px] font-bold text-[#1a2332]">
                {fmt(stats.cold_storage)}
              </p>
            </div>
          </div>
        </div>

        {/* ── Card 2: Frozen Funds ── */}
        <div className="p-6 md:border-r border-[#93c5d6] border-dashed">
          <p className="text-[9px] font-black tracking-[0.18em] text-[#7aafc2] uppercase mb-4">
            Frozen Funds
          </p>

          <div className="mb-3">
            <span className="text-[26px] font-black text-[#d71939] leading-none tracking-tight">
              {fmt(stats.frozen_funds)}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-[3px] bg-gray-100 rounded-full mb-4">
            <div
              className="h-full bg-[#d71939] rounded-full"
              style={{ width: `${frozenPct}%` }}
            />
          </div>

          <p className="text-[11px] text-gray-400 leading-relaxed">
            <span className="font-bold text-gray-600">{stats.arbitration_count}</span>{' '}
            Assets currently in arbitration
          </p>
        </div>

        {/* ── Card 3: Platform Fees (dark teal) ── */}
        <div className="relative p-6 bg-[#1b3d4f] overflow-hidden">
          {/* Background chip icon */}
          <div className="absolute top-4 right-4 opacity-20">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1">
              <rect x="2" y="5" width="20" height="14" rx="2"/>
              <line x1="2" y1="10" x2="22" y2="10"/>
              <line x1="7" y1="15" x2="7.01" y2="15" strokeWidth="2" strokeLinecap="round"/>
              <line x1="11" y1="15" x2="13" y2="15" strokeWidth="1.5"/>
            </svg>
          </div>

          <p className="text-[9px] font-black tracking-[0.18em] text-[#7ab8cc] uppercase mb-4">
            Platform Fees
          </p>

          <div className="mb-1">
            <span className="text-[26px] font-black text-white leading-none tracking-tight">
              {fmt(stats.platform_fees)}
            </span>
          </div>

          <p className="text-[10px] text-[#7ab8cc] mb-6">
            Net revenue this month
          </p>

          <button className="flex items-center gap-2 group">
            <span className="text-[10px] font-black tracking-[0.15em] text-white uppercase">
              Withdraw Earnings
            </span>
            <ArrowRight
              size={13}
              className="text-white group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>

      </div>
    </div>
  );
}

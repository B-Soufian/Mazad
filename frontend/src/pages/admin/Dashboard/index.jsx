import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../../api/adminApi';
import {
  DollarSign, Gavel, Users, ClipboardCheck,
  Loader2, TrendingUp, ArrowRight, Clock, CheckCircle, XCircle
} from 'lucide-react';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

// ─── Helpers ────────────────────────────────────────────────────────────────
const formatMoney = (n) =>
  Number(n || 0).toLocaleString('fr-MA', { minimumFractionDigits: 0 });

const timeAgo = (dateStr) => {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, iconBg, badge }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
    {/* Top Row */}
    <div className="flex items-start justify-between mb-5">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>
        {icon}
      </div>
      {badge}
    </div>
    {/* Label + Value */}
    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-3xl font-black text-gray-900 leading-none">{value}</p>
  </div>
);

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminApi.getDashboardStats()
      .then(setData)
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full min-h-[60vh]">
      <div className="flex flex-col items-center gap-3 text-gray-400">
        <LoadingSpinner />
        <span className="text-sm font-bold tracking-widest uppercase mt-4">Loading Dashboard...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-full min-h-[60vh]">
      <div className="text-center">
        <XCircle size={48} className="text-red-400 mx-auto mb-3" />
        <p className="text-gray-500 font-semibold">{error}</p>
      </div>
    </div>
  );

  const { stats, recent_pending, recent_deposits } = data;

  const cards = [
    {
      label: 'Total Revenue',
      value: `${formatMoney(stats.total_revenue)} MAD`,
      iconBg: 'bg-teal-50',
      icon: <DollarSign size={22} className="text-teal-500" />,
      badge: <span className="text-xs font-bold text-green-500">+12.5%</span>,
    },
    {
      label: 'Active Auctions',
      value: stats.active_auctions,
      iconBg: 'bg-yellow-50',
      icon: <Gavel size={22} className="text-yellow-500" />,
      badge: <span className="text-[11px] font-bold bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full">Live</span>,
    },
    {
      label: 'Users',
      value: stats.total_users,
      iconBg: 'bg-blue-50',
      icon: <Users size={22} className="text-blue-500" />,
      badge: (
        <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Live
        </span>
      ),
    },
    {
      label: 'Pending Approvals',
      value: stats.pending_approvals,
      iconBg: 'bg-red-50',
      icon: <ClipboardCheck size={22} className="text-[#d71939]" />,
      badge: stats.pending_approvals > 0
        ? <span className="text-[11px] font-bold bg-red-100 text-[#d71939] px-2.5 py-1 rounded-full">Urgent</span>
        : <span className="text-[11px] font-bold bg-green-100 text-green-600 px-2.5 py-1 rounded-full">Clear</span>,
    },
  ];

  return (
    <div className="space-y-8">

      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      {/* ── Two Column Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Pending Approvals Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-amber-500" />
              <h2 className="font-bold text-gray-900 text-sm uppercase tracking-widest">Last 5 Pending</h2>
            </div>
            <button
              onClick={() => navigate('/admin/approvals')}
              className="flex items-center gap-1 text-[#d71939] text-xs font-bold hover:underline"
            >
              View All <ArrowRight size={14} />
            </button>
          </div>

          {recent_pending.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <CheckCircle size={36} className="text-green-400 mb-3" />
              <p className="font-semibold text-sm">No pending auctions!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recent_pending.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group">
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">by <span className="font-semibold text-gray-600">{item.owner}</span></p>
                    <p className="text-xs text-gray-400 mt-0.5">{timeAgo(item.created_at)}</p>
                  </div>
                  <button
                    onClick={() => navigate('/admin/approvals')}
                    className="shrink-0 ml-4 bg-[#0c1220] text-white text-xs font-bold px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Deposits */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-green-500" />
              <h2 className="font-bold text-gray-900 text-sm uppercase tracking-widest">Recent Deposits</h2>
            </div>
          </div>

          {recent_deposits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <DollarSign size={36} className="text-gray-300 mb-3" />
              <p className="font-semibold text-sm">No deposits yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recent_deposits.map((dep) => (
                <div key={dep.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <DollarSign size={16} className="text-green-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 text-sm">{dep.user}</p>
                      <p className="text-xs text-gray-400">{timeAgo(dep.created_at)}</p>
                    </div>
                  </div>
                  <span className="font-black text-green-600 text-sm shrink-0 ml-4">
                    +{formatMoney(dep.amount)} MAD
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

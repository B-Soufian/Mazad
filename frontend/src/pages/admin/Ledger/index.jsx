import React, { useState, useEffect } from 'react';
import { adminApi } from '../../../api/adminApi';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import StatsCards from './components/StatsCards';
import TransactionsTable from './components/TransactionsTable';

const TABS = ['ALL FUNDS', 'STRIPE ONLY', 'ESCROW'];

export default function Ledger() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL FUNDS');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchLedger = async (page = 1) => {
    try {
      setLoading(true);
      const res = await adminApi.getLedger(page);
      setData(res);
    } catch (err) {
      setError('Failed to load ledger data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLedger(currentPage); }, [currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || (data && page > data.transactions.last_page)) return;
    setCurrentPage(page);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner />
        <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mt-2">Loading Financial Ledger...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-red-500 font-semibold text-sm">{error}</p>
    </div>
  );

  return (
    <div className="space-y-5 font-sans text-[#1a2332]">

      {/* ── TOP SECTION: breadcrumb + header ── */}
      <div style={{ border: '1.5px dashed #93c5d6' }} className="rounded-md p-5">
        {/* Breadcrumb */}
        <p className="text-[9px] font-bold tracking-widest text-[#93c5d6] uppercase mb-3">
          FINANCIALS &nbsp;›&nbsp; MASTER LEDGER
        </p>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {/* Title + subtitle */}
          <div>
            <h1 className="text-[15px] font-black text-gray-900 leading-snug">Financial Ledger</h1>
            <p className="text-[11px] text-gray-400 mt-1 max-w-xs leading-relaxed">
              Comprehensive audit of automated Stripe wallet settlements, escrowed funds, and transactional auction deductions.
            </p>
          </div>

          {/* Tabs + filter */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex border border-gray-200 rounded overflow-hidden bg-white shadow-sm">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 text-[9px] font-black tracking-widest leading-tight transition-colors ${
                    activeTab === tab
                      ? 'bg-[#0c1a2b] text-white'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab.split(' ').map((word, i) => (
                    <span key={i} className="block text-center">{word}</span>
                  ))}
                </button>
              ))}
            </div>
            {/* Filter icon */}
            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded bg-white text-gray-400 hover:text-gray-600 shadow-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="9" y1="18" x2="15" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── STATS CARDS ── */}
      <StatsCards stats={data.stats} />

      {/* ── TRANSACTIONS TABLE ── */}
      <TransactionsTable
        transactions={data.transactions.data}
        currentPage={data.transactions.current_page}
        lastPage={data.transactions.last_page}
        total={data.transactions.total}
        onPageChange={handlePageChange}
        activeTab={activeTab}
      />
    </div>
  );
}

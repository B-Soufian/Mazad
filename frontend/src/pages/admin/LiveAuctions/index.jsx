import React, { useState, useEffect } from 'react';
import { auctionApi } from '../../../api/auctionApi';
import { categoryApi } from '../../../api/categoryApi';
import { ChevronDown, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import LiveAuctionTable from './components/LiveAuctionTable';

const LiveAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAuctions, setTotalAuctions] = useState(0);

  const [filterCategory, setFilterCategory] = useState('');
  const [filterPriceRange, setFilterPriceRange] = useState('');
  const [filterStatus, setFilterStatus] = useState('live'); // Though page says "Live Auctions", backend accepts status

  useEffect(() => {
    categoryApi.getAll().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        let minPrice = '';
        let maxPrice = '';
        if (filterPriceRange === 'under10k') maxPrice = 10000;
        else if (filterPriceRange === '10k_50k') { minPrice = 10000; maxPrice = 50000; }
        else if (filterPriceRange === 'over50k') minPrice = 50000;

        const response = await auctionApi.getAll({ 
          status: filterStatus,
          category: filterCategory,
          min_price: minPrice,
          max_price: maxPrice,
          page 
        });
        setAuctions(response.data || []);
        setTotalPages(response.last_page || 1);
        setTotalAuctions(response.total || 0);
      } catch (error) {
        console.error("Failed to fetch auctions:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAuctions();
  }, [page, filterCategory, filterPriceRange, filterStatus]);

  const resetFilters = () => {
    setFilterCategory('');
    setFilterPriceRange('');
    setFilterStatus('live');
    setPage(1);
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 animate-fade-in">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Live Auctions</h1>
          <p className="text-slate-500 mt-2 text-base font-medium">
            Real-time oversight of ongoing high-value asset exchanges.
          </p>
        </div>
        <div className="flex items-center gap-2.5 bg-red-50 text-[#D71939] px-5 py-2.5 rounded-xl border border-red-100 font-bold text-[13px] tracking-wide">
          <span className="w-2 h-2 bg-[#D71939] rounded-full animate-pulse"></span>
          {totalAuctions} ACTIVE SESSIONS
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-[#F8FAFC] p-4 md:p-6 rounded-2xl flex flex-wrap items-end gap-4 mb-8 border border-slate-100 shadow-sm">
        
        {/* Category Filter */}
        <div className="flex-1 min-w-[150px]">
          <label className="block text-[10px] font-bold text-slate-400 mb-2 tracking-widest uppercase">
            CATEGORY
          </label>
          <div className="relative">
            <select 
              value={filterCategory} 
              onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
              className="w-full appearance-none bg-white border border-slate-200 px-4 py-2.5 pr-10 rounded-xl text-sm font-semibold text-slate-700 shadow-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#d71939] focus:border-[#d71939] transition-all"
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="flex-1 min-w-[150px]">
          <label className="block text-[10px] font-bold text-slate-400 mb-2 tracking-widest uppercase">
            PRICE RANGE
          </label>
          <div className="relative">
            <select 
              value={filterPriceRange} 
              onChange={(e) => { setFilterPriceRange(e.target.value); setPage(1); }}
              className="w-full appearance-none bg-white border border-slate-200 px-4 py-2.5 pr-10 rounded-xl text-sm font-semibold text-slate-700 shadow-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#d71939] focus:border-[#d71939] transition-all"
            >
              <option value="">Any Range</option>
              <option value="under10k">Under 10,000 MAD</option>
              <option value="10k_50k">10,000 - 50,000 MAD</option>
              <option value="over50k">Over 50,000 MAD</option>
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex-1 min-w-[150px]">
          <label className="block text-[10px] font-bold text-slate-400 mb-2 tracking-widest uppercase">
            STATUS
          </label>
          <div className="relative">
            <select 
              value={filterStatus} 
              onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
              className="w-full appearance-none bg-white border border-slate-200 px-4 py-2.5 pr-10 rounded-xl text-sm font-semibold text-slate-700 shadow-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#d71939] focus:border-[#d71939] transition-all"
            >
              <option value="live">Live</option>
              <option value="pending">Pending</option>
              <option value="closed">Closed</option>
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <button onClick={resetFilters} className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-600 px-6 py-2.5 rounded-xl font-bold text-sm transition-colors border border-slate-200 shadow-sm">
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      {/* Data Table */}
      <LiveAuctionTable auctions={auctions} loading={loading} />

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between px-2 text-slate-500 font-medium text-sm gap-4">
          <p>Showing {auctions.length} of {totalAuctions} auctions</p>
          <div className="flex gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 transition-colors shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 transition-colors shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveAuctions;
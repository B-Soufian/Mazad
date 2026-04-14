import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, RotateCcw, Clock, 
  ChevronLeft, ChevronRight, Monitor, Eye 
} from 'lucide-react';

const LiveAuctions = () => {
  const [vehicles, setVehicles] = useState([]);
  const formatSimpleDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-indexed
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetsRes, auctionsRes] = await Promise.all([
          fetch('http://localhost:5000/assets').then(res => res.json()).catch(() => []),
          fetch('http://localhost:5000/auctions').then(res => res.json()).catch(() => [])
        ]);

        const rawData = assetsRes
          .map(asset => {
            const auction = auctionsRes.find(a => a.assetId === asset.id) || null;
            return { asset, auction };
          })
          .filter(item => item.auction !== null && item.auction.status === "live");

        setVehicles(rawData);
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto p-8">
      
      {/* 1. Header Section */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Live Auctions</h1>
          <p className="text-slate-500 mt-2 text-base font-medium">
            Real-time oversight of ongoing high-value asset exchanges.
          </p>
        </div>
        <div className="flex items-center gap-2.5 bg-red-50 text-[#D71939] px-5 py-2.5 rounded-xl border border-red-100 font-bold text-[13px] tracking-wide">
          <span className="w-2 h-2 bg-[#D71939] rounded-full animate-pulse"></span>
          {vehicles.length} ACTIVE SESSIONS
        </div>
      </div>

      {/* 2. Filters Section */}
      <div className="bg-[#F1F5F9]/50 p-6 rounded-2xl flex items-end gap-4 mb-10 border border-slate-100">
        <FilterDropdown label="CATEGORY" value="All Categories" />
        <FilterDropdown label="PRICE RANGE" value="Any Range" />
        <FilterDropdown label="STATUS" value="All Status" />
        <button className="flex items-center gap-2 bg-[#E2E8F0] hover:bg-slate-300 text-slate-600 px-6 py-2.5 rounded-xl font-bold text-sm transition-colors mb-0.5">
          <RotateCcw size={16} />
          Reset Filters
        </button>
      </div>

      {/* 3. Data Table */}
      <div className="w-full">
        {/* Table Header Grid */}
        <div className="grid grid-cols-[2.5fr,1.2fr,1.5fr,1fr,1.2fr,140px] px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">
          <div>Item</div>
          <div>Category</div>
          <div>Current Bid</div>
          <div className="text-center">Bidders</div>
          <div>End At</div>
          <div></div>
        </div>

        {/* Table Content */}
        <div className="space-y-3">
          {vehicles.map((item, index) => (
            <div 
              key={item.asset.id} 
              className="grid grid-cols-[2.5fr,1.2fr,1.5fr,1fr,1.2fr,140px] items-center bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
            >
              {/* Item Info */}
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <img 
                    src={item.asset.imageUrl || 'https://via.placeholder.com/100'} 
                    alt={item.asset.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 text-[17px] leading-tight truncate">
                    {item.asset.name || item.asset.title}
                  </h3>
                  <p className="text-slate-400 text-[11px] font-medium mt-1">
                    Asset ID: <span className="uppercase">{item.asset.id}</span>
                  </p>
                </div>
              </div>

              {/* Category */}
              <div>
                <span className="text-[10px] font-bold bg-[#EDF2F7] text-[#4A5568] px-3 py-1.5 rounded-lg tracking-wider whitespace-nowrap">
                  {item.asset.category?.toUpperCase() || 'GENERAL'}
                </span>
              </div>

              {/* Bid Info */}
              <div>
                <p className="text-[22px] font-bold text-[#0D6B64] leading-none">
                  ${item.auction.pricing.currentPrice?.toLocaleString()}
                </p>
                <p className="text-[11px] font-bold text-[#718096] mt-1.5">
                  {item.auction.pricing.isReserveMet ? 'Reserve Met' : 'Under Reserve'}
                </p>
              </div>

              {/* Bidders */}
              <div className="flex justify-center">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F7FAFC] text-slate-600 font-bold text-sm border border-slate-100">
                  {item.auction.metrics.bidCount || 0}
                </div>
              </div>

              {/* Time Left */}
              <div className="flex items-center gap-2.5 font-bold text-[#D71939] text-base">
                <Clock size={18} />
                {formatSimpleDate(item.auction.timeline.endsAt)}
              </div>

              {/* Action Button */}
              <div className="text-right">
                {index % 2 === 0 ? (
                  <button className="w-full bg-[#0D6B64] hover:bg-[#0a524c] text-white font-bold py-2.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2">
                    <Monitor size={16} /> Monitor
                  </button>
                ) : (
                  <button className="w-full bg-[#F1F5F9] hover:bg-slate-200 text-slate-600 font-bold py-2.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2">
                    <Eye size={16} /> View Live
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 4. Pagination Footer */}
        <div className="mt-8 flex items-center justify-between px-2 text-slate-400 font-medium text-sm">
          <p>Showing {vehicles.length} of 12 active auctions</p>
          <div className="flex gap-2">
            <button className="p-2 border border-slate-200 rounded-lg hover:bg-white hover:text-slate-600 transition-all shadow-sm">
              <ChevronLeft size={18} />
            </button>
            <button className="p-2 border border-slate-200 rounded-lg hover:bg-white hover:text-slate-600 transition-all shadow-sm">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for filters
const FilterDropdown = ({ label, value }) => (
  <div className="flex-1 min-w-0">
    <label className="block text-[10px] font-bold text-slate-400 mb-2 tracking-widest uppercase">
      {label}
    </label>
    <button className="w-full flex items-center justify-between bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 shadow-sm hover:border-slate-300 transition-all">
      <span className="truncate">{value}</span>
      <ChevronDown size={18} className="text-slate-400 ml-2" />
    </button>
  </div>
);

export default LiveAuctions;
import React from 'react';
import { getImageUrl } from '../../../../utils/getImageUrl';
import { formatDistanceToNow } from 'date-fns';
import { Clock } from 'lucide-react';

export default function LiveAuctionTable({ auctions, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-slate-500 font-bold">
        Loading live auctions...
      </div>
    );
  }

  if (auctions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-slate-500 font-bold">
        No active auctions right now.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-5 border-b border-gray-100 bg-white text-[11px] font-bold text-slate-400 uppercase tracking-widest">
        <div className="col-span-4">Item</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-2">Current Bid</div>
        <div className="col-span-1 text-center">Bidders</div>
        <div className="col-span-2">Time Left</div>
        <div className="col-span-1"></div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-100">
        {auctions.map((auction, index) => (
          <div 
            key={auction.id} 
            className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-gray-50/50 transition-colors group"
          >
            {/* Item */}
            <div className="col-span-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                <img 
                  src={getImageUrl(auction.asset?.media?.thumbnail) || '/placeholder-car.png'} 
                  alt={auction.asset?.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="min-w-0 pr-4">
                <h3 className="font-bold text-gray-900 text-[15px] leading-snug truncate">
                  {auction.asset?.title || 'Unknown Asset'}
                </h3>
                <p className="text-gray-400 text-[11px] font-medium mt-0.5 uppercase tracking-wider">
                  Asset ID: #{auction.asset?.lot_number || `MZ-${auction.asset_id}`}
                </p>
              </div>
            </div>

            {/* Category */}
            <div className="col-span-2 flex items-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-[#F1F5F9] text-[#4A5568] uppercase tracking-wider whitespace-nowrap">
                {auction.asset?.category?.name || 'Uncategorized'}
              </span>
            </div>

            {/* Current Bid */}
            <div className="col-span-2">
              <p className="text-[18px] font-bold text-teal-700 leading-none">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(auction.current_price || auction.starting_price)}
              </p>
              <p className="text-[11px] font-medium text-[#718096] mt-1">
                {auction.is_reserve_met ? 'Reserve Met' : 'Under Reserve'}
              </p>
            </div>

            {/* Bidders */}
            <div className="col-span-1 flex md:justify-center">
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F8FAFC] text-slate-700 font-bold text-xs border border-slate-100">
                {auction.bid_count || 0}
              </div>
            </div>

            {/* Time Left */}
            <div className="col-span-2 flex items-center gap-2 font-bold text-red-600 text-sm">
              <Clock size={16} className="text-red-500" />
              {formatDistanceToNow(new Date(auction.ends_at))}
            </div>

            {/* Action Button */}
            <div className="col-span-1 text-right">
              {index % 2 === 0 ? (
                <button className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-2 rounded-lg transition-colors text-xs text-center shadow-sm">
                  Monitor
                </button>
              ) : (
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 rounded-lg transition-colors text-xs text-center">
                  View Live
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

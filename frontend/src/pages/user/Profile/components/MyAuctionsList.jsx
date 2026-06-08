import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { profileApi } from '../../../../api/profileApi';
import { Clock, Search, Plus } from 'lucide-react';
import { getImageUrl } from '../../../../utils/getImageUrl';

const MyAuctionsList = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAuctions, setTotalAuctions] = useState(0);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        const data = await profileApi.getMyAuctions(page, searchQuery);
        setAuctions(data.data || data); 
        setTotalPages(data.last_page || 1);
        setTotalAuctions(data.total || (data.data ? data.data.length : data.length) || 0);
      } catch (err) {
        console.error("Failed to fetch my auctions:", err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchAuctions();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [page, searchQuery]);

  if (loading && auctions.length === 0) {
     return <div className="pt-4 text-gray-500 animate-pulse">Loading your dashboard...</div>;
  }

  const activeCount = auctions.filter(a => {
    if (!a.extended_ends_at && !a.ends_at) return false;
    const activeEndTime = a.extended_ends_at || a.ends_at;
    return new Date(activeEndTime) >= new Date();
  }).length;

  return (
    <div className="animate-[fadeIn_0.2s_ease-out] w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#111827] tracking-tight mb-2">My Auctions</h2>
          <p className="text-[#64748b] text-[15px]">Real-time oversight of your ongoing high-value asset exchanges.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="bg-[#fef2f2] text-[#d71939] px-4 py-2.5 rounded-lg text-[13px] font-bold flex items-center gap-2 border border-[#fee2e2]">
            <div className="w-2 h-2 rounded-full bg-[#d71939] animate-pulse" />
            {activeCount} ACTIVE SESSIONS ON THIS PAGE
          </div>
          <Link 
            to="/sell"
            className="bg-[#111827] hover:bg-black text-white px-5 py-2.5 rounded-lg text-[13px] font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={16} strokeWidth={2.5} />
            Create Auction
          </Link>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50 p-4 rounded-xl border border-gray-100">
         <div className="relative w-full max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by item name or lot number..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-[14px] text-[#111827] font-medium outline-none focus:border-[#d71939] focus:ring-1 focus:ring-[#d71939]/20 transition-all"
            />
         </div>
         <div className="text-[13px] font-semibold text-gray-500">
            {totalAuctions} Result{totalAuctions !== 1 && 's'}
         </div>
      </div>

      {auctions.length === 0 ? (
        <div className="text-center py-12 border-t border-gray-100">
          <p className="text-gray-500">{searchQuery ? "No auctions match your search." : "You haven't created any auctions yet."}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="pb-4 px-2 text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest">Item</th>
                <th className="pb-4 px-2 text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest text-center">Category</th>
                <th className="pb-4 px-2 text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest">Current Bid</th>
                <th className="pb-4 px-2 text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest text-center">Bidders</th>
                <th className="pb-4 px-2 text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest">Time Left</th>
                <th className="pb-4 px-2 text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {auctions.map(auction => {
                const asset = auction.asset;
                const price = Number(auction.current_price).toLocaleString();
                
                let isEnded = false;
                let timeString = "--:--";
                if (auction.extended_ends_at || auction.ends_at) {
                    const activeEndTime = auction.extended_ends_at || auction.ends_at;
                    const diffMs = new Date(activeEndTime) - new Date();
                    if (diffMs > 0) {
                      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                      if (days > 0) timeString = `${days}d ${hours}h`;
                      else timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                    } else {
                      isEnded = true;
                      timeString = "Ended";
                    }
                }

                return (
                  <tr key={auction.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-5 px-2">
                      <div className="flex items-center gap-4">
                        {asset?.media?.thumbnail ? (
                           <img src={getImageUrl(asset.media.thumbnail)} alt={asset?.title} className="w-14 h-14 rounded-lg object-cover bg-gray-100" />
                        ) : (
                           <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-[10px] font-bold uppercase">No Img</div>
                        )}
                        <div>
                           <div className="font-bold text-[#0f172a] text-[15px] mb-0.5">{asset?.title || 'Unknown Item'}</div>
                           <div className="text-[12px] text-[#94a3b8]">Asset ID: #{asset?.lot_number || asset?.id || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-2 text-center">
                       <div className="inline-block bg-[#f1f5f9] text-[#475569] px-3 py-1.5 rounded-full text-[10px] font-bold uppercase leading-tight tracking-wider">
                          {asset?.category?.name || 'ASSET'}
                       </div>
                    </td>
                    <td className="py-5 px-2">
                       <div className="font-bold text-[#0d9488] text-[18px]">MAD {price}</div>
                       <div className="text-[11px] text-[#0d9488]/70 font-medium">Current</div>
                    </td>
                    <td className="py-5 px-2 text-center">
                       <span className="inline-block bg-[#f1f5f9] text-[#475569] font-bold text-[13px] px-3 py-1 rounded-full">
                         {auction.bid_count || 0}
                       </span>
                    </td>
                    <td className="py-5 px-2">
                       <div className="flex items-center gap-2">
                          <Clock size={15} strokeWidth={2.5} className={isEnded ? "text-[#94a3b8]" : "text-[#d71939]"} />
                          <span className={`font-bold text-[14px] ${isEnded ? "text-[#94a3b8]" : "text-[#d71939]"}`}>
                            {timeString}
                          </span>
                       </div>
                    </td>
                    <td className="py-5 px-2 text-right">
                       <div className="flex items-center justify-end gap-2">
                         <Link
                           to={`/auction/edit/${auction.id}`}
                           className="inline-block px-4 py-2.5 rounded-lg font-bold text-[13px] transition-colors border border-gray-200 bg-white text-[#64748b] hover:border-[#d71939] hover:text-[#d71939]"
                         >
                           Modify
                         </Link>
                         <Link 
                           to={`/auction/${auction.id}`} 
                           className={`inline-block px-6 py-2.5 rounded-lg font-bold text-[13px] transition-colors ${
                             isEnded 
                             ? 'bg-gray-100 text-[#64748b] hover:bg-gray-200' 
                             : 'bg-[#d71939] text-white hover:bg-[#b5142e]'
                           }`}
                         >
                            {isEnded ? 'Details' : 'Monitor'}
                         </Link>
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 pt-4 gap-4">
          <p className="text-sm font-medium text-gray-500">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 text-sm font-bold text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <button 
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 text-sm font-bold text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAuctionsList;

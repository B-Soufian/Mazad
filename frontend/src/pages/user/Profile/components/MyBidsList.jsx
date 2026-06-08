import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { profileApi } from '../../../../api/profileApi';
import { Clock } from 'lucide-react';
import { getImageUrl } from '../../../../utils/getImageUrl';

const MyBidsList = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const data = await profileApi.getMyBids();
        const rawBids = data.data || data;
        
        // Sort by newest first, then group by auction so we only show the latest bid per auction
        const sortedBids = [...rawBids].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const groupedBids = [];
        const seenAuctions = new Set();
        for (const bid of sortedBids) {
          if (bid.auction && !seenAuctions.has(bid.auction.id)) {
            groupedBids.push(bid);
            seenAuctions.add(bid.auction.id);
          }
        }
        
        setBids(groupedBids);
      } catch (err) {
        console.error("Failed to fetch my bids:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, []);

  if (loading) {
     return <div className="pt-4 text-gray-500 animate-pulse">Loading your bids...</div>;
  }

  const activeCount = bids.filter(b => {
    if (!b.auction?.extended_ends_at && !b.auction?.ends_at) return false;
    const activeEndTime = b.auction.extended_ends_at || b.auction.ends_at;
    return new Date(activeEndTime) >= new Date();
  }).length;

  return (
    <div className="animate-[fadeIn_0.2s_ease-out] w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#111827] tracking-tight mb-2">Bidding Hub</h2>
          <p className="text-[#64748b] text-[15px]">Real-time tracking of the auctions you are participating in.</p>
        </div>
        <div className="bg-[#fef2f2] text-[#d71939] px-4 py-2 rounded-md text-[13px] font-bold flex items-center gap-2 border border-[#fee2e2]">
          <div className="w-2 h-2 rounded-full bg-[#d71939] animate-pulse" />
          {activeCount} ACTIVE BIDS
        </div>
      </div>

      {bids.length === 0 ? (
        <div className="text-center py-12 border-t border-gray-100">
          <p className="text-gray-500">You haven't placed any bids yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="pb-4 px-2 text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest">Item</th>
                <th className="pb-4 px-2 text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest text-center">Category</th>
                <th className="pb-4 px-2 text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest">Your Bid</th>
                <th className="pb-4 px-2 text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest text-center">Status</th>
                <th className="pb-4 px-2 text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest text-center">Date</th>
                <th className="pb-4 px-2 text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest">Time Left</th>
                <th className="pb-4 px-2 text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bids.map(bid => {
                const auction = bid.auction;
                const asset = auction?.asset;
                const amount = Number(bid.amount).toLocaleString();
                const date = new Date(bid.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' });
                
                let isEnded = false;
                let timeString = "--:--";
                if (auction?.extended_ends_at || auction?.ends_at) {
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

                let statusBadge;
                switch(bid.status) {
                  case 'winning':
                    statusBadge = <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border border-green-200">Winning</span>;
                    break;
                  case 'outbid':
                    statusBadge = <span className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border border-orange-200">Outbid</span>;
                    break;
                  case 'won':
                    statusBadge = <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border border-blue-200">Won</span>;
                    break;
                  default:
                    statusBadge = <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border border-gray-200">{bid.status || 'Active'}</span>;
                }

                return (
                  <tr key={bid.id} className="hover:bg-gray-50/50 transition-colors group">
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
                       <div className="font-bold text-[#0d9488] text-[18px]">MAD {amount}</div>
                       <div className="text-[11px] text-[#0d9488]/70 font-medium">Placed Bid</div>
                    </td>
                    <td className="py-5 px-2 text-center">
                       {statusBadge}
                    </td>
                    <td className="py-5 px-2 text-center">
                       <div className="text-[13px] text-[#64748b] font-medium">{date}</div>
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
                       {auction?.id && (
                          <Link 
                            to={`/auction/${auction.id}`} 
                            className={`inline-block px-6 py-2.5 rounded-lg font-bold text-[13px] transition-colors ${
                              isEnded 
                              ? 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]' 
                              : 'bg-[#f1f5f9] text-[#0f172a] hover:bg-[#e2e8f0]'
                            }`}
                          >
                             {isEnded ? 'Details' : 'View Live'}
                          </Link>
                       )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyBidsList;

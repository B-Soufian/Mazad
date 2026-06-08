import React, { useState, useEffect } from 'react';
import { auctionApi } from '../../../api/auctionApi';
import { getImageUrl } from '../../../utils/getImageUrl';
import { formatDistanceToNow } from 'date-fns';
import ReviewModal from './components/ReviewModal';

const Approvals = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await auctionApi.getAll({ status: 'pending' });
      // Depending on pagination structure
      setAuctions(res.data || []);
    } catch (error) {
      console.error('Error fetching pending auctions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClick = (id) => {
    setReviewingId(id);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pending Approvals</h1>
          <p className="text-gray-500 mt-2">Review and approve new auction listings.</p>
        </div>
        <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg border border-red-100">
          <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
          <span className="text-sm font-bold text-red-700 tracking-wide uppercase">
            {auctions.length} Pending Approvals
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</label>
          <select className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2.5">
            <option>All Categories</option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Price Range</label>
          <select className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2.5">
            <option>Any Range</option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sort By</label>
          <select className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2.5">
            <option>Newest First</option>
            <option>Oldest First</option>
          </select>
        </div>
        <button className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
          Reset Filters
        </button>
      </div>

      {/* Table header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50/50 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <div className="col-span-4">Item</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Starting Price</div>
          <div className="col-span-2">Owner / Seller</div>
          <div className="col-span-2 text-right">Submitted</div>
        </div>

        {/* Table rows */}
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading pending approvals...</div>
          ) : auctions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No pending approvals found.</div>
          ) : (
            auctions.map((auction) => (
              <div key={auction.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors">
                
                {/* Item */}
                <div className="col-span-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                    <img 
                      src={getImageUrl(auction.asset?.media?.thumbnail) || '/placeholder-car.png'} 
                      alt={auction.asset?.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm md:text-base line-clamp-1">{auction.asset?.title || 'Unknown Title'}</h3>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Asset ID: #{auction.asset?.lot_number || `MZ-${auction.asset_id}`}</p>
                  </div>
                </div>

                {/* Category */}
                <div className="col-span-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800 uppercase tracking-wider">
                    {auction.asset?.category?.name || 'Uncategorized'}
                  </span>
                </div>

                {/* Starting Price */}
                <div className="col-span-2">
                  <div className="font-bold text-teal-700 text-base">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(auction.starting_price)}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">Needs Review</div>
                </div>

                {/* Owner */}
                <div className="col-span-2">
                  <div className="font-bold text-gray-900 text-sm">
                    {auction.asset?.owner?.display_name || 'Unknown User'}
                  </div>
                </div>

                {/* Submitted */}
                <div className="col-span-2 flex items-center justify-between md:justify-end gap-4">
                  <div className="flex items-center gap-1.5 text-gray-600 font-medium text-sm">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {formatDistanceToNow(new Date(auction.created_at), { addSuffix: true })}
                  </div>
                  <button 
                    onClick={() => handleReviewClick(auction.id)}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
                  >
                    Review
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      {reviewingId && (
        <ReviewModal 
          auctionId={reviewingId}
          onClose={() => setReviewingId(null)}
          onSuccess={() => {
            setReviewingId(null);
            fetchPending(); // Refresh list after approve/reject
          }}
        />
      )}
    </div>
  );
};

export default Approvals;

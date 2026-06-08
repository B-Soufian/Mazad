import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { auctionApi } from '../../../../api/auctionApi';
import { getImageUrl } from '../../../../utils/getImageUrl';

function getTimeString(auction) {
  const activeEndTime = auction?.extended_ends_at || auction?.ends_at;
  if (!activeEndTime) return { text: '--h : --m', ended: false };

  const diffMs = new Date(activeEndTime) - new Date();
  if (diffMs <= 0) return { text: 'Ended', ended: true };

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return { text: `${days}d : ${hours}h`, ended: false };
  return { text: `${hours}h : ${minutes}m`, ended: false };
}

export default function Similar({ car }) {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const auctionId = car?.auction?.id;

  useEffect(() => {
    if (!auctionId) return;

    const fetchSimilar = async () => {
      try {
        setLoading(true);
        const data = await auctionApi.getSimilar(auctionId);
        setSimilar(data);
      } catch (err) {
        console.error('Failed to fetch similar auctions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilar();
  }, [auctionId]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const amount = 360;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  // Don't render anything if there are no similar items
  if (!loading && similar.length === 0) return null;

  return (
    <div className="mt-16">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Similar Auctions</h2>
        {similar.length > 3 && (
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition shadow-sm bg-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-50 transition shadow-sm bg-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
                <div className="h-8 bg-gray-200 rounded w-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cards */}
      {!loading && similar.length > 0 && (
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {similar.map((auction) => {
            const asset = auction.asset;
            const specs = asset?.specifications || [];
            const mileageSpec = specs.find((s) => s.label === 'Mileage');
            const thumbnail = asset?.media?.thumbnail ? getImageUrl(asset.media.thumbnail) : null;
            const time = getTimeString(auction);
            const currentPrice = Number(auction.current_price || 0).toLocaleString();
            const bidsCount = auction.bid_count || 0;

            return (
              <Link
                key={auction.id}
                to={`/auction/${auction.id}`}
                state={{ car: { asset, auction } }}
                className="min-w-[320px] max-w-[340px] flex-shrink-0 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={asset?.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  {/* Category Badge */}
                  {asset?.category?.name && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[11px] font-bold text-gray-700 shadow-sm uppercase tracking-wider">
                      {asset.category.name}
                    </div>
                  )}

                  {/* Favorite */}
                  <button
                    className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition shadow-sm"
                    onClick={(e) => e.preventDefault()}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">
                    {asset?.title || 'Untitled'}
                  </h3>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-5">
                    {mileageSpec && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {mileageSpec.value}
                      </span>
                    )}
                    {bidsCount > 0 && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.7 6.3-1.4 1.4M2.4 21.6 12 12M6 14.5 14.5 6M17.7 2.3l4 4M19.6 15l-2.2 2.2a2 2 0 0 1-2.8 0l-3.2-3.2a2 2 0 0 1 0-2.8l2.2-2.2" />
                          </svg>
                          {bidsCount} {bidsCount === 1 ? 'Bid' : 'Bids'}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-end border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Current Bid</p>
                      <p className="font-extrabold text-lg text-gray-900">
                        <span className="text-[13px] font-semibold mr-1">MAD</span>
                        {currentPrice}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 flex items-center justify-end gap-1 mb-0.5">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Ends in
                      </p>
                      <p className={`font-bold text-sm ${time.ended ? 'text-gray-400' : 'text-[#D71939]'}`}>
                        {time.text}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
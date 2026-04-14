import React from 'react';
import { Link } from 'react-router-dom';

export default function VehicleCard({ car }) {
  const { asset, auction } = car;

  // 1. Data Extraction
  const specs = asset?.specifications || [];
  const mileageSpec = specs.find(s => s.label === "Mileage");
  const specsSpec = specs.find(s => s.label === "Specs");

  // 2. Time Logic (Anti-Sniping)
  let timeString = "--h : --m";
  const activeEndTime = auction?.extended_ends_at || auction?.ends_at;
  let isEnded = false;

  if (activeEndTime) {
    const endDate = new Date(activeEndTime);
    const now = new Date();
    const diffMs = endDate - now;
    
    if (diffMs > 0) {
       const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
       const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
       const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
       
       if (days > 0) timeString = `${days}d : ${hours}h`;
       else timeString = `${hours}h : ${minutes}m`;
    } else {
       timeString = "Ended";
       isEnded = true;
    }
  }

  // 3. Mock Images
  let imgUrl = "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80"; 
  if (asset?.media?.thumbnail?.includes("ferrari")) {
     imgUrl = "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&q=80"; 
  }

  // 4. Formatting variables
  const isHot = asset?.marketing?.isHot;
  const isSalvage = asset?.conditionStatus === "salvage";
  const lotNumber = asset?.lot_number || 'N/A';
  const title = asset?.title || 'Unknown Vehicle';
  const mileage = mileageSpec ? mileageSpec.value : 'N/A';
  const specDetails = specsSpec ? specsSpec.value : null;

  const bidsCount = auction?.bid_count || 0;
  const bidsString = bidsCount === 1 ? "1 Bid" : `${bidsCount} Bids`;
  const currentPrice = auction?.current_price.toLocaleString() 

  return (
    <Link 
      to={`/auction/${auction?.id || asset?.id}`} 
      state={{ car }} 
      className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm flex flex-col group hover:shadow-lg transition-all duration-300"
    >
      
      {/* Image Container */}
      <div className="relative h-[200px] bg-gray-100 overflow-hidden">
        <img 
          src={imgUrl} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />

        {/* HOT Badge */}
        {isHot && (
          <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded text-[11px] font-bold text-[#e1251b] flex items-center gap-1 shadow-md uppercase tracking-wider">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/></svg>
            HOT
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        
        {/* Lot Number & Share Icon */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-[13px] text-gray-500 font-medium">Lot # {lotNumber}</span>
          <button className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
          </button>
        </div>

        {/* Title */}
        <h3 className="font-bold text-[#1a1a1a] text-[17px] leading-snug mb-3">
          {title}
        </h3>

        {/* Specs Badges */}
        <div className="flex flex-wrap gap-2 mb-4 mt-auto">
          {isSalvage ? (
            <span className="bg-[#fef2f2] text-[#e1251b] px-2.5 py-1 rounded-md text-[12px] font-semibold flex items-center gap-1.5 border border-[#fee2e2]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
              Salvage
            </span>
          ) : (
            <>
              {mileage !== 'N/A' && (
                <span className="bg-[#fef2f2] text-[#e1251b] px-2.5 py-1 rounded-full text-[12px] font-medium flex items-center gap-1.5 border border-[#fee2e2]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m12 12 4.5-4.5"/><path d="M12 16v.01"/></svg>
                  {mileage}
                </span>
              )}
              {specDetails && specDetails !== "None" && (
                <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-[12px] font-medium flex items-center gap-1.5 border border-gray-200">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  {specDetails}
                </span>
              )}
            </>
          )}
        </div>

        {/* Stats (Bids & Time) */}
        <div className="flex gap-5 text-[13px] text-gray-500 mb-5 font-medium">
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m14.7 6.3-1.4 1.4"/><path d="M2.4 21.6 12 12"/><path d="M6 14.5 14.5 6"/><path d="m17.7 2.3 4 4"/><path d="m19.6 15-2.2 2.2a2 2 0 0 1-2.8 0l-3.2-3.2a2 2 0 0 1 0-2.8l2.2-2.2"/></svg>
            {bidsString}
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span className={isEnded ? "text-red-500 font-bold" : ""}>{timeString}</span>
          </div>
        </div>

        {/* Footer (Price & Button) */}
        <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-auto">
          <div>
            <p className="text-[12px] text-gray-500 mb-0.5">Current Price</p>
            <p className="font-bold text-[18px] text-gray-900 leading-none">
              <span className="text-[13px] font-semibold mr-1">AED</span> 
              {currentPrice}
            </p>
          </div>

          <button 
            className={`px-4 py-2 rounded-md text-[14px] font-bold relative z-10 transition-colors ${
              isEnded 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-[#e1251b] text-white hover:bg-[#c91f16]'
            }`}
            onClick={(e) => {
              if (isEnded) e.preventDefault();
            }}
          >
            {isEnded ? 'Auction Ended' : 'Bid Now'}
          </button>
        </div>

      </div>
    </Link>
  );
};
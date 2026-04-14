export default function BiddingCard({ car }) {
    const { auction } = car || {};
    console.log(auction)
    let timeString = "--h : --m";
    const activeEndTime = auction?.extended_ends_at || auction?.ends_at;

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
      }
    }

    const currentPriceRaw = auction.current_price || 0;
    const currentPriceText = `AED ${currentPriceRaw.toLocaleString()}`;
    const minIncrement = auction?.minimum_increment || 5000;
    const buyNowPriceRaw = auction?.buy_now_price || 0;
    const buyNowPriceText = buyNowPriceRaw ? `AED ${buyNowPriceRaw.toLocaleString()}` : "N/A";
    const nextBid = currentPriceRaw + minIncrement;
    const bidsCount = auction?.bid_count || 0;

    let endsOnFormatted = "N/A";
    if (activeEndTime) {
       const d = new Date(activeEndTime);
       endsOnFormatted = d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
    }

    return(
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 p-7">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Current Price</p>
              <h2 className="text-5xl font-bold text-gray-900 mb-8 tracking-tight">{currentPriceText}</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <span className="text-gray-500 text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Time remaining
                  </span>
                  <span className="font-bold text-sm">{timeString}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <span className="text-gray-500 text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    No. of Bids
                  </span>
                  <span className="font-bold text-sm">{bidsCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    Ends on
                  </span>
                  <span className="font-bold text-sm">{endsOnFormatted}</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 text-left w-full pl-1">ENTER YOUR BID</p>
                <div className="flex border border-gray-200 rounded-xl overflow-hidden h-14 mb-4 bg-white">
                  <span className="px-4 flex items-center text-gray-400 font-bold border-r border-gray-100 text-sm">AED</span>
                  <input type="text" defaultValue={nextBid.toLocaleString()} className="w-full px-4 font-bold text-gray-900 text-lg outline-none" />
                </div>
                
                <div className="flex gap-3">
                  <button className="flex-1 bg-[#1a1f24] hover:bg-black transition-colors rounded-xl py-3.5 flex flex-col items-center justify-center text-white shadow-md">
                    <span className="font-bold text-sm tracking-wide">Place a Bid</span>
                    <span className="text-[9px] text-gray-400 mt-0.5 tracking-wider">MIN. INCR. AED {minIncrement.toLocaleString()}</span>
                  </button>
                  <button className="flex-1 bg-[#D71939] hover:bg-[#b5142e] transition-colors rounded-xl py-3.5 flex flex-col items-center justify-center text-white shadow-md">
                    <span className="font-bold text-sm tracking-wide">Buy Now</span>
                    <span className="text-[9px] text-red-200 mt-0.5 tracking-wider">{buyNowPriceText}</span>
                  </button>
                </div>
              </div>
        </div>
    )}
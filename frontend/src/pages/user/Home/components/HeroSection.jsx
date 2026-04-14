import React from 'react';

export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
        <div className="max-w-2xl">
          <p className="text-[#D70B27] text-xs font-bold tracking-wider uppercase mb-4 inline-block border border rounded-full px-3 py-1">
            Timed Auctions End September, Auction House 2
          </p>
          <h1 className="font-['Inter'] text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6">
            Bid on <br />
            <span className="text-[#D70B27]">Excellence.</span> <br />
            Own the <br />
            Extraordinary.
          </h1>
          <p className="text-gray-500 text-base mb-8 max-w-lg leading-relaxed">
            From luxury motors to special plate numbers and unique numbers plates, allow you to browse and bid on items from the trust of Emirates Auction.
          </p>
          <button className="bg-[#D70B27] hover:bg-red-800 text-white font-semibold py-3 px-8 rounded-md transition duration-300">
            Browse Full Auctions
          </button>
        </div>
      </section>
  );
};

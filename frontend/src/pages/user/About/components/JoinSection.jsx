import React from 'react';

export default function HeroSection() {
    return(
    <section className="bg-[#D71939] py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 select-none">
            <span className="text-[20vw] font-black font-['Inter'] text-white">BIDMASTER</span>
        </div>
        <div className="relative z-10">
            <h2 className="font-['Playfair_Display'] text-7xl md:text-8xl text-white mb-12">Join the Elite.</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-[#D71939] px-12 py-4 font-bold uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-colors">
                    Start Bidding
                </button>
                <button className="border border-white/30 text-white px-12 py-4 font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-[#D71939] transition-colors">
                    Consign an Item
                </button>
            </div>
        </div>
      </section>
    )}
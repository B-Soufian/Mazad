import React from 'react';

export default function HeroSection() {
    return(
        <section className="relative h-screen justify-center text-white text-center overflow-hidden flex h-screen justify-center items-center">
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <div className="h-screen bg-[linear-gradient(to_bottom,_#000_60%,_rgba(255,255,255,0)_100%)] w-full flex h-screen justify-center items-center">
          <div className=" z-10 ">
            <h1 className="font-['Playfair_Display'] text-7xl md:text-9xl leading-tight mb-6">
              The Art <br /> 
              <span className="italic font-normal">of the Bid</span>
            </h1>
            
            <p className="max-w-xl mx-auto text-sm md:text-base text-gray-300 font-light leading-relaxed">
              Where legacy meets innovation. Discover the world's most prestigious digital marketplace for luxury assets.
            </p>

            <button className="mt-12 opacity-50 hover:opacity-100 animate-bounce">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
            </button>
          </div>
        </div>
      </section>
    )
}
import React from 'react';

export default function StandardSection() {
    return(
    <section className="py-32 px-6 md:px-20 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="max-w-md mb-16 md:mb-0">
          <span className="text-[10px] tracking-widest uppercase font-bold text-[#D71939] mb-4 block">The Bidmaster Standard</span>
          <h2 className="font-['Playfair_Display'] text-6xl leading-tight mb-8">Five Pillars of <br /><span className="italic font-normal text-gray-400">Excellence</span></h2>
          <p className="text-gray-500 text-sm leading-relaxed">We don't just facilitate transactions; we build trust through a rigorous adherence to our core values.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
            {["Competitive.", "Premium.", "Secure.", "Fast."].map((word, i) => (
                <h3 key={i} className={`font-['Playfair_Display'] text-6xl md:text-7xl font-bold leading-none ${i % 2 === 0 ? 'text-[#1a1a1a]' : 'text-[#1a1a1a]'}`}>
                    {word.split('.')[0]}<span className="text-[#D71939]">.</span>
                </h3>
            ))}
        </div>
    </section>
)}
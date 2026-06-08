import React from 'react';

export default function HeroSection() {
    return(

    <div className="border-y border-gray-100 py-20 overflow-hidden whitespace-nowrap bg-white">
        <div className="flex items-center gap-12 text-5xl font-['Playfair_Display'] text-gray-200">
            {[1,2,3].map((_, i) => (
                <React.Fragment key={i}>
                    <span>Vehicles</span> <span className="text-[#D71939] text-2xl">•</span>
                    <span>Real Estate</span> <span className="text-[#D71939] text-2xl">•</span>
                    <span>Watches</span> <span className="text-[#D71939] text-2xl">•</span>
                    <span>Jewelry</span> <span className="text-[#D71939] text-2xl">•</span>
                    <span>Art</span> <span className="text-[#D71939] text-2xl">•</span>
                </React.Fragment>
            ))}
        </div>
    </div>
    )}
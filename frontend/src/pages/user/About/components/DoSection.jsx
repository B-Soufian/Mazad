import React from 'react';

export default function DoSection() {
    return(
    <section className="py-10 md:px-20 max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-24">
            <h2 className="font-['Playfair_Display'] text-6xl leading-tight">
                What We <br />
                <span className="text-[#D71939] italic font-normal">Do & Sell</span>
            </h2>
            <p className="max-w-[350px] text-gray-400 text-sm leading-relaxed text-right mt-4">
                A comprehensive marketplace connecting buyers and sellers through a seamless, three-step process.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                { n: "01", title: "List", desc: "Sellers submit their luxury assets for valuation and verification by our expert team.", icon: "☰" },
                { n: "02", title: "Bid", desc: "Buyers participate in live, transparent auctions from anywhere in the world.", icon: "◿" },
                { n: "03", title: "Win", desc: "Secure transactions and premium logistics ensure your asset arrives safely.", icon: "◎" }
            ].map((step, i) => (
                <div key={i} className="border border-gray-100 p-12 relative group hover:border-[#D71939]/30 transition-colors">
                    <span className="absolute top-8 right-10 font-['Playfair_Display'] text-7xl text-gray-50 group-hover:text-gray-100 transition-colors font-bold z-0">{step.n}</span>
                    <div className="relative z-10">
                        <h4 className="text-xl font-bold mb-6 font-['Inter']">{step.title}</h4>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8">{step.desc}</p>
                        <div className="text-[#D71939] text-xl">{step.icon}</div>
                    </div>
                </div>
            ))}
        </div>
      </section>
    )}